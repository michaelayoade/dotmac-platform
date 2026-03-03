from __future__ import annotations

import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Enum, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class GitAuthType(str, enum.Enum):
    none = "none"
    token = "token"


class RegistryEnvironment(str, enum.Enum):
    production = "production"
    staging = "staging"


class GitRepository(Base):
    __tablename__ = "git_repositories"

    repo_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    github_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    auth_type: Mapped[GitAuthType] = mapped_column(Enum(GitAuthType, name="gitauthtype"), default=GitAuthType.none)
    token_encrypted: Mapped[str | None] = mapped_column(Text)
    default_branch: Mapped[str] = mapped_column(String(120), default="main")
    is_platform_default: Mapped[bool] = mapped_column(Boolean, default=False)
    webhook_secret_encrypted: Mapped[str | None] = mapped_column(Text)
    registry_url: Mapped[str | None] = mapped_column(String(512))
    environment: Mapped[RegistryEnvironment] = mapped_column(
        Enum(RegistryEnvironment, name="registryenvironment"),
        default=RegistryEnvironment.production,
        server_default="production",
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )
