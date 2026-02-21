"""add clone operations

Revision ID: 1f2c3b4a5d6e
Revises: 0d8b3a1c2e4f
Create Date: 2026-02-09 13:05:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM, UUID

from alembic import op

revision = "1f2c3b4a5d6e"
down_revision = "0d8b3a1c2e4f"
branch_labels = None
depends_on = None

clone_status_enum = ENUM(
    "pending",
    "cloning_config",
    "backing_up",
    "deploying",
    "restoring_data",
    "verifying",
    "completed",
    "failed",
    name="clonestatus",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if bind.dialect.name == "postgresql":
        bind.execute(
            sa.text(
                "DO $$ BEGIN CREATE TYPE clonestatus AS ENUM "
                "('pending','cloning_config','backing_up','deploying',"
                "'restoring_data','verifying','completed','failed'); "
                "EXCEPTION WHEN duplicate_object THEN NULL; END $$"
            )
        )

    if "clone_operations" not in inspector.get_table_names():
        op.create_table(
            "clone_operations",
            sa.Column("clone_id", UUID(as_uuid=True), nullable=False),
            sa.Column("source_instance_id", UUID(as_uuid=True), nullable=False),
            sa.Column("target_instance_id", UUID(as_uuid=True), nullable=True),
            sa.Column("target_server_id", UUID(as_uuid=True), nullable=True),
            sa.Column("new_org_code", sa.String(length=40), nullable=False),
            sa.Column("new_org_name", sa.String(length=200), nullable=True),
            sa.Column("admin_password_encrypted", sa.Text(), nullable=True),
            sa.Column("status", clone_status_enum, nullable=True),
            sa.Column("include_data", sa.Boolean(), nullable=False, server_default="true"),
            sa.Column("progress_pct", sa.Float(), nullable=False, server_default="0"),
            sa.Column("current_step", sa.String(length=200), nullable=True),
            sa.Column("error_message", sa.Text(), nullable=True),
            sa.Column("backup_id", UUID(as_uuid=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["source_instance_id"], ["instances.instance_id"]),
            sa.ForeignKeyConstraint(["target_instance_id"], ["instances.instance_id"]),
            sa.ForeignKeyConstraint(["target_server_id"], ["servers.server_id"]),
            sa.ForeignKeyConstraint(["backup_id"], ["backups.backup_id"]),
            sa.PrimaryKeyConstraint("clone_id"),
        )

    clone_indexes = {idx["name"] for idx in inspector.get_indexes("clone_operations")}
    if "ix_clone_operations_source_instance_id" not in clone_indexes:
        op.create_index("ix_clone_operations_source_instance_id", "clone_operations", ["source_instance_id"])


def downgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    op.drop_index("ix_clone_operations_source_instance_id", table_name="clone_operations")
    op.drop_table("clone_operations")

    if is_postgres:
        clone_status_enum.drop(bind, checkfirst=True)
