"""
License validation API for ISP services.

ISP instances call these endpoints on startup and periodically
to validate their license and retrieve license details.
"""

import hashlib
import json
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dotmac.platform.database import get_async_session
from dotmac.platform.licensing.models import (
    Activation,
    ActivationStatus,
    ActivationType,
    License,
    LicenseStatus,
)
from dotmac.platform.tenant.models import Tenant
from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/license", tags=["License API"])


class LicenseInfo(BaseModel):
    """License information returned to ISP."""

    model_config = ConfigDict()

    license_key: str
    license_id: str
    tenant_id: str
    tenant_name: str
    is_valid: bool
    status: str
    expires_at: datetime | None
    features: dict[str, Any]
    max_subscribers: int | None
    current_subscribers: int | None
    max_activations: int
    current_activations: int


class LicenseValidationRequest(BaseModel):
    """Request body for license validation."""

    model_config = ConfigDict()

    license_key: str
    isp_instance_id: str
    version: str  # ISP app version
    device_fingerprint: str | None = None  # For activation tracking


class LicenseValidationResponse(BaseModel):
    """Response for license validation."""

    model_config = ConfigDict()

    valid: bool
    message: str
    license_info: LicenseInfo | None = None
    config_hash: str | None = None  # For detecting config changes
    activation_token: str | None = None  # If new activation was created


class HeartbeatRequest(BaseModel):
    """Heartbeat request body."""

    model_config = ConfigDict()

    activation_token: str


def _compute_config_hash(tenant: Tenant, license_obj: License) -> str:
    """Compute a stable hash of tenant config + license features for drift detection."""
    config_data = {
        "tenant_id": tenant.id,
        "features": tenant.features,
        "settings": tenant.settings,
        "license_features": license_obj.features,
        "license_restrictions": license_obj.restrictions,
        "plan_type": tenant.plan_type.value if tenant.plan_type else None,
        "updated_at": tenant.updated_at.isoformat() if tenant.updated_at else None,
    }
    config_str = json.dumps(config_data, sort_keys=True, default=str)
    return hashlib.sha256(config_str.encode()).hexdigest()[:16]


def _extract_subscriber_limit(license_obj: License) -> int | None:
    """Extract max subscriber limit from license features."""
    features = license_obj.features or {}
    # Check common feature key patterns
    feature_list = features.get("features", [])
    for feat in feature_list:
        if isinstance(feat, dict):
            if feat.get("code") == "max_subscribers":
                return feat.get("value")
    # Direct key check
    if "max_subscribers" in features:
        return features["max_subscribers"]
    return None


@router.get("/{license_key}")
async def get_license(
    license_key: str,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> LicenseInfo:
    """Get license details by key.

    Called by ISP services to retrieve their license configuration.
    """
    key_prefix = license_key[:8] if len(license_key) > 8 else license_key
    logger.info(
        "License get request: key_prefix=%s tenant_id=%s",
        key_prefix, service.tenant_id
    )

    # Query license by key
    result = await db.execute(
        select(License).where(License.license_key == license_key)
    )
    license_obj = result.scalar_one_or_none()

    if not license_obj:
        logger.warning("License not found: key_prefix=%s", key_prefix)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="License not found",
        )

    # Verify the ISP is requesting their own license (tenant_id from token should match)
    if service.tenant_id and license_obj.tenant_id != service.tenant_id:
        logger.warning(
            "License tenant mismatch: requested=%s caller=%s",
            license_obj.tenant_id, service.tenant_id
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access license for other tenants",
        )

    # Get tenant info
    tenant_result = await db.execute(
        select(Tenant).where(Tenant.id == license_obj.tenant_id)
    )
    tenant = tenant_result.scalar_one_or_none()
    tenant_name = tenant.name if tenant else "Unknown"

    # Determine validity
    is_valid = (
        license_obj.status == LicenseStatus.ACTIVE
        and (license_obj.expiry_date is None or license_obj.expiry_date > datetime.now(UTC))
    )

    max_subscribers = _extract_subscriber_limit(license_obj)

    return LicenseInfo(
        license_key=license_key,
        license_id=license_obj.id,
        tenant_id=license_obj.tenant_id,
        tenant_name=tenant_name,
        is_valid=is_valid,
        status=license_obj.status.value,
        expires_at=license_obj.expiry_date,
        features=license_obj.features,
        max_subscribers=max_subscribers,
        current_subscribers=None,  # Would need to query actual usage
        max_activations=license_obj.max_activations,
        current_activations=license_obj.current_activations,
    )


@router.post("/validate")
async def validate_license(
    request: LicenseValidationRequest,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> LicenseValidationResponse:
    """Validate an ISP license.

    Called by ISP services on startup and periodically to ensure
    their license is still valid. Can also create/refresh activations.
    """
    key_prefix = request.license_key[:8] if len(request.license_key) > 8 else request.license_key
    logger.info(
        "License validate request: key_prefix=%s isp_instance=%s version=%s tenant_id=%s",
        key_prefix, request.isp_instance_id, request.version, service.tenant_id
    )

    # Query license by key
    result = await db.execute(
        select(License).where(License.license_key == request.license_key)
    )
    license_obj = result.scalar_one_or_none()

    if not license_obj:
        logger.warning("License validation failed: not_found key_prefix=%s", key_prefix)
        return LicenseValidationResponse(
            valid=False,
            message="License not found",
        )

    # Verify tenant match
    if service.tenant_id and license_obj.tenant_id != service.tenant_id:
        logger.warning(
            "License validation failed: tenant_mismatch license_tenant=%s caller_tenant=%s",
            license_obj.tenant_id, service.tenant_id
        )
        return LicenseValidationResponse(
            valid=False,
            message="License does not belong to this tenant",
        )

    # Check license status
    if license_obj.status == LicenseStatus.REVOKED:
        logger.warning("License validation failed: revoked license_id=%s", license_obj.id)
        return LicenseValidationResponse(
            valid=False,
            message="License has been revoked",
        )

    if license_obj.status == LicenseStatus.SUSPENDED:
        logger.warning("License validation failed: suspended license_id=%s", license_obj.id)
        return LicenseValidationResponse(
            valid=False,
            message="License is suspended",
        )

    if license_obj.status not in (LicenseStatus.ACTIVE, LicenseStatus.PENDING):
        logger.warning(
            "License validation failed: inactive_status license_id=%s status=%s",
            license_obj.id, license_obj.status.value
        )
        return LicenseValidationResponse(
            valid=False,
            message=f"License is {license_obj.status.value}",
        )

    # Check expiry
    if license_obj.expiry_date and license_obj.expiry_date < datetime.now(UTC):
        # Check grace period
        grace_days = license_obj.grace_period_days or 0
        grace_end = license_obj.expiry_date + timedelta(days=grace_days)

        if datetime.now(UTC) > grace_end:
            logger.warning(
                "License validation failed: expired license_id=%s expiry_date=%s",
                license_obj.id, license_obj.expiry_date.isoformat()
            )
            return LicenseValidationResponse(
                valid=False,
                message="License has expired",
            )
        else:
            logger.warning(
                "License in grace period: license_id=%s grace_ends=%s",
                license_obj.id, grace_end.isoformat()
            )

    # Get tenant for config hash
    tenant_result = await db.execute(
        select(Tenant).where(Tenant.id == license_obj.tenant_id)
    )
    tenant = tenant_result.scalar_one_or_none()

    if not tenant:
        logger.error(
            "License tenant not found: license_id=%s tenant_id=%s",
            license_obj.id, license_obj.tenant_id
        )
        return LicenseValidationResponse(
            valid=False,
            message="Tenant configuration not found",
        )

    # Compute config hash for drift detection
    config_hash = _compute_config_hash(tenant, license_obj)

    # Enforce activation limits even without fingerprint
    if not request.device_fingerprint and license_obj.current_activations >= license_obj.max_activations:
        logger.warning(
            "license.activation_limit_reached_no_fingerprint",
            license_id=license_obj.id,
            max_activations=license_obj.max_activations,
            current_activations=license_obj.current_activations,
        )
        return LicenseValidationResponse(
            valid=False,
            message=f"Activation limit reached ({license_obj.max_activations})",
            config_hash=config_hash,
        )

    # Handle activation tracking if device fingerprint provided
    activation_token: str | None = None
    if request.device_fingerprint:
        # Check for existing activation
        activation_result = await db.execute(
            select(Activation).where(
                Activation.license_id == license_obj.id,
                Activation.device_fingerprint == request.device_fingerprint,
                Activation.status == ActivationStatus.ACTIVE,
            )
        )
        existing_activation = activation_result.scalar_one_or_none()

        if existing_activation:
            # Update heartbeat
            existing_activation.last_heartbeat = datetime.now(UTC)
            existing_activation.application_version = request.version
            activation_token = existing_activation.activation_token
            await db.commit()
            logger.info(
                "Activation heartbeat updated: activation_id=%s license_id=%s",
                existing_activation.id, license_obj.id
            )
        elif license_obj.current_activations < license_obj.max_activations:
            # Create new activation
            new_token = secrets.token_urlsafe(32)
            new_activation = Activation(
                license_id=license_obj.id,
                activation_token=new_token,
                device_fingerprint=request.device_fingerprint,
                machine_name=request.isp_instance_id,
                application_version=request.version,
                activation_type=ActivationType.ONLINE,
                status=ActivationStatus.ACTIVE,
                tenant_id=license_obj.tenant_id,
                last_heartbeat=datetime.now(UTC),
            )
            db.add(new_activation)
            license_obj.current_activations += 1
            await db.commit()
            activation_token = new_token
            logger.info(
                "New activation created: license_id=%s fingerprint=%s current_activations=%d",
                license_obj.id, request.device_fingerprint, license_obj.current_activations
            )
        else:
            logger.warning(
                "Activation limit reached: license_id=%s max=%d current=%d",
                license_obj.id, license_obj.max_activations, license_obj.current_activations
            )
            max_subscribers = _extract_subscriber_limit(license_obj)
            license_info = LicenseInfo(
                license_key=request.license_key,
                license_id=license_obj.id,
                tenant_id=license_obj.tenant_id,
                tenant_name=tenant.name,
                is_valid=False,
                status=license_obj.status.value,
                expires_at=license_obj.expiry_date,
                features=license_obj.features,
                max_subscribers=max_subscribers,
                current_subscribers=None,
                max_activations=license_obj.max_activations,
                current_activations=license_obj.current_activations,
            )
            return LicenseValidationResponse(
                valid=False,
                message="Activation limit reached",
                license_info=license_info,
                config_hash=config_hash,
            )

    # Build license info
    max_subscribers = _extract_subscriber_limit(license_obj)

    license_info = LicenseInfo(
        license_key=request.license_key,
        license_id=license_obj.id,
        tenant_id=license_obj.tenant_id,
        tenant_name=tenant.name,
        is_valid=True,
        status=license_obj.status.value,
        expires_at=license_obj.expiry_date,
        features=license_obj.features,
        max_subscribers=max_subscribers,
        current_subscribers=None,
        max_activations=license_obj.max_activations,
        current_activations=license_obj.current_activations,
    )

    logger.info(
        "License validation success: license_id=%s tenant_id=%s config_hash=%s",
        license_obj.id, license_obj.tenant_id, config_hash
    )

    return LicenseValidationResponse(
        valid=True,
        message="License validated successfully",
        license_info=license_info,
        config_hash=config_hash,
        activation_token=activation_token,
    )


@router.post("/heartbeat")
async def activation_heartbeat(
    request: HeartbeatRequest,
    service: ServiceCredentials = Depends(require_isp_service),
    db: AsyncSession = Depends(get_async_session),
) -> dict[str, str]:
    """Update activation heartbeat.

    Called periodically by ISP instances to indicate they are still running.
    Allows Platform to track active instances and detect stale activations.
    """
    activation_token = request.activation_token
    token_prefix = activation_token[:8] if len(activation_token) > 8 else activation_token
    logger.debug(
        "Heartbeat request: token_prefix=%s tenant_id=%s",
        token_prefix, service.tenant_id
    )

    # Find activation
    result = await db.execute(
        select(Activation).where(
            Activation.activation_token == activation_token,
            Activation.status == ActivationStatus.ACTIVE,
        )
    )
    activation = result.scalar_one_or_none()

    if not activation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activation not found or inactive",
        )

    # Verify tenant ownership
    if service.tenant_id and activation.tenant_id != service.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Activation does not belong to this tenant",
        )

    # Update heartbeat
    activation.last_heartbeat = datetime.now(UTC)
    await db.commit()

    return {"status": "acknowledged", "message": "Heartbeat recorded"}
