"""add app catalog

Revision ID: 3a9b2c7d4f10
Revises: 2b7a9c4d1e8f
Create Date: 2026-02-09 15:10:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON, UUID

from alembic import op

revision = "3a9b2c7d4f10"
down_revision = "2b7a9c4d1e8f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "app_releases",
        sa.Column("release_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("version", sa.String(length=60), nullable=False),
        sa.Column("git_ref", sa.String(length=120), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("release_id"),
    )

    op.create_table(
        "app_bundles",
        sa.Column("bundle_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("module_slugs", JSON(), nullable=True),
        sa.Column("flag_keys", JSON(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("bundle_id"),
    )

    op.create_table(
        "app_catalog_items",
        sa.Column("catalog_id", UUID(as_uuid=True), nullable=False),
        sa.Column("label", sa.String(length=200), nullable=False),
        sa.Column("release_id", UUID(as_uuid=True), nullable=False),
        sa.Column("bundle_id", UUID(as_uuid=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["release_id"], ["app_releases.release_id"]),
        sa.ForeignKeyConstraint(["bundle_id"], ["app_bundles.bundle_id"]),
        sa.PrimaryKeyConstraint("catalog_id"),
    )
    op.create_index("ix_app_catalog_items_release_id", "app_catalog_items", ["release_id"])
    op.create_index("ix_app_catalog_items_bundle_id", "app_catalog_items", ["bundle_id"])


def downgrade() -> None:
    op.drop_index("ix_app_catalog_items_bundle_id", table_name="app_catalog_items")
    op.drop_index("ix_app_catalog_items_release_id", table_name="app_catalog_items")
    op.drop_table("app_catalog_items")
    op.drop_table("app_bundles")
    op.drop_table("app_releases")
