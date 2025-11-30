"""
Platform Service API - Internal endpoints for ISP service communication.

These endpoints are called by ISP instances for:
- License validation
- Configuration retrieval
- Metrics reporting
- Event webhooks
"""

from fastapi import APIRouter

from .license_api import router as license_router
from .config_api import router as config_router
from .metrics_api import router as metrics_router
from .webhook_api import router as webhook_router

router = APIRouter(prefix="/api/platform/v1", tags=["Service API"])

router.include_router(license_router)
router.include_router(config_router)
router.include_router(metrics_router)
router.include_router(webhook_router)

__all__ = ["router"]
