"""simplify registries — add environment enum, rename url, drop dead columns

Revision ID: d5e6f7a8b9c0
Revises: c4d5e6f7a8b9
Create Date: 2026-03-01 14:00:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "d5e6f7a8b9c0"
down_revision = "c4d5e6f7a8b9"
branch_labels = None
depends_on = None


def _has_column(table: str, column: str) -> bool:
    conn = op.get_bind()
    result = conn.execute(
        sa.text("SELECT 1 FROM information_schema.columns WHERE table_name = :table AND column_name = :column"),
        {"table": table, "column": column},
    )
    return result.scalar() is not None


def _has_constraint(table: str, constraint: str) -> bool:
    conn = op.get_bind()
    result = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.table_constraints "
            "WHERE table_name = :table AND constraint_name = :constraint"
        ),
        {"table": table, "constraint": constraint},
    )
    return result.scalar() is not None


def upgrade() -> None:
    conn = op.get_bind()

    # 1. Create PG enum registryenvironment if not exists
    conn.execute(
        sa.text(
            "DO $$ BEGIN CREATE TYPE registryenvironment AS ENUM ('production', 'staging'); EXCEPTION WHEN duplicate_object THEN NULL; END $$"
        )
    )

    # 2. Add environment column to git_repositories
    if not _has_column("git_repositories", "environment"):
        op.add_column(
            "git_repositories",
            sa.Column(
                "environment",
                sa.Enum("production", "staging", name="registryenvironment", create_type=False),
                server_default="production",
                nullable=False,
            ),
        )

    # 3. Rename url → github_url on git_repositories
    if _has_column("git_repositories", "url") and not _has_column("git_repositories", "github_url"):
        op.alter_column("git_repositories", "url", new_column_name="github_url")

    # 4. Drop ssh_key_encrypted from git_repositories
    if _has_column("git_repositories", "ssh_key_encrypted"):
        op.drop_column("git_repositories", "ssh_key_encrypted")

    # 5. Drop FK constraints + release_id, bundle_id from app_catalog_items
    if _has_column("app_catalog_items", "release_id"):
        if _has_constraint("app_catalog_items", "app_catalog_items_release_id_fkey"):
            op.drop_constraint("app_catalog_items_release_id_fkey", "app_catalog_items", type_="foreignkey")
        op.drop_column("app_catalog_items", "release_id")

    if _has_column("app_catalog_items", "bundle_id"):
        if _has_constraint("app_catalog_items", "app_catalog_items_bundle_id_fkey"):
            op.drop_constraint("app_catalog_items_bundle_id_fkey", "app_catalog_items", type_="foreignkey")
        op.drop_column("app_catalog_items", "bundle_id")


def downgrade() -> None:
    # Re-add release_id and bundle_id to app_catalog_items
    if not _has_column("app_catalog_items", "release_id"):
        op.add_column(
            "app_catalog_items",
            sa.Column("release_id", UUID(as_uuid=True), nullable=True),
        )
        op.create_foreign_key(
            "app_catalog_items_release_id_fkey",
            "app_catalog_items",
            "app_releases",
            ["release_id"],
            ["release_id"],
        )

    if not _has_column("app_catalog_items", "bundle_id"):
        op.add_column(
            "app_catalog_items",
            sa.Column("bundle_id", UUID(as_uuid=True), nullable=True),
        )
        op.create_foreign_key(
            "app_catalog_items_bundle_id_fkey",
            "app_catalog_items",
            "app_bundles",
            ["bundle_id"],
            ["bundle_id"],
        )

    # Re-add ssh_key_encrypted
    if not _has_column("git_repositories", "ssh_key_encrypted"):
        op.add_column(
            "git_repositories",
            sa.Column("ssh_key_encrypted", sa.Text(), nullable=True),
        )

    # Rename github_url → url
    if _has_column("git_repositories", "github_url") and not _has_column("git_repositories", "url"):
        op.alter_column("git_repositories", "github_url", new_column_name="url")

    # Drop environment column
    if _has_column("git_repositories", "environment"):
        op.drop_column("git_repositories", "environment")

    # Note: PG enum registryenvironment is intentionally left — dropping enums can break concurrent migrations
