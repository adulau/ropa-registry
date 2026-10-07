"""Browser regression checks for the schema form and JSON editor."""
import json
import shutil
import threading

import pytest
from werkzeug.security import generate_password_hash
from werkzeug.serving import make_server

from ropa import create_app
from ropa.db import get_db, init_db, utcnow
from ropa.schema import activity_schema, default_activity, enum_values

playwright = pytest.importorskip("playwright.sync_api")


@pytest.fixture(scope="module")
def editor_server(tmp_path_factory):
    database = tmp_path_factory.mktemp("editor") / "test.sqlite3"
    app = create_app({"TESTING": True, "SECRET_KEY": "browser-test", "DATABASE": str(database)})
    with app.app_context():
        init_db()
        db = get_db()
        for number in (1, 2):
            db.execute("INSERT INTO organisations(uuid,name,created_at) VALUES(?,?,?)",
                       (f"org-{number}", f"Organisation {number}", utcnow()))
            db.execute("INSERT INTO departments(uuid,organisation_id,name,created_at) VALUES(?,?,?,?)",
                       (f"dept-{number}", number, f"Department {number}", utcnow()))
        db.execute("INSERT INTO users(username,password_hash,role,created_at) VALUES(?,?,?,?)",
                   ("browser-admin", generate_password_hash("test-password"), "admin", utcnow()))
        db.commit()
    server = make_server("127.0.0.1", 0, app, threaded=True)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()
    thread.join()
    server.server_close()


@pytest.fixture(scope="module")
def editor_browser():
    with playwright.sync_playwright() as driver:
        browser = driver.chromium.launch(executable_path=shutil.which("chromium"), headless=True)
        yield browser
        browser.close()


@pytest.fixture()
def editor_page(editor_browser, editor_server):
    context = editor_browser.new_context()
    page = context.new_page()
    page.set_default_timeout(10000)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(editor_server + "/login")
    page.get_by_label("Username", exact=True).fill("browser-admin")
    page.get_by_label("Password", exact=True).fill("test-password")
    page.get_by_role("button", name="Sign in", exact=True).click()
    page.wait_for_url(editor_server + "/")
    yield page
    context.close()
    assert errors == []


def field(page, *path):
    attribute = json.dumps(list(path), separators=(",", ":"))
    selector = '[data-field-path="' + attribute.replace("\\", "\\\\").replace('"', '\\"') + '"]'
    wrapper = page.locator(selector)
    wrapper.evaluate("""el => {
        const section = el.querySelector(':scope > details');
        if (section) section.open = true;
        for (let parent = el.parentElement; parent; parent = parent.parentElement) {
            if (parent.tagName === 'DETAILS') parent.open = true;
        }
    }""")
    return wrapper


def control(page, *path):
    return field(page, *path).locator(":scope > input, :scope > select, :scope > textarea")


def create_record(page, base_url, payload, invalid=False):
    response = page.context.request.post(base_url + "/api/v1/activities" + ("?allow_invalid=true" if invalid else ""),
                                         data={"organisation_id": 1, "activity": payload, "status": "draft"})
    assert response.status == 201, response.text()
    uuid = response.json()["uuid"]
    page.goto(f"{base_url}/activities/{uuid}/edit")
    playwright.expect(page.locator("#show-form")).to_have_attribute("aria-pressed", "true")
    return uuid


def save(page):
    with page.expect_navigation():
        page.get_by_role("button", name="Save", exact=True).click()


def full_activity(definition):
    if "enum" in definition:
        return definition["enum"][0]
    if definition.get("type") == "object":
        return {key: full_activity(child) for key, child in definition.get("properties", {}).items()
                if isinstance(child, dict)}
    if definition.get("type") == "array":
        return [full_activity(definition["items"])]
    if definition.get("type") == "boolean":
        return False
    if definition.get("type") == "number":
        return 42
    return "Example value"


def test_every_schema_field_has_a_form_control_and_extensions_survive(editor_page, editor_server):
    page = editor_page
    payload = full_activity(activity_schema())
    payload["extension"] = {"list": ["", None, False, 42], "html": "</script><script>window.injected=true</script>"}
    payload["__proto__"] = {"preserved": True}
    payload["description"]["custom"] = {"nested": [1, 2]}
    uuid = create_record(page, editor_server, payload)

    def assert_fields(value, path=()):
        if isinstance(value, dict):
            for key, child in value.items():
                wrapper = field(page, *path, key)
                assert wrapper.count() == 1
                if key not in ("extension", "__proto__", "custom"):
                    assert_fields(child, (*path, key))
        elif isinstance(value, list):
            for index, child in enumerate(value):
                assert field(page, *path, index).count() == 1
                assert_fields(child, (*path, index))
    assert_fields(payload)
    control(page, "name").fill("Edited using the complete form")
    payload["name"] = "Edited using the complete form"
    save(page)
    result = page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()
    assert result["activity"] == payload
    assert result["schema_valid"] is True
    assert page.evaluate("window.injected === undefined")


def test_new_activity_nested_fields_and_mode_switching(editor_page, editor_server):
    page = editor_page
    page.goto(editor_server + "/activities/new")
    control(page, "name").fill("Created in the form")
    control(page, "id").fill("23")
    control(page, "international_transfer", "transfer").select_option("false")
    field(page, "data_subjects").get_by_role("button", name="Add item to Data Subjects", exact=True).click()
    control(page, "data_subjects", 0).fill("Customers\nwith a multiline description")
    field(page, "personal_data", "data").get_by_role("button", name="Add item to Data", exact=True).click()
    control(page, "personal_data", "data", 0, "description").fill("Email addresses")
    control(page, "personal_data", "data", 0, "category").select_option(label="Personal details")
    field(page, "legal_ground", "NIS2_references").get_by_role("button", name="Add NIS2 References", exact=True).click()
    field(page, "legal_ground", "NIS2_references").get_by_role("button", name="Add item to NIS2 References", exact=True).click()
    control(page, "legal_ground", "NIS2_references", 0).select_option("1")
    page.get_by_role("button", name="JSON editor", exact=True).click()
    raw = page.locator("#payload-json")
    payload = json.loads(raw.input_value())
    assert payload["id"] == 23
    assert payload["international_transfer"]["transfer"] is False
    assert payload["data_subjects"] == ["Customers\nwith a multiline description"]
    assert payload["legal_ground"]["NIS2_references"] == enum_values("legal_ground", "NIS2_references", "items")[1:2]
    payload["retention_period"] = "24 months"
    payload["raw_extension"] = {"preserve": None}
    raw.fill(json.dumps(payload))
    page.get_by_role("button", name="Form editor", exact=True).click()
    assert control(page, "retention_period").input_value() == "24 months"
    control(page, "controller").fill("Example organisation")
    payload["controller"] = "Example organisation"
    page.locator('select[name="status"]').select_option("active")
    save(page)
    uuid = page.url.split("/")[-1]
    result = page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()
    assert result["activity"] == payload
    assert result["status"] == "active"


def test_optional_fields_empty_arrays_false_and_absent_values_are_preserved(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    del payload["controller"]
    uuid = create_record(page, editor_server, payload)
    save(page)
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload
    page.goto(f"{editor_server}/activities/{uuid}/edit")
    field(page, "data_subjects").get_by_role("button", name="Add item to Data Subjects", exact=True).click()
    control(page, "data_subjects", 0).fill("First entry")
    field(page, "data_subjects").get_by_role("button", name="Add item to Data Subjects", exact=True).click()
    control(page, "data_subjects", 1).fill("Second entry")
    field(page, "data_subjects", 0).get_by_role("button", name="Remove item: Item 1", exact=True).click()
    assert control(page, "data_subjects", 0).input_value() == "Second entry"
    field(page, "description").get_by_role("button", name="Remove field: Description", exact=True).click()
    save(page)
    payload["data_subjects"] = ["Second entry"]
    del payload["description"]
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload


def test_legacy_enum_values_are_preserved_until_changed(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    payload["purpose"] = "Unrecognised legacy purpose"
    uuid = create_record(page, editor_server, payload, invalid=True)
    assert control(page, "purpose").input_value() == "legacy"
    save(page)
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload
    page.goto(f"{editor_server}/activities/{uuid}/edit")
    control(page, "purpose").select_option("0")
    save(page)
    result = page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()
    assert result["schema_valid"] is True


def test_invalid_json_stays_in_raw_editor_and_survives_rejected_save(editor_page, editor_server):
    page = editor_page
    page.goto(editor_server + "/activities/new")
    page.get_by_role("button", name="JSON editor", exact=True).click()
    broken = '{"name": "Keep this unsaved edit"'
    page.locator("#payload-json").fill(broken)
    page.get_by_role("button", name="Form editor", exact=True).click()
    playwright.expect(page.locator("#editor-error")).to_be_visible()
    assert page.locator("#payload-json").input_value() == broken
    page.locator('select[name="organisation_id"]').select_option("2")
    page.locator('select[name="department_id"]').select_option("2")
    page.locator('select[name="status"]').select_option("active")
    save(page)
    assert page.locator("#payload-json").input_value() == broken
    assert page.locator('select[name="organisation_id"]').input_value() == "2"
    assert page.locator('select[name="department_id"]').input_value() == "2"
    assert page.locator('select[name="status"]').input_value() == "active"


def test_invalid_active_form_save_preserves_edits_without_updating_database(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    uuid = create_record(page, editor_server, payload)
    control(page, "name").fill("Keep the rejected form edit")
    field(page, "legal_ground").get_by_role("button", name="Remove field: Legal Ground", exact=True).click()
    page.locator('select[name="status"]').select_option("active")
    save(page)
    playwright.expect(page.get_by_role("heading", name="Validation issues")).to_be_visible()
    assert control(page, "name").input_value() == "Keep the rejected form edit"
    assert page.locator('select[name="status"]').input_value() == "active"
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload


def test_malformed_existing_field_can_be_replaced_with_form_controls(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    payload["data_subjects"] = "Legacy wrong type"
    uuid = create_record(page, editor_server, payload, invalid=True)
    field(page, "data_subjects").get_by_role("button", name="Replace with array", exact=True).click()
    field(page, "data_subjects").get_by_role("button", name="Add item to Data Subjects", exact=True).click()
    control(page, "data_subjects", 0).fill("Customers")
    save(page)
    result = page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()
    assert result["activity"]["data_subjects"] == ["Customers"]
    assert result["schema_valid"] is True


def test_invalid_extra_field_json_cannot_be_silently_discarded(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    payload["extension"] = {"preserved": True}
    uuid = create_record(page, editor_server, payload)
    control(page, "extension").fill("{")
    page.get_by_role("button", name="JSON editor", exact=True).click()
    playwright.expect(page.locator("#editor-error")).to_be_visible()
    playwright.expect(page.locator("#form-editor")).to_be_visible()
    field(page, "extension").get_by_role("button", name="Remove field: Extension", exact=True).click()
    save(page)
    result = page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()
    assert "extension" not in result["activity"]


def test_raw_json_editing_without_javascript(editor_page, editor_browser, editor_server):
    context = editor_browser.new_context(storage_state=editor_page.context.storage_state(), java_script_enabled=False)
    page = context.new_page()
    payload = default_activity()
    response = context.request.post(editor_server + "/api/v1/activities", data={"organisation_id": 1, "activity": payload})
    assert response.status == 201
    uuid = response.json()["uuid"]
    page.goto(f"{editor_server}/activities/{uuid}/edit")
    playwright.expect(page.locator(".editor-switch")).to_be_hidden()
    playwright.expect(page.locator("#payload-json")).to_be_visible()
    payload["name"] = "Edited without JavaScript"
    page.locator("#payload-json").fill(json.dumps(payload))
    save(page)
    assert context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload
    context.close()


def test_editor_layout_on_mobile(editor_page, editor_server):
    page = editor_page
    page.set_viewport_size({"width": 390, "height": 844})
    create_record(page, editor_server, full_activity(activity_schema()))
    assert page.locator("#form-editor > [data-field-path]").first.get_attribute("data-field-path") == '["id"]'
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    control(page, "name").fill("Edited on mobile")
    page.get_by_role("button", name="JSON editor", exact=True).click()
    assert json.loads(page.locator("#payload-json").input_value())["name"] == "Edited on mobile"


def test_replacing_malformed_field_preserves_other_pending_json_edits(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    payload["extension"] = {"preserved": True}
    payload["data_subjects"] = "Legacy wrong type"
    create_record(page, editor_server, payload, invalid=True)
    control(page, "extension").fill("{")
    field(page, "data_subjects").get_by_role("button", name="Replace with array", exact=True).click()
    assert control(page, "extension").input_value() == "{"
    assert control(page, "data_subjects").input_value() == json.dumps("Legacy wrong type")
    playwright.expect(page.locator("#editor-error")).to_be_visible()
    control(page, "extension").fill('{"preserved": false}')
    field(page, "data_subjects").get_by_role("button", name="Replace with array", exact=True).click()
    page.get_by_role("button", name="JSON editor", exact=True).click()
    result = json.loads(page.locator("#payload-json").input_value())
    assert result["extension"] == {"preserved": False}
    assert result["data_subjects"] == []
