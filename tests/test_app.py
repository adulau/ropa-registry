import base64
import json
from pathlib import Path

import pytest
from werkzeug.security import generate_password_hash

from ropa import create_app
from ropa.db import get_db, init_db, utcnow
from ropa.schema import default_activity, validate_activity


def basic(username, password="pw"):
    token = base64.b64encode(f"{username}:{password}".encode()).decode()
    return {"Authorization": f"Basic {token}"}


@pytest.fixture()
def app(tmp_path):
    app = create_app({"TESTING": True, "SECRET_KEY": "test", "DATABASE": str(tmp_path / "test.sqlite3")})
    with app.app_context():
        init_db()
        db = get_db()
        db.execute("INSERT INTO organisations(uuid,name,created_at) VALUES('o1','Org One',?)", (utcnow(),))
        db.execute("INSERT INTO organisations(uuid,name,created_at) VALUES('o2','Org Two',?)", (utcnow(),))
        org1 = db.execute("SELECT id FROM organisations WHERE uuid='o1'").fetchone()["id"]
        org2 = db.execute("SELECT id FROM organisations WHERE uuid='o2'").fetchone()["id"]
        db.execute("INSERT INTO departments(uuid,organisation_id,name,created_at) VALUES('d1',?,'Dept One',?)", (org1, utcnow()))
        dept1 = db.execute("SELECT id FROM departments WHERE uuid='d1'").fetchone()["id"]
        users = [
            ("manager", "manager", org1, dept1),
            ("orgmanager", "manager", org1, None),
            ("viewer", "viewer", None, None),
            ("admin", "admin", None, None),
        ]
        for username, role, oid, did in users:
            db.execute(
                "INSERT INTO users(username,password_hash,role,organisation_id,department_id,created_at) VALUES(?,?,?,?,?,?)",
                (username, generate_password_hash("pw"), role, oid, did, utcnow()),
            )
        db.commit()
        app.config.update(TEST_ORG1=org1, TEST_ORG2=org2, TEST_DEPT1=dept1)
    return app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_manager_scope_and_viewer_read_only(app, client):
    payload = default_activity(1)
    payload.update({"name": "Example", "controller": "Org One", "retention_period": "1 year"})
    payload["data_subjects"] = ["customers"]
    payload["recipients"] = ["internal staff"]
    payload["personal_data"] = {"source": ["direct"], "data": [{"description": "email", "category": "Personal details"}]}
    r = client.post(
        "/api/v1/activities",
        headers=basic("manager"),
        json={"organisation_id": app.config["TEST_ORG1"], "department_id": app.config["TEST_DEPT1"], "activity": payload},
    )
    assert r.status_code == 201, r.get_data(as_text=True)

    forbidden = client.post(
        "/api/v1/activities",
        headers=basic("manager"),
        json={"organisation_id": app.config["TEST_ORG2"], "activity": payload},
    )
    assert forbidden.status_code == 403

    visible = client.get("/api/v1/activities", headers=basic("viewer"))
    assert visible.status_code == 200
    assert len(visible.get_json()) == 1

    viewer_write = client.post(
        "/api/v1/activities",
        headers=basic("viewer"),
        json={"organisation_id": app.config["TEST_ORG1"], "activity": payload},
    )
    assert viewer_write.status_code == 403


def test_invalid_activity_requires_draft_override(app, client):
    bad = {"id": 99, "name": "Incomplete"}
    r = client.post(
        "/api/v1/activities",
        headers=basic("admin"),
        json={"organisation_id": app.config["TEST_ORG1"], "activity": bad},
    )
    assert r.status_code == 422

    r = client.post(
        "/api/v1/activities?allow_invalid=true",
        headers=basic("admin"),
        json={"organisation_id": app.config["TEST_ORG1"], "status": "draft", "activity": bad},
    )
    assert r.status_code == 201
    assert r.get_json()["schema_valid"] is False


def test_openapi_is_public(client):
    r = client.get("/api/openapi.json")
    assert r.status_code == 200
    assert r.get_json()["openapi"] == "3.1.0"
    assert "/v1/activities" in r.get_json()["paths"]


def test_supplied_sample_has_compatibility_warnings():
    data_path = Path(__file__).parents[1] / "ropa" / "data" / "example-processing-activities.json"
    records = json.loads(data_path.read_text())
    invalid = [r for r in records if validate_activity(r)]
    assert len(records) == 30
    assert len(invalid) > 0
