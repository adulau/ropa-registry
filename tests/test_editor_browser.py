"""Browser regression checks for the schema form and JSON editor."""
import json
import re
import shutil
import threading
from decimal import Decimal

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


@pytest.mark.parametrize("edit_name", [False, True])
def test_large_integers_survive_form_save_and_mode_switches(editor_page, editor_server, edit_name):
    page = editor_page
    large = 9007199254740993
    payload = default_activity()
    payload["id_old"] = large
    payload["extension"] = {"nested": [large, -large, 10**80], "text": str(large)}
    payload["description"]["extra_number"] = large
    uuid = create_record(page, editor_server, payload)
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload
    assert control(page, "id_old").input_value() == str(large)
    if edit_name:
        control(page, "name").fill("Only this name changed")
        payload["name"] = "Only this name changed"
        for _ in range(2):
            page.get_by_role("button", name="JSON editor", exact=True).click()
            assert json.loads(page.locator("#payload-json").input_value()) == payload
            page.get_by_role("button", name="Form editor", exact=True).click()
    save(page)
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload


def test_large_integers_can_be_edited_in_numeric_and_extra_fields(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    payload["id_old"] = 42
    payload["extension"] = {"value": 1}
    uuid = create_record(page, editor_server, payload)
    large = 9007199254740993
    control(page, "id_old").fill(str(large))
    control(page, "extension").fill(json.dumps({"value": -large, "nested": [10**80]}))
    save(page)
    payload["id_old"] = large
    payload["extension"] = {"value": -large, "nested": [10**80]}
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload


def test_number_lexemes_survive_json_form_roundtrips(editor_page, editor_server):
    page = editor_page
    page.goto(editor_server + "/activities/new")
    page.get_by_role("button", name="JSON editor", exact=True).click()
    numeric_tokens = ["9007199254740993", "1.23456789012345678901234567890", "1e-1000", "-0", "1E+300"]
    raw = json.dumps(default_activity())[:-1] + ', "extension": [' + ", ".join(numeric_tokens) + "]}"
    page.locator("#payload-json").fill(raw)
    for _ in range(2):
        page.get_by_role("button", name="Form editor", exact=True).click()
        control(page, "name").fill("Preserve numeric tokens")
        page.get_by_role("button", name="JSON editor", exact=True).click()
        raw = page.locator("#payload-json").input_value()
        for token in numeric_tokens:
            assert token in raw
    numbers = json.loads(raw, parse_float=Decimal)["extension"]
    assert numbers[0] == 9007199254740993
    assert numbers[1] == Decimal(numeric_tokens[1])
    assert numbers[2] == Decimal(numeric_tokens[2])


def test_invalid_numeric_edit_blocks_serializing_an_old_value(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    payload["id_old"] = 9007199254740993
    create_record(page, editor_server, payload)
    control(page, "id_old").fill("not a number")
    page.get_by_role("button", name="JSON editor", exact=True).click()
    playwright.expect(page.locator("#editor-error")).to_be_visible()
    playwright.expect(page.locator("#form-editor")).to_be_visible()
    assert control(page, "id_old").input_value() == "not a number"
    control(page, "id_old").fill("9007199254740995")
    page.get_by_role("button", name="JSON editor", exact=True).click()
    assert json.loads(page.locator("#payload-json").input_value())["id_old"] == 9007199254740995


@pytest.mark.parametrize("unsupported", ["rawJSON", "reviver-source"])
def test_older_browsers_use_raw_json_without_rounding(editor_page, editor_browser, editor_server, unsupported):
    payload = default_activity()
    payload["id_old"] = 9007199254740993
    uuid = create_record(editor_page, editor_server, payload)
    context = editor_browser.new_context(storage_state=editor_page.context.storage_state())
    if unsupported == "rawJSON":
        context.add_init_script("JSON.rawJSON = undefined;")
    else:
        context.add_init_script("""const nativeParse = JSON.parse;
            JSON.parse = (text, reviver) => nativeParse(text, reviver ? (key, value) => reviver(key, value) : undefined);
        """)
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(f"{editor_server}/activities/{uuid}/edit")
    playwright.expect(page.locator("#form-editor")).to_be_hidden()
    playwright.expect(page.locator("#payload-json")).to_be_visible()
    playwright.expect(page.locator("#editor-error")).to_contain_text("Update your browser")
    assert json.loads(page.locator("#payload-json").input_value()) == payload
    payload["name"] = "Edited with exact integers in the raw fallback"
    page.locator("#payload-json").fill(json.dumps(payload))
    save(page)
    assert context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload
    context.close()
    assert errors == []


@pytest.mark.parametrize("path", [("purpose",), ("description", "RFC_2350_generic", 0)])
def test_reselecting_legacy_enum_restores_displayed_and_saved_value(editor_page, editor_server, path):
    page = editor_page
    payload = default_activity()
    legacy = "Unrecognised legacy value"
    if len(path) == 1:
        payload["purpose"] = legacy
    else:
        payload["description"]["RFC_2350_generic"] = [legacy]
    uuid = create_record(page, editor_server, payload, invalid=True)
    control(page, *path).select_option("0")
    control(page, *path).select_option("legacy")
    assert field(page, *path).locator(".editor-enum-value").inner_text() == legacy
    page.get_by_role("button", name="JSON editor", exact=True).click()
    assert json.loads(page.locator("#payload-json").input_value()) == payload
    page.get_by_role("button", name="Form editor", exact=True).click()
    control(page, *path).select_option("0")
    control(page, *path).select_option("legacy")
    save(page)
    assert page.context.request.get(f"{editor_server}/api/v1/activities/{uuid}").json()["activity"] == payload


def test_vitrine_json_tree_raw_search_and_download_preserve_payload(editor_page, editor_server, tmp_path):
    page = editor_page
    payload = default_activity()
    payload['extension'] = {
        'large_integer': 90071992547409931234567890,
        'hostile_text': '</pre><script>window.injected=true</script>',
    }
    uuid = create_record(page, editor_server, payload)
    page.goto(f'{editor_server}/activities/{uuid}')
    viewer = page.locator('vt-json')
    playwright.expect(viewer).to_be_visible()
    playwright.expect(viewer.get_by_role('tree')).to_be_visible()
    playwright.expect(page.locator('[data-record-viewer=json] .viewer-source')).to_be_hidden()
    viewer.get_by_role('tab', name='Raw', exact=True).click()
    playwright.expect(viewer.locator('[part=code]')).to_contain_text(str(payload['extension']['large_integer']))
    viewer.get_by_role('button', name='Search', exact=True).click()
    viewer.get_by_role('searchbox').fill('large_integer')
    playwright.expect(viewer.locator('[part=search-count]')).to_contain_text('1')
    with page.expect_download() as pending:
        viewer.get_by_role('button', name='Download', exact=True).click()
    download = pending.value
    destination = tmp_path / download.suggested_filename
    download.save_as(destination)
    assert json.loads(destination.read_text()) == payload
    assert page.evaluate('window.injected') is None


def test_vitrine_markdown_preview_blocks_content_execution_and_remote_images(editor_page, editor_server):
    page = editor_page
    payload = default_activity()
    payload['name'] = 'Incident response'
    payload['description']['summary'] = (
        '<img src=x onerror="window.injected=true">\n\n'
        '![Remote image](https://example.invalid/tracker.png)\n\n'
        '[Bad link](javascript:alert(1))'
    )
    uuid = create_record(page, editor_server, payload)
    requests = []
    page.on('request', lambda request: requests.append(request.url))
    page.goto(f'{editor_server}/activities/{uuid}')
    page.locator('[data-record-viewer=markdown]').locator('..').evaluate('element => element.open = true')
    viewer = page.locator('vt-markdown')
    playwright.expect(viewer).to_be_visible()
    playwright.expect(viewer.get_by_role('heading', name=re.compile('^1 — Incident response'))).to_be_visible()
    assert viewer.locator('img, script, [onerror], a[href^="javascript:"]').count() == 0
    assert page.evaluate('window.injected') is None
    assert all(url.startswith(editor_server) for url in requests)
    viewer.get_by_role('tab', name='Source', exact=True).click()
    playwright.expect(viewer.locator('[part=code]')).to_contain_text('Remote image')


@pytest.mark.parametrize('disabled_javascript', [True, False], ids=['no-javascript', 'missing-viewer-module'])
def test_record_viewer_text_fallback(editor_page, editor_browser, editor_server, disabled_javascript):
    uuid = create_record(editor_page, editor_server, default_activity())
    context = editor_browser.new_context(storage_state=editor_page.context.storage_state(),
                                         java_script_enabled=not disabled_javascript)
    if not disabled_javascript:
        context.route('**/static/vendor/vitrine/viewers.js', lambda route: route.abort())
    page = context.new_page()
    try:
        page.goto(f'{editor_server}/activities/{uuid}')
        source = page.locator('[data-record-viewer=json] .viewer-source')
        playwright.expect(source).to_be_visible()
        assert json.loads(source.inner_text()) == default_activity()
        page.locator('[data-record-viewer=markdown]').locator('..').evaluate('element => element.open = true')
        playwright.expect(page.locator('[data-record-viewer=markdown] .viewer-source')).to_be_visible()
    finally:
        context.close()


@pytest.mark.parametrize('bad_content', ["'x'.repeat(2 * 1024 * 1024 + 1)", "'{'"],
                         ids=['content-too-large', 'invalid-json'])
def test_viewer_error_restores_original_text(editor_page, editor_server, bad_content):
    page = editor_page
    payload = default_activity()
    uuid = create_record(page, editor_server, payload)
    page.goto(f'{editor_server}/activities/{uuid}')
    viewer = page.locator('vt-json')
    playwright.expect(viewer).to_be_visible()
    viewer.evaluate(f"element => {{ element.content = {bad_content}; }}")
    playwright.expect(viewer).to_be_hidden()
    source = page.locator('[data-record-viewer=json] .viewer-source')
    playwright.expect(source).to_be_visible()
    assert json.loads(source.inner_text()) == payload


def test_vitrine_and_registry_pages_fit_mobile_viewport(editor_page, editor_server):
    page = editor_page
    uuid = create_record(page, editor_server, default_activity())
    page.set_viewport_size({'width': 390, 'height': 844})
    for path in ('/', '/activities', f'/activities/{uuid}', '/activities/import', '/admin/organisations',
                 '/admin/departments', '/admin/users', '/admin/audit', '/api/docs'):
        response = page.goto(editor_server + path)
        assert response.status == 200
        if path == f'/activities/{uuid}':
            playwright.expect(page.locator('vt-json')).to_be_visible()
            page.locator('[data-record-viewer=markdown]').locator('..').evaluate('element => element.open = true')
            playwright.expect(page.locator('vt-markdown')).to_be_visible()
            for component, tab in (('vt-json', 'Raw'), ('vt-markdown', 'Source')):
                viewer = page.locator(component)
                button = viewer.get_by_role('tab', name=tab, exact=True)
                bounds = button.bounding_box()
                frame = viewer.bounding_box()
                assert bounds['x'] + bounds['width'] <= frame['x'] + frame['width']
                button.click()
                playwright.expect(button).to_have_attribute('aria-selected', 'true')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), path
        playwright.expect(page.get_by_role('navigation', name='Main navigation')).to_be_visible()
