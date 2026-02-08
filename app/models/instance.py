import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class SectorType(str, enum.Enum):
    PRIVATE = "PRIVATE"
    PUBLIC = "PUBLIC"
    NGO = "NGO"


class AccountingFramework(str, enum.Enum):
    IFRS = "IFRS"
    IPSAS = "IPSAS"
    BOTH = "BOTH"


class InstanceStatus(str, enum.Enum):
    provisioned = "provisioned"
    deploying = "deploying"
    running = "running"
    stopped = "stopped"
    error = "error"
    trial = "trial"
    suspended = "suspended"
    archived = "archived"


class Instance(Base):
    __tablename__ = "instances"

    instance_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    server_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("servers.server_id"), nullable=False, index=True
    )
    org_code: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    org_name: Mapped[str] = mapped_column(String(200), nullable=False)
    org_uuid: Mapped[str | None] = mapped_column(String(36))
    sector_type: Mapped[SectorType] = mapped_column(Enum(SectorType), default=SectorType.PRIVATE)
    framework: Mapped[AccountingFramework] = mapped_column(Enum(AccountingFramework), default=AccountingFramework.IFRS)
    currency: Mapped[str] = mapped_column(String(3), default="NGN")
    app_port: Mapped[int] = mapped_column(Integer, nullable=False)
    db_port: Mapped[int] = mapped_column(Integer, nullable=False)
    redis_port: Mapped[int] = mapped_column(Integer, nullable=False)
    domain: Mapped[str | None] = mapped_column(String(255))
    app_url: Mapped[str | None] = mapped_column(String(512))
    admin_email: Mapped[str | None] = mapped_column(String(255))
    admin_username: Mapped[str | None] = mapped_column(String(80))
    deploy_path: Mapped[str | None] = mapped_column(String(512))
    status: Mapped[InstanceStatus] = mapped_column(Enum(InstanceStatus), default=InstanceStatus.provisioned)
    notes: Mapped[str | None] = mapped_column(Text)
    # Plan association
    plan_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("plans.plan_id"), nullable=True, index=True
    )
    # Version pinning
    git_branch: Mapped[str | None] = mapped_column(String(120))
    git_tag: Mapped[str | None] = mapped_column(String(120))
    deployed_git_ref: Mapped[str | None] = mapped_column(String(120))
    # Lifecycle
    trial_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    suspended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    server = relationship("Server")
    plan = relationship("Plan")
