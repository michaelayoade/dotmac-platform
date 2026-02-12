"""add signup requests

Revision ID: f9a1b2c3d4e5
Revises: 8d1f0a2b3c4d
Create Date: 2026-02-10 10:45:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "f9a1b2c3d4e5"
down_revision = "8d1f0a2b3c4d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "signup_requests",
        sa.Column("signup_id", sa.UUID(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("org_name", sa.String(length=200), nullable=False),
        sa.Column("org_code", sa.String(length=40), nullable=True),
        sa.Column("catalog_item_id", sa.UUID(), nullable=False),
        sa.Column("domain", sa.String(length=255), nullable=True),
        sa.Column("server_id", sa.UUID(), nullable=True),
        sa.Column("admin_username", sa.String(length=80), nullable=False),
        sa.Column("admin_password_enc", sa.Text(), nullable=False),
        sa.Column("trial_days", sa.Integer(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("pending", "verified", "provisioned", "expired", "canceled", name="signupstatus"),
            nullable=False,
        ),
        sa.Column("verification_token_hash", sa.String(length=64), nullable=True),
        sa.Column("verification_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("email_verified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("billing_confirmed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("billing_reference", sa.String(length=120), nullable=True),
        sa.Column("instance_id", sa.UUID(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["catalog_item_id"], ["app_catalog_items.catalog_id"]),
        sa.ForeignKeyConstraint(["instance_id"], ["instances.instance_id"]),
        sa.ForeignKeyConstraint(["server_id"], ["servers.server_id"]),
        sa.PrimaryKeyConstraint("signup_id"),
    )
    op.create_index(op.f("ix_signup_requests_email"), "signup_requests", ["email"], unique=False)
    op.create_index(op.f("ix_signup_requests_org_code"), "signup_requests", ["org_code"], unique=False)
    op.create_index(op.f("ix_signup_requests_catalog_item_id"), "signup_requests", ["catalog_item_id"], unique=False)
    op.create_index(op.f("ix_signup_requests_expires_at"), "signup_requests", ["expires_at"], unique=False)
    op.create_index(
        op.f("ix_signup_requests_verification_token_hash"), "signup_requests", ["verification_token_hash"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_signup_requests_verification_token_hash"), table_name="signup_requests")
    op.drop_index(op.f("ix_signup_requests_expires_at"), table_name="signup_requests")
    op.drop_index(op.f("ix_signup_requests_catalog_item_id"), table_name="signup_requests")
    op.drop_index(op.f("ix_signup_requests_org_code"), table_name="signup_requests")
    op.drop_index(op.f("ix_signup_requests_email"), table_name="signup_requests")
    op.drop_table("signup_requests")
    op.execute("DROP TYPE signupstatus")
