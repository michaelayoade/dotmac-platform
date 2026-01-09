import uuid

from fastapi import HTTPException


def coerce_uuid(value):
    if value is None:
        return None
    if isinstance(value, uuid.UUID):
        return value
    return uuid.UUID(str(value))


def apply_ordering(query, order_by, order_dir, allowed_columns):
    if order_by not in allowed_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid order_by. Allowed: {', '.join(sorted(allowed_columns))}",
        )
    column = allowed_columns[order_by]
    if order_dir == "desc":
        return query.order_by(column.desc())
    return query.order_by(column.asc())


def apply_pagination(query, limit, offset):
    return query.limit(limit).offset(offset)
