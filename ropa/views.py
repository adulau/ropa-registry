import json
import uuid

from flask import (
    Blueprint, Response, abort, flash, redirect, render_template, request, url_for
)

from .audit import log_action
from .auth import current_user, login_required
from .db import get_db, utcnow
from .markdown_export import render_register
from .permissions import can_edit_scope, can_view_activity, require_activity_view, require_scope_edit
from .schema import default_activity, normalize_activity, validate_activity
from .security import validate_csrf

bp = Blueprint("views", __name__)


def _row_to_activity(row):
    d = dict(row)
    d["payload"] = normalize_activity(json.loads(d.pop("payload_json")))
    d["validation_errors"] = json.loads(d.pop("validation_errors_json") or "[]")
    return d


def _scope_query(user, include_archived=False):
    clauses = [] if include_archived else ["a.status != 'archived'"]
    params = []
    if user["role"] == "manager":
        clauses.append("a.organisation_id=?")
        params.append(user["organisation_id"])
        if user["department_id"] is not None:
            clauses.append("a.department_id=?")
            params.append(user["department_id"])
    return (" AND ".join(clauses) if clauses else "1=1"), params


def _get_activity(uuid_value):
    row = get_db().execute(
        """
        SELECT a.*, o.name AS organisation_name, d.name AS department_name,
               cu.username AS created_by_name, uu.username AS updated_by_name
        FROM activities a
        JOIN organisations o ON o.id=a.organisation_id
        LEFT JOIN departments d ON d.id=a.department_id
        LEFT JOIN users cu ON cu.id=a.created_by
        LEFT JOIN users uu ON uu.id=a.updated_by
        WHERE a.uuid=?
        """,
        (uuid_value,),
    ).fetchone()
    if not row:
        abort(404)
    return _row_to_activity(row)


def _organisation_options(user):
    db = get_db()
    if user["role"] == "admin":
        return db.execute("SELECT * FROM organisations ORDER BY name").fetchall()
    if user["role"] == "manager":
        return db.execute("SELECT * FROM organisations WHERE id=?", (user["organisation_id"],)).fetchall()
    return []


def _department_options(user, organisation_id=None):
    db = get_db()
    if user["role"] == "admin":
        if organisation_id:
            return db.execute("SELECT * FROM departments WHERE organisation_id=? ORDER BY name", (organisation_id,)).fetchall()
        return db.execute("SELECT * FROM departments ORDER BY name").fetchall()
    if user["role"] == "manager":
        if user["department_id"] is not None:
            return db.execute("SELECT * FROM departments WHERE id=?", (user["department_id"],)).fetchall()
        return db.execute("SELECT * FROM departments WHERE organisation_id=? ORDER BY name", (user["organisation_id"],)).fetchall()
    return []


def _next_external_id(organisation_id, department_id):
    db = get_db()
    if department_id is None:
        rows = db.execute(
            "SELECT external_id FROM activities WHERE organisation_id=? AND department_id IS NULL AND external_id IS NOT NULL",
            (organisation_id,),
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT external_id FROM activities WHERE organisation_id=? AND department_id=? AND external_id IS NOT NULL",
            (organisation_id, department_id),
        ).fetchall()
    return max([r["external_id"] for r in rows] or [0]) + 1


@bp.route("/")
@login_required
def dashboard():
    user = current_user()
    where, params = _scope_query(user)
    db = get_db()
    counts = db.execute(
        f"""
        SELECT COUNT(*) AS total,
               SUM(CASE WHEN a.schema_valid=1 THEN 1 ELSE 0 END) AS valid_count,
               SUM(CASE WHEN a.status='draft' THEN 1 ELSE 0 END) AS draft_count
        FROM activities a WHERE {where}
        """,
        params,
    ).fetchone()
    recent = db.execute(
        f"""
        SELECT a.*, o.name organisation_name, d.name department_name
        FROM activities a JOIN organisations o ON o.id=a.organisation_id
        LEFT JOIN departments d ON d.id=a.department_id
        WHERE {where} ORDER BY a.updated_at DESC LIMIT 8
        """,
        params,
    ).fetchall()
    recent = [_row_to_activity(r) for r in recent]
    return render_template("dashboard.html", counts=counts, recent=recent)


@bp.route("/activities")
@login_required
def activities():
    user = current_user()
    where, params = _scope_query(user, include_archived=request.args.get("archived") == "1")
    q = request.args.get("q", "").strip()
    if q:
        where += " AND (a.payload_json LIKE ? OR a.uuid LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%"])
    rows = get_db().execute(
        f"""
        SELECT a.*, o.name organisation_name, d.name department_name
        FROM activities a JOIN organisations o ON o.id=a.organisation_id
        LEFT JOIN departments d ON d.id=a.department_id
        WHERE {where}
        ORDER BY o.name, COALESCE(d.name,''), a.external_id, a.updated_at DESC
        """,
        params,
    ).fetchall()
    return render_template("activities.html", activities=[_row_to_activity(r) for r in rows], q=q)


@bp.route("/activities/<uuid_value>")
@login_required
def activity_detail(uuid_value):
    activity = _get_activity(uuid_value)
    require_activity_view(current_user(), activity)
    return render_template("activity_detail.html", activity=activity)


@bp.route("/activities/new", methods=("GET", "POST"))
@login_required
def activity_new():
    user = current_user()
    if user["role"] not in ("manager", "admin"):
        abort(403)
    orgs = _organisation_options(user)
    depts = _department_options(user)
    initial_org = user["organisation_id"] if user["role"] == "manager" else (orgs[0]["id"] if orgs else None)
    initial_dept = user["department_id"] if user["role"] == "manager" else None
    payload = default_activity(_next_external_id(initial_org, initial_dept) if initial_org else 1)
    errors = []

    if request.method == "POST":
        validate_csrf()
        try:
            organisation_id = int(request.form["organisation_id"])
            department_id = int(request.form["department_id"]) if request.form.get("department_id") else None
        except (KeyError, ValueError):
            abort(400)
        require_scope_edit(user, organisation_id, department_id)
        try:
            payload = json.loads(request.form.get("payload_json", "{}"))
            if not isinstance(payload, dict):
                raise ValueError("Processing activity must be a JSON object")
        except Exception as exc:
            errors = [{"path": "$", "message": f"Invalid JSON: {exc}"}]
        else:
            payload = normalize_activity(payload)
            errors = validate_activity(payload)
            status = request.form.get("status", "draft")
            if status == "active" and errors:
                flash("An active record must pass schema validation. Saved status was not changed.", "error")
            else:
                now = utcnow()
                auuid = str(uuid.uuid4())
                db = get_db()
                db.execute(
                    """INSERT INTO activities(
                       uuid,organisation_id,department_id,external_id,payload_json,schema_valid,
                       validation_errors_json,status,created_by,updated_by,created_at,updated_at
                    ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)""",
                    (auuid, organisation_id, department_id, payload.get("id"),
                     json.dumps(payload, ensure_ascii=False), int(not errors),
                     json.dumps(errors, ensure_ascii=False), status, user["id"], user["id"], now, now),
                )
                log_action(user, "create", "activity", auuid, organisation_id, department_id,
                           details={"schema_valid": not errors}, after=payload)
                db.commit()
                flash("Processing activity created.", "success")
                return redirect(url_for("views.activity_detail", uuid_value=auuid))

    return render_template("activity_edit.html", activity=None, payload=payload, errors=errors,
                           organisations=orgs, departments=depts)


@bp.route("/activities/<uuid_value>/edit", methods=("GET", "POST"))
@login_required
def activity_edit(uuid_value):
    user = current_user()
    activity = _get_activity(uuid_value)
    require_scope_edit(user, activity["organisation_id"], activity["department_id"])
    payload = activity["payload"]
    errors = activity["validation_errors"]
    orgs = _organisation_options(user)
    depts = _department_options(user)
    if request.method == "POST":
        validate_csrf()
        try:
            organisation_id = int(request.form["organisation_id"])
            department_id = int(request.form["department_id"]) if request.form.get("department_id") else None
        except (KeyError, ValueError):
            abort(400)
        require_scope_edit(user, organisation_id, department_id)
        try:
            new_payload = json.loads(request.form.get("payload_json", "{}"))
            if not isinstance(new_payload, dict):
                raise ValueError("Processing activity must be a JSON object")
        except Exception as exc:
            errors = [{"path": "$", "message": f"Invalid JSON: {exc}"}]
        else:
            new_payload = normalize_activity(new_payload)
            errors = validate_activity(new_payload)
            status = request.form.get("status", activity["status"])
            if status == "active" and errors:
                flash("An active record must pass schema validation.", "error")
                payload = new_payload
            else:
                db = get_db()
                db.execute(
                    """UPDATE activities SET organisation_id=?,department_id=?,external_id=?,payload_json=?,
                       schema_valid=?,validation_errors_json=?,status=?,updated_by=?,updated_at=?,
                       archived_at=CASE WHEN ?='archived' THEN COALESCE(archived_at,?) ELSE NULL END
                       WHERE uuid=?""",
                    (organisation_id, department_id, new_payload.get("id"),
                     json.dumps(new_payload, ensure_ascii=False), int(not errors), json.dumps(errors, ensure_ascii=False),
                     status, user["id"], utcnow(), status, utcnow(), uuid_value),
                )
                log_action(user, "update", "activity", uuid_value, organisation_id, department_id,
                           details={"schema_valid": not errors, "status": status}, before=activity["payload"], after=new_payload)
                db.commit()
                flash("Processing activity updated.", "success")
                return redirect(url_for("views.activity_detail", uuid_value=uuid_value))
    return render_template("activity_edit.html", activity=activity, payload=payload, errors=errors,
                           organisations=orgs, departments=depts)


@bp.post("/activities/<uuid_value>/archive")
@login_required
def activity_archive(uuid_value):
    validate_csrf()
    user = current_user()
    activity = _get_activity(uuid_value)
    require_scope_edit(user, activity["organisation_id"], activity["department_id"])
    db = get_db()
    now = utcnow()
    db.execute("UPDATE activities SET status='archived',archived_at=?,updated_at=?,updated_by=? WHERE uuid=?",
               (now, now, user["id"], uuid_value))
    log_action(user, "archive", "activity", uuid_value, activity["organisation_id"], activity["department_id"], before=activity["payload"])
    db.commit()
    flash("Processing activity archived.", "success")
    return redirect(url_for("views.activities"))


@bp.route("/activities/import", methods=("GET", "POST"))
@login_required
def import_activities():
    user = current_user()
    if user["role"] not in ("manager", "admin"):
        abort(403)
    orgs = _organisation_options(user)
    depts = _department_options(user)
    report = None
    if request.method == "POST":
        validate_csrf()
        try:
            organisation_id = int(request.form["organisation_id"])
            department_id = int(request.form["department_id"]) if request.form.get("department_id") else None
        except (KeyError, ValueError):
            abort(400)
        require_scope_edit(user, organisation_id, department_id)
        upload = request.files.get("json_file")
        if not upload:
            flash("Choose a JSON file.", "error")
        else:
            try:
                data = json.load(upload.stream)
                records = data if isinstance(data, list) else [data]
                if not all(isinstance(x, dict) for x in records):
                    raise ValueError("JSON must be an activity object or an array of activity objects")
            except Exception as exc:
                flash(f"Unable to parse JSON: {exc}", "error")
            else:
                db = get_db()
                created = updated = invalid = 0
                details = []
                now = utcnow()
                for payload in records:
                    payload = normalize_activity(payload)
                    errors = validate_activity(payload)
                    invalid += int(bool(errors))
                    external_id = payload.get("id")
                    existing = None
                    if request.form.get("upsert") == "1" and external_id is not None:
                        if department_id is None:
                            existing = db.execute(
                                "SELECT * FROM activities WHERE organisation_id=? AND department_id IS NULL AND external_id=? AND status!='archived' ORDER BY id LIMIT 1",
                                (organisation_id, external_id),
                            ).fetchone()
                        else:
                            existing = db.execute(
                                "SELECT * FROM activities WHERE organisation_id=? AND department_id=? AND external_id=? AND status!='archived' ORDER BY id LIMIT 1",
                                (organisation_id, department_id, external_id),
                            ).fetchone()
                    if existing:
                        before = normalize_activity(json.loads(existing["payload_json"]))
                        status = existing["status"] if errors or existing["status"] != "active" else "active"
                        if errors and status == "active": status = "draft"
                        db.execute(
                            "UPDATE activities SET payload_json=?,schema_valid=?,validation_errors_json=?,external_id=?,status=?,updated_by=?,updated_at=? WHERE id=?",
                            (json.dumps(payload, ensure_ascii=False), int(not errors), json.dumps(errors, ensure_ascii=False), external_id, status, user["id"], now, existing["id"]),
                        )
                        log_action(user, "import_update", "activity", existing["uuid"], organisation_id, department_id,
                                   details={"schema_valid": not errors}, before=before, after=payload)
                        updated += 1
                        details.append({"id": external_id, "action": "updated", "valid": not errors, "errors": errors})
                    else:
                        auuid = str(uuid.uuid4())
                        status = "active" if not errors else "draft"
                        db.execute(
                            """INSERT INTO activities(uuid,organisation_id,department_id,external_id,payload_json,schema_valid,
                               validation_errors_json,status,created_by,updated_by,created_at,updated_at)
                               VALUES(?,?,?,?,?,?,?,?,?,?,?,?)""",
                            (auuid, organisation_id, department_id, external_id, json.dumps(payload, ensure_ascii=False),
                             int(not errors), json.dumps(errors, ensure_ascii=False), status, user["id"], user["id"], now, now),
                        )
                        log_action(user, "import_create", "activity", auuid, organisation_id, department_id,
                                   details={"schema_valid": not errors}, after=payload)
                        created += 1
                        details.append({"id": external_id, "action": "created", "valid": not errors, "errors": errors})
                db.commit()
                report = {"created": created, "updated": updated, "invalid": invalid, "details": details}
                flash(f"Import completed: {created} created, {updated} updated; {invalid} record(s) have schema warnings.", "success")
    return render_template("import.html", organisations=orgs, departments=depts, report=report)


def _records_for_export(user):
    where, params = _scope_query(user)
    org = request.args.get("organisation_id", type=int)
    dept_raw = request.args.get("department_id")
    if org:
        where += " AND a.organisation_id=?"; params.append(org)
    if dept_raw:
        if dept_raw == "none": where += " AND a.department_id IS NULL"
        else: where += " AND a.department_id=?"; params.append(int(dept_raw))
    rows = get_db().execute(
        f"""SELECT a.*,o.name organisation_name,d.name department_name
             FROM activities a JOIN organisations o ON o.id=a.organisation_id
             LEFT JOIN departments d ON d.id=a.department_id
             WHERE {where} ORDER BY o.name,COALESCE(d.name,''),a.external_id""",
        params,
    ).fetchall()
    return [_row_to_activity(r) for r in rows]


@bp.get("/activities/export.json")
@login_required
def export_json():
    records = _records_for_export(current_user())
    include_meta = request.args.get("include_meta") == "1"
    output = []
    for r in records:
        payload = dict(r["payload"])
        if include_meta:
            payload["_meta"] = {
                "uuid": r["uuid"], "organisation": r["organisation_name"], "department": r["department_name"],
                "status": r["status"], "schema_valid": bool(r["schema_valid"]),
                "created_at": r["created_at"], "updated_at": r["updated_at"],
            }
        output.append(payload)
    body = json.dumps(output, ensure_ascii=False, indent=2)
    return Response(body, mimetype="application/json", headers={"Content-Disposition": "attachment; filename=processing-activities.json"})


@bp.get("/activities/export.md")
@login_required
def export_markdown():
    records = _records_for_export(current_user())
    prepared = []
    for r in records:
        prepared.append({
            "payload": r["payload"],
            "meta": {
                "uuid": r["uuid"], "organisation_name": r["organisation_name"], "department_name": r["department_name"],
                "status": r["status"], "schema_valid": bool(r["schema_valid"]), "created_at": r["created_at"], "updated_at": r["updated_at"],
            },
        })
    body = render_register(prepared)
    return Response(body, mimetype="text/markdown", headers={"Content-Disposition": "attachment; filename=processing-activities.md"})
