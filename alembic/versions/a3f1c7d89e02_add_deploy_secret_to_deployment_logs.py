"""add deploy_secret to deployment_logs

Revision ID: a3f1c7d89e02
Revises: 15dbba693b0f
Create Date: 2026-02-05 10:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "a3f1c7d89e02"
down_revision = "15dbba693b0f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("deployment_logs"):
        columns = {col["name"] for col in inspector.get_columns("deployment_logs")}
        if "deploy_secret" not in columns:
            op.add_column(
                "deployment_logs",
                sa.Column("deploy_secret", sa.Text, nullable=True),
            )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("deployment_logs"):
        columns = {col["name"] for col in inspector.get_columns("deployment_logs")}
        if "deploy_secret" in columns:
            op.drop_column("deployment_logs", "deploy_secret")
