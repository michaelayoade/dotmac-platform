"""merge heads and add instances.auto_deploy

Revision ID: d4e5f6a7b8c9
Revises: 8d1f0a2b3c4d, b2c3d4e5f6a8, c7d8e9f0a1b2
Create Date: 2026-02-16 12:35:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa

from alembic import op

revision = "d4e5f6a7b8c9"
down_revision = ("8d1f0a2b3c4d", "b2c3d4e5f6a8", "c7d8e9f0a1b2")
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)
    cols = {col["name"] for col in insp.get_columns("instances")}
    if "auto_deploy" not in cols:
        op.add_column(
            "instances",
            sa.Column("auto_deploy", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        )


def downgrade() -> None:
    op.execute("ALTER TABLE instances DROP COLUMN IF EXISTS auto_deploy")
