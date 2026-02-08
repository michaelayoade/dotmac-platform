"""add platform tables and enum value

Revision ID: 15dbba693b0f
Revises: 799a0ecebdd4
Create Date: 2026-02-04 15:16:00.657160

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

revision = "15dbba693b0f"
down_revision = "799a0ecebdd4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # Add 'platform' value to settingdomain enum
    op.execute("ALTER TYPE settingdomain ADD VALUE IF NOT EXISTS 'platform'")

    # Create enum types if they don't exist
    existing_enums = [e["name"] for e in inspector.get_enums()]

    if "serverstatus" not in existing_enums:
        sa.Enum("connected", "unreachable", "unknown", name="serverstatus").create(bind)

    if "sectortype" not in existing_enums:
        sa.Enum("PRIVATE", "PUBLIC", "NGO", name="sectortype").create(bind)

    if "accountingframework" not in existing_enums:
        sa.Enum("IFRS", "IPSAS", "BOTH", name="accountingframework").create(bind)

    if "instancestatus" not in existing_enums:
        sa.Enum("provisioned", "deploying", "running", "stopped", "error", name="instancestatus").create(bind)

    if "healthstatus" not in existing_enums:
        sa.Enum("healthy", "unhealthy", "unreachable", name="healthstatus").create(bind)

    if "deploystepstatus" not in existing_enums:
        sa.Enum("pending", "running", "success", "failed", "skipped", name="deploystepstatus").create(bind)

    # Create servers table
    if not inspector.has_table("servers"):
        op.create_table(
            "servers",
            sa.Column("server_id", UUID(as_uuid=True), primary_key=True),
            sa.Column("name", sa.String(120), nullable=False),
            sa.Column("hostname", sa.String(255), nullable=False),
            sa.Column("ssh_port", sa.Integer, server_default="22"),
            sa.Column("ssh_user", sa.String(80), server_default="'root'"),
            sa.Column("ssh_key_path", sa.String(512), server_default="'/root/.ssh/id_rsa'"),
            sa.Column("base_domain", sa.String(255), nullable=True),
            sa.Column("is_local", sa.Boolean, server_default="false"),
            sa.Column(
                "status",
                sa.Enum("connected", "unreachable", "unknown", name="serverstatus", create_type=False),
                server_default="'unknown'",
            ),
            sa.Column("last_connected", sa.DateTime(timezone=True), nullable=True),
            sa.Column("notes", sa.Text, nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        )

    # Create instances table
    if not inspector.has_table("instances"):
        op.create_table(
            "instances",
            sa.Column("instance_id", UUID(as_uuid=True), primary_key=True),
            sa.Column("server_id", UUID(as_uuid=True), sa.ForeignKey("servers.server_id"), nullable=False),
            sa.Column("org_code", sa.String(40), unique=True, nullable=False),
            sa.Column("org_name", sa.String(200), nullable=False),
            sa.Column("org_uuid", sa.String(36), nullable=True),
            sa.Column(
                "sector_type",
                sa.Enum("PRIVATE", "PUBLIC", "NGO", name="sectortype", create_type=False),
                server_default="'PRIVATE'",
            ),
            sa.Column(
                "framework",
                sa.Enum("IFRS", "IPSAS", "BOTH", name="accountingframework", create_type=False),
                server_default="'IFRS'",
            ),
            sa.Column("currency", sa.String(3), server_default="'NGN'"),
            sa.Column("app_port", sa.Integer, nullable=False),
            sa.Column("db_port", sa.Integer, nullable=False),
            sa.Column("redis_port", sa.Integer, nullable=False),
            sa.Column("domain", sa.String(255), nullable=True),
            sa.Column("app_url", sa.String(512), nullable=True),
            sa.Column("admin_email", sa.String(255), nullable=True),
            sa.Column("admin_username", sa.String(80), nullable=True),
            sa.Column("deploy_path", sa.String(512), nullable=True),
            sa.Column(
                "status",
                sa.Enum(
                    "provisioned", "deploying", "running", "stopped", "error", name="instancestatus", create_type=False
                ),
                server_default="'provisioned'",
            ),
            sa.Column("notes", sa.Text, nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        )

    # Create health_checks table
    if not inspector.has_table("health_checks"):
        op.create_table(
            "health_checks",
            sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
            sa.Column(
                "instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False, index=True
            ),
            sa.Column("checked_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column(
                "status",
                sa.Enum("healthy", "unhealthy", "unreachable", name="healthstatus", create_type=False),
                server_default="'unreachable'",
            ),
            sa.Column("response_ms", sa.Integer, nullable=True),
            sa.Column("db_healthy", sa.Boolean, nullable=True),
            sa.Column("redis_healthy", sa.Boolean, nullable=True),
            sa.Column("error_message", sa.Text, nullable=True),
        )

    # Create deployment_logs table
    if not inspector.has_table("deployment_logs"):
        op.create_table(
            "deployment_logs",
            sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
            sa.Column(
                "instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False, index=True
            ),
            sa.Column("deployment_id", sa.String(36), nullable=False, index=True),
            sa.Column("step", sa.String(60), nullable=False),
            sa.Column(
                "status",
                sa.Enum(
                    "pending", "running", "success", "failed", "skipped", name="deploystepstatus", create_type=False
                ),
                server_default="'pending'",
            ),
            sa.Column("message", sa.Text, nullable=True),
            sa.Column("output", sa.Text, nullable=True),
            sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("deployment_logs"):
        op.drop_table("deployment_logs")
    if inspector.has_table("health_checks"):
        op.drop_table("health_checks")
    if inspector.has_table("instances"):
        op.drop_table("instances")
    if inspector.has_table("servers"):
        op.drop_table("servers")
