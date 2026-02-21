"""add upgrade cancellation fields

Revision ID: 8d1f0a2b3c4d
Revises: 7c9d2f1a3b4e
Create Date: 2026-02-09 19:10:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "8d1f0a2b3c4d"
down_revision = "7c9d2f1a3b4e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = set(inspector.get_table_names())
    if "app_upgrades" not in tables:
        return
    cols = {c["name"] for c in inspector.get_columns("app_upgrades")}
    if "cancelled_by" not in cols:
        op.add_column("app_upgrades", sa.Column("cancelled_by", sa.String(length=120), nullable=True))
    if "cancelled_by_name" not in cols:
        op.add_column("app_upgrades", sa.Column("cancelled_by_name", sa.String(length=200), nullable=True))


def downgrade() -> None:
    op.drop_column("app_upgrades", "cancelled_by_name")
    op.drop_column("app_upgrades", "cancelled_by")
