"""flatten catalog items — merge release + bundle fields onto item

Revision ID: c4d5e6f7a8b9
Revises: a7c9d1e3f5b7, e1f2a3b4c5d6
Create Date: 2026-03-01 12:00:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "c4d5e6f7a8b9"
down_revision = "b8d9e0f1a2c3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_cols = {c["name"] for c in inspector.get_columns("app_catalog_items")}

    # Add new columns (nullable initially for data migration)
    if "version" not in existing_cols:
        op.add_column("app_catalog_items", sa.Column("version", sa.String(60), nullable=True))
    if "git_ref" not in existing_cols:
        op.add_column("app_catalog_items", sa.Column("git_ref", sa.String(120), nullable=True))
    if "git_repo_id" not in existing_cols:
        op.add_column(
            "app_catalog_items",
            sa.Column("git_repo_id", UUID(as_uuid=True), sa.ForeignKey("git_repositories.repo_id"), nullable=True),
        )
    if "notes" not in existing_cols:
        op.add_column("app_catalog_items", sa.Column("notes", sa.Text(), nullable=True))
    if "module_slugs" not in existing_cols:
        op.add_column("app_catalog_items", sa.Column("module_slugs", sa.JSON(), nullable=True))
    if "flag_keys" not in existing_cols:
        op.add_column("app_catalog_items", sa.Column("flag_keys", sa.JSON(), nullable=True))

    # Copy data from releases + bundles into items
    conn.execute(
        sa.text("""
            UPDATE app_catalog_items ci
            SET version = r.version,
                git_ref = r.git_ref,
                git_repo_id = r.git_repo_id,
                notes = r.notes
            FROM app_releases r
            WHERE ci.release_id = r.release_id
              AND ci.version IS NULL
        """)
    )
    conn.execute(
        sa.text("""
            UPDATE app_catalog_items ci
            SET module_slugs = b.module_slugs,
                flag_keys = b.flag_keys
            FROM app_bundles b
            WHERE ci.bundle_id = b.bundle_id
              AND ci.module_slugs IS NULL
        """)
    )

    # Set defaults for any items that didn't match a release (shouldn't happen, but safe)
    conn.execute(
        sa.text("""
            UPDATE app_catalog_items
            SET version = 'unknown', git_ref = 'unknown'
            WHERE version IS NULL OR git_ref IS NULL
        """)
    )

    # Make version, git_ref NOT NULL
    op.alter_column("app_catalog_items", "version", nullable=False)
    op.alter_column("app_catalog_items", "git_ref", nullable=False)

    # Make release_id, bundle_id nullable (deprecated)
    op.alter_column("app_catalog_items", "release_id", existing_type=UUID(as_uuid=True), nullable=True)
    op.alter_column("app_catalog_items", "bundle_id", existing_type=UUID(as_uuid=True), nullable=True)


def downgrade() -> None:
    # Restore release_id, bundle_id as NOT NULL
    op.alter_column("app_catalog_items", "release_id", existing_type=UUID(as_uuid=True), nullable=False)
    op.alter_column("app_catalog_items", "bundle_id", existing_type=UUID(as_uuid=True), nullable=False)

    # Drop flattened columns
    op.drop_column("app_catalog_items", "flag_keys")
    op.drop_column("app_catalog_items", "module_slugs")
    op.drop_column("app_catalog_items", "notes")
    op.drop_column("app_catalog_items", "git_repo_id")
    op.drop_column("app_catalog_items", "git_ref")
    op.drop_column("app_catalog_items", "version")
