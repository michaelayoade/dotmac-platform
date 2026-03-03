"""add server ssh host key fingerprint

Revision ID: a7c9d1e3f5b7
Revises: d4e5f6a7b8c9
Create Date: 2026-02-27 12:20:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "a7c9d1e3f5b7"
down_revision = "d4e5f6a7b8c9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    server_cols = {c["name"] for c in inspector.get_columns("servers")}
    if "ssh_host_key_fingerprint" not in server_cols:
        op.add_column("servers", sa.Column("ssh_host_key_fingerprint", sa.String(length=255), nullable=True))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    server_cols = {c["name"] for c in inspector.get_columns("servers")}
    if "ssh_host_key_fingerprint" in server_cols:
        op.drop_column("servers", "ssh_host_key_fingerprint")
