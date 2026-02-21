"""add deployment_batches git_ref and deployment_type

Revision ID: a2b3c4d5e6f7
Revises: f3a5b7c9d1e3
Create Date: 2026-02-21 12:00:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa

from alembic import op

revision = "a2b3c4d5e6f7"
down_revision = "f3a5b7c9d1e3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    cols = {c["name"] for c in inspector.get_columns("deployment_batches")}
    if "git_ref" not in cols:
        op.add_column("deployment_batches", sa.Column("git_ref", sa.String(200), nullable=True))
    if "deployment_type" not in cols:
        op.add_column(
            "deployment_batches",
            sa.Column("deployment_type", sa.String(20), nullable=False, server_default="upgrade"),
        )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    cols = {c["name"] for c in inspector.get_columns("deployment_batches")}
    if "deployment_type" in cols:
        op.drop_column("deployment_batches", "deployment_type")
    if "git_ref" in cols:
        op.drop_column("deployment_batches", "git_ref")
