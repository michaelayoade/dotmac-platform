from __future__ import annotations

from typing import Any
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.instance import AccountingFramework, SectorType


class InstanceCreateRequest(BaseModel):
    server_id: UUID
    org_code: str = Field(min_length=1, max_length=40)
    org_name: str = Field(min_length=1, max_length=200)
    sector_type: SectorType | None = None
    framework: AccountingFramework | None = None
    currency: str | None = Field(default=None, max_length=3)
    admin_email: EmailStr | None = None
    admin_username: str = Field(default="admin", min_length=1, max_length=80)
    domain: str | None = Field(default=None, max_length=255)
    catalog_item_id: UUID
    app_port: int | None = Field(default=None, ge=1, le=65535)
    db_port: int | None = Field(default=None, ge=1, le=65535)
    redis_port: int | None = Field(default=None, ge=1, le=65535)


class InstanceCreateResponse(BaseModel):
    instance_id: UUID
    server_id: UUID
    org_code: str
    org_name: str
    app_url: str | None = None
    domain: str | None = None
    status: str
    catalog_item_id: UUID | None = None


class InstanceWebhookCreateRequest(BaseModel):
    url: str = Field(min_length=1, max_length=1024)
    events: list[str] = Field(default_factory=list)
    secret: str | None = Field(default=None, max_length=256)
    description: str | None = Field(default=None, max_length=500)
    instance_id: UUID | None = None


class InstanceAutoDeployRead(BaseModel):
    instance_id: str
    auto_deploy: bool


class ModuleRead(BaseModel):
    module_id: str
    name: str
    slug: str
    description: str | None = None
    schemas: list[str]
    dependencies: list[str]
    is_core: bool


class InstanceModuleRead(BaseModel):
    module: ModuleRead
    enabled: bool


class ModuleToggleRead(BaseModel):
    module_id: str
    enabled: bool


class FeatureFlagRead(BaseModel):
    key: str
    description: str
    value: str
    is_custom: bool


class FeatureFlagValueRead(BaseModel):
    key: str
    value: str


class PlanRead(BaseModel):
    plan_id: str
    name: str
    description: str | None = None
    max_users: int
    max_storage_gb: int
    allowed_modules: list[str]
    allowed_flags: list[str]


class InstancePlanAssignmentRead(BaseModel):
    instance_id: str
    plan_id: str


class SecretRotationTaskRead(BaseModel):
    task_id: str
    instance_id: str
    secret_name: str | None = None


class SecretRotationLogRead(BaseModel):
    id: int
    secret_name: str
    status: str
    rotated_by: str | None = None
    error_message: str | None = None
    started_at: str | None = None
    completed_at: str | None = None
    created_at: str | None = None


class BackupRead(BaseModel):
    backup_id: str
    backup_type: str
    status: str
    size_bytes: int | None = None
    created_at: str | None = None
    file_path: str | None = None
    completed_at: str | None = None


class BackupRestoreRead(BaseModel):
    success: bool
    message: str | None = None
    error: str | None = None


class DomainRead(BaseModel):
    domain_id: str
    domain: str
    is_primary: bool
    status: str
    ssl_expires_at: str | None = None
    created_at: str | None = None
    verification_token: str | None = None


class DomainVerificationRead(BaseModel):
    verified: bool
    message: str | None = None


class DomainSSLProvisionRead(BaseModel):
    success: bool


class TrialLifecycleRead(BaseModel):
    status: str
    trial_expires_at: str | None = None


class LifecycleStatusRead(BaseModel):
    status: str


class ReconfigureRead(BaseModel):
    deployment_id: str
    type: str


class InstanceVersionRead(BaseModel):
    git_branch: str | None = None
    git_tag: str | None = None
    deployed_git_ref: str | None = None


class BatchDeployCreateRead(BaseModel):
    batch_id: str
    total_instances: int
    strategy: str


class BatchDeployRead(BaseModel):
    batch_id: str
    strategy: str
    status: str
    total_instances: int
    completed_count: int
    failed_count: int
    git_ref: str | None = None
    deployment_type: str
    created_at: str | None = None
    started_at: str | None = None
    completed_at: str | None = None


class ResourceConsumerRead(BaseModel):
    org_code: str
    instance_id: str
    cpu_percent: float
    memory_mb: int
    db_size_mb: int
    active_connections: int


class WebhookEndpointRead(BaseModel):
    endpoint_id: str
    url: str
    events: list[str]
    description: str | None = None
    instance_id: str | None = None
    is_active: bool


class WebhookDeliveryRead(BaseModel):
    delivery_id: str
    event: str
    status: str
    response_code: int | None = None
    attempts: int
    created_at: str | None = None


class TenantAuditLogRead(BaseModel):
    id: int
    action: str
    user_name: str | None = None
    details: dict[str, Any] | None = None
    created_at: str | None = None


class CloneDispatchRead(BaseModel):
    clone_id: str
    source_instance_id: str
    status: str


class CloneOperationRead(BaseModel):
    clone_id: str
    source_instance_id: str
    target_instance_id: str | None = None
    status: str
    progress_pct: float
    current_step: str | None = None
    error_message: str | None = None
    created_at: str | None = None
    completed_at: str | None = None


class MaintenanceWindowRead(BaseModel):
    window_id: str
    day_of_week: int
    start_time: str
    end_time: str
    timezone: str


class MaintenanceWindowUpsertRead(BaseModel):
    window_id: str
    day_of_week: int


class UsageRecordRead(BaseModel):
    metric: str
    value: float
    period_start: str
    period_end: str


class PlanViolationRead(BaseModel):
    kind: str
    message: str
    current: float | int | str | None = None
    limit: float | int | list[str] | None = None
    percent: float | None = None


class UsageSummaryRead(BaseModel):
    plan_name: str | None = None
    max_users: int
    max_storage_gb: int
    current_users: float
    current_storage_gb: float
    users_percent: float | None = None
    storage_percent: float | None = None
    users_over_limit: bool
    storage_over_limit: bool


class TagRead(BaseModel):
    key: str
    value: str


class DeployApprovalRead(BaseModel):
    approval_id: str
    instance_id: str
    upgrade_id: str | None = None
    requested_by_name: str | None = None
    deployment_type: str
    git_ref: str | None = None
    reason: str | None = None
    status: str
    created_at: str | None = None


class ApprovalStatusRead(BaseModel):
    approval_id: str
    status: str


class DriftReportRead(BaseModel):
    has_drift: bool | None = None
    diffs: dict[str, Any] | None = None
    detected_at: str | None = None
    message: str | None = None


class DRStatusRead(BaseModel):
    configured: bool
    dr_plan_id: str | None = None
    backup_schedule_cron: str | None = None
    retention_days: int | None = None
    target_server_id: str | None = None
    last_backup_at: str | None = None
    last_tested_at: str | None = None
    last_test_status: str | None = None
    last_test_message: str | None = None
    is_active: bool | None = None


class UpgradeRead(BaseModel):
    upgrade_id: str
    catalog_item_id: str
    status: str
    scheduled_for: str | None = None
    started_at: str | None = None
    completed_at: str | None = None
    cancelled_by: str | None = None
    cancelled_by_name: str | None = None
    error_message: str | None = None
    created_at: str | None = None


class UpgradeDispatchRead(BaseModel):
    upgrade_id: str
    status: str
    approval_required: bool
    approval_id: str | None = None


class UpgradeCancelRead(BaseModel):
    upgrade_id: str
    status: str


class AlertRuleRead(BaseModel):
    rule_id: str
    name: str
    metric: str
    operator: str
    threshold: float
    channel: str
    instance_id: str | None = None
    is_active: bool
    cooldown_minutes: int


class AlertRuleCreateRead(BaseModel):
    rule_id: str
    name: str


class AlertEventRead(BaseModel):
    event_id: str
    rule_id: str
    instance_id: str | None = None
    metric_value: float
    threshold: float
    triggered_at: str | None = None
    resolved_at: str | None = None
    notified: bool


class HealthCheckRead(BaseModel):
    status: str
    response_ms: int | None = None
    db_healthy: bool | None = None
    redis_healthy: bool | None = None
    checked_at: str | None = None
