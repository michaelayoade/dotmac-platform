"""make git_repositories.url nullable

Revision ID: d6e7f8a9b0c1
Revises: b3c4d5e6f7a8
Create Date: 2026-02-22 00:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "d6e7f8a9b0c1"
down_revision = "b3c4d5e6f7a8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = set(inspector.get_table_names())

    if "git_repositories" not in tables:
        return

    cols = {c["name"]: c for c in inspector.get_columns("git_repositories")}
    url_col = cols.get("url")
    if url_col and not url_col.get("nullable", False):
        op.alter_column("git_repositories", "url", existing_type=sa.String(length=512), nullable=True)


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = set(inspector.get_table_names())

    if "git_repositories" not in tables:
        return

    # Ensure no NULL values before restoring NOT NULL.
    op.execute("UPDATE git_repositories SET url = '' WHERE url IS NULL")
    op.alter_column("git_repositories", "url", existing_type=sa.String(length=512), nullable=False)
