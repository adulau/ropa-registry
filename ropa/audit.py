import json
from flask import request

from .db import get_db, utcnow


def log_action(user, action, object_type, object_uuid=None, organisation_id=None,
               department_id=None, details=None, before=None, after=None, commit=False):
    db = get_db()
    db.execute(
        """
        INSERT INTO audit_logs(
          timestamp,user_id,username,action,object_type,object_uuid,
          organisation_id,department_id,remote_addr,user_agent,details_json,before_json,after_json
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
        """,
        (
            utcnow(), user["id"] if user else None, user["username"] if user else None,
            action, object_type, object_uuid, organisation_id, department_id,
            request.remote_addr if request else None,
            request.headers.get("User-Agent", "")[:500] if request else None,
            json.dumps(details, ensure_ascii=False) if details is not None else None,
            json.dumps(before, ensure_ascii=False) if before is not None else None,
            json.dumps(after, ensure_ascii=False) if after is not None else None,
        ),
    )
    if commit:
        db.commit()
