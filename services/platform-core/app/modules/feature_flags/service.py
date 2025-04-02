import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import redis
from sqlalchemy.ext.asyncio import AsyncSession

from .models import FeatureFlag, FeatureFlagCreate, FeatureFlagUpdate

logger = logging.getLogger(__name__)

# Redis key prefix for feature flags
FEATURE_FLAG_CACHE_PREFIX = "feature_flag:"
# Cache TTL (e.g., 5 minutes)
FEATURE_FLAG_CACHE_TTL = timedelta(minutes=5)


class FeatureFlagsService:
    """Service layer for managing feature flags and their evaluation."""

    @staticmethod
    def _get_cache_key(flag_key: str) -> str:
        return f"{FEATURE_FLAG_CACHE_PREFIX}{flag_key}"

    # --- Flag CRUD Operations ---

    @staticmethod
    async def create_feature_flag(
        db: AsyncSession, redis_client: redis.Redis, flag_in: FeatureFlagCreate
    ) -> FeatureFlag:
        """Creates a new feature flag."""
        result = await db.execute(FeatureFlag.__table__.select().where(FeatureFlag.key == flag_in.key))
        existing = result.scalar_one_or_none()

        if existing:
            raise ValueError(f"Feature flag with key '{flag_in.key}' already exists.")

        db_flag = FeatureFlag(**flag_in.dict())
        db.add(db_flag)
        await db.commit()
        await db.refresh(db_flag)
        logger.info(f"Feature flag created: Key='{db_flag.key}', ID={db_flag.id}")

        # Invalidate cache (though unlikely to exist)
        await FeatureFlagsService.invalidate_cache(redis_client, db_flag.key)
        return db_flag

    @staticmethod
    async def get_feature_flag_by_key(db: AsyncSession, flag_key: str) -> Optional[FeatureFlag]:
        """Retrieves a feature flag by its key."""
        result = await db.execute(FeatureFlag.__table__.select().where(FeatureFlag.key == flag_key))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_feature_flags(
        db: AsyncSession,
        is_active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[FeatureFlag]:
        """Retrieves a list of feature flags."""
        query = FeatureFlag.__table__.select()

        if is_active is not None:
            query = query.where(FeatureFlag.is_enabled == is_active)

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def update_feature_flag(
        db: AsyncSession,
        redis_client: redis.Redis,
        flag_key: str,
        flag_update: FeatureFlagUpdate,
    ) -> Optional[FeatureFlag]:
        """Updates an existing feature flag."""
        db_flag = await FeatureFlagsService.get_feature_flag_by_key(db, flag_key)
        if not db_flag:
            return None

        update_data = flag_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_flag, key, value)

        await db.commit()
        await db.refresh(db_flag)
        logger.info(f"Feature flag updated: Key='{db_flag.key}', Changes={update_data}")

        # Invalidate cache if relevant fields changed
        if "is_enabled" in update_data or "targeting_rules" in update_data:
            await FeatureFlagsService.invalidate_cache(redis_client, flag_key)

        return db_flag

    @staticmethod
    async def delete_feature_flag(db: AsyncSession, key: str) -> bool:
        """Deletes a feature flag."""
        db_flag = await FeatureFlagsService.get_feature_flag_by_key(db, key)
        if not db_flag:
            return False

        await db.delete(db_flag)
        await db.commit()
        logger.info(f"Feature flag deleted: Key='{key}'")
        return True

    # --- Flag Evaluation Logic ---

    @staticmethod
    async def is_feature_enabled(
        db: AsyncSession,
        redis_client: redis.Redis,
        flag_key: str,
        context: Dict[str, Any],
    ) -> bool:
        """Checks if a feature flag is enabled for the given context."""
        # 1. Check Cache
        cached_flag = await FeatureFlagsService._get_flag_from_cache(redis_client, flag_key)
        if cached_flag is not None:
            logger.debug(f"Cache hit for feature flag '{flag_key}'")
            # Evaluate rules based on cached data
            return FeatureFlagsService._evaluate_rules(
                globally_enabled=cached_flag["is_enabled"],
                rules=cached_flag.get("targeting_rules"),
                context=context,
            )

        # 2. Cache miss - Fetch from DB
        logger.debug(f"Cache miss for feature flag '{flag_key}'. Fetching from DB.")
        db_flag = await FeatureFlagsService.get_feature_flag_by_key(db, flag_key)

        if not db_flag:
            # Flag doesn't exist
            logger.warning(f"Feature flag '{flag_key}' not found during evaluation.")
            raise ValueError(f"Feature flag '{flag_key}' not found.")

        # 3. Evaluate Rules
        is_enabled = FeatureFlagsService._evaluate_rules(
            globally_enabled=db_flag.is_enabled,
            rules=db_flag.targeting_rules,
            context=context,
        )

        # 4. Update Cache
        await FeatureFlagsService._cache_flag(redis_client, db_flag)

        return is_enabled

    @staticmethod
    def _evaluate_rules(
        globally_enabled: bool,
        rules: Optional[Dict[str, Any]],
        context: Dict[str, Any],
    ) -> bool:
        """Evaluates targeting rules against the provided context."""
        if not globally_enabled:
            return False  # If globally disabled, rules don't matter

        if not rules:
            # No specific rules, default to globally enabled state
            return True

        # Simple rule evaluation (example: check user_id or group_id)
        user_id = context.get("user_id")
        group_id = context.get("group_id")

        # Check user targeting
        allowed_users = rules.get("allowed_users", [])
        if user_id and user_id in allowed_users:
            return True

        # Check group targeting
        allowed_groups = rules.get("allowed_groups", [])
        if group_id and group_id in allowed_groups:
            return True

        # Check percentage rollout (simple example)
        percentage = rules.get("percentage")
        if percentage is not None and user_id:
            # Basic hash-based rollout (needs a stable hashing function)
            import hashlib

            user_hash = int(hashlib.md5(user_id.encode()).hexdigest(), 16)
            if (user_hash % 100) < percentage:
                return True

        # If no rules matched, and the flag is globally enabled BUT has rules,
        # it means the user doesn't fit the specific targeting.
        # Default to false.
        return False

    @staticmethod
    def _compare_values(context_value: Any, operator: str, target_value: Any) -> bool:
        """
        Compare values using the specified operator.

        Args:
            context_value: Value from the context
            operator: Comparison operator
            target_value: Value to compare against

        Returns:
            Result of the comparison
        """
        if operator == "eq":
            return context_value == target_value
        elif operator == "ne":
            return context_value != target_value
        elif operator == "gt":
            return context_value > target_value
        elif operator == "lt":
            return context_value < target_value
        elif operator == "ge":
            return context_value >= target_value
        elif operator == "le":
            return context_value <= target_value
        elif operator == "in":
            return context_value in target_value
        elif operator == "not_in":
            return context_value not in target_value
        elif operator == "contains":
            return target_value in context_value
        elif operator == "not_contains":
            return target_value not in context_value
        else:
            logger.warning(f"Unknown operator: {operator}")
            return False

    # --- Cache Management ---

    @staticmethod
    async def _get_flag_from_cache(redis_client: redis.Redis, flag_key: str) -> Optional[Dict]:
        """Retrieves flag data from Redis cache."""
        cache_key = FeatureFlagsService._get_cache_key(flag_key)
        try:
            cached_data = await redis_client.get(cache_key)
            if cached_data:
                import json

                return json.loads(cached_data)
        except redis.RedisError as e:
            logger.error(f"Redis error getting cache for '{flag_key}': {e}")
        return None

    @staticmethod
    async def _cache_flag(redis_client: redis.Redis, flag: FeatureFlag):
        """Stores flag data in Redis cache."""
        cache_key = FeatureFlagsService._get_cache_key(flag.key)
        try:
            import json

            flag_data = {
                "key": flag.key,
                "is_enabled": flag.is_enabled,
                "targeting_rules": flag.targeting_rules,
                "updated_at": flag.updated_at.isoformat() if flag.updated_at else None,
            }
            await redis_client.set(
                cache_key,
                json.dumps(flag_data),
                ex=int(FEATURE_FLAG_CACHE_TTL.total_seconds()),
            )
            logger.debug(f"Cached feature flag '{flag.key}'")
        except redis.RedisError as e:
            logger.error(f"Redis error setting cache for '{flag.key}': {e}")
        except TypeError as e:
            logger.error(f"Serialization error caching flag '{flag.key}': {e}")

    @staticmethod
    async def invalidate_cache(redis_client: redis.Redis, key: str):
        """Removes a flag from the Redis cache."""
        cache_key = FeatureFlagsService._get_cache_key(key)
        try:
            await redis_client.delete(cache_key)
            logger.info(f"Invalidated cache for feature flag '{key}'")
        except redis.RedisError as e:
            logger.error(f"Redis error deleting cache for '{key}': {e}")

    @staticmethod
    async def publish_update(redis_client: redis.Redis, key: str, action: str):
        """Publishes an update event for a feature flag."""
        channel = "feature_flag_updates"
        try:
            import json

            message = json.dumps(
                {
                    "key": key,
                    "action": action,
                    "timestamp": datetime.now().isoformat(),
                }
            )
            await redis_client.publish(channel, message)
            logger.info(f"Published {action} event for feature flag '{key}'")
        except redis.RedisError as e:
            logger.error(f"Redis error publishing update for '{key}': {e}")
        except Exception as e:
            logger.error(f"Error publishing update for '{key}': {e}")
