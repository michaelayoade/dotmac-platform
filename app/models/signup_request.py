import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class SignupStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    provisioned = "provisioned"
    expired = "expired"
    canceled = "canceled"


class SignupRequest(Base):
    __tablename__ = "signup_requests"

    signup_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    org_name: Mapped[str] = mapped_column(String(200), nullable=False)
    org_code: Mapped[str | None] = mapped_column(String(40), index=True)
    catalog_item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("app_catalog_items.catalog_id"), nullable=False, index=True
    )
    domain: Mapped[str | None] = mapped_column(String(255))
    server_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("servers.server_id"))
    admin_username: Mapped[str] = mapped_column(String(80), nullable=False, default="admin")
    admin_password_enc: Mapped[str] = mapped_column(Text, nullable=False)
    trial_days: Mapped[int | None] = mapped_column(Integer)

    status: Mapped[SignupStatus] = mapped_column(Enum(SignupStatus), default=SignupStatus.pending)
    verification_token_hash: Mapped[str | None] = mapped_column(String(64), index=True)
    verification_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    billing_confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    billing_reference: Mapped[str | None] = mapped_column(String(120))

    instance_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("instances.instance_id"))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )
