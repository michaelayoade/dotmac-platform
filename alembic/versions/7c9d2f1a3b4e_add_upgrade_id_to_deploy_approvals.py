"""add upgrade id to deploy approvals

Revision ID: 7c9d2f1a3b4e
Revises: 6b2d8a4f1c30
Create Date: 2026-02-09 18:00:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "7c9d2f1a3b4e"
down_revision = "6b2d8a4f1c30"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("deploy_approvals", sa.Column("upgrade_id", UUID(as_uuid=True), nullable=True))
    op.create_index("ix_deploy_approvals_upgrade_id", "deploy_approvals", ["upgrade_id"])
    op.create_foreign_key(
        "fk_deploy_approvals_upgrade_id",
        "deploy_approvals",
        "app_upgrades",
        ["upgrade_id"],
        ["upgrade_id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_deploy_approvals_upgrade_id", "deploy_approvals", type_="foreignkey")
    op.drop_index("ix_deploy_approvals_upgrade_id", table_name="deploy_approvals")
    op.drop_column("deploy_approvals", "upgrade_id")
