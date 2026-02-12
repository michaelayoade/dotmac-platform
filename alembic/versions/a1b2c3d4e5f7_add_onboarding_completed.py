"""add onboarding_completed to people

Revision ID: a1b2c3d4e5f7
Revises: f9a1b2c3d4e5
Create Date: 2026-02-12 10:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "a1b2c3d4e5f7"
down_revision = "f9a1b2c3d4e5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("people") as batch_op:
        batch_op.add_column(sa.Column("onboarding_completed", sa.Boolean(), nullable=True, server_default=sa.text("0")))


def downgrade() -> None:
    with op.batch_alter_table("people") as batch_op:
        batch_op.drop_column("onboarding_completed")
