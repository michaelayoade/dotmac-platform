import logging
from urllib.parse import urlparse

import redis.asyncio as redis
from app.core.config import settings
from fastapi import HTTPException
from redis.asyncio.connection import ConnectionPool

logger = logging.getLogger(__name__)


class RedisClient:
    pool: ConnectionPool
    _client: redis.Redis

    def __init__(self, redis_url: str):
        """Initializes the Redis connection pool."""
        if not redis_url:
            raise ValueError("Redis URL cannot be empty")
        try:
            self.pool = ConnectionPool.from_url(
                url=redis_url,
                decode_responses=True,
                encoding="utf-8",
            )
        except Exception as e:
            logger.error(f"Failed to create Redis connection pool: {e}")
            raise

    async def ping(self):
        return await self._client.ping()

    async def get_client(self) -> redis.Redis:
        """Gets an active Redis client from the pool."""
        if not hasattr(self, "_client") or self._client is None:
            self._client = redis.Redis(connection_pool=self.pool)
        return self._client


redis_pool: redis.Redis | None = None


async def initialize_redis_pool():
    """Redis connection pool instance."""
    global redis_pool
    if redis_pool is None:
        redis_url = str(settings.CACHE.REDIS_URL)
        logger.info(f"Initializing Redis pool for URL: {redis_url}")
        # Parse URL safely
        pool_url = redis_url.replace("+sentinel", "")
        if "+sentinel" in redis_url:
            # If using Sentinel, need to extract master name and sentinel hosts
            # Example URL:
            # redis+sentinel://:password@host1:port1,host2:port2/master_name
            parsed_url = urlparse(redis_url)
            # Get the host:port part after the @ symbol
            sentinels_str = parsed_url.netloc.split("@")[1]
            master_name = parsed_url.path.strip("/")
            password = parsed_url.password
            # Create sentinel connection
            sentinels = [
                (s.split(":")[0], int(s.split(":")[1]))
                for s in sentinels_str.split(",")
            ]
            sentinel = redis.asyncio.Sentinel(
                sentinels,
                socket_timeout=0.1,
                password=password,
            )
            redis_pool = sentinel.master_for(
                master_name, decode_responses=True
            )
            logger.info(
                f"Redis Sentinel pool initialized for master '{master_name}'"
                f"using sentinels: {sentinels_str}"
            )
        else:
            redis_pool = redis.asyncio.from_url(
                pool_url,
                encoding="utf-8",
                decode_responses=True,
                health_check_interval=30,  # Check connection every 30s
            )
            logger.info(
                f"Standard Redis pool initialized from URL: {pool_url}"
            )

        # Test connection immediately after creation
        try:
            async with redis_pool.client() as client:
                await client.ping()
            logger.info("Redis connection successful.")
        except redis.exceptions.ConnectionError as e:
            logger.error(
                f"Failed to connect to Redis at {redis_url} "
                f"during pool initialization: {e}"
            )
            # Optionally re-raise or handle based on application requirements
            # raise  # Uncomment to prevent startup if Redis is down
        except redis.exceptions.AuthenticationError as e:
            logger.error(
                f"Redis authentication failed for URL: {redis_url}. Error: {e}"
            )
            # raise # Uncomment to prevent startup on auth failure
        except Exception as e:
            logger.error(
                f"An unexpected error occurred during Redis pool init for "
                f"{redis_url}: {e}",
                exc_info=True,
            )
            # raise


async def close_redis_pool():
    """Closes the Redis connection pool."""
    global redis_pool
    if redis_pool:
        try:
            await redis_pool.close()
            logger.info("Closed Redis connection pool.")
        except Exception as e:
            logger.error(f"Error closing Redis pool: {e}")
        redis_pool = None


# For use as a FastAPI dependency
async def get_redis() -> redis.Redis:
    """Returns a Redis client from the pool."""
    # Ensure pool is initialized
    # (important if app startup event doesn't run first)
    if redis_pool is None:
        await initialize_redis_pool()

    if redis_pool is None:
        raise HTTPException(
            status_code=503, detail="Redis service unavailable."
        )

    async with redis_pool.client() as client:
        try:
            # Optional: verify connection before yielding
            # await client.ping()
            yield client
        except Exception as e:
            logger.error(f"Failed to yield Redis client: {e}")
            raise HTTPException(
                status_code=503, detail="Redis connection error."
            )
