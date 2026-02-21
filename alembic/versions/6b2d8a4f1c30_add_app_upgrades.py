"""add app upgrades

Revision ID: 6b2d8a4f1c30
Revises: 5e1f7a2c9d3b
Create Date: 2026-02-09 16:45:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM, UUID

from alembic import op

revision = "6b2d8a4f1c30"
down_revision = "5e1f7a2c9d3b"
branch_labels = None
depends_on = None

upgrade_status_enum = ENUM(
    "scheduled",
    "running",
    "completed",
    "failed",
    "cancelled",
    name="upgradestatus",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())

    if bind.dialect.name == "postgresql":
        bind.execute(
            sa.text(
                "DO $$ BEGIN CREATE TYPE upgradestatus AS ENUM "
                "('scheduled','running','completed','failed','cancelled'); "
                "EXCEPTION WHEN duplicate_object THEN NULL; END $$"
            )
        )

    if "app_upgrades" not in tables:
        op.create_table(
            "app_upgrades",
            sa.Column("upgrade_id", UUID(as_uuid=True), nullable=False),
            sa.Column("instance_id", UUID(as_uuid=True), nullable=False),
            sa.Column("catalog_item_id", UUID(as_uuid=True), nullable=False),
            sa.Column("status", upgrade_status_enum, nullable=True),
            sa.Column("scheduled_for", sa.DateTime(timezone=True), nullable=True),
            sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("requested_by", sa.String(length=120), nullable=True),
            sa.Column("error_message", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["instance_id"], ["instances.instance_id"]),
            sa.ForeignKeyConstraint(["catalog_item_id"], ["app_catalog_items.catalog_id"]),
            sa.PrimaryKeyConstraint("upgrade_id"),
        )
    au_indexes = {idx["name"] for idx in inspector.get_indexes("app_upgrades")} if "app_upgrades" in tables else set()
    if "ix_app_upgrades_instance_id" not in au_indexes:
        op.create_index("ix_app_upgrades_instance_id", "app_upgrades", ["instance_id"])


def downgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    op.drop_index("ix_app_upgrades_instance_id", table_name="app_upgrades")
    op.drop_table("app_upgrades")

    if is_postgres:
        upgrade_status_enum.drop(bind, checkfirst=True)
