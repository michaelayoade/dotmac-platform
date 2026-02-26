import re
from datetime import UTC, datetime
from typing import cast

from fastapi import APIRouter, HTTPException
from sqlalchemy.engine import Engine

from app.db import SessionLocal

router = APIRouter(prefix="/health", tags=["health"])

_QUEUE_POOL_STATUS_PATTERN = re.compile(
    r"Pool size:\s*(?P<pool_size>-?\d+)\s+"
    r"Connections in pool:\s*(?P<checked_in>-?\d+)\s+"
    r"Current Overflow:\s*(?P<overflow>-?\d+)\s+"
    r"Current Checked out connections:\s*(?P<checked_out>-?\d+)"
)


@router.get("/ready")
def readiness() -> dict[str, str]:
    return {
        "status": "ready",
        "timestamp": datetime.now(UTC).isoformat(),
    }


def _get_db_engine() -> Engine:
    bind = SessionLocal.kw.get("bind")
    if bind is None:
        raise RuntimeError("SessionLocal is not bound to a database engine")
    return cast(Engine, bind)


def _parse_pool_status(status: str) -> dict[str, int] | None:
    match = _QUEUE_POOL_STATUS_PATTERN.search(status)
    if match is None:
        return None
    return {
        "pool_size": int(match.group("pool_size")),
        "checked_in": int(match.group("checked_in")),
        "checked_out": int(match.group("checked_out")),
        "overflow": int(match.group("overflow")),
    }


@router.get("/db-pool")
def db_pool_status() -> dict[str, int]:
    engine = _get_db_engine()
    status = engine.pool.status()
    metrics = _parse_pool_status(status)
    if metrics is None:
        raise HTTPException(status_code=500, detail="Unable to parse database pool status")
    return metrics
