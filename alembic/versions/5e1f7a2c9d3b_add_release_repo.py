"""add release git repo

Revision ID: 5e1f7a2c9d3b
Revises: 4c8d1e5f9a20
Create Date: 2026-02-09 16:10:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "5e1f7a2c9d3b"
down_revision = "4c8d1e5f9a20"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("app_releases", sa.Column("git_repo_id", UUID(as_uuid=True), nullable=True))
    op.create_index("ix_app_releases_git_repo_id", "app_releases", ["git_repo_id"])
    op.create_foreign_key(
        "fk_app_releases_git_repo_id",
        "app_releases",
        "git_repositories",
        ["git_repo_id"],
        ["repo_id"],
    )

    op.execute("UPDATE app_releases SET git_repo_id = NULL")

    op.alter_column("app_releases", "git_repo_id", nullable=False)


def downgrade() -> None:
    op.drop_constraint("fk_app_releases_git_repo_id", "app_releases", type_="foreignkey")
    op.drop_index("ix_app_releases_git_repo_id", table_name="app_releases")
    op.drop_column("app_releases", "git_repo_id")
