"""Make ERP-specific fields nullable on instances table.

Revision ID: c7d8e9f0a1b2
Revises: 15dbba693b0f
Create Date: 2026-02-14

sector_type, framework, and currency are ERP-specific.  Making them
nullable lets the platform track arbitrary applications (e.g. itself)
without forcing irrelevant ERP defaults.
"""

from __future__ import annotations

import sqlalchemy as sa

from alembic import op

revision = "c7d8e9f0a1b2"
down_revision = "15dbba693b0f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = set(inspector.get_table_names())
    if "instances" not in tables:
        return

    # Make columns nullable and drop server defaults
    # alter_column is inherently idempotent (setting nullable=True when already nullable is a no-op)
    with op.batch_alter_table("instances") as batch_op:
        batch_op.alter_column("sector_type", existing_type=sa.String(length=7), nullable=True, server_default=None)
        batch_op.alter_column("framework", existing_type=sa.String(length=4), nullable=True, server_default=None)
        batch_op.alter_column("currency", existing_type=sa.String(length=3), nullable=True, server_default=None)

    # Fix the existing platform instance (if it exists)
    op.execute(
        sa.text(
            "UPDATE instances "
            "SET sector_type = NULL, framework = NULL, currency = NULL, "
            "    app_port = 8001, db_port = 5432, redis_port = 6379, "
            "    status = 'running' "
            "WHERE org_code = 'DOTMAC-PLATFORM'"
        )
    )


def downgrade() -> None:
    # Restore non-null defaults
    op.execute(sa.text("UPDATE instances SET sector_type = 'PRIVATE' WHERE sector_type IS NULL"))
    op.execute(sa.text("UPDATE instances SET framework = 'IFRS' WHERE framework IS NULL"))
    op.execute(sa.text("UPDATE instances SET currency = 'NGN' WHERE currency IS NULL"))

    with op.batch_alter_table("instances") as batch_op:
        batch_op.alter_column("sector_type", existing_type=sa.String(length=7), nullable=False)
        batch_op.alter_column("framework", existing_type=sa.String(length=4), nullable=False)
        batch_op.alter_column("currency", existing_type=sa.String(length=3), nullable=False)
