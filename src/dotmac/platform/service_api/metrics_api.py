"""
Metrics reporting API for ISP services.

ISP instances report usage metrics to Platform for:
- License enforcement (subscriber counts)
- Analytics and dashboards
- Billing calculations
"""

from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict

from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

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
    warnings: list[str] | None = None  # Any warnings (e.g., approaching limits)


@router.post("/report")
async def report_metrics(
    request: MetricsReportRequest,
    service: ServiceCredentials = Depends(require_isp_service),
) -> MetricsReportResponse:
    """Report usage metrics from ISP to Platform.

    Called periodically by ISP instances to report their usage.
    Platform uses this for:
    - License enforcement (check subscriber limits)
    - Dashboard aggregation
    - Billing calculations
    """
    metrics = request.metrics

    # Verify the ISP is reporting for their own tenant
    if service.tenant_id != metrics.tenant_id:
        return MetricsReportResponse(
            received=False,
            message="Tenant ID mismatch",
        )

    # TODO: Store metrics in time-series database
    # TODO: Check against license limits and generate warnings

    warnings = []

    # Example: Check subscriber limits
    # This would be fetched from the license in production
    max_subscribers = 1000
    if metrics.active_subscribers > max_subscribers * 0.9:
        warnings.append(
            f"Approaching subscriber limit: {metrics.active_subscribers}/{max_subscribers}"
        )

    if metrics.active_subscribers > max_subscribers:
        warnings.append(
            f"EXCEEDED subscriber limit: {metrics.active_subscribers}/{max_subscribers}"
        )

    return MetricsReportResponse(
        received=True,
        message="Metrics recorded successfully",
        warnings=warnings if warnings else None,
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


@router.post("/health")
async def report_health(
    report: HealthReport,
    service: ServiceCredentials = Depends(require_isp_service),
) -> dict[str, str]:
    """Report health status from ISP to Platform.

    Called frequently (e.g., every minute) by ISP instances.
    Platform uses this for:
    - Monitoring dashboard
    - Alerting on unhealthy instances
    - Detecting version drift
    """
    # Verify tenant
    if service.tenant_id != report.tenant_id:
        return {"status": "rejected", "message": "Tenant ID mismatch"}

    # TODO: Store health status
    # TODO: Trigger alerts if unhealthy
    # TODO: Check for version updates needed

    return {
        "status": "acknowledged",
        "message": f"Health report for {report.tenant_id} recorded",
    }
