import base64
from functools import wraps

from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash

from .db import get_db
from .security import validate_csrf

bp = Blueprint("auth", __name__)


def current_user():
    if hasattr(g, "_current_user"):
        return g._current_user
    uid = session.get("user_id")
    if not uid:
        g._current_user = None
        return None
    row = get_db().execute(
        """
        SELECT u.*, o.name AS organisation_name, d.name AS department_name
        FROM users u
        LEFT JOIN organisations o ON o.id=u.organisation_id
        LEFT JOIN departments d ON d.id=u.department_id
        WHERE u.id=? AND u.active=1
        """,
        (uid,),
    ).fetchone()
    g._current_user = row
    return row


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if current_user() is None:
            return redirect(url_for("auth.login", next=request.full_path))
        return view(*args, **kwargs)

    return wrapped


def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = current_user()
        if not user:
            return redirect(url_for("auth.login"))
        if user["role"] != "admin":
            from flask import abort

            abort(403)
        return view(*args, **kwargs)

    return wrapped


def api_auth_user():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Basic "):
        try:
            raw = base64.b64decode(auth[6:]).decode("utf-8")
            username, password = raw.split(":", 1)
        except Exception:
            return None
        row = get_db().execute("SELECT * FROM users WHERE username=? AND active=1", (username,)).fetchone()
        if row and check_password_hash(row["password_hash"], password):
            return row
        return None
    return current_user()


@bp.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        validate_csrf()
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        row = get_db().execute("SELECT * FROM users WHERE username=? AND active=1", (username,)).fetchone()
        if not row or not check_password_hash(row["password_hash"], password):
            flash("Invalid username or password.", "error")
        else:
            session.clear()
            session["user_id"] = row["id"]
            nxt = request.args.get("next", "")
            return redirect(nxt if nxt.startswith("/") and not nxt.startswith("//") else url_for("views.dashboard"))
    return render_template("login.html")


@bp.post("/logout")
@login_required
def logout():
    validate_csrf()
    session.clear()
    return redirect(url_for("auth.login"))
