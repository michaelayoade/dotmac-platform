import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Enum, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class ServerStatus(str, enum.Enum):
    connected = "connected"
    unreachable = "unreachable"
    unknown = "unknown"


class Server(Base):
    __tablename__ = "servers"

    server_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    hostname: Mapped[str] = mapped_column(String(255), nullable=False)
    ssh_port: Mapped[int] = mapped_column(Integer, default=22)
    ssh_user: Mapped[str] = mapped_column(String(80), default="root")
    ssh_key_path: Mapped[str] = mapped_column(String(512), default="/root/.ssh/id_rsa")
    base_domain: Mapped[str | None] = mapped_column(String(255))
    is_local: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[ServerStatus] = mapped_column(Enum(ServerStatus), default=ServerStatus.unknown)
    last_connected: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )
