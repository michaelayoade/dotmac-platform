"""
Configuration API for ISP services.

Platform pushes configuration updates to ISP instances,
and ISP instances can pull their configuration on demand.
"""

from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict

from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

router = APIRouter(prefix="/config", tags=["Config API"])


class TenantConfig(BaseModel):
    """Tenant configuration returned to ISP."""

    model_config = ConfigDict()

    tenant_id: str
    tenant_name: str
    config_version: str
    updated_at: datetime

    # RADIUS settings
    radius: dict[str, Any]

    # Billing settings
    billing: dict[str, Any]

    # Feature flags
    features: dict[str, bool]

    # Branding
    branding: dict[str, Any]


@router.get("/{tenant_id}")
async def get_tenant_config(
    tenant_id: str,
    service: ServiceCredentials = Depends(require_isp_service),
) -> TenantConfig:
    """Get tenant configuration.

    Called by ISP services to retrieve their tenant-specific settings.
    """
    # Verify the ISP is requesting their own config
    if service.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access configuration for other tenants",
        )

    # TODO: Implement actual config lookup from database
    # For now, return a placeholder

    return TenantConfig(
        tenant_id=tenant_id,
        tenant_name="Demo ISP",
        config_version="v2024.11.29.001",
        updated_at=datetime.now(UTC),
        radius={
            "nas_identifier": "demo-isp-nas",
            "default_session_timeout": 86400,
            "default_idle_timeout": 1800,
            "coa_port": 3799,
            "accounting_interim_interval": 300,
        },
        billing={
            "currency": "USD",
            "tax_rate": 0.0,
            "invoice_due_days": 14,
            "dunning_enabled": True,
            "payment_methods": ["stripe", "paystack"],
        },
        features={
            "fiber_management": True,
            "wireless_management": True,
            "field_service": True,
            "customer_portal": True,
            "sms_notifications": True,
            "email_notifications": True,
        },
        branding={
            "company_name": "Demo ISP",
            "primary_color": "#1976d2",
            "logo_url": "https://example.com/logo.png",
            "support_email": "support@demo-isp.com",
            "support_phone": "+1-555-0123",
        },
    )


class ConfigSyncRequest(BaseModel):
    """Request to sync configuration from Platform."""

    model_config = ConfigDict()

    current_version: str | None = None  # Current config version on ISP


class ConfigSyncResponse(BaseModel):
    """Response for config sync."""

    model_config = ConfigDict()

    needs_update: bool
    config: TenantConfig | None = None


@router.post("/{tenant_id}/sync")
async def sync_tenant_config(
    tenant_id: str,
    request: ConfigSyncRequest,
    service: ServiceCredentials = Depends(require_isp_service),
) -> ConfigSyncResponse:
    """Check if config needs sync and return updated config if needed.

    ISP services call this periodically to check for config updates.
    """
    # Verify the ISP is requesting their own config
    if service.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot sync configuration for other tenants",
        )

    # TODO: Compare versions and return config if updated
    current_version = "v2024.11.29.001"

    if request.current_version == current_version:
        return ConfigSyncResponse(needs_update=False, config=None)

    # Config has changed, return the full config
    config = await get_tenant_config(tenant_id, service)
    return ConfigSyncResponse(needs_update=True, config=config)
