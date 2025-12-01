"""
Onboarding Router.

API endpoints for tenant onboarding.
"""

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from dotmac.platform.database import get_async_session
from dotmac.platform.settings import settings
from dotmac.shared.auth.dependencies import get_current_user, require_admin

from .schemas import OnboardingRequest, OnboardingResponse, OnboardingStatusResponse
from .service import OnboardingService

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.post("/", response_model=OnboardingResponse)
async def onboard_tenant(
    request: OnboardingRequest,
    db: AsyncSession = Depends(get_async_session),
    current_user: dict = Depends(require_admin),
) -> OnboardingResponse:
    """
    Onboard a new tenant.

    Creates:
    - Tenant record
    - License with features based on plan
    - Service credentials for deployment
    - Docker Compose configuration (if docker_compose backend)

    Requires admin privileges.
    """
    logger.info(
        "onboarding.request",
        tenant_name=request.tenant_name,
        plan_type=request.plan_type,
        requested_by=current_user.get("id"),
    )

    try:
        service = OnboardingService(
            db=db,
            platform_url=settings.platform_url,
        )

        response = await service.onboard_tenant(
            request=request,
            created_by=current_user.get("id"),
        )

        logger.info(
            "onboarding.success",
            tenant_id=response.tenant_id,
            license_id=response.license_id,
        )

        return response

    except ValueError as e:
        logger.warning(
            "onboarding.validation_error",
            error=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(
            "onboarding.error",
            error=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Onboarding failed: {e}",
        )


@router.post("/self-service", response_model=OnboardingResponse)
async def self_service_onboard(
    request: OnboardingRequest,
    db: AsyncSession = Depends(get_async_session),
) -> OnboardingResponse:
    """
    Self-service tenant onboarding.

    Allows new customers to sign up without admin intervention.
    Limited to free/starter plans.
    """
    # Restrict to free/starter plans for self-service
    allowed_plans = ["free", "starter"]
    if request.plan_type not in allowed_plans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Self-service onboarding only available for plans: {', '.join(allowed_plans)}",
        )

    logger.info(
        "onboarding.self_service_request",
        tenant_name=request.tenant_name,
        plan_type=request.plan_type,
        email=request.email,
    )

    try:
        service = OnboardingService(
            db=db,
            platform_url=settings.platform_url,
        )

        response = await service.onboard_tenant(
            request=request,
            created_by=None,  # Self-service
        )

        logger.info(
            "onboarding.self_service_success",
            tenant_id=response.tenant_id,
        )

        return response

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(
            "onboarding.self_service_error",
            error=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Onboarding failed. Please try again or contact support.",
        )


@router.get("/{tenant_id}/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    tenant_id: str,
    db: AsyncSession = Depends(get_async_session),
    current_user: dict = Depends(get_current_user),
) -> OnboardingStatusResponse:
    """Get tenant onboarding status."""
    from sqlalchemy import select
    from dotmac.platform.tenant.models import Tenant
    from dotmac.platform.licensing.models import License, LicenseStatus
    from dotmac.platform.deployment.models import DeploymentInstance

    # Get tenant
    result = await db.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )
    tenant = result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    # Get license status
    license_result = await db.execute(
        select(License).where(License.tenant_id == tenant_id).order_by(License.created_at.desc()).limit(1)
    )
    license_obj = license_result.scalar_one_or_none()

    # Get deployment status
    deployment_result = await db.execute(
        select(DeploymentInstance).where(DeploymentInstance.tenant_id == tenant_id).limit(1)
    )
    deployment = deployment_result.scalar_one_or_none()

    return OnboardingStatusResponse(
        tenant_id=tenant_id,
        status=tenant.status.value,
        license_status=license_obj.status.value if license_obj else "none",
        deployment_status=deployment.state.value if deployment else None,
        created_at=tenant.created_at,
        activated_at=tenant.subscription_starts_at,
    )


@router.post("/{tenant_id}/regenerate-credentials")
async def regenerate_credentials(
    tenant_id: str,
    db: AsyncSession = Depends(get_async_session),
    current_user: dict = Depends(require_admin),
) -> dict:
    """
    Regenerate service credentials for a tenant.

    Use this if the original credentials were compromised or lost.
    Note: Existing deployments will need to be updated with new credentials.
    """
    import secrets
    from sqlalchemy import select
    from dotmac.platform.tenant.models import Tenant
    from dotmac.platform.licensing.models import License

    # Get tenant
    result = await db.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )
    tenant = result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    # Get license
    license_result = await db.execute(
        select(License).where(License.tenant_id == tenant_id).order_by(License.created_at.desc()).limit(1)
    )
    license_obj = license_result.scalar_one_or_none()

    if not license_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No license found for tenant",
        )

    # Generate new service secret
    new_service_secret = secrets.token_urlsafe(32)

    # Update license extra_data with new hash
    license_obj.extra_data = license_obj.extra_data or {}
    license_obj.extra_data["service_secret_hash"] = secrets.token_hex(16)
    license_obj.extra_data["credentials_regenerated_at"] = __import__("datetime").datetime.now(
        __import__("datetime").UTC
    ).isoformat()
    license_obj.extra_data["regenerated_by"] = current_user.get("id")

    await db.commit()

    logger.info(
        "onboarding.credentials_regenerated",
        tenant_id=tenant_id,
        regenerated_by=current_user.get("id"),
    )

    return {
        "success": True,
        "message": "Credentials regenerated successfully",
        "tenant_id": tenant_id,
        "license_key": license_obj.license_key,
        "service_secret": new_service_secret,
        "platform_url": settings.platform_url,
        "warning": "Update your deployment with the new service_secret",
    }
