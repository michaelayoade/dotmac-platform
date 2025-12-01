"""
Configuration API for ISP services.

Platform pushes configuration updates to ISP instances,
and ISP instances can pull their configuration on demand.
"""

import hashlib
from datetime import UTC, datetime
from typing import Any

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dotmac.platform.database import get_async_session
from dotmac.platform.licensing.models import License, LicenseStatus
from dotmac.platform.tenant.models import Tenant, TenantSetting
from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

logger = structlog.get_logger(__name__)

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

    # License info
    license_features: dict[str, Any]
    license_restrictions: dict[str, Any]

    # Plan limits
    limits: dict[str, Any]


def _compute_config_version(tenant: Tenant, license_obj: License | None) -> str:
    """Compute a version string based on tenant and license update times."""
    tenant_ts = tenant.updated_at.isoformat() if tenant.updated_at else ""
    license_ts = license_obj.updated_at.isoformat() if license_obj and license_obj.updated_at else ""
    combined = f"{tenant_ts}:{license_ts}"
    return f"v{hashlib.md5(combined.encode()).hexdigest()[:12]}"


def _build_tenant_config(tenant: Tenant, license_obj: License | None, settings_map: dict[str, str]) -> TenantConfig:
    """Build TenantConfig from database models."""
    # Extract RADIUS settings from tenant settings or use defaults
    radius_config = {
        "nas_identifier": settings_map.get("radius.nas_identifier", f"{tenant.slug}-nas"),
        "default_session_timeout": int(settings_map.get("radius.session_timeout", "86400")),
        "default_idle_timeout": int(settings_map.get("radius.idle_timeout", "1800")),
        "coa_port": int(settings_map.get("radius.coa_port", "3799")),
        "accounting_interim_interval": int(settings_map.get("radius.interim_interval", "300")),
    }

    # Extract billing settings
    billing_config = {
        "currency": settings_map.get("billing.currency", "USD"),
        "tax_rate": float(settings_map.get("billing.tax_rate", "0.0")),
        "invoice_due_days": int(settings_map.get("billing.invoice_due_days", "14")),
        "dunning_enabled": settings_map.get("billing.dunning_enabled", "true").lower() == "true",
        "payment_methods": settings_map.get("billing.payment_methods", "stripe").split(","),
    }

    # Extract features from tenant.features and license
    tenant_features = tenant.features or {}
    license_features = license_obj.features if license_obj else {}

    # Combine feature flags
    features = {
        "fiber_management": tenant_features.get("fiber_management", False),
        "wireless_management": tenant_features.get("wireless_management", False),
        "field_service": tenant_features.get("field_service", False),
        "customer_portal": tenant_features.get("customer_portal", True),
        "sms_notifications": tenant_features.get("sms_notifications", False),
        "email_notifications": tenant_features.get("email_notifications", True),
        "radius_enabled": tenant_features.get("radius_enabled", True),
        "voltha_enabled": tenant_features.get("voltha_enabled", False),
        "genieacs_enabled": tenant_features.get("genieacs_enabled", False),
    }

    # Override with license features if present
    for feat in license_features.get("features", []):
        if isinstance(feat, dict) and "code" in feat:
            feat_code = feat["code"]
            feat_value = feat.get("value", True)
            if isinstance(feat_value, bool):
                features[feat_code] = feat_value

    # Branding
    branding = {
        "company_name": tenant.name,
        "primary_color": tenant.primary_color or "#1976d2",
        "logo_url": tenant.logo_url,
        "support_email": tenant.email or settings_map.get("support.email"),
        "support_phone": tenant.phone or settings_map.get("support.phone"),
        "timezone": tenant.timezone,
    }

    # Limits from tenant quotas
    limits = {
        "max_users": tenant.max_users,
        "max_api_calls_per_month": tenant.max_api_calls_per_month,
        "max_storage_gb": tenant.max_storage_gb,
    }

    # Add license-based limits
    if license_obj:
        limits["max_activations"] = license_obj.max_activations
        for feat in license_obj.features.get("features", []):
            if isinstance(feat, dict) and feat.get("code") == "max_subscribers":
                limits["max_subscribers"] = feat.get("value")

    config_version = _compute_config_version(tenant, license_obj)

    return TenantConfig(
        tenant_id=tenant.id,
        tenant_name=tenant.name,
        config_version=config_version,
        updated_at=tenant.updated_at or datetime.now(UTC),
        radius=radius_config,
        billing=billing_config,
        features=features,
        branding=branding,
        license_features=license_obj.features if license_obj else {},
        license_restrictions=license_obj.restrictions if license_obj else {},
        limits=limits,
    )


@router.get("/{tenant_id}")
async def get_tenant_config(
    tenant_id: str,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> TenantConfig:
    """Get tenant configuration.

    Called by ISP services to retrieve their tenant-specific settings.
    """
    logger.info(
        "Config get request: tenant_id=%s caller_tenant=%s",
        tenant_id, service.tenant_id
    )

    # Verify the ISP is requesting their own config
    if service.tenant_id != tenant_id:
        logger.warning(
            "Config access denied: requested=%s caller=%s",
            tenant_id, service.tenant_id
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access configuration for other tenants",
        )

    # Query tenant
    result = await db.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )
    tenant = result.scalar_one_or_none()

    if not tenant:
        logger.warning("Config tenant not found: tenant_id=%s", tenant_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    # Query tenant settings
    settings_result = await db.execute(
        select(TenantSetting).where(TenantSetting.tenant_id == tenant_id)
    )
    settings = settings_result.scalars().all()
    settings_map = {s.key: s.value for s in settings}

    # Query active license for this tenant
    license_result = await db.execute(
        select(License).where(
            License.tenant_id == tenant_id,
            License.status == LicenseStatus.ACTIVE,
        ).order_by(License.created_at.desc()).limit(1)
    )
    license_obj = license_result.scalar_one_or_none()

    config = _build_tenant_config(tenant, license_obj, settings_map)

    logger.info(
        "Config get success: tenant_id=%s config_version=%s",
        tenant_id, config.config_version
    )

    return config


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
    db: AsyncSession = Depends(get_async_session),
) -> ConfigSyncResponse:
    """Check if config needs sync and return updated config if needed.

    ISP services call this periodically to check for config updates.
    """
    logger.info(
        "Config sync request: tenant_id=%s current_version=%s caller_tenant=%s",
        tenant_id, request.current_version, service.tenant_id
    )

    # Verify the ISP is requesting their own config
    if service.tenant_id != tenant_id:
        logger.warning(
            "Config sync access denied: requested=%s caller=%s",
            tenant_id, service.tenant_id
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot sync configuration for other tenants",
        )

    # Query tenant
    result = await db.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )
    tenant = result.scalar_one_or_none()

    if not tenant:
        logger.warning("Config sync tenant not found: tenant_id=%s", tenant_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    # Query active license
    license_result = await db.execute(
        select(License).where(
            License.tenant_id == tenant_id,
            License.status == LicenseStatus.ACTIVE,
        ).order_by(License.created_at.desc()).limit(1)
    )
    license_obj = license_result.scalar_one_or_none()

    # Compute current version
    current_version = _compute_config_version(tenant, license_obj)

    # Check if version matches
    if request.current_version == current_version:
        logger.debug(
            "Config sync no update needed: tenant_id=%s version=%s",
            tenant_id, current_version
        )
        return ConfigSyncResponse(needs_update=False, config=None)

    # Config has changed, return the full config
    settings_result = await db.execute(
        select(TenantSetting).where(TenantSetting.tenant_id == tenant_id)
    )
    settings = settings_result.scalars().all()
    settings_map = {s.key: s.value for s in settings}

    config = _build_tenant_config(tenant, license_obj, settings_map)

    logger.info(
        "Config sync update provided: tenant_id=%s old_version=%s new_version=%s",
        tenant_id, request.current_version, config.config_version
    )

    return ConfigSyncResponse(needs_update=True, config=config)
