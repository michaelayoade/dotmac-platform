"""add git repositories

Revision ID: 0d8b3a1c2e4f
Revises: f2a4c6d8e0b1
Create Date: 2026-02-09 12:15:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "0d8b3a1c2e4f"
down_revision = "f2a4c6d8e0b1"
branch_labels = None
depends_on = None

git_auth_type_enum = sa.Enum("none", "ssh_key", "token", name="gitauthtype", create_type=True)


def upgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"
    if is_postgres:
        git_auth_type_enum.create(bind, checkfirst=True)

    op.create_table(
        "git_repositories",
        sa.Column("repo_id", UUID(as_uuid=True), nullable=False),
        sa.Column("label", sa.String(length=120), nullable=False),
        sa.Column("url", sa.String(length=512), nullable=False),
        sa.Column("auth_type", git_auth_type_enum, nullable=True),
        sa.Column("ssh_key_encrypted", sa.Text(), nullable=True),
        sa.Column("token_encrypted", sa.Text(), nullable=True),
        sa.Column("default_branch", sa.String(length=120), nullable=True),
        sa.Column("is_platform_default", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("repo_id"),
        sa.UniqueConstraint("label", name="uq_git_repositories_label"),
    )

    op.add_column("instances", sa.Column("git_repo_id", UUID(as_uuid=True), nullable=True))
    op.create_index("ix_instances_git_repo_id", "instances", ["git_repo_id"])
    op.create_foreign_key(
        "fk_instances_git_repo_id",
        "instances",
        "git_repositories",
        ["git_repo_id"],
        ["repo_id"],
    )


def downgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    op.drop_constraint("fk_instances_git_repo_id", "instances", type_="foreignkey")
    op.drop_index("ix_instances_git_repo_id", table_name="instances")
    op.drop_column("instances", "git_repo_id")

    op.drop_table("git_repositories")

    if is_postgres:
        git_auth_type_enum.drop(bind, checkfirst=True)
