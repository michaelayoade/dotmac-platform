from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class MetricsSummaryRead(BaseModel):
    instance_id: UUID
    org_code: str
    status: str | None = None
    response_ms: int | None = None
    cpu_percent: float | None = None
    memory_mb: int | None = None
    db_size_mb: int | None = None
    active_connections: int | None = None
    checked_at: datetime | None = None
    last_backup_at: datetime | None = None


class LogStreamRead(BaseModel):
    stream: str
    container: str
    running: bool


class LogsPayloadRead(BaseModel):
    stream: str
    lines: int
    since: str | None = None
    entries: list[str]
