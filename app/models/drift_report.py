"""Config Drift Report — detected differences between expected and running config."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class DriftReport(Base):
    __tablename__ = "drift_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    diffs: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    has_drift: Mapped[bool] = mapped_column(Boolean, default=False)
    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
