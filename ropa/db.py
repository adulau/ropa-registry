import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

import click
from flask import current_app, g
from flask.cli import with_appcontext
from werkzeug.security import generate_password_hash


def utcnow():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"], detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS organisations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    organisation_id INTEGER NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(organisation_id, name)
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('manager','viewer','admin')),
    organisation_id INTEGER REFERENCES organisations(id) ON DELETE RESTRICT,
    department_id INTEGER REFERENCES departments(id) ON DELETE RESTRICT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    CHECK(
        role != 'manager' OR organisation_id IS NOT NULL
    )
);

CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    organisation_id INTEGER NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
    department_id INTEGER REFERENCES departments(id) ON DELETE RESTRICT,
    external_id INTEGER,
    payload_json TEXT NOT NULL,
    schema_valid INTEGER NOT NULL DEFAULT 0,
    validation_errors_json TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','archived')),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    archived_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_activities_scope ON activities(organisation_id, department_id, status);
CREATE INDEX IF NOT EXISTS idx_activities_external_id ON activities(organisation_id, department_id, external_id);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    username TEXT,
    action TEXT NOT NULL,
    object_type TEXT NOT NULL,
    object_uuid TEXT,
    organisation_id INTEGER,
    department_id INTEGER,
    remote_addr TEXT,
    user_agent TEXT,
    details_json TEXT,
    before_json TEXT,
    after_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_object ON audit_logs(object_type, object_uuid);
"""


def init_db():
    db = get_db()
    db.executescript(SCHEMA_SQL)
    db.commit()
    upgrade_activity_validation()


def upgrade_activity_validation():
    """Revalidate pre-upgrade activities once, atomically, under the rights schema."""
    from .audit import log_action
    from .schema import validate_activity

    db = get_db()
    migration = "restriction-rights-validation-v1"
    with db:
        # Serialize concurrent application startups and commit the marker with the updates.
        db.execute("BEGIN IMMEDIATE")
        db.execute("""CREATE TABLE IF NOT EXISTS schema_migrations (
            name TEXT PRIMARY KEY,
            applied_at TEXT NOT NULL
        )""")
        if db.execute("SELECT 1 FROM schema_migrations WHERE name=?", (migration,)).fetchone():
            return
        for row in db.execute("SELECT * FROM activities").fetchall():
            try:
                payload = json.loads(row["payload_json"])
            except ValueError as exc:
                errors = [{"path": "$", "message": f"Invalid JSON: {exc}"}]
            else:
                errors = validate_activity(payload)
            valid = int(not errors)
            errors_json = json.dumps(errors, ensure_ascii=False)
            status = "draft" if errors and row["status"] == "active" else row["status"]
            before = {
                "schema_valid": row["schema_valid"],
                "validation_errors_json": row["validation_errors_json"],
                "status": row["status"],
            }
            after = {
                "schema_valid": valid, "validation_errors_json": errors_json, "status": status,
            }
            if before != after:
                db.execute(
                    """UPDATE activities SET schema_valid=?,validation_errors_json=?,status=?,updated_at=?
                       WHERE id=?""",
                    (valid, errors_json, status, utcnow(), row["id"]),
                )
                log_action(None, "schema_revalidate", "activity", row["uuid"],
                           row["organisation_id"], row["department_id"],
                           details={"migration": migration, "before": before, "after": after})
        db.execute("INSERT INTO schema_migrations(name,applied_at) VALUES(?,?)", (migration, utcnow()))


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(create_admin_command)
    # Upgrade existing databases before any read path can expose stale validation metadata.
    # Fresh databases remain initialized explicitly through init-db.
    if Path(app.config["DATABASE"]).is_file():
        with app.app_context():
            if get_db().execute(
                "SELECT 1 FROM sqlite_master WHERE type='table' AND name='activities'"
            ).fetchone():
                upgrade_activity_validation()


@click.command("init-db")
@with_appcontext
def init_db_command():
    init_db()
    click.echo("Initialized the database.")


@click.command("create-admin")
@click.argument("username")
@click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
@with_appcontext
def create_admin_command(username, password):
    import uuid

    init_db()
    db = get_db()
    existing = db.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    if existing:
        raise click.ClickException("User already exists")
    db.execute(
        "INSERT INTO users(username,password_hash,role,created_at) VALUES(?,?,?,?)",
        (username, generate_password_hash(password), "admin", utcnow()),
    )
    db.commit()
    click.echo(f"Created admin user {username}.")
