"""GitHub Webhook Log — records of incoming GitHub push events."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class GitHubWebhookLog(Base):
    __tablename__ = "github_webhook_logs"

    log_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repo_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("git_repositories.repo_id"), nullable=True, index=True
    )
    event_type: Mapped[str] = mapped_column(String(60), nullable=False)
    branch: Mapped[str | None] = mapped_column(String(120))
    commit_sha: Mapped[str | None] = mapped_column(String(64))
    sender: Mapped[str | None] = mapped_column(String(200))
    payload_summary: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="received")
    error_message: Mapped[str | None] = mapped_column(Text)
    deployments_triggered: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), index=True)
