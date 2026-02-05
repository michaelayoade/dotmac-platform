import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class HealthStatus(str, enum.Enum):
    healthy = "healthy"
    unhealthy = "unhealthy"
    unreachable = "unreachable"


class HealthCheck(Base):
    __tablename__ = "health_checks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    checked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    status: Mapped[HealthStatus] = mapped_column(
        Enum(HealthStatus), default=HealthStatus.unreachable
    )
    response_ms: Mapped[int | None] = mapped_column(Integer)
    db_healthy: Mapped[bool | None] = mapped_column(Boolean)
    redis_healthy: Mapped[bool | None] = mapped_column(Boolean)
    error_message: Mapped[str | None] = mapped_column(Text)
