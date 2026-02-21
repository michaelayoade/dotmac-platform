"""add github_webhook_logs and notification_channels

Revision ID: b3c4d5e6f7a8
Revises: a2b3c4d5e6f7
Create Date: 2026-02-21 14:00:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM, UUID

from alembic import op

revision = "b3c4d5e6f7a8"
down_revision = "a2b3c4d5e6f7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = set(inspector.get_table_names())

    if "github_webhook_logs" not in tables:
        op.create_table(
            "github_webhook_logs",
            sa.Column("log_id", UUID(as_uuid=True), nullable=False),
            sa.Column("repo_id", UUID(as_uuid=True), nullable=True),
            sa.Column("event_type", sa.String(60), nullable=False),
            sa.Column("branch", sa.String(120), nullable=True),
            sa.Column("commit_sha", sa.String(64), nullable=True),
            sa.Column("sender", sa.String(200), nullable=True),
            sa.Column("payload_summary", sa.Text(), nullable=True),
            sa.Column("status", sa.String(20), nullable=False, server_default="received"),
            sa.Column("error_message", sa.Text(), nullable=True),
            sa.Column("deployments_triggered", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint("log_id"),
            sa.ForeignKeyConstraint(["repo_id"], ["git_repositories.repo_id"]),
        )
    indexes = (
        {idx["name"] for idx in inspector.get_indexes("github_webhook_logs")}
        if "github_webhook_logs" in tables or "github_webhook_logs" in set(inspector.get_table_names())
        else set()
    )
    if "ix_github_webhook_logs_repo_id" not in indexes:
        op.create_index("ix_github_webhook_logs_repo_id", "github_webhook_logs", ["repo_id"])
    if "ix_github_webhook_logs_created_at" not in indexes:
        op.create_index("ix_github_webhook_logs_created_at", "github_webhook_logs", ["created_at"])

    # Create channeltype enum if not exists
    channeltype_enum = ENUM("email", "slack", "telegram", name="channeltype", create_type=False)
    conn.execute(
        sa.text(
            "DO $$ BEGIN CREATE TYPE channeltype AS ENUM ('email', 'slack', 'telegram'); EXCEPTION WHEN duplicate_object THEN NULL; END $$"
        )
    )

    if "notification_channels" not in tables:
        op.create_table(
            "notification_channels",
            sa.Column("channel_id", UUID(as_uuid=True), nullable=False),
            sa.Column("person_id", UUID(as_uuid=True), nullable=True),
            sa.Column("channel_type", channeltype_enum, nullable=False),
            sa.Column("label", sa.String(120), nullable=False),
            sa.Column("config_encrypted", sa.Text(), nullable=True),
            sa.Column("events", sa.Text(), nullable=True),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint("channel_id"),
            sa.ForeignKeyConstraint(["person_id"], ["people.id"]),
        )
    nc_indexes = (
        {idx["name"] for idx in inspector.get_indexes("notification_channels")}
        if "notification_channels" in tables or "notification_channels" in set(inspector.get_table_names())
        else set()
    )
    if "ix_notification_channels_person_id" not in nc_indexes:
        op.create_index("ix_notification_channels_person_id", "notification_channels", ["person_id"])


def downgrade() -> None:
    op.drop_index("ix_notification_channels_person_id", table_name="notification_channels")
    op.drop_table("notification_channels")
    op.execute("DROP TYPE IF EXISTS channeltype")
    op.drop_index("ix_github_webhook_logs_created_at", table_name="github_webhook_logs")
    op.drop_index("ix_github_webhook_logs_repo_id", table_name="github_webhook_logs")
    op.drop_table("github_webhook_logs")
