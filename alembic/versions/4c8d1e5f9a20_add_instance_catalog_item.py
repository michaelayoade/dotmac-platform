"""add instance catalog item

Revision ID: 4c8d1e5f9a20
Revises: 3a9b2c7d4f10
Create Date: 2026-02-09 15:40:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "4c8d1e5f9a20"
down_revision = "3a9b2c7d4f10"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("instances", sa.Column("catalog_item_id", UUID(as_uuid=True), nullable=True))
    op.create_index("ix_instances_catalog_item_id", "instances", ["catalog_item_id"])
    op.create_foreign_key(
        "fk_instances_catalog_item_id",
        "instances",
        "app_catalog_items",
        ["catalog_item_id"],
        ["catalog_id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_instances_catalog_item_id", "instances", type_="foreignkey")
    op.drop_index("ix_instances_catalog_item_id", table_name="instances")
    op.drop_column("instances", "catalog_item_id")
