from flask import abort

from .db import get_db


def valid_scope(organisation_id, department_id):
    db = get_db()
    if not db.execute("SELECT 1 FROM organisations WHERE id=?", (organisation_id,)).fetchone():
        return False
    if department_id is None:
        return True
    return db.execute(
        "SELECT 1 FROM departments WHERE id=? AND organisation_id=?",
        (department_id, organisation_id),
    ).fetchone() is not None


def can_view_activity(user, activity):
    if user["role"] in ("admin", "viewer"):
        return True
    if user["role"] == "manager":
        if activity["organisation_id"] != user["organisation_id"]:
            return False
        if user["department_id"] is not None:
            return activity["department_id"] == user["department_id"]
        return True
    return False


def can_edit_scope(user, organisation_id, department_id):
    if not valid_scope(organisation_id, department_id):
        return False
    if user["role"] == "admin":
        return True
    if user["role"] != "manager":
        return False
    if organisation_id != user["organisation_id"]:
        return False
    if user["department_id"] is not None:
        return department_id == user["department_id"]
    return True


def require_activity_view(user, activity):
    if not can_view_activity(user, activity):
        abort(403)


def require_scope_edit(user, organisation_id, department_id):
    if not can_edit_scope(user, organisation_id, department_id):
        abort(403)
