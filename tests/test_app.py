import base64
from copy import deepcopy
from io import BytesIO
import json
from pathlib import Path

import pytest
from werkzeug.security import generate_password_hash

from ropa import create_app
from ropa.db import get_db, init_db, utcnow
from ropa.schema import default_activity, normalize_activity, validate_activity


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


def test_supplied_sample_accepts_legacy_and_corrected_rights():
    data_path = Path(__file__).parents[1] / "ropa" / "data" / "example-processing-activities.json"
    records = json.loads(data_path.read_text())
    assert records
    for record in records:
        assert validate_activity(record) == []
        corrected = normalize_activity(record)
        assert validate_activity(corrected) == []
        assert '"rigths"' not in json.dumps(corrected)


def restriction_activity(spelling="rights", external_id=1):
    payload = default_activity(external_id)
    payload["name"] = "Restriction example"
    payload["data_subject_rights"]["restrictions"] = [
        {spelling: ["right_of_erasure", "right_of_restriction"]},
        {spelling: ["right_of_rectification"]},
    ]
    return payload


def login_admin(app, client):
    with app.app_context():
        uid = get_db().execute("SELECT id FROM users WHERE username='admin'").fetchone()["id"]
    with client.session_transaction() as session:
        session["user_id"] = uid
        session["_csrf_token"] = "test-csrf"


def assert_canonical(payload):
    restrictions = payload["data_subject_rights"]["restrictions"]
    assert restrictions == [
        {"rights": ["right_of_erasure", "right_of_restriction"]},
        {"rights": ["right_of_rectification"]},
    ]


def test_normalization_is_scoped_and_does_not_mutate_input():
    payload = restriction_activity("rigths")
    payload["extension"] = {"rigths": "leave unrelated fields alone"}
    original = deepcopy(payload)
    normalized = normalize_activity(payload)
    assert_canonical(normalized)
    assert normalized["extension"] == payload["extension"]
    assert payload == original
    assert normalize_activity(normalized) == normalized


def test_corrected_field_takes_precedence():
    payload = restriction_activity("rigths")
    payload["data_subject_rights"]["restrictions"][0]["rights"] = []
    restriction = normalize_activity(payload)["data_subject_rights"]["restrictions"][0]
    assert restriction == {"rights": []}


@pytest.mark.parametrize("spelling", ["rigths", "rights"])
@pytest.mark.parametrize("value", ["right_of_erasure", ["unknown_right"]])
def test_both_spellings_are_validated(spelling, value):
    payload = restriction_activity(spelling)
    payload["data_subject_rights"]["restrictions"][0][spelling] = value
    errors = validate_activity(payload)
    assert any(e["path"].startswith("data_subject_rights.restrictions.0.rights") for e in errors)


@pytest.mark.parametrize("spelling", ["rigths", "rights"])
def test_api_create_and_update_store_and_return_canonical_rights(app, client, spelling):
    payload = restriction_activity(spelling)
    response = client.post(
        "/api/v1/activities", headers=basic("admin"),
        json={"organisation_id": app.config["TEST_ORG1"], "activity": payload},
    )
    assert response.status_code == 201, response.get_data(as_text=True)
    assert_canonical(response.get_json()["activity"])
    uuid_value = response.get_json()["uuid"]
    # Exercise the other spelling on update as well.
    payload = restriction_activity("rights" if spelling == "rigths" else "rigths")
    response = client.put(
        f"/api/v1/activities/{uuid_value}", headers=basic("admin"), json={"activity": payload},
    )
    assert response.status_code == 200
    assert_canonical(response.get_json()["activity"])
    with app.app_context():
        row = get_db().execute("SELECT payload_json FROM activities WHERE uuid=?", (uuid_value,)).fetchone()
        assert_canonical(json.loads(row["payload_json"]))


@pytest.mark.parametrize("spelling", ["rigths", "rights"])
@pytest.mark.parametrize("as_array", [False, True])
def test_file_import_and_upsert_export_canonical_rights(app, client, spelling, as_array):
    login_admin(app, client)
    payload = restriction_activity(spelling)
    records = [payload] if as_array else payload
    for _ in range(2):
        response = client.post("/activities/import", data={
            "_csrf_token": "test-csrf", "organisation_id": app.config["TEST_ORG1"], "upsert": "1",
            "json_file": (BytesIO(json.dumps(records).encode()), "activities.json"),
        })
        assert response.status_code == 200
        assert b"0 record(s) have schema warnings" in response.data
    with app.app_context():
        rows = get_db().execute("SELECT payload_json FROM activities").fetchall()
        assert len(rows) == 1
        assert_canonical(json.loads(rows[0]["payload_json"]))
    for suffix in ("", "?include_meta=1"):
        response = client.get("/activities/export.json" + suffix)
        assert response.status_code == 200
        assert_canonical(response.get_json()[0])
        assert ("_meta" in response.get_json()[0]) == bool(suffix)


def test_existing_legacy_records_are_canonical_on_read(app, client):
    response = client.post(
        "/api/v1/activities", headers=basic("admin"),
        json={"organisation_id": app.config["TEST_ORG1"], "activity": restriction_activity()},
    )
    assert response.status_code == 201
    uuid_value = response.get_json()["uuid"]
    legacy_json = json.dumps(restriction_activity("rigths"))
    with app.app_context():
        db = get_db()
        db.execute("UPDATE activities SET payload_json=? WHERE uuid=?", (legacy_json, uuid_value))
        db.commit()
    response = client.get(f"/api/v1/activities/{uuid_value}", headers=basic("viewer"))
    assert response.status_code == 200
    assert_canonical(response.get_json()["activity"])
    assert_canonical(client.get("/api/v1/activities", headers=basic("viewer")).get_json()[0]["activity"])
    login_admin(app, client)
    for suffix in ("", "?include_meta=1"):
        assert_canonical(client.get("/activities/export.json" + suffix).get_json()[0])
    response = client.get(f"/activities/{uuid_value}/edit")
    assert response.status_code == 200
    assert b'"rights"' in response.data
    assert b'"rigths"' not in response.data
    with app.app_context():
        row = get_db().execute("SELECT payload_json FROM activities WHERE uuid=?", (uuid_value,)).fetchone()
        assert row["payload_json"] == legacy_json  # Reads do not rewrite stored data.


@pytest.mark.parametrize("spelling", ["rigths", "rights"])
def test_web_create_and_edit_normalize_rights(app, client, spelling):
    login_admin(app, client)
    response = client.post("/activities/new", data={
        "_csrf_token": "test-csrf", "organisation_id": app.config["TEST_ORG1"],
        "status": "active", "payload_json": json.dumps(restriction_activity(spelling)),
    })
    assert response.status_code == 302
    location = response.headers["Location"]
    response = client.post(location + "/edit", data={
        "_csrf_token": "test-csrf", "organisation_id": app.config["TEST_ORG1"],
        "status": "active", "payload_json": json.dumps(restriction_activity(spelling)),
    })
    assert response.status_code == 302
    with app.app_context():
        row = get_db().execute("SELECT payload_json FROM activities").fetchone()
        assert_canonical(json.loads(row["payload_json"]))


def test_published_schemas_only_describe_corrected_rights(client):
    for url, headers in (("/api/openapi.json", {}), ("/api/v1/schema", basic("admin"))):
        response = client.get(url, headers=headers)
        assert response.status_code == 200
        schema = response.get_json()
        if url == "/api/openapi.json":
            schema = schema["components"]["schemas"]["ProcessingActivity"]
        properties = schema["properties"]["data_subject_rights"]["properties"]["restrictions"]["items"]["properties"]
        assert "rights" in properties
        assert "rigths" not in properties
