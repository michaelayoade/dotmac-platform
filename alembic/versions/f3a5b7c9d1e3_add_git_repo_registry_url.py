"""add git_repositories registry_url

Revision ID: f3a5b7c9d1e3
Revises: d4e5f6a7b8c9, e6f7a8b9c0d1
Create Date: 2026-02-21 10:00:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa

from alembic import op

revision = "f3a5b7c9d1e3"
down_revision = ("d4e5f6a7b8c9", "e6f7a8b9c0d1")
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if "git_repositories" not in inspector.get_table_names():
        return
    cols = {c["name"] for c in inspector.get_columns("git_repositories")}
    if "registry_url" not in cols:
        op.add_column("git_repositories", sa.Column("registry_url", sa.String(512), nullable=True))


def downgrade() -> None:
    op.execute("ALTER TABLE git_repositories DROP COLUMN IF EXISTS registry_url")
