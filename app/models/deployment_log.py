import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class DeployStepStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    success = "success"
    failed = "failed"
    skipped = "skipped"


class DeploymentLog(Base):
    __tablename__ = "deployment_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    deployment_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    deployment_type: Mapped[str | None] = mapped_column(String(30))
    git_ref: Mapped[str | None] = mapped_column(String(120))
    step: Mapped[str] = mapped_column(String(60), nullable=False)
    # Temporary storage for deploy secrets (cleared after use)
    deploy_secret: Mapped[str | None] = mapped_column(Text)
    status: Mapped[DeployStepStatus] = mapped_column(
        Enum(DeployStepStatus), default=DeployStepStatus.pending
    )
    message: Mapped[str | None] = mapped_column(Text)
    output: Mapped[str | None] = mapped_column(Text)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
