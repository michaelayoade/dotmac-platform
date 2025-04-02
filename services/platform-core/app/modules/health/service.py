import logging
from datetime import datetime
from typing import Any, Dict, List

import sqlalchemy as sa
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings

logger = logging.getLogger(__name__)


class HealthService:
    """
    Service for health and readiness checks.
    """

    @staticmethod
    def get_status() -> str:
        """
        Get the current application status.
        """
        return "ok"

    @staticmethod
    def get_version() -> str:
        """
        Get the application version.
        """
        return settings.VERSION

    @staticmethod
    def get_timestamp() -> str:
        """
        Get the current timestamp in ISO format.
        """
        return datetime.utcnow().isoformat()

    @staticmethod
    async def check_db(engine: AsyncSession) -> Dict[str, Any]:
        """
        Check database connectivity.
        """
        try:
            # Execute a simple query to check connectivity
            async with engine.begin() as conn:
                await conn.execute(sa.text("SELECT 1"))

            return {
                "status": "ok",
                "details": {
                    "database": str(engine.url).split("@")[-1],  # Hide credentials
                    "dialect": engine.dialect.name,
                },
            }
        except Exception as e:
            logger.error(f"Database connection check failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
            }

    @staticmethod
    async def check_redis(redis_client: Redis) -> Dict[str, Any]:
        """
        Check Redis connectivity.
        """
        try:
            # Execute a simple command to check connectivity
            await redis_client.ping()

            # Get Redis info if possible
            try:
                info = await redis_client.info()
                version = info.get("redis_version", "unknown")
            except Exception:
                # Some Redis implementations (like fakeredis) might not support info
                version = "unknown (possibly fakeredis)"

            return {
                "status": "ok",
                "details": {
                    "version": version,
                    "implementation": redis_client.__class__.__name__,
                },
            }
        except Exception as e:
            logger.error(f"Redis connection check failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
            }

    @classmethod
    async def check_all_components(cls, engine: AsyncSession, redis_client: Redis) -> List[Dict[str, Any]]:
        """
        Check all components and return their status.
        """
        db_status = await cls.check_db(engine)
        redis_status = await cls.check_redis(redis_client)

        return [
            {"name": "database", **db_status},
            {"name": "redis", **redis_status},
        ]

    @staticmethod
    def get_overall_status(components: List[Dict[str, Any]]) -> str:
        """
        Determine overall status based on component statuses.
        """
        if any(component["status"] == "error" for component in components):
            return "error"

        if any(component["status"] == "warning" for component in components):
            return "warning"

        if all(component["status"] == "ok" for component in components):
            return "ok"

        return "unknown"
