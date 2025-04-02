from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from redis.asyncio import Redis

from app.db.redis import get_redis
from app.db.session import engine
from app.modules.health.models import HealthResponse
from app.modules.health.service import HealthService

router = APIRouter()


@router.get("/healthz", response_model=HealthResponse)
async def health_check():
    """
    Basic liveness probe.
    """
    return HealthResponse(
        status=HealthService.get_status(),
        version=HealthService.get_version(),
        timestamp=HealthService.get_timestamp(),
    )


@router.get("/readyz", response_model=HealthResponse)
async def readiness_check(redis_client: Redis = Depends(get_redis)):
    """
    Readiness probe checking all dependencies.
    """
    components = await HealthService.check_all_components(engine, redis_client)
    overall_status = HealthService.get_overall_status(components)

    return HealthResponse(
        status=overall_status,
        version=HealthService.get_version(),
        timestamp=HealthService.get_timestamp(),
        components=components,
    )


@router.get("/metrics", response_class=PlainTextResponse)
async def metrics():
    """
    Prometheus metrics endpoint.

    Note: In a production setup, this would be implemented using
    prometheus-fastapi-instrumentator or a similar library.
    """
    # Return a basic Prometheus-style metrics response for testing
    metrics_text = """# HELP platform_core_uptime_seconds How long the service has been running
# TYPE platform_core_uptime_seconds gauge
platform_core_uptime_seconds 123.45

# HELP platform_core_requests_total Total number of requests
# TYPE platform_core_requests_total counter
platform_core_requests_total 100
"""
    return metrics_text
