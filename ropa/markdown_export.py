from datetime import datetime


def _label(key):
    aliases = {
        "id": "ID", "id_old": "Old ID", "RFC_2350_generic": "RFC 2350 (generic)",
        "RFC_2350_CIRCL": "RFC 2350 (organisation-specific)",
        "special_catgories": "Special categories", "rigths": "Rights",
    }
    return aliases.get(key, key.replace("_", " ").strip().title())


def _scalar(v):
    if v is True: return "Yes"
    if v is False: return "No"
    if v is None: return "—"
    return str(v)


def _render_value(key, value, level=3):
    out = []
    title = _label(key)
    if isinstance(value, dict):
        out.append(f"{'#' * level} {title}\n")
        if not value:
            out.append("_Not specified._\n")
        for k, v in value.items():
            out.extend(_render_value(k, v, min(level + 1, 6)))
    elif isinstance(value, list):
        out.append(f"{'#' * level} {title}\n")
        if not value:
            out.append("_None specified._\n")
        elif all(not isinstance(x, (dict, list)) for x in value):
            for item in value:
                out.append(f"- {_scalar(item)}")
            out.append("")
        else:
            for i, item in enumerate(value, 1):
                out.append(f"**{title} {i}**")
                if isinstance(item, dict):
                    for k, v in item.items():
                        if isinstance(v, (dict, list)):
                            out.extend(_render_value(k, v, min(level + 1, 6)))
                        else:
                            out.append(f"- **{_label(k)}:** {_scalar(v)}")
                else:
                    out.append(str(item))
                out.append("")
    else:
        out.append(f"- **{title}:** {_scalar(value)}")
    return out


def render_activity(payload, meta=None, heading_level=2):
    name = payload.get("name") or "Unnamed processing activity"
    ext_id = payload.get("id")
    heading = f"{ext_id} — {name}" if ext_id is not None else name
    out = [f"{'#' * heading_level} {heading}", ""]
    if meta:
        out.extend([
            f"- **UUID:** `{meta.get('uuid')}`",
            f"- **Organisation:** {meta.get('organisation_name') or '—'}",
            f"- **Department:** {meta.get('department_name') or '—'}",
            f"- **Status:** {meta.get('status') or '—'}",
            f"- **Schema valid:** {'Yes' if meta.get('schema_valid') else 'No'}",
            f"- **Created:** {meta.get('created_at') or '—'}",
            f"- **Updated:** {meta.get('updated_at') or '—'}",
            "",
        ])
    preferred = [
        "purpose", "description", "legal_ground", "data_subjects", "personal_data",
        "retention_period", "controller", "joint_controllers", "data_processor",
        "recipients", "international_transfer", "data_subject_rights", "security_measures"
    ]
    seen = {"id", "name"}
    for key in preferred:
        if key in payload:
            out.extend(_render_value(key, payload[key], heading_level + 1))
            out.append("")
            seen.add(key)
    for key, value in payload.items():
        if key not in seen and key != "_meta":
            out.extend(_render_value(key, value, heading_level + 1))
            out.append("")
    return "\n".join(out).rstrip() + "\n"


def render_register(records, title="Record of Processing Activities", include_meta=True):
    out = [f"# {title}", "", f"Generated: {datetime.utcnow().isoformat(timespec='seconds')}Z", ""]
    for record in records:
        out.append(render_activity(record["payload"], record.get("meta") if include_meta else None))
    return "\n".join(out)
