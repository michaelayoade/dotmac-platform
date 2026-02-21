"""add otel_export_configs table

Revision ID: b2c3d4e5f6a8
Revises: a1b2c3d4e5f7
Create Date: 2026-02-12 11:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "b2c3d4e5f6a8"
down_revision = "a1b2c3d4e5f7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = set(inspector.get_table_names())

    if "otel_export_configs" not in tables:
        op.create_table(
            "otel_export_configs",
            sa.Column("id", sa.UUID(), nullable=False),
            sa.Column("instance_id", sa.UUID(), nullable=False),
            sa.Column("endpoint_url", sa.String(length=512), nullable=False),
            sa.Column("protocol", sa.String(length=30), nullable=False, server_default="http/protobuf"),
            sa.Column("headers_enc", sa.Text(), nullable=True),
            sa.Column("export_interval_seconds", sa.Integer(), nullable=False, server_default="60"),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
            sa.Column("last_export_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("last_error", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["instance_id"], ["instances.instance_id"]),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("instance_id"),
        )
    otel_indexes = (
        {idx["name"] for idx in inspector.get_indexes("otel_export_configs")}
        if "otel_export_configs" in tables
        else set()
    )
    if "ix_otel_export_configs_instance_id" not in otel_indexes:
        op.create_index(op.f("ix_otel_export_configs_instance_id"), "otel_export_configs", ["instance_id"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_otel_export_configs_instance_id"), table_name="otel_export_configs")
    op.drop_table("otel_export_configs")
