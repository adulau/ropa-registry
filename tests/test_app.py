import base64
from copy import deepcopy
from io import BytesIO
from hashlib import sha256
import json
from pathlib import Path

import pytest
from jsonschema import Draft7Validator
from werkzeug.security import generate_password_hash

from ropa import create_app
from ropa.db import get_db, init_db, utcnow
from ropa.schema import activity_schema, default_activity, enum_values, normalize_activity, validate_activity


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


def seed_preupgrade_activity(app, client, payload, status="active", valid=True, errors=None):
    response = client.post(
        "/api/v1/activities", headers=basic("admin"),
        json={"organisation_id": app.config["TEST_ORG1"], "activity": restriction_activity()},
    )
    assert response.status_code == 201
    uuid_value = response.get_json()["uuid"]
    with app.app_context():
        db = get_db()
        db.execute(
            """UPDATE activities SET payload_json=?,schema_valid=?,validation_errors_json=?,
               status=?,archived_at=? WHERE uuid=?""",
            (json.dumps(payload), int(valid), json.dumps(errors or []), status,
             "2025-01-01T00:00:00+00:00" if status == "archived" else None, uuid_value),
        )
        # Model an existing database created before migration tracking existed.
        db.execute("DROP TABLE IF EXISTS schema_migrations")
        db.execute("DROP TABLE IF EXISTS activity_schema_state")
        db.commit()
        return dict(db.execute("SELECT * FROM activities WHERE uuid=?", (uuid_value,)).fetchone())


def restart_app(app):
    return create_app({"TESTING": True, "SECRET_KEY": "test", "DATABASE": app.config["DATABASE"]})


@pytest.mark.parametrize("value", ["right_of_erasure", ["unknown_right"]])
@pytest.mark.parametrize("status", ["active", "draft", "archived"])
@pytest.mark.parametrize("entrypoint", ["startup", "init-db"])
def test_upgrade_revalidates_previously_unrestricted_rights(app, client, value, status, entrypoint):
    payload = restriction_activity()
    payload["data_subject_rights"]["restrictions"][0]["rights"] = value
    before = seed_preupgrade_activity(app, client, payload, status)
    if entrypoint == "startup":
        upgraded = restart_app(app)
    else:
        result = app.test_cli_runner().invoke(args=["init-db"])
        assert result.exit_code == 0, result.output
        upgraded = app
    with upgraded.app_context():
        db = get_db()
        row = dict(db.execute("SELECT * FROM activities WHERE uuid=?", (before["uuid"],)).fetchone())
        assert row["schema_valid"] == 0
        assert json.loads(row["validation_errors_json"]) == validate_activity(payload)
        assert row["status"] == ("draft" if status == "active" else status)
        for field in ("payload_json", "uuid", "organisation_id", "department_id", "external_id",
                      "created_at", "created_by", "updated_by", "archived_at"):
            assert row[field] == before[field]
        audit = db.execute("SELECT * FROM audit_logs WHERE action='schema_revalidate'").fetchall()
        assert len(audit) == 1
        details = json.loads(audit[0]["details_json"])
        assert details["before"]["schema_valid"] == 1
        assert details["after"]["schema_valid"] == 0
        migration = dict(db.execute("SELECT * FROM schema_migrations").fetchone())
        schema_state = dict(db.execute("SELECT * FROM activity_schema_state").fetchone())

    upgraded_client = upgraded.test_client()
    response = upgraded_client.get(f"/api/v1/activities/{before['uuid']}", headers=basic("viewer"))
    assert response.status_code == 200
    assert response.get_json()["schema_valid"] is False
    assert response.get_json()["validation_errors"] == validate_activity(payload)
    assert response.get_json()["status"] == row["status"]
    if status != "archived":
        assert upgraded_client.get("/api/v1/activities", headers=basic("viewer")).get_json()[0]["schema_valid"] is False
        login_admin(upgraded, upgraded_client)
        exported = upgraded_client.get("/activities/export.json?include_meta=1").get_json()[0]
        assert exported["_meta"]["schema_valid"] is False
        assert exported["_meta"]["status"] == row["status"]

    # Repeated factory startup and explicit initialization do not change rows or add audit entries.
    restarted = restart_app(upgraded)
    result = restarted.test_cli_runner().invoke(args=["init-db"])
    assert result.exit_code == 0, result.output
    with restarted.app_context():
        db = get_db()
        assert dict(db.execute("SELECT * FROM activities WHERE uuid=?", (before["uuid"],)).fetchone()) == row
        assert db.execute("SELECT COUNT(*) FROM audit_logs WHERE action='schema_revalidate'").fetchone()[0] == 1
        assert dict(db.execute("SELECT * FROM schema_migrations").fetchone()) == migration
        assert dict(db.execute("SELECT * FROM activity_schema_state").fetchone()) == schema_state


@pytest.mark.parametrize("spelling", ["rights", "rigths"])
@pytest.mark.parametrize("status", ["active", "draft", "archived"])
def test_upgrade_refreshes_valid_records_without_changing_status(app, client, spelling, status):
    payload = restriction_activity(spelling)
    before = seed_preupgrade_activity(
        app, client, payload, status, valid=False, errors=[{"path": "$", "message": "stale error"}],
    )
    upgraded = restart_app(app)
    with upgraded.app_context():
        row = get_db().execute("SELECT * FROM activities WHERE uuid=?", (before["uuid"],)).fetchone()
        assert row["schema_valid"] == 1
        assert json.loads(row["validation_errors_json"]) == []
        assert row["status"] == status
        assert row["archived_at"] == before["archived_at"]
        assert row["payload_json"] == before["payload_json"]
    response = upgraded.test_client().get(f"/api/v1/activities/{before['uuid']}", headers=basic("viewer"))
    assert response.status_code == 200
    assert_canonical(response.get_json()["activity"])


def test_upgrade_rolls_back_changes_and_marker_on_failure(app, client, monkeypatch):
    payload = restriction_activity()
    payload["data_subject_rights"]["restrictions"][0]["rights"] = ["unknown_right"]
    before = [seed_preupgrade_activity(app, client, payload) for _ in range(2)]
    calls = 0

    def failing_validator(payload):
        nonlocal calls
        calls += 1
        if calls == 2:
            raise RuntimeError("interrupted upgrade")
        return validate_activity(payload)

    monkeypatch.setattr("ropa.schema.validate_activity", failing_validator)
    with pytest.raises(RuntimeError, match="interrupted upgrade"):
        restart_app(app)
    with app.app_context():
        db = get_db()
        assert [dict(row) for row in db.execute("SELECT * FROM activities ORDER BY id")] == before
        assert db.execute("SELECT COUNT(*) FROM audit_logs WHERE action='schema_revalidate'").fetchone()[0] == 0
        assert db.execute("SELECT 1 FROM sqlite_master WHERE name='schema_migrations'").fetchone() is None
        assert db.execute("SELECT 1 FROM sqlite_master WHERE name='activity_schema_state'").fetchone() is None
    monkeypatch.undo()
    upgraded = restart_app(app)
    with upgraded.app_context():
        rows = get_db().execute("SELECT status,schema_valid FROM activities").fetchall()
        assert all(row["status"] == "draft" and row["schema_valid"] == 0 for row in rows)


def test_nis2_references_are_optional_and_validate_all_csirt_references():
    payload = default_activity()
    assert validate_activity(payload) == []
    payload["legal_ground"]["NIS2_references"] = []
    assert validate_activity(payload) == []
    references = enum_values("legal_ground", "NIS2_references", "items")
    assert len(references) == 12
    assert {reference.split(" - ")[0] for reference in references} == {
        *(f"NIS 2 Art. 11(3)({letter})" for letter in "abcdefgh"),
        "NIS 2 Art. 11(4)",
        *(f"NIS 2 Art. 11(5)({letter})" for letter in "abc"),
    }
    payload["legal_ground"]["NIS2_references"] = references
    payload["legal_ground"]["NISD_references"] = enum_values("legal_ground", "NISD_references", "items")
    assert validate_activity(payload) == []


@pytest.mark.parametrize("value", ["NIS 2", ["unknown reference"], [42], None])
def test_nis2_references_reject_malformed_values(value):
    payload = default_activity()
    payload["legal_ground"]["NIS2_references"] = value
    errors = validate_activity(payload)
    assert any(error["path"].startswith("legal_ground.NIS2_references") for error in errors)


def test_nis2_references_import_api_and_export_roundtrip(app, client):
    payload = restriction_activity()
    payload["legal_ground"]["NIS2_references"] = enum_values("legal_ground", "NIS2_references", "items")
    payload["legal_ground"]["NISD_references"] = enum_values("legal_ground", "NISD_references", "items")[:1]
    login_admin(app, client)
    response = client.post("/activities/import", data={
        "_csrf_token": "test-csrf", "organisation_id": app.config["TEST_ORG1"],
        "json_file": (BytesIO(json.dumps([payload]).encode()), "nis2.json"),
    })
    assert response.status_code == 200
    assert b"0 record(s) have schema warnings" in response.data
    response = client.get("/api/v1/activities", headers=basic("viewer"))
    assert response.status_code == 200
    activity = response.get_json()[0]
    assert activity["activity"] == payload
    assert activity["schema_valid"] is True
    payload["legal_ground"]["NIS2_references"] = payload["legal_ground"]["NIS2_references"][:2]
    response = client.put(f"/api/v1/activities/{activity['uuid']}", headers=basic("admin"), json={"activity": payload})
    assert response.status_code == 200
    assert response.get_json()["activity"] == payload
    assert client.get("/activities/export.json").get_json() == [payload]
    response = client.get("/activities/export.md")
    assert response.status_code == 200
    assert payload["legal_ground"]["NIS2_references"][0].encode() in response.data
    for url, headers in (("/api/openapi.json", {}), ("/api/v1/schema", basic("viewer"))):
        response = client.get(url, headers=headers)
        assert response.status_code == 200
        schema = response.get_json()
        if url == "/api/openapi.json":
            schema = schema["components"]["schemas"]["ProcessingActivity"]
        assert schema["properties"]["legal_ground"]["properties"]["NIS2_references"]["items"]["enum"] == enum_values("legal_ground", "NIS2_references", "items")


@pytest.mark.parametrize("previous_marker", ["rights-migration", "schema-fingerprint", "current-schema-fingerprint"])
def test_schema_change_revalidates_existing_nis2_values(app, client, previous_marker):
    payload = restriction_activity()
    payload["legal_ground"]["NIS2_references"] = ["previously unrestricted value"]
    before = seed_preupgrade_activity(app, client, payload)
    if previous_marker == "rights-migration":
        marker = "restriction-rights-validation-v1"
    else:
        old_schema = deepcopy(activity_schema())
        if previous_marker == "schema-fingerprint":
            del old_schema["properties"]["legal_ground"]["properties"]["NIS2_references"]
        marker = "activity-schema-validation-" + sha256(
            json.dumps(old_schema, sort_keys=True, separators=(",", ":")).encode("utf-8")
        ).hexdigest()
    with app.app_context():
        db = get_db()
        db.execute("CREATE TABLE schema_migrations(name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)")
        db.execute("INSERT INTO schema_migrations VALUES(?,?)", (marker, utcnow()))
        db.commit()
    upgraded = restart_app(app)
    response = upgraded.test_client().get(f"/api/v1/activities/{before['uuid']}", headers=basic("viewer"))
    assert response.status_code == 200
    result = response.get_json()
    assert result["schema_valid"] is False
    assert result["status"] == "draft"
    assert result["validation_errors"] == validate_activity(payload)
    with restart_app(upgraded).app_context():
        db = get_db()
        assert db.execute("SELECT COUNT(*) FROM schema_migrations").fetchone()[0] == (
            1 if previous_marker == "current-schema-fingerprint" else 2
        )
        assert db.execute("SELECT COUNT(*) FROM audit_logs WHERE action='schema_revalidate'").fetchone()[0] == 1


@pytest.mark.parametrize("entrypoint", ["startup", "init-db"])
@pytest.mark.parametrize("fail_first", [False, True])
def test_returning_to_previous_schema_revalidates_new_records(app, monkeypatch, entrypoint, fail_first):
    strict_schema = deepcopy(activity_schema())
    permissive_schema = deepcopy(strict_schema)
    new_reference = "NIS 2 reference introduced only by the newer schema"
    permissive_schema["properties"]["legal_ground"]["properties"]["NIS2_references"]["items"]["enum"].append(new_reference)
    running_schema = [strict_schema]
    monkeypatch.setattr("ropa.schema.activity_schema", lambda: running_schema[0])
    monkeypatch.setattr("ropa.schema.validator", lambda: Draft7Validator(running_schema[0]))
    with app.app_context():
        strict_state = dict(get_db().execute("SELECT * FROM activity_schema_state").fetchone())

    running_schema[0] = permissive_schema
    newer_app = restart_app(app)
    payload = restriction_activity()
    payload["legal_ground"]["NIS2_references"] = [new_reference]
    assert list(Draft7Validator(strict_schema).iter_errors(payload))
    assert validate_activity(payload) == []
    response = newer_app.test_client().post(
        "/api/v1/activities", headers=basic("admin"),
        json={"organisation_id": app.config["TEST_ORG1"], "activity": payload},
    )
    assert response.status_code == 201
    record = response.get_json()
    assert record["schema_valid"] is True
    assert record["status"] == "active"
    with newer_app.app_context():
        db = get_db()
        permissive_state = dict(db.execute("SELECT * FROM activity_schema_state").fetchone())
        assert permissive_state["fingerprint"] != strict_state["fingerprint"]
        # Both schemas have historical markers, including the one we roll back to.
        assert db.execute("SELECT COUNT(*) FROM schema_migrations").fetchone()[0] == 2

    running_schema[0] = strict_schema
    if fail_first:
        with monkeypatch.context() as failing:
            def interrupted(payload):
                raise RuntimeError("interrupted rollback validation")
            failing.setattr("ropa.schema.validate_activity", interrupted)
            if entrypoint == "startup":
                with pytest.raises(RuntimeError, match="interrupted rollback validation"):
                    restart_app(newer_app)
            else:
                result = newer_app.test_cli_runner().invoke(args=["init-db"])
                assert result.exit_code != 0
                assert str(result.exception) == "interrupted rollback validation"
        with newer_app.app_context():
            db = get_db()
            assert dict(db.execute("SELECT * FROM activity_schema_state").fetchone()) == permissive_state
            row = db.execute("SELECT * FROM activities WHERE uuid=?", (record["uuid"],)).fetchone()
            assert row["schema_valid"] == 1 and row["status"] == "active"
            assert db.execute("SELECT COUNT(*) FROM audit_logs WHERE action='schema_revalidate'").fetchone()[0] == 0

    if entrypoint == "startup":
        rolled_back_app = restart_app(newer_app)
    else:
        result = newer_app.test_cli_runner().invoke(args=["init-db"])
        assert result.exit_code == 0, result.output
        rolled_back_app = newer_app
    response = rolled_back_app.test_client().get(f"/api/v1/activities/{record['uuid']}", headers=basic("viewer"))
    assert response.status_code == 200
    result = response.get_json()
    assert result["activity"] == payload
    assert result["schema_valid"] is False
    assert result["status"] == "draft"
    assert result["validation_errors"] == validate_activity(payload)
    with rolled_back_app.app_context():
        db = get_db()
        current_state = dict(db.execute("SELECT * FROM activity_schema_state").fetchone())
        assert current_state["fingerprint"] == strict_state["fingerprint"]
        assert db.execute("SELECT COUNT(*) FROM schema_migrations").fetchone()[0] == 2
        assert db.execute("SELECT COUNT(*) FROM audit_logs WHERE action='schema_revalidate'").fetchone()[0] == 1
    with restart_app(rolled_back_app).app_context():
        db = get_db()
        assert dict(db.execute("SELECT * FROM activity_schema_state").fetchone()) == current_state
        assert db.execute("SELECT COUNT(*) FROM audit_logs WHERE action='schema_revalidate'").fetchone()[0] == 1
