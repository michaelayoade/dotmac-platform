import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class CloneStatus(str, enum.Enum):
    pending = "pending"
    cloning_config = "cloning_config"
    backing_up = "backing_up"
    deploying = "deploying"
    restoring_data = "restoring_data"
    verifying = "verifying"
    completed = "completed"
    failed = "failed"


class CloneOperation(Base):
    __tablename__ = "clone_operations"

    clone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    target_instance_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id")
    )
    target_server_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("servers.server_id"))
    new_org_code: Mapped[str] = mapped_column(String(40), nullable=False)
    new_org_name: Mapped[str | None] = mapped_column(String(200))
    admin_password_encrypted: Mapped[str | None] = mapped_column(Text)
    status: Mapped[CloneStatus] = mapped_column(Enum(CloneStatus, name="clonestatus"), default=CloneStatus.pending)
    include_data: Mapped[bool] = mapped_column(Boolean, default=True)
    progress_pct: Mapped[float] = mapped_column(Float, default=0.0)
    current_step: Mapped[str | None] = mapped_column(String(200))
    error_message: Mapped[str | None] = mapped_column(Text)
    backup_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("backups.backup_id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
