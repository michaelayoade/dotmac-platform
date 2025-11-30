"""
License validation API for ISP services.

ISP instances call these endpoints on startup and periodically
to validate their license and retrieve license details.
"""

from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict

from dotmac.shared.service_auth import (
    ServiceCredentials,
    require_isp_service,
)

router = APIRouter(prefix="/license", tags=["License API"])


class LicenseInfo(BaseModel):
    """License information returned to ISP."""

    model_config = ConfigDict()

    license_key: str
    tenant_id: str
    tenant_name: str
    is_valid: bool
    expires_at: datetime | None
    features: dict[str, Any]  # Feature flags enabled for this license
    max_subscribers: int | None
    current_subscribers: int | None


class LicenseValidationRequest(BaseModel):
    """Request body for license validation."""

    model_config = ConfigDict()

    license_key: str
    isp_instance_id: str
    version: str  # ISP app version


class LicenseValidationResponse(BaseModel):
    """Response for license validation."""

    model_config = ConfigDict()

    valid: bool
    message: str
    license_info: LicenseInfo | None = None
    config_hash: str | None = None  # For detecting config changes


@router.get("/{license_key}")
async def get_license(
    license_key: str,
    service: ServiceCredentials = Depends(require_isp_service),
) -> LicenseInfo:
    """Get license details by key.

    Called by ISP services to retrieve their license configuration.
    """
    # TODO: Implement actual license lookup from database
    # For now, return a placeholder

    # Verify the ISP is requesting their own license
    # (tenant_id from token should match license tenant)

    return LicenseInfo(
        license_key=license_key,
        tenant_id=service.tenant_id or "unknown",
        tenant_name="Demo ISP",
        is_valid=True,
        expires_at=datetime(2025, 12, 31, tzinfo=UTC),
        features={
            "radius_enabled": True,
            "fiber_management": True,
            "field_service": True,
            "customer_portal": True,
            "max_technicians": 10,
        },
        max_subscribers=1000,
        current_subscribers=150,
    )


@router.post("/validate")
async def validate_license(
    request: LicenseValidationRequest,
    service: ServiceCredentials = Depends(require_isp_service),
) -> LicenseValidationResponse:
    """Validate an ISP license.

    Called by ISP services on startup and periodically to ensure
    their license is still valid.
    """
    # TODO: Implement actual license validation
    # 1. Check license exists in database
    # 2. Check license is not expired
    # 3. Check license tenant matches requesting ISP
    # 4. Update last_validated timestamp
    # 5. Return license info and current config hash

    # Placeholder implementation
    if not request.license_key.startswith("lic_"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid license key format",
        )

    return LicenseValidationResponse(
        valid=True,
        message="License validated successfully",
        license_info=LicenseInfo(
            license_key=request.license_key,
            tenant_id=service.tenant_id or "unknown",
            tenant_name="Demo ISP",
            is_valid=True,
            expires_at=datetime(2025, 12, 31, tzinfo=UTC),
            features={
                "radius_enabled": True,
                "fiber_management": True,
                "field_service": True,
            },
            max_subscribers=1000,
            current_subscribers=150,
        ),
        config_hash="abc123def456",  # Hash of current config for change detection
    )
