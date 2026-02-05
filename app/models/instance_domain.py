import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class DomainStatus(str, enum.Enum):
    pending_verification = "pending_verification"
    verified = "verified"
    ssl_provisioned = "ssl_provisioned"
    active = "active"
    failed = "failed"


class InstanceDomain(Base):
    __tablename__ = "instance_domains"

    domain_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    domain: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[DomainStatus] = mapped_column(
        Enum(DomainStatus), default=DomainStatus.pending_verification
    )
    verification_token: Mapped[str | None] = mapped_column(String(255))
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ssl_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ssl_provisioned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    error_message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    instance = relationship("Instance")
