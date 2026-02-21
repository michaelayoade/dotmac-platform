"""add notifications

Revision ID: a1b2c3d4e5f6
Revises: 99f13692b073
Create Date: 2026-02-09 12:00:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM, UUID

from alembic import op

revision = "a1b2c3d4e5f6"
down_revision = "99f13692b073"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # Ensure enum types exist before creating table.
    notificationcategory = ENUM("alert", "deploy", "backup", "system", name="notificationcategory")
    notificationcategory.create(bind, checkfirst=True)
    notificationseverity = ENUM("info", "warning", "critical", name="notificationseverity")
    notificationseverity.create(bind, checkfirst=True)

    if "notifications" in inspector.get_table_names():
        existing_indexes = {idx["name"] for idx in inspector.get_indexes("notifications")}
        if "ix_notifications_person_id" not in existing_indexes:
            op.create_index("ix_notifications_person_id", "notifications", ["person_id"])
        if "ix_notifications_created_at" not in existing_indexes:
            op.create_index("ix_notifications_created_at", "notifications", ["created_at"])
        if "ix_notifications_is_read" not in existing_indexes:
            op.create_index("ix_notifications_is_read", "notifications", ["is_read"])
        return

    op.create_table(
        "notifications",
        sa.Column("notification_id", UUID(as_uuid=True), primary_key=True),
        sa.Column("person_id", UUID(as_uuid=True), sa.ForeignKey("people.id"), nullable=True),
        sa.Column(
            "category",
            ENUM("alert", "deploy", "backup", "system", name="notificationcategory", create_type=False),
            nullable=False,
        ),
        sa.Column(
            "severity",
            ENUM("info", "warning", "critical", name="notificationseverity", create_type=False),
            nullable=False,
            server_default="info",
        ),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("link", sa.String(512), nullable=True),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_index("ix_notifications_person_id", "notifications", ["person_id"])
    op.create_index("ix_notifications_created_at", "notifications", ["created_at"])
    op.create_index("ix_notifications_is_read", "notifications", ["is_read"])


def downgrade() -> None:
    op.drop_index("ix_notifications_is_read")
    op.drop_index("ix_notifications_created_at")
    op.drop_index("ix_notifications_person_id")
    op.drop_table("notifications")
    sa.Enum(name="notificationcategory").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="notificationseverity").drop(op.get_bind(), checkfirst=True)
