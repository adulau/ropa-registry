import json
import uuid
from functools import wraps

from flask import Blueprint, Response, abort, jsonify, render_template, request

from .audit import log_action
from .auth import api_auth_user
from .db import get_db, utcnow
from .markdown_export import render_register
from .permissions import can_edit_scope, can_view_activity
from .schema import activity_schema, normalize_activity, validate_activity

bp = Blueprint("api", __name__, url_prefix="/api")


def require_api_user(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = api_auth_user()
        if not user:
            return Response("Authentication required", 401, {"WWW-Authenticate": 'Basic realm="ROPA API"'})
        return view(user, *args, **kwargs)
    return wrapped


def activity_dict(row, include_payload=True):
    d = {
        "uuid": row["uuid"], "organisation_id": row["organisation_id"], "department_id": row["department_id"],
        "external_id": row["external_id"], "status": row["status"], "schema_valid": bool(row["schema_valid"]),
        "validation_errors": json.loads(row["validation_errors_json"] or "[]"),
        "created_at": row["created_at"], "updated_at": row["updated_at"],
    }
    if include_payload: d["activity"] = normalize_activity(json.loads(row["payload_json"]))
    return d


def _api_get(uuid_value):
    row = get_db().execute("SELECT * FROM activities WHERE uuid=?", (uuid_value,)).fetchone()
    if not row: abort(404)
    return row


@bp.get("/v1/activities")
@require_api_user
def list_activities(user):
    clauses = ["status!='archived'"]; params = []
    if user["role"] == "manager":
        clauses.append("organisation_id=?"); params.append(user["organisation_id"])
        if user["department_id"] is not None:
            clauses.append("department_id=?"); params.append(user["department_id"])
    org = request.args.get("organisation_id", type=int); dept = request.args.get("department_id", type=int)
    if org: clauses.append("organisation_id=?"); params.append(org)
    if dept: clauses.append("department_id=?"); params.append(dept)
    rows = get_db().execute(f"SELECT * FROM activities WHERE {' AND '.join(clauses)} ORDER BY updated_at DESC", params).fetchall()
    return jsonify([activity_dict(r) for r in rows])


@bp.get("/v1/activities/<uuid_value>")
@require_api_user
def get_activity(user, uuid_value):
    row = _api_get(uuid_value)
    if not can_view_activity(user, row): abort(403)
    return jsonify(activity_dict(row))


@bp.post("/v1/activities")
@require_api_user
def create_activity(user):
    body = request.get_json(silent=True) or {}
    organisation_id = body.get("organisation_id"); department_id = body.get("department_id")
    payload = body.get("activity")
    if not isinstance(payload, dict) or not isinstance(organisation_id, int):
        return jsonify(error="organisation_id (integer) and activity (object) are required"), 400
    if not can_edit_scope(user, organisation_id, department_id): abort(403)
    payload = normalize_activity(payload)
    errors = validate_activity(payload)
    if errors and request.args.get("allow_invalid") != "true":
        return jsonify(error="Schema validation failed", validation_errors=errors), 422
    status = body.get("status", "draft" if errors else "active")
    if status == "active" and errors:
        return jsonify(error="Invalid records cannot be active", validation_errors=errors), 422
    if status not in ("draft", "active"):
        return jsonify(error="status must be draft or active"), 400
    auuid = str(uuid.uuid4()); now = utcnow(); db = get_db()
    db.execute("""INSERT INTO activities(uuid,organisation_id,department_id,external_id,payload_json,schema_valid,
                validation_errors_json,status,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)""",
               (auuid, organisation_id, department_id, payload.get("id"), json.dumps(payload, ensure_ascii=False), int(not errors),
                json.dumps(errors, ensure_ascii=False), status, user["id"], user["id"], now, now))
    log_action(user, "api_create", "activity", auuid, organisation_id, department_id, details={"schema_valid": not errors}, after=payload)
    db.commit(); return jsonify(activity_dict(_api_get(auuid))), 201


@bp.put("/v1/activities/<uuid_value>")
@require_api_user
def update_activity(user, uuid_value):
    row = _api_get(uuid_value)
    if not can_edit_scope(user, row["organisation_id"], row["department_id"]): abort(403)
    body = request.get_json(silent=True) or {}; payload = body.get("activity")
    if not isinstance(payload, dict): return jsonify(error="activity object is required"), 400
    organisation_id = body.get("organisation_id", row["organisation_id"]); department_id = body.get("department_id", row["department_id"])
    if not can_edit_scope(user, organisation_id, department_id): abort(403)
    payload = normalize_activity(payload)
    errors = validate_activity(payload)
    if errors and request.args.get("allow_invalid") != "true":
        return jsonify(error="Schema validation failed", validation_errors=errors), 422
    status = body.get("status", row["status"])
    if status == "active" and errors: return jsonify(error="Invalid records cannot be active", validation_errors=errors), 422
    before = normalize_activity(json.loads(row["payload_json"])); db = get_db()
    db.execute("""UPDATE activities SET organisation_id=?,department_id=?,external_id=?,payload_json=?,schema_valid=?,
                validation_errors_json=?,status=?,updated_by=?,updated_at=? WHERE uuid=?""",
               (organisation_id, department_id, payload.get("id"), json.dumps(payload, ensure_ascii=False), int(not errors),
                json.dumps(errors, ensure_ascii=False), status, user["id"], utcnow(), uuid_value))
    log_action(user, "api_update", "activity", uuid_value, organisation_id, department_id, details={"schema_valid": not errors}, before=before, after=payload)
    db.commit(); return jsonify(activity_dict(_api_get(uuid_value)))


@bp.delete("/v1/activities/<uuid_value>")
@require_api_user
def archive_activity(user, uuid_value):
    row = _api_get(uuid_value)
    if not can_edit_scope(user, row["organisation_id"], row["department_id"]): abort(403)
    now = utcnow(); db = get_db()
    db.execute("UPDATE activities SET status='archived',archived_at=?,updated_at=?,updated_by=? WHERE uuid=?", (now, now, user["id"], uuid_value))
    log_action(user, "api_archive", "activity", uuid_value, row["organisation_id"], row["department_id"])
    db.commit(); return "", 204


@bp.get("/v1/schema")
@require_api_user
def get_schema(user):
    return jsonify(activity_schema())


@bp.get("/v1/activities/<uuid_value>/markdown")
@require_api_user
def get_markdown(user, uuid_value):
    row = _api_get(uuid_value)
    if not can_view_activity(user, row): abort(403)
    payload = normalize_activity(json.loads(row["payload_json"]))
    body = render_register([{"payload": payload, "meta": activity_dict(row, include_payload=False)}], title=payload.get("name", "Processing activity"))
    return Response(body, mimetype="text/markdown")


@bp.get("/openapi.json")
def openapi():
    return jsonify({
        "openapi": "3.1.0",
        "info": {"title": "ROPA Registry API", "version": "1.0.0", "description": "Minimal API for GDPR records of processing activities."},
        "servers": [{"url": "/api"}],
        "components": {
            "securitySchemes": {"basicAuth": {"type": "http", "scheme": "basic"}},
            "schemas": {
                "ProcessingActivity": activity_schema(),
                "ActivityEnvelope": {
                    "type": "object",
                    "required": ["organisation_id", "activity"],
                    "properties": {
                        "organisation_id": {"type": "integer"}, "department_id": {"type": ["integer", "null"]},
                        "status": {"type": "string", "enum": ["draft", "active"]},
                        "activity": {"$ref": "#/components/schemas/ProcessingActivity"},
                    },
                },
            },
        },
        "security": [{"basicAuth": []}],
        "paths": {
            "/v1/activities": {
                "get": {"summary": "List visible processing activities", "responses": {"200": {"description": "OK"}}},
                "post": {"summary": "Create a processing activity", "requestBody": {"required": True, "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityEnvelope"}}}}, "responses": {"201": {"description": "Created"}, "422": {"description": "Schema validation failed"}}},
            },
            "/v1/activities/{uuid}": {
                "parameters": [{"name": "uuid", "in": "path", "required": True, "schema": {"type": "string", "format": "uuid"}}],
                "get": {"summary": "Get a processing activity", "responses": {"200": {"description": "OK"}}},
                "put": {"summary": "Update a processing activity", "responses": {"200": {"description": "Updated"}, "422": {"description": "Schema validation failed"}}},
                "delete": {"summary": "Archive a processing activity", "responses": {"204": {"description": "Archived"}}},
            },
            "/v1/activities/{uuid}/markdown": {
                "parameters": [{"name": "uuid", "in": "path", "required": True, "schema": {"type": "string", "format": "uuid"}}],
                "get": {"summary": "Export one processing activity as Markdown", "responses": {"200": {"description": "Markdown"}}},
            },
            "/v1/schema": {"get": {"summary": "Get the processing activity JSON Schema", "responses": {"200": {"description": "Schema"}}}},
        },
    })


@bp.get("/docs")
def docs():
    return render_template("api_docs.html")
