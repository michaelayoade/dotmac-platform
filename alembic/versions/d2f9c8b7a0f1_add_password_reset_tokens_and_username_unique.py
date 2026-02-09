"""add password reset tokens and username unique constraint

Revision ID: d2f9c8b7a0f1
Revises: a3f1c7d89e02
Create Date: 2026-02-08 12:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "d2f9c8b7a0f1"
down_revision = "a3f1c7d89e02"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("password_reset_tokens"):
        op.create_table(
            "password_reset_tokens",
            sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
            sa.Column("person_id", sa.dialects.postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("token_hash", sa.String(length=255), nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["person_id"], ["people.id"]),
        )
    if inspector.has_table("password_reset_tokens"):
        existing_indexes = {idx["name"] for idx in inspector.get_indexes("password_reset_tokens")}
        if "ix_password_reset_tokens_token_hash" not in existing_indexes:
            op.create_index(
                "ix_password_reset_tokens_token_hash",
                "password_reset_tokens",
                ["token_hash"],
                unique=True,
            )
        if "ix_password_reset_tokens_person_id" not in existing_indexes:
            op.create_index(
                "ix_password_reset_tokens_person_id",
                "password_reset_tokens",
                ["person_id"],
            )

    if inspector.has_table("user_credentials"):
        existing_indexes = {idx["name"] for idx in inspector.get_indexes("user_credentials")}
        if "ux_user_credentials_username_not_null" not in existing_indexes:
            op.create_index(
                "ux_user_credentials_username_not_null",
                "user_credentials",
                ["username"],
                unique=True,
                postgresql_where=sa.text("username IS NOT NULL"),
                sqlite_where=sa.text("username IS NOT NULL"),
            )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("user_credentials"):
        existing_indexes = {idx["name"] for idx in inspector.get_indexes("user_credentials")}
        if "ux_user_credentials_username_not_null" in existing_indexes:
            op.drop_index("ux_user_credentials_username_not_null", table_name="user_credentials")

    if inspector.has_table("password_reset_tokens"):
        existing_indexes = {idx["name"] for idx in inspector.get_indexes("password_reset_tokens")}
        if "ix_password_reset_tokens_person_id" in existing_indexes:
            op.drop_index("ix_password_reset_tokens_person_id", table_name="password_reset_tokens")
        if "ix_password_reset_tokens_token_hash" in existing_indexes:
            op.drop_index("ix_password_reset_tokens_token_hash", table_name="password_reset_tokens")
        op.drop_table("password_reset_tokens")
