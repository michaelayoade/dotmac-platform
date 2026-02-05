import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class BackupType(str, enum.Enum):
    full = "full"
    db_only = "db_only"
    pre_deploy = "pre_deploy"


class BackupStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"


class Backup(Base):
    __tablename__ = "backups"

    backup_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    backup_type: Mapped[BackupType] = mapped_column(
        Enum(BackupType), default=BackupType.db_only
    )
    status: Mapped[BackupStatus] = mapped_column(
        Enum(BackupStatus), default=BackupStatus.pending
    )
    file_path: Mapped[str | None] = mapped_column(String(512))
    size_bytes: Mapped[int | None] = mapped_column(BigInteger)
    error_message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    instance = relationship("Instance")
