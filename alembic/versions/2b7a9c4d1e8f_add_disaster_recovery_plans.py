"""add disaster recovery plans

Revision ID: 2b7a9c4d1e8f
Revises: 1f2c3b4a5d6e
Create Date: 2026-02-09 14:20:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "2b7a9c4d1e8f"
down_revision = "1f2c3b4a5d6e"
branch_labels = None
depends_on = None


dr_test_status_enum = sa.Enum("pending", "running", "passed", "failed", name="drteststatus", create_type=True)


def upgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"
    if is_postgres:
        dr_test_status_enum.create(bind, checkfirst=True)

    op.create_table(
        "disaster_recovery_plans",
        sa.Column("dr_plan_id", UUID(as_uuid=True), nullable=False),
        sa.Column("instance_id", UUID(as_uuid=True), nullable=False),
        sa.Column("backup_schedule_cron", sa.String(length=120), nullable=False),
        sa.Column("retention_days", sa.Integer(), nullable=False),
        sa.Column("target_server_id", UUID(as_uuid=True), nullable=True),
        sa.Column("last_backup_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_tested_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_test_status", dr_test_status_enum, nullable=True),
        sa.Column("last_test_message", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["instance_id"], ["instances.instance_id"]),
        sa.ForeignKeyConstraint(["target_server_id"], ["servers.server_id"]),
        sa.PrimaryKeyConstraint("dr_plan_id"),
    )
    op.create_index("ix_disaster_recovery_plans_instance_id", "disaster_recovery_plans", ["instance_id"])


def downgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    op.drop_index("ix_disaster_recovery_plans_instance_id", table_name="disaster_recovery_plans")
    op.drop_table("disaster_recovery_plans")

    if is_postgres:
        dr_test_status_enum.drop(bind, checkfirst=True)
