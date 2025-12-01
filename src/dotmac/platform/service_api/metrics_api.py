"""
Metrics reporting API for ISP services.

ISP instances report usage metrics to Platform for:
- License enforcement (subscriber counts)
- Analytics and dashboards
- Billing calculations
"""

import hashlib
from datetime import UTC, datetime
from typing import Any

import structlog
from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dotmac.platform.database import get_async_session
from dotmac.platform.licensing.models import Activation, ActivationStatus, License, LicenseStatus
from dotmac.platform.tenant.models import Tenant, TenantUsage
from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/metrics", tags=["Metrics API"])


class UsageMetrics(BaseModel):
    """Usage metrics reported by ISP instances."""

    model_config = ConfigDict()

    tenant_id: str
    reported_at: datetime

    # Subscriber metrics
    active_subscribers: int
    total_subscribers: int
    new_subscribers_today: int
    churned_subscribers_today: int

    # Session metrics
    active_sessions: int
    sessions_today: int
    total_data_usage_mb: float

    # Infrastructure metrics
    active_nas_devices: int
    active_olts: int
    active_onts: int

    # Financial metrics (optional)
    revenue_today: float | None = None
    outstanding_invoices: float | None = None


class MetricsReportRequest(BaseModel):
    """Request to report metrics to Platform."""

    model_config = ConfigDict()

    metrics: UsageMetrics
    metadata: dict[str, Any] | None = None


class MetricsReportResponse(BaseModel):
    """Response for metrics report."""

    model_config = ConfigDict()

    received: bool
    message: str
    warnings: list[str] | None = None
    errors: list[str] | None = None
    enforcement_action: str | None = None  # "none", "warning", "soft_limit", "hard_limit"


def _extract_subscriber_limit(license_obj: License) -> int | None:
    """Extract max subscriber limit from license features."""
    features = license_obj.features or {}
    feature_list = features.get("features", [])
    for feat in feature_list:
        if isinstance(feat, dict):
            if feat.get("code") == "max_subscribers":
                return feat.get("value")
    if "max_subscribers" in features:
        return features["max_subscribers"]
    return None


@router.post("/report")
async def report_metrics(
    request: MetricsReportRequest,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> MetricsReportResponse:
    """Report usage metrics from ISP to Platform.

    Called periodically by ISP instances to report their usage.
    Platform uses this for:
    - License enforcement (check subscriber limits)
    - Dashboard aggregation
    - Billing calculations
    """
    metrics = request.metrics

    logger.info(
        "Metrics report received: tenant_id=%s active_subscribers=%d active_sessions=%d caller_tenant=%s",
        metrics.tenant_id, metrics.active_subscribers, metrics.active_sessions, service.tenant_id
    )

    # Verify the ISP is reporting for their own tenant
    if service.tenant_id != metrics.tenant_id:
        logger.warning(
            "Metrics tenant mismatch: reported=%s caller=%s",
            metrics.tenant_id, service.tenant_id
        )
        return MetricsReportResponse(
            received=False,
            message="Tenant ID mismatch",
            errors=["Cannot report metrics for other tenants"],
        )

    # Query tenant
    tenant_result = await db.execute(
        select(Tenant).where(Tenant.id == metrics.tenant_id)
    )
    tenant = tenant_result.scalar_one_or_none()

    if not tenant:
        logger.warning("Metrics tenant not found: tenant_id=%s", metrics.tenant_id)
        return MetricsReportResponse(
            received=False,
            message="Tenant not found",
            errors=["Tenant does not exist"],
        )

    # Query active license for this tenant
    license_result = await db.execute(
        select(License).where(
            License.tenant_id == metrics.tenant_id,
            License.status == LicenseStatus.ACTIVE,
        ).order_by(License.created_at.desc()).limit(1)
    )
    license_obj = license_result.scalar_one_or_none()

    warnings: list[str] = []
    errors: list[str] = []
    enforcement_action = "none"

    # Check subscriber limits from license
    max_subscribers = _extract_subscriber_limit(license_obj) if license_obj else None

    if max_subscribers:
        usage_percentage = (metrics.active_subscribers / max_subscribers) * 100

        if metrics.active_subscribers > max_subscribers:
            # Hard limit exceeded
            overage = metrics.active_subscribers - max_subscribers
            errors.append(
                f"EXCEEDED subscriber limit: {metrics.active_subscribers}/{max_subscribers} "
                f"(+{overage} over limit)"
            )
            enforcement_action = "hard_limit"
            logger.error(
                "Subscriber limit exceeded: tenant_id=%s active=%d limit=%d overage=%d",
                metrics.tenant_id, metrics.active_subscribers, max_subscribers, overage
            )
        elif usage_percentage >= 95:
            # Critical warning
            warnings.append(
                f"CRITICAL: {usage_percentage:.1f}% of subscriber limit used "
                f"({metrics.active_subscribers}/{max_subscribers})"
            )
            enforcement_action = "soft_limit"
            logger.warning(
                "Subscriber limit critical: tenant_id=%s usage_percent=%.1f",
                metrics.tenant_id, usage_percentage
            )
        elif usage_percentage >= 90:
            # Warning
            warnings.append(
                f"WARNING: Approaching subscriber limit: "
                f"{metrics.active_subscribers}/{max_subscribers} ({usage_percentage:.1f}%)"
            )
            enforcement_action = "warning"
            logger.warning(
                "Subscriber limit warning: tenant_id=%s usage_percent=%.1f",
                metrics.tenant_id, usage_percentage
            )
        elif usage_percentage >= 80:
            # Info warning
            warnings.append(
                f"INFO: {usage_percentage:.1f}% of subscriber limit used"
            )

    # Check API call limits from tenant quotas
    if tenant.max_api_calls_per_month > 0 and tenant.current_api_calls > 0:
        api_usage_pct = (tenant.current_api_calls / tenant.max_api_calls_per_month) * 100
        if api_usage_pct >= 90:
            warnings.append(
                f"API calls at {api_usage_pct:.1f}% of monthly limit "
                f"({tenant.current_api_calls}/{tenant.max_api_calls_per_month})"
            )

    # Store metrics in TenantUsage for analytics
    # Create a usage record for this reporting period
    usage_record = TenantUsage(
        tenant_id=metrics.tenant_id,
        period_start=metrics.reported_at,
        period_end=metrics.reported_at,  # Point-in-time snapshot
        api_calls=0,  # Not tracked in this report
        storage_gb=0,
        active_users=metrics.active_subscribers,
        bandwidth_gb=metrics.total_data_usage_mb / 1024 if metrics.total_data_usage_mb else 0,
        metrics={
            "active_subscribers": metrics.active_subscribers,
            "total_subscribers": metrics.total_subscribers,
            "new_subscribers_today": metrics.new_subscribers_today,
            "churned_subscribers_today": metrics.churned_subscribers_today,
            "active_sessions": metrics.active_sessions,
            "sessions_today": metrics.sessions_today,
            "total_data_usage_mb": metrics.total_data_usage_mb,
            "active_nas_devices": metrics.active_nas_devices,
            "active_olts": metrics.active_olts,
            "active_onts": metrics.active_onts,
            "revenue_today": metrics.revenue_today,
            "outstanding_invoices": metrics.outstanding_invoices,
            "reported_at": metrics.reported_at.isoformat(),
        },
    )
    db.add(usage_record)

    # Update tenant current usage
    tenant.current_users = metrics.active_subscribers

    await db.commit()

    logger.info(
        "Metrics report stored: tenant_id=%s warnings_count=%d errors_count=%d enforcement=%s",
        metrics.tenant_id, len(warnings), len(errors), enforcement_action
    )

    return MetricsReportResponse(
        received=True,
        message="Metrics recorded successfully",
        warnings=warnings if warnings else None,
        errors=errors if errors else None,
        enforcement_action=enforcement_action,
    )


class HealthReport(BaseModel):
    """Health status report from ISP."""

    model_config = ConfigDict()

    tenant_id: str
    reported_at: datetime
    status: str  # "healthy", "degraded", "unhealthy"

    # Service health
    api_status: str
    radius_status: str
    database_status: str
    redis_status: str

    # System metrics
    cpu_usage_percent: float
    memory_usage_percent: float
    disk_usage_percent: float

    # Versions
    app_version: str
    config_version: str


class HealthReportResponse(BaseModel):
    """Response for health report."""

    model_config = ConfigDict()

    status: str
    message: str
    license_valid: bool = True
    config_update_available: bool = False
    latest_config_version: str | None = None


@router.post("/health")
async def report_health(
    report: HealthReport,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> HealthReportResponse:
    """Report health status from ISP to Platform.

    Called frequently (e.g., every minute) by ISP instances.
    Platform uses this for:
    - Monitoring dashboard
    - Alerting on unhealthy instances
    - Detecting version drift
    """
    logger.info(
        "Health report: tenant_id=%s status=%s app_version=%s config_version=%s caller_tenant=%s",
        report.tenant_id, report.status, report.app_version, report.config_version, service.tenant_id
    )

    # Verify tenant
    if service.tenant_id != report.tenant_id:
        logger.warning(
            "Health tenant mismatch: reported=%s caller=%s",
            report.tenant_id, service.tenant_id
        )
        return HealthReportResponse(
            status="rejected",
            message="Tenant ID mismatch",
            license_valid=False,
        )

    # Query license to check validity
    license_result = await db.execute(
        select(License).where(
            License.tenant_id == report.tenant_id,
            License.status == LicenseStatus.ACTIVE,
        ).order_by(License.created_at.desc()).limit(1)
    )
    license_obj = license_result.scalar_one_or_none()

    license_valid = False
    if license_obj:
        if license_obj.expiry_date is None or license_obj.expiry_date > datetime.now(UTC):
            license_valid = True
        else:
            logger.warning(
                "Health license expired: tenant_id=%s expiry_date=%s",
                report.tenant_id, license_obj.expiry_date.isoformat() if license_obj.expiry_date else None
            )

    # Query tenant to check config version
    tenant_result = await db.execute(
        select(Tenant).where(Tenant.id == report.tenant_id)
    )
    tenant = tenant_result.scalar_one_or_none()

    config_update_available = False
    latest_config_version = None

    if tenant:
        # Compute current config version
        tenant_ts = tenant.updated_at.isoformat() if tenant.updated_at else ""
        license_ts = license_obj.updated_at.isoformat() if license_obj and license_obj.updated_at else ""
        combined = f"{tenant_ts}:{license_ts}"
        latest_config_version = f"v{hashlib.md5(combined.encode()).hexdigest()[:12]}"

        if report.config_version != latest_config_version:
            config_update_available = True
            logger.info(
                "Health config drift: tenant_id=%s reported_version=%s latest_version=%s",
                report.tenant_id, report.config_version, latest_config_version
            )

    # Update activation heartbeat if found
    # This assumes the ISP has an activation token - we update heartbeat by tenant
    activation_result = await db.execute(
        select(Activation).where(
            Activation.tenant_id == report.tenant_id,
            Activation.status == ActivationStatus.ACTIVE,
        ).order_by(Activation.last_heartbeat.desc()).limit(1)
    )
    activation = activation_result.scalar_one_or_none()

    if activation:
        activation.last_heartbeat = datetime.now(UTC)
        activation.application_version = report.app_version
        await db.commit()

    # Trigger alerts if unhealthy
    if report.status == "unhealthy":
        logger.error(
            "Health unhealthy: tenant_id=%s api=%s radius=%s database=%s redis=%s",
            report.tenant_id, report.api_status, report.radius_status,
            report.database_status, report.redis_status
        )
        # TODO: Trigger alerting system

    elif report.status == "degraded":
        logger.warning(
            "Health degraded: tenant_id=%s api=%s radius=%s",
            report.tenant_id, report.api_status, report.radius_status
        )

    # Check for high resource usage
    if report.cpu_usage_percent > 90:
        logger.warning(
            "Health high CPU: tenant_id=%s cpu_percent=%.1f",
            report.tenant_id, report.cpu_usage_percent
        )
    if report.memory_usage_percent > 90:
        logger.warning(
            "Health high memory: tenant_id=%s memory_percent=%.1f",
            report.tenant_id, report.memory_usage_percent
        )
    if report.disk_usage_percent > 90:
        logger.warning(
            "Health high disk: tenant_id=%s disk_percent=%.1f",
            report.tenant_id, report.disk_usage_percent
        )

    return HealthReportResponse(
        status="acknowledged",
        message=f"Health report for {report.tenant_id} recorded",
        license_valid=license_valid,
        config_update_available=config_update_available,
        latest_config_version=latest_config_version,
    )
