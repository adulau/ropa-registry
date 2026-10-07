# ROPA Registry

A lightweight application for managing GDPR Records of Processing Activities (ROPA) relying on a standard JSON format.

The application deliberately keeps the processing-activity JSON as the exchange object and stores operational metadata (UUID, organisation/department scope, timestamps, validation state and user references) in SQLite. This keeps the exchange format clean while allowing the format to evolve into a reusable standard.

This was done to operate the GDPR ROPA of a CSIRT. But it could work for any organisation who need a ROPA.

## Features

- Processing activities scoped to an **organisation** and optionally a **department**.
- Three roles:
  - **manager** — create, import, edit, archive and export activities in the assigned organisation; if assigned to a department, the manager is restricted to that department.
  - **viewer** — read and export all processing activities.
  - **admin** — full access, plus organisation, department and user creation and audit-log access.
- JSON import of one activity or an array of activities.
- Imports and API writes accept both `data_subject_rights.restrictions[].rigths`
  (legacy spelling) and `rights`. New records, JSON exports and API responses use
  only `rights`, including responses for previously stored legacy records. If
  both spellings occur in a restriction, `rights` takes precedence.
- Upsert-on-import by numeric processing-activity `id` within the selected organisation/department scope.
- JSON Schema validation using the supplied Draft-07 schema.
- Optional `legal_ground.NIS2_references` lists CSIRT tasks and cooperation
  requirements from NIS 2 Article 11 of Directive (EU) 2022/2555. It uses an array
  of predefined references, like `NISD_references`; both fields may coexist.
- Invalid legacy imports are retained as **drafts with validation warnings**. Invalid records cannot be activated.
- JSON export preserving the exchange format.
- Optional application metadata in JSON export with `?include_meta=1`.
- Human-readable Markdown export.
- UUID, created/updated timestamps, creator/updater references and status for each registry record.
- Append-only application audit log containing actor, action, object, source IP/user-agent and before/after JSON for changes.
- SQLite storage.
- Minimal versioned API with HTTP Basic authentication and OpenAPI 3.1 at `/api/openapi.json`.
- No JavaScript framework and only two runtime Python dependencies.

## Quick start

Requires Python 3.11+.

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt

export ROPA_SECRET_KEY="replace-with-a-long-random-secret"
flask --app app init-db
flask --app app create-admin admin
flask --app app run --debug
```

Open <http://127.0.0.1:5000>, sign in as the admin, then:

1. create an organisation;
2. optionally create departments;
3. create manager/viewer users;
4. import `ropa/data/example-processing-activities.json` or create a new activity.

For production, do **not** use Flask's development server. Put the application behind a production WSGI server/reverse proxy, configure TLS, set a strong `ROPA_SECRET_KEY`, restrict filesystem permissions on the SQLite database, and back up both the database and exported register.

## Upgrading existing databases

Back up the SQLite database before upgrading. On the first application startup
with an updated activity schema (or when running `flask --app app init-db`),
a transactional migration revalidates every persisted activity and refreshes its
validation state and errors. Invalid active records become drafts; draft and
archived records retain their status. Valid drafts are not automatically activated.
Stored payloads remain unchanged, and validation/status changes are recorded in
the audit log. A marker derived from the schema prevents repeat work on later
startups and triggers revalidation when the schema changes again.

This also catches malformed `rights` values that the previous schema accepted as
unrestricted additional properties, despite marking those records valid and active.

## Data model

The SQLite database has five main tables:

- `organisations`
- `departments`
- `users`
- `activities`
- `audit_logs`

`activities.payload_json` stores the processing activity without transforming the source representation. The table also stores:

- `uuid`: stable application identifier;
- `external_id`: the JSON record's numeric `id` for convenient matching/import;
- `organisation_id` / `department_id`: access scope;
- `schema_valid` and `validation_errors_json`;
- `status`: `draft`, `active`, or `archived`;
- `created_by` / `updated_by`;
- `created_at` / `updated_at` / `archived_at`.

## API

API authentication uses HTTP Basic authentication with the same application users and role/scoping checks as the web UI.

OpenAPI: `GET /api/openapi.json`

Human-readable endpoint index: `GET /api/docs`

Main endpoints:

```text
GET    /api/v1/activities
POST   /api/v1/activities
GET    /api/v1/activities/{uuid}
PUT    /api/v1/activities/{uuid}
DELETE /api/v1/activities/{uuid}          # archive, not physical deletion
GET    /api/v1/activities/{uuid}/markdown
GET    /api/v1/schema
```

Example create request:

```bash
curl -u manager:password \
  -H 'Content-Type: application/json' \
  -d '{
    "organisation_id": 1,
    "department_id": 1,
    "status": "active",
    "activity": {
      "id": 1,
      "name": "Customer support",
      "purpose": "Office management",
      "legal_ground": {
        "lawfulness": "processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract"
      },
      "data_subjects": ["customers"],
      "personal_data": {"data": [{"description": "name and email", "category": "Personal details"}]},
      "recipients": ["support staff"],
      "international_transfer": {"transfer": false},
      "retention_period": "24 months",
      "security_measures": {"others": ["access control"]}
    }
  }' \
  http://127.0.0.1:5000/api/v1/activities
```

Strict API create/update returns HTTP `422` on schema validation failure. For controlled migration of legacy records, `?allow_invalid=true` permits storage as a draft.

## JSON and Markdown export

The web UI exposes whole-register export. The default JSON export is an array of processing activities compatible with the source format. Add `?include_meta=1` to include an `_meta` object with UUID, scope and timestamps.

Markdown export produces a readable register containing all fields, including nested structures and application metadata.

## Audit logging

The application records create/update/import/archive operations and administrative object creation. Before and after JSON is stored for activity changes. The audit UI is restricted to admins.

For a higher-assurance deployment, consider forwarding audit events to an external append-only/SIEM target and implementing database retention/backup controls appropriate to your organisation.

## Tests

```bash
pytest -q
```

## Licensing

~~~
Copyright (C) 2025-2026 Alexandre Dulaunoy
Copyright (C) 2025-2026 CIRCL - Computer Incident Response Center Luxembourg

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
~~~
