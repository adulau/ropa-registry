import json
import uuid
from flask import Blueprint, abort, flash, redirect, render_template, request, url_for
from werkzeug.security import generate_password_hash

from .audit import log_action
from .auth import admin_required, current_user
from .db import get_db, utcnow
from .security import validate_csrf

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.route("/organisations", methods=("GET", "POST"))
@admin_required
def organisations():
    db = get_db(); user = current_user()
    if request.method == "POST":
        validate_csrf(); name = request.form.get("name", "").strip()
        if not name: flash("Organisation name is required.", "error")
        else:
            ouuid = str(uuid.uuid4())
            try:
                db.execute("INSERT INTO organisations(uuid,name,created_at) VALUES(?,?,?)", (ouuid, name, utcnow()))
                log_action(user, "create", "organisation", ouuid, details={"name": name})
                db.commit(); flash("Organisation created.", "success")
            except Exception as exc:
                db.rollback(); flash(f"Unable to create organisation: {exc}", "error")
    rows = db.execute("SELECT * FROM organisations ORDER BY name").fetchall()
    return render_template("admin_organisations.html", organisations=rows)


@bp.route("/departments", methods=("GET", "POST"))
@admin_required
def departments():
    db = get_db(); user = current_user()
    if request.method == "POST":
        validate_csrf(); name = request.form.get("name", "").strip()
        try: organisation_id = int(request.form.get("organisation_id", ""))
        except ValueError: organisation_id = None
        if not name or not organisation_id: flash("Organisation and department name are required.", "error")
        else:
            duuid = str(uuid.uuid4())
            try:
                db.execute("INSERT INTO departments(uuid,organisation_id,name,created_at) VALUES(?,?,?,?)", (duuid, organisation_id, name, utcnow()))
                log_action(user, "create", "department", duuid, organisation_id, details={"name": name})
                db.commit(); flash("Department created.", "success")
            except Exception as exc:
                db.rollback(); flash(f"Unable to create department: {exc}", "error")
    orgs = db.execute("SELECT * FROM organisations ORDER BY name").fetchall()
    rows = db.execute("SELECT d.*,o.name organisation_name FROM departments d JOIN organisations o ON o.id=d.organisation_id ORDER BY o.name,d.name").fetchall()
    return render_template("admin_departments.html", departments=rows, organisations=orgs)


@bp.route("/users", methods=("GET", "POST"))
@admin_required
def users():
    db = get_db(); user = current_user()
    if request.method == "POST":
        validate_csrf()
        username = request.form.get("username", "").strip(); password = request.form.get("password", "")
        role = request.form.get("role", "viewer")
        organisation_id = request.form.get("organisation_id") or None
        department_id = request.form.get("department_id") or None
        organisation_id = int(organisation_id) if organisation_id else None
        department_id = int(department_id) if department_id else None
        if role not in ("manager", "viewer", "admin") or not username or not password:
            flash("Username, password and a valid role are required.", "error")
        elif role == "manager" and not organisation_id:
            flash("A manager must be assigned to an organisation.", "error")
        else:
            try:
                db.execute("INSERT INTO users(username,password_hash,role,organisation_id,department_id,created_at) VALUES(?,?,?,?,?,?)",
                           (username, generate_password_hash(password), role, organisation_id, department_id, utcnow()))
                log_action(user, "create", "user", details={"username": username, "role": role, "organisation_id": organisation_id, "department_id": department_id})
                db.commit(); flash("User created.", "success")
            except Exception as exc:
                db.rollback(); flash(f"Unable to create user: {exc}", "error")
    rows = db.execute("""SELECT u.*,o.name organisation_name,d.name department_name FROM users u
                         LEFT JOIN organisations o ON o.id=u.organisation_id LEFT JOIN departments d ON d.id=u.department_id
                         ORDER BY u.username""").fetchall()
    orgs = db.execute("SELECT * FROM organisations ORDER BY name").fetchall()
    depts = db.execute("SELECT d.*,o.name organisation_name FROM departments d JOIN organisations o ON o.id=d.organisation_id ORDER BY o.name,d.name").fetchall()
    return render_template("admin_users.html", users=rows, organisations=orgs, departments=depts)


@bp.get("/audit")
@admin_required
def audit():
    rows = get_db().execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 500").fetchall()
    return render_template("admin_audit.html", logs=rows)
