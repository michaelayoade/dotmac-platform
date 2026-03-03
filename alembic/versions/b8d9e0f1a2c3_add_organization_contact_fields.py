"""add organization contact fields

Revision ID: b8d9e0f1a2c3
Revises: a7c9d1e3f5b7
Create Date: 2026-03-01 10:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "b8d9e0f1a2c3"
down_revision = ("a7c9d1e3f5b7", "e1f2a3b4c5d6")
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = {c["name"] for c in inspector.get_columns("organizations")}
    if "contact_email" not in cols:
        op.add_column("organizations", sa.Column("contact_email", sa.String(length=255), nullable=True))
    if "contact_phone" not in cols:
        op.add_column("organizations", sa.Column("contact_phone", sa.String(length=40), nullable=True))
    if "notes" not in cols:
        op.add_column("organizations", sa.Column("notes", sa.Text(), nullable=True))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = {c["name"] for c in inspector.get_columns("organizations")}
    if "notes" in cols:
        op.drop_column("organizations", "notes")
    if "contact_phone" in cols:
        op.drop_column("organizations", "contact_phone")
    if "contact_email" in cols:
        op.drop_column("organizations", "contact_email")
