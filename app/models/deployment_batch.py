import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, Enum, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class BatchStrategy(str, enum.Enum):
    parallel = "parallel"
    rolling = "rolling"
    canary = "canary"


class BatchStatus(str, enum.Enum):
    scheduled = "scheduled"
    running = "running"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"


class DeploymentBatch(Base):
    __tablename__ = "deployment_batches"

    batch_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instance_ids: Mapped[list] = mapped_column(JSON, nullable=False)
    strategy: Mapped[BatchStrategy] = mapped_column(Enum(BatchStrategy), default=BatchStrategy.rolling)
    status: Mapped[BatchStatus] = mapped_column(Enum(BatchStatus), default=BatchStatus.scheduled)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    results: Mapped[dict | None] = mapped_column(JSON)
    total_instances: Mapped[int] = mapped_column(Integer, default=0)
    completed_count: Mapped[int] = mapped_column(Integer, default=0)
    failed_count: Mapped[int] = mapped_column(Integer, default=0)
    created_by: Mapped[str | None] = mapped_column(String(120))
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
