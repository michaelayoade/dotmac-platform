"""add webhooks, tenant audit, tags, approvals, drift, alerts, maintenance, usage

Revision ID: c7e3a1b4d902
Revises: b4f2a8c91d03
Create Date: 2026-02-05 14:00:00.000000

"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON, UUID

from alembic import op

revision = "c7e3a1b4d902"
down_revision = "b4f2a8c91d03"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"
    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())

    # Webhook Endpoints
    if "webhook_endpoints" not in tables:
        op.create_table(
            "webhook_endpoints",
            sa.Column("endpoint_id", UUID(as_uuid=True), primary_key=True),
            sa.Column("url", sa.String(1024), nullable=False),
            sa.Column("secret", sa.String(256)),
            sa.Column("description", sa.String(500)),
            sa.Column(
                "events",
                JSON,
                server_default=sa.text("'[]'::json") if is_postgres else sa.text("'[]'"),
            ),
            sa.Column("is_active", sa.Boolean(), server_default="true"),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )

    # Webhook Deliveries
    if "webhook_deliveries" not in tables:
        op.create_table(
            "webhook_deliveries",
            sa.Column("delivery_id", UUID(as_uuid=True), primary_key=True),
            sa.Column(
                "endpoint_id", UUID(as_uuid=True), sa.ForeignKey("webhook_endpoints.endpoint_id"), nullable=False
            ),
            sa.Column("event", sa.String(60), nullable=False),
            sa.Column(
                "payload",
                JSON,
                server_default=sa.text("'{}'::json") if is_postgres else sa.text("'{}'"),
            ),
            sa.Column(
                "status", sa.Enum("pending", "success", "failed", name="deliverystatus"), server_default="pending"
            ),
            sa.Column("response_code", sa.Integer()),
            sa.Column("response_body", sa.Text()),
            sa.Column("attempts", sa.Integer(), server_default="0"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("delivered_at", sa.DateTime(timezone=True)),
        )
    wd_indexes = (
        {idx["name"] for idx in inspector.get_indexes("webhook_deliveries")}
        if "webhook_deliveries" in tables
        else set()
    )
    if "ix_webhook_deliveries_endpoint_id" not in wd_indexes:
        op.create_index("ix_webhook_deliveries_endpoint_id", "webhook_deliveries", ["endpoint_id"])

    # Tenant Audit Logs
    if "tenant_audit_logs" not in tables:
        op.create_table(
            "tenant_audit_logs",
            sa.Column("id", sa.Integer(), autoincrement=True, primary_key=True),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False),
            sa.Column("user_id", sa.String(36)),
            sa.Column("user_name", sa.String(200)),
            sa.Column("action", sa.String(100), nullable=False),
            sa.Column("details", JSON),
            sa.Column("ip_address", sa.String(45)),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
    tal_indexes = (
        {idx["name"] for idx in inspector.get_indexes("tenant_audit_logs")} if "tenant_audit_logs" in tables else set()
    )
    if "ix_tenant_audit_logs_instance_id" not in tal_indexes:
        op.create_index("ix_tenant_audit_logs_instance_id", "tenant_audit_logs", ["instance_id"])
    if "ix_tenant_audit_logs_action" not in tal_indexes:
        op.create_index("ix_tenant_audit_logs_action", "tenant_audit_logs", ["action"])
    if "ix_tenant_audit_logs_user_id" not in tal_indexes:
        op.create_index("ix_tenant_audit_logs_user_id", "tenant_audit_logs", ["user_id"])
    if "ix_tenant_audit_logs_created_at" not in tal_indexes:
        op.create_index("ix_tenant_audit_logs_created_at", "tenant_audit_logs", ["created_at"])

    # Maintenance Windows
    if "maintenance_windows" not in tables:
        op.create_table(
            "maintenance_windows",
            sa.Column("window_id", UUID(as_uuid=True), primary_key=True),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False),
            sa.Column("day_of_week", sa.Integer(), nullable=False),
            sa.Column("start_time", sa.Time(), nullable=False),
            sa.Column("end_time", sa.Time(), nullable=False),
            sa.Column("timezone", sa.String(60), server_default="UTC"),
            sa.Column("is_active", sa.Boolean(), server_default="true"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
    mw_indexes = (
        {idx["name"] for idx in inspector.get_indexes("maintenance_windows")}
        if "maintenance_windows" in tables
        else set()
    )
    if "ix_maintenance_windows_instance_id" not in mw_indexes:
        op.create_index("ix_maintenance_windows_instance_id", "maintenance_windows", ["instance_id"])

    # Usage Records
    if "usage_records" not in tables:
        op.create_table(
            "usage_records",
            sa.Column("id", sa.Integer(), autoincrement=True, primary_key=True),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False),
            sa.Column(
                "metric",
                sa.Enum("active_users", "storage_gb", "api_calls", "cpu_hours", "bandwidth_gb", name="usagemetric"),
                nullable=False,
            ),
            sa.Column("value", sa.Float(), nullable=False),
            sa.Column("period_start", sa.DateTime(timezone=True), nullable=False),
            sa.Column("period_end", sa.DateTime(timezone=True), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
    ur_indexes = {idx["name"] for idx in inspector.get_indexes("usage_records")} if "usage_records" in tables else set()
    if "ix_usage_records_instance_id" not in ur_indexes:
        op.create_index("ix_usage_records_instance_id", "usage_records", ["instance_id"])

    # Instance Tags
    if "instance_tags" not in tables:
        op.create_table(
            "instance_tags",
            sa.Column("id", sa.Integer(), autoincrement=True, primary_key=True),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False),
            sa.Column("key", sa.String(60), nullable=False),
            sa.Column("value", sa.String(200), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.UniqueConstraint("instance_id", "key", name="uq_instance_tag_key"),
        )
    it_indexes = {idx["name"] for idx in inspector.get_indexes("instance_tags")} if "instance_tags" in tables else set()
    if "ix_instance_tags_instance_id" not in it_indexes:
        op.create_index("ix_instance_tags_instance_id", "instance_tags", ["instance_id"])
    if "ix_instance_tags_key" not in it_indexes:
        op.create_index("ix_instance_tags_key", "instance_tags", ["key"])

    # Deploy Approvals
    if "deploy_approvals" not in tables:
        op.create_table(
            "deploy_approvals",
            sa.Column("approval_id", UUID(as_uuid=True), primary_key=True),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False),
            sa.Column("deployment_id", sa.String(36)),
            sa.Column("requested_by", sa.String(36), nullable=False),
            sa.Column("requested_by_name", sa.String(200)),
            sa.Column("approved_by", sa.String(36)),
            sa.Column("approved_by_name", sa.String(200)),
            sa.Column(
                "status",
                sa.Enum("pending", "approved", "rejected", "expired", name="approvalstatus"),
                server_default="pending",
            ),
            sa.Column("reason", sa.Text()),
            sa.Column("deployment_type", sa.String(30), server_default="full"),
            sa.Column("git_ref", sa.String(120)),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("resolved_at", sa.DateTime(timezone=True)),
        )
    da_indexes = (
        {idx["name"] for idx in inspector.get_indexes("deploy_approvals")} if "deploy_approvals" in tables else set()
    )
    if "ix_deploy_approvals_instance_id" not in da_indexes:
        op.create_index("ix_deploy_approvals_instance_id", "deploy_approvals", ["instance_id"])

    # Drift Reports
    if "drift_reports" not in tables:
        op.create_table(
            "drift_reports",
            sa.Column("id", sa.Integer(), autoincrement=True, primary_key=True),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=False),
            sa.Column(
                "diffs",
                JSON,
                server_default=sa.text("'{}'::json") if is_postgres else sa.text("'{}'"),
            ),
            sa.Column("has_drift", sa.Boolean(), server_default="false"),
            sa.Column("detected_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )
    dr_indexes = {idx["name"] for idx in inspector.get_indexes("drift_reports")} if "drift_reports" in tables else set()
    if "ix_drift_reports_instance_id" not in dr_indexes:
        op.create_index("ix_drift_reports_instance_id", "drift_reports", ["instance_id"])

    # Alert Rules
    if "alert_rules" not in tables:
        op.create_table(
            "alert_rules",
            sa.Column("rule_id", UUID(as_uuid=True), primary_key=True),
            sa.Column("name", sa.String(200), nullable=False),
            sa.Column(
                "metric",
                sa.Enum(
                    "cpu_percent",
                    "memory_mb",
                    "db_size_mb",
                    "active_connections",
                    "response_ms",
                    "health_failures",
                    "disk_usage_mb",
                    name="alertmetric",
                ),
                nullable=False,
            ),
            sa.Column("operator", sa.Enum("gt", "gte", "lt", "lte", "eq", name="alertoperator"), nullable=False),
            sa.Column("threshold", sa.Float(), nullable=False),
            sa.Column("channel", sa.Enum("webhook", "email", "log", name="alertchannel"), server_default="webhook"),
            sa.Column("channel_config", JSON),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=True),
            sa.Column("is_active", sa.Boolean(), server_default="true"),
            sa.Column("cooldown_minutes", sa.Integer(), server_default="15"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        )

    # Alert Events
    if "alert_events" not in tables:
        op.create_table(
            "alert_events",
            sa.Column("event_id", UUID(as_uuid=True), primary_key=True),
            sa.Column("rule_id", UUID(as_uuid=True), sa.ForeignKey("alert_rules.rule_id"), nullable=False),
            sa.Column("instance_id", UUID(as_uuid=True), sa.ForeignKey("instances.instance_id"), nullable=True),
            sa.Column("metric_value", sa.Float(), nullable=False),
            sa.Column("threshold", sa.Float(), nullable=False),
            sa.Column("triggered_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
            sa.Column("resolved_at", sa.DateTime(timezone=True)),
            sa.Column("notified", sa.Boolean(), server_default="false"),
        )
    ae_indexes = {idx["name"] for idx in inspector.get_indexes("alert_events")} if "alert_events" in tables else set()
    if "ix_alert_events_rule_id" not in ae_indexes:
        op.create_index("ix_alert_events_rule_id", "alert_events", ["rule_id"])
    if "ix_alert_events_instance_id" not in ae_indexes:
        op.create_index("ix_alert_events_instance_id", "alert_events", ["instance_id"])


def downgrade() -> None:
    op.drop_table("alert_events")
    op.drop_table("alert_rules")
    op.drop_table("drift_reports")
    op.drop_table("deploy_approvals")
    op.drop_table("instance_tags")
    op.drop_table("usage_records")
    op.drop_table("maintenance_windows")
    op.drop_table("tenant_audit_logs")
    op.drop_table("webhook_deliveries")
    op.drop_table("webhook_endpoints")

    for name in [
        "deliverystatus",
        "usagemetric",
        "approvalstatus",
        "alertmetric",
        "alertoperator",
        "alertchannel",
    ]:
        op.execute(f"DROP TYPE IF EXISTS {name}")
