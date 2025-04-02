import logging
from typing import Optional

import redis.asyncio as redis
from redis.asyncio.client import Redis
from redis.exceptions import RedisError

from app.core.config import settings

logger = logging.getLogger(__name__)


class RedisClient:
    """
    Asynchronous Redis client manager using redis.asyncio.
    Manages a connection pool and provides access to the Redis client.
    """

    _redis_client: Optional[Redis] = None
    _pool: Optional[redis.ConnectionPool] = None

    @classmethod
    async def initialize(cls):
        """Initialize the Redis connection pool and client."""
        if cls._redis_client is not None:
            logger.warning("Redis client already initialized.")
            return

        try:
            logger.info(f"Initializing Redis connection pool for URL: {settings.CACHE.REDIS_URL}")
            # Use ConnectionPool for efficient connection management
            cls._pool = redis.ConnectionPool.from_url(
                str(settings.CACHE.REDIS_URL),  # Ensure URL is a string
                decode_responses=True,  # Automatically decode responses to strings
                max_connections=10,  # Example: configure pool size
            )
            cls._redis_client = Redis(connection_pool=cls._pool)
            # Test the connection
            await cls._redis_client.ping()
            logger.info("Successfully connected to Redis and pinged server.")
        except RedisError as e:
            logger.error(f"Failed to initialize Redis connection: {e}", exc_info=True)
            # Depending on the application's needs, you might want to raise the error
            # or handle it gracefully (e.g., operate without cache).
            cls._redis_client = None  # Ensure client is None if initialization fails
            cls._pool = None
            # raise  # Optionally re-raise the exception
        except Exception as e:
            logger.error(
                f"An unexpected error occurred during Redis initialization: {e}",
                exc_info=True,
            )
            cls._redis_client = None
            cls._pool = None
            # raise

    @classmethod
    async def close(cls):
        """Close the Redis client and connection pool gracefully."""
        if cls._redis_client:
            try:
                await cls._redis_client.aclose()  # Use aclose() for async client
                logger.info("Redis connection pool closed.")
                cls._redis_client = None
            except Exception as e:
                logger.error(f"Error closing Redis connection pool: {e}")
        else:
            logger.warning("Attempted to close Redis client, but it was not initialized.")

        if cls._pool:
            try:
                await cls._pool.disconnect()  # Disconnect the pool
                logger.info("Redis connection pool disconnected.")
            except RedisError as e:
                logger.error(f"Error disconnecting Redis pool: {e}", exc_info=True)
            finally:
                cls._pool = None
        else:
            logger.warning("Attempted to disconnect Redis pool, but it was not initialized.")

    @classmethod
    def get_client(cls) -> Optional[Redis]:
        """Get the initialized Redis client instance."""
        if cls._redis_client is None:
            logger.error("Redis client accessed before initialization or after failure.")
            # Depending on requirements, you could raise an error or return None
            # raise RuntimeError("Redis client is not initialized.")
        return cls._redis_client


# Example of how to use the client (e.g., in a service or endpoint)
async def example_redis_usage():
    redis_conn = RedisClient.get_client()
    if redis_conn:
        try:
            await redis_conn.set("mykey", "myvalue", ex=60)  # Set with 60s expiry
            value = await redis_conn.get("mykey")
            logger.info(f"Got value from Redis: {value}")
            return value
        except RedisError as e:
            logger.error(f"Redis operation failed: {e}")
    return None
