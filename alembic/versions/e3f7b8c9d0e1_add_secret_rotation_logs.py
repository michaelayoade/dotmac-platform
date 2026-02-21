"""add secret rotation logs

Revision ID: e3f7b8c9d0e1
Revises: a1b2c3d4e5f6
Create Date: 2026-02-09 08:30:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM, UUID

from alembic import op

revision = "e3f7b8c9d0e1"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None

rotation_status_enum = ENUM(
    "pending",
    "running",
    "success",
    "failed",
    "rolled_back",
    name="rotationstatus",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if bind.dialect.name == "postgresql":
        bind.execute(
            sa.text(
                "DO $$ BEGIN "
                "CREATE TYPE rotationstatus AS ENUM ('pending','running','success','failed','rolled_back'); "
                "EXCEPTION WHEN duplicate_object THEN NULL; END $$"
            )
        )

    if "secret_rotation_logs" not in inspector.get_table_names():
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

    existing_indexes = {idx["name"] for idx in inspector.get_indexes("secret_rotation_logs")}
    if "ix_secret_rotation_logs_instance_id" not in existing_indexes:
        op.create_index("ix_secret_rotation_logs_instance_id", "secret_rotation_logs", ["instance_id"])


def downgrade() -> None:
    op.drop_index("ix_secret_rotation_logs_instance_id", table_name="secret_rotation_logs")
    op.drop_table("secret_rotation_logs")
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        rotation_status_enum.drop(bind, checkfirst=True)
