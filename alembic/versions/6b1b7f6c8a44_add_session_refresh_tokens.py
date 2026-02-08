"""add session refresh token history

Revision ID: 6b1b7f6c8a44
Revises: d2f9c8b7a0f1
Create Date: 2026-02-08 13:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


revision = '6b1b7f6c8a44'
down_revision = 'd2f9c8b7a0f1'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("session_refresh_tokens"):
        op.create_table(
            "session_refresh_tokens",
            sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column("session_id", sa.dialects.postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("token_hash", sa.String(length=255), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["session_id"], ["sessions.id"]),
        )
        op.create_index(
            "ix_session_refresh_tokens_session_id",
            "session_refresh_tokens",
            ["session_id"],
        )
        op.create_index(
            "ix_session_refresh_tokens_token_hash",
            "session_refresh_tokens",
            ["token_hash"],
            unique=True,
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("session_refresh_tokens"):
        op.drop_index("ix_session_refresh_tokens_token_hash", table_name="session_refresh_tokens")
        op.drop_index("ix_session_refresh_tokens_session_id", table_name="session_refresh_tokens")
        op.drop_table("session_refresh_tokens")
