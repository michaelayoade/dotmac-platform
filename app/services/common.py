import logging
import uuid
from typing import Any

from fastapi import HTTPException

logger = logging.getLogger(__name__)


def coerce_uuid(value: str | uuid.UUID | None) -> uuid.UUID | None:
    if value is None:
        return None
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid UUID: {value!r}") from exc


def apply_ordering(stmt: Any, order_by: str, order_dir: str, allowed_columns: dict[str, Any]) -> Any:
    if order_by not in allowed_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid order_by. Allowed: {', '.join(sorted(allowed_columns))}",
        )
    column = allowed_columns[order_by]
    if order_dir == "desc":
        return stmt.order_by(column.desc())
    return stmt.order_by(column.asc())


def apply_pagination(stmt: Any, limit: int, offset: int) -> Any:
    return stmt.limit(limit).offset(offset)
