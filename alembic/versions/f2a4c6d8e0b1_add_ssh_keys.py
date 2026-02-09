"""add ssh keys

Revision ID: f2a4c6d8e0b1
Revises: e3f7b8c9d0e1
Create Date: 2026-02-09 10:20:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "f2a4c6d8e0b1"
down_revision = "e3f7b8c9d0e1"
branch_labels = None
depends_on = None

ssh_key_type_enum = sa.Enum("ed25519", "rsa", name="sshkeytype", create_type=True)


def upgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"
    if is_postgres:
        ssh_key_type_enum.create(bind, checkfirst=True)

    op.create_table(
        "ssh_keys",
        sa.Column("key_id", UUID(as_uuid=True), nullable=False),
        sa.Column("label", sa.String(length=200), nullable=False),
        sa.Column("public_key", sa.Text(), nullable=False),
        sa.Column("private_key_encrypted", sa.Text(), nullable=False),
        sa.Column("fingerprint", sa.String(length=120), nullable=False),
        sa.Column("key_type", ssh_key_type_enum, nullable=True),
        sa.Column("bit_size", sa.Integer(), nullable=True),
        sa.Column("created_by", sa.String(length=120), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("key_id"),
        sa.UniqueConstraint("fingerprint", name="uq_ssh_keys_fingerprint"),
    )

    op.add_column("servers", sa.Column("ssh_key_id", UUID(as_uuid=True), nullable=True))
    op.create_index("ix_servers_ssh_key_id", "servers", ["ssh_key_id"])
    op.create_foreign_key(
        "fk_servers_ssh_key_id",
        "servers",
        "ssh_keys",
        ["ssh_key_id"],
        ["key_id"],
    )


def downgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    op.drop_constraint("fk_servers_ssh_key_id", "servers", type_="foreignkey")
    op.drop_index("ix_servers_ssh_key_id", table_name="servers")
    op.drop_column("servers", "ssh_key_id")

    op.drop_table("ssh_keys")

    if is_postgres:
        ssh_key_type_enum.drop(bind, checkfirst=True)
