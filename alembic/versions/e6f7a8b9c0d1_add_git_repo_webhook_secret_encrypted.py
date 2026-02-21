"""add git_repositories webhook_secret_encrypted

Revision ID: e6f7a8b9c0d1
Revises: b2c3d4e5f6a8
Create Date: 2026-02-16 13:05:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa

from alembic import op

revision = "e6f7a8b9c0d1"
down_revision = "b2c3d4e5f6a8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if "git_repositories" not in inspector.get_table_names():
        return
    cols = {c["name"] for c in inspector.get_columns("git_repositories")}
    if "webhook_secret_encrypted" not in cols:
        op.add_column("git_repositories", sa.Column("webhook_secret_encrypted", sa.Text(), nullable=True))


def downgrade() -> None:
    op.execute("ALTER TABLE git_repositories DROP COLUMN IF EXISTS webhook_secret_encrypted")
