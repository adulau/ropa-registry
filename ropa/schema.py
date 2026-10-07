import json
from functools import lru_cache
from pathlib import Path

from jsonschema import Draft7Validator

SCHEMA_FILE = Path(__file__).parent / "data" / "processing-activities-records-schema.json"
EXAMPLE_FILE = Path(__file__).parent / "data" / "example-processing-activities.json"


@lru_cache(maxsize=1)
def full_schema():
    return json.loads(SCHEMA_FILE.read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def activity_schema():
    return full_schema()["items"]


@lru_cache(maxsize=1)
def validator():
    return Draft7Validator(activity_schema())


def validate_activity(payload):
    errors = []
    for err in sorted(validator().iter_errors(payload), key=lambda e: list(e.absolute_path)):
        path = ".".join(str(x) for x in err.absolute_path) or "$"
        errors.append({"path": path, "message": err.message})
    return errors


def enum_values(*path):
    node = activity_schema()
    for part in path:
        if part == "properties":
            node = node[part]
        else:
            node = node.get("properties", {}).get(part, node.get(part, {}))
    return node.get("enum", [])


def default_activity(external_id=1):
    return {
        "id": external_id,
        "name": "",
        "purpose": "GDPR Recital 49 - ensuring network and information security",
        "description": {"type": "Other services", "summary": "", "tools": []},
        "legal_ground": {"lawfulness": "processing is necessary for the purposes of the legitimate interests pursued by the controller of by a third party"},
        "data_subjects": [],
        "personal_data": {"source": [], "data": []},
        "retention_period": "",
        "controller": "",
        "joint_controllers": [],
        "data_processor": "",
        "recipients": [],
        "international_transfer": {"transfer": False},
        "data_subject_rights": {"transparency": {"required": False}},
        "security_measures": {"pseudonymisation": "", "others": []},
    }
