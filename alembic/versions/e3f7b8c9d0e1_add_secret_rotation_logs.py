"""add secret rotation logs

Revision ID: e3f7b8c9d0e1
Revises: a1b2c3d4e5f6
Create Date: 2026-02-09 08:30:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "e3f7b8c9d0e1"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None

rotation_status_enum = sa.Enum(
    "pending",
    "running",
    "success",
    "failed",
    "rolled_back",
    name="rotationstatus",
    create_type=True,
)


def upgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"
    if is_postgres:
        rotation_status_enum.create(bind, checkfirst=True)

    op.create_table(
        "secret_rotation_logs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("instance_id", UUID(as_uuid=True), nullable=False),
        sa.Column("secret_name", sa.String(length=80), nullable=False),
        sa.Column("status", rotation_status_enum, nullable=True),
        sa.Column("rotated_by", sa.String(length=120), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["instance_id"], ["instances.instance_id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_secret_rotation_logs_instance_id", "secret_rotation_logs", ["instance_id"])


def downgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    op.drop_index("ix_secret_rotation_logs_instance_id", table_name="secret_rotation_logs")
    op.drop_table("secret_rotation_logs")

    if is_postgres:
        rotation_status_enum.drop(bind, checkfirst=True)
