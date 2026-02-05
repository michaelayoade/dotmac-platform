import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class InstanceFlag(Base):
    __tablename__ = "instance_flags"
    __table_args__ = (
        UniqueConstraint("instance_id", "flag_key", name="uq_instance_flag"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    flag_key: Mapped[str] = mapped_column(String(120), nullable=False)
    flag_value: Mapped[str] = mapped_column(String(255), nullable=False, default="true")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    instance = relationship("Instance")
