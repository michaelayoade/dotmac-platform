import json
import logging
from typing import Any, List, Optional

from fastapi import HTTPException, status
from redis import Redis
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.modules.config.models import (
    ConfigHistory,
    ConfigItem,
    ConfigItemCreate,
    ConfigItemUpdate,
    ConfigScope,
    ConfigScopeCreate,
    ConfigScopeUpdate,
)

log = logging.getLogger(__name__)


class ConfigService:
    """
    Service for managing configuration.
    """

    # Redis key patterns
    CONFIG_KEY_PATTERN = "config:{scope}:{key}"
    CONFIG_SCOPE_PATTERN = "config:{scope}:*"

    @staticmethod
    async def create_scope(db: Session, scope: ConfigScopeCreate) -> ConfigScope:
        """
        Create a new configuration scope.
        """
        db_scope = ConfigScope(name=scope.name, description=scope.description)

        try:
            db.add(db_scope)
            db.commit()
            db.refresh(db_scope)
            return db_scope
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Scope with name '{scope.name}' already exists",
            )

    @staticmethod
    async def get_scopes(db: Session, skip: int = 0, limit: int = 100) -> List[ConfigScope]:
        """
        Get all configuration scopes.
        """
        return db.query(ConfigScope).offset(skip).limit(limit).all()

    @staticmethod
    async def get_scope_by_name(db: Session, name: str) -> Optional[ConfigScope]:
        """
        Get a configuration scope by name.
        """
        return db.query(ConfigScope).filter(ConfigScope.name == name).first()

    @staticmethod
    async def get_scope_by_id(db: Session, scope_id: int) -> Optional[ConfigScope]:
        """
        Get a configuration scope by ID.
        """
        return db.query(ConfigScope).filter(ConfigScope.id == scope_id).first()

    @staticmethod
    async def create_config_item(
        db: Session,
        item: ConfigItemCreate,
        scope_id: int,
        actor_id: str,
    ) -> ConfigItem:
        """
        Create a new configuration item.
        """
        # Get scope
        scope = await ConfigService.get_scope_by_id(db, scope_id)
        if not scope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scope with ID '{scope_id}' not found",
            )

        # Create config item
        db_config = ConfigItem(
            key=item.key,
            value=item.value,
            description=item.description,
            is_secret=1 if item.is_secret else 0,
            scope_id=scope.id,
        )

        try:
            db.add(db_config)
            db.commit()
            db.refresh(db_config)

            # Create initial history entry
            history = ConfigHistory(
                value=item.value,
                version=1,
                changed_by=actor_id,
                config_id=db_config.id,
            )
            db.add(history)
            db.commit()

            return db_config
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Config with key '{item.key}' already exists in scope '{scope.name}'",
            )

    @staticmethod
    async def get_config_items_by_scope(
        db: Session, scope_name: str, skip: int = 0, limit: int = 100
    ) -> List[ConfigItem]:
        """
        Get all configuration items for a scope.
        """
        scope = await ConfigService.get_scope_by_name(db, scope_name)
        if not scope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scope '{scope_name}' not found",
            )

        return db.query(ConfigItem).filter(ConfigItem.scope_id == scope.id).offset(skip).limit(limit).all()

    @staticmethod
    async def get_config_item(db: Session, redis_client: Redis, scope_name: str, key: str) -> Optional[ConfigItem]:
        """
        Get a configuration item by scope and key.
        """
        scope = await ConfigService.get_scope_by_name(db, scope_name)
        if not scope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scope '{scope_name}' not found",
            )

        return db.query(ConfigItem).filter(ConfigItem.scope_id == scope.id, ConfigItem.key == key).first()

    @staticmethod
    async def get_config_item_value(db: Session, redis_client: Redis, scope_name: str, key: str) -> Any:
        """
        Get a configuration item value by scope and key.
        """
        config_item = await ConfigService.get_config_item(db, redis_client, scope_name, key)
        if not config_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Config with key '{key}' not found in scope '{scope_name}'",
            )

        return config_item.value

    @staticmethod
    async def update_config_item(db: Session, item_id: int, item_update: ConfigItemUpdate, actor_id: str) -> ConfigItem:
        """
        Update a configuration item.
        """
        # Get config item
        db_config = db.query(ConfigItem).filter(ConfigItem.id == item_id).first()
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Config with ID '{item_id}' not found",
            )

        # Create history entry before updating
        history = ConfigHistory(
            value=db_config.value,
            version=db_config.version,
            changed_by=actor_id,
            config_id=db_config.id,
        )
        db.add(history)

        # Update config item
        db_config.value = item_update.value
        db_config.version += 1

        if item_update.description is not None:
            db_config.description = item_update.description

        if item_update.is_secret is not None:
            db_config.is_secret = 1 if item_update.is_secret else 0

        db.commit()
        db.refresh(db_config)

        return db_config

    @staticmethod
    async def delete_config_item(db: Session, item_id: int, actor_id: str) -> Optional[ConfigItem]:
        """
        Delete a configuration item.
        """
        # Get config item
        db_config = db.query(ConfigItem).filter(ConfigItem.id == item_id).first()
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Config with ID '{item_id}' not found",
            )

        db.delete(db_config)
        db.commit()

        return db_config

    @staticmethod
    async def get_config_history(db: Session, item_id: int, skip: int = 0, limit: int = 100) -> List[ConfigHistory]:
        """
        Get history for a configuration item.
        """
        # Get config item
        db_config = db.query(ConfigItem).filter(ConfigItem.id == item_id).first()
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Config with ID '{item_id}' not found",
            )

        return (
            db.query(ConfigHistory)
            .filter(ConfigHistory.config_id == db_config.id)
            .order_by(ConfigHistory.version.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    async def get_config_scope_by_name(db: Session, scope_name: str) -> Optional[ConfigScope]:
        """
        Get a configuration scope by name.
        """
        return db.query(ConfigScope).filter(ConfigScope.name == scope_name).first()

    @staticmethod
    async def get_config_scope_by_id(db: Session, scope_id: int) -> Optional[ConfigScope]:
        """
        Get a configuration scope by ID.
        """
        return db.query(ConfigScope).filter(ConfigScope.id == scope_id).first()

    @staticmethod
    async def get_all_config_scopes(db: Session, skip: int = 0, limit: int = 100) -> List[ConfigScope]:
        """
        Get all configuration scopes.
        """
        return db.query(ConfigScope).offset(skip).limit(limit).all()

    @staticmethod
    async def create_config_scope(db: Session, scope: ConfigScopeCreate, actor_id: str) -> ConfigScope:
        """
        Create a new configuration scope.
        """
        db_scope = ConfigScope(name=scope.name, description=scope.description)

        try:
            db.add(db_scope)
            db.commit()
            db.refresh(db_scope)
            return db_scope
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Scope with name '{scope.name}' already exists",
            )

    @staticmethod
    async def update_config_scope(
        db: Session,
        scope_id: int,
        scope_update: ConfigScopeUpdate,
        actor_id: str,
    ) -> ConfigScope:
        """
        Update a configuration scope.
        """
        # Get scope
        db_scope = await ConfigService.get_config_scope_by_id(db, scope_id)
        if not db_scope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scope with ID '{scope_id}' not found",
            )

        # Update scope
        db_scope.name = scope_update.name
        db_scope.description = scope_update.description

        db.commit()
        db.refresh(db_scope)

        return db_scope

    @staticmethod
    async def delete_config_scope(db: Session, scope_id: int, actor_id: str) -> Optional[ConfigScope]:
        """
        Delete a configuration scope.
        """
        # Get scope
        db_scope = await ConfigService.get_config_scope_by_id(db, scope_id)
        if not db_scope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scope with ID '{scope_id}' not found",
            )

        db.delete(db_scope)
        db.commit()

        return db_scope

    @classmethod
    async def cache_config(cls, redis: Redis, scope_name: str, key: str, value: str) -> bool:
        """
        Cache a configuration item in Redis.
        """
        redis_key = cls.CONFIG_KEY_PATTERN.format(scope=scope_name, key=key)
        return redis.set(redis_key, value)

    @classmethod
    async def get_cached_config(cls, redis: Redis, scope_name: str, key: str) -> Optional[str]:
        """
        Get a cached configuration item from Redis.
        """
        redis_key = cls.CONFIG_KEY_PATTERN.format(scope=scope_name, key=key)
        return redis.get(redis_key)

    @classmethod
    async def invalidate_config_cache(cls, redis: Redis, scope_name: str, key: str) -> bool:
        """
        Invalidate the cache for a specific config item.
        """
        cache_key = cls._get_cache_key(scope_name, key)
        await redis.delete(cache_key)
        log.info(f"Invalidated cache for config: {scope_name}/{key}")

    @classmethod
    async def publish_config_update(cls, redis: Redis, scope_name: str, key: str) -> int:
        """
        Publish a notification about a config update.
        """
        channel = "config_updates"
        message = json.dumps({"scope": scope_name, "key": key, "action": "updated"})
        await redis.publish(channel, message)
        log.info(f"Published update notification for config: {scope_name}/{key}")

    @classmethod
    async def get_all_config_items(cls, db: Session) -> List[ConfigItem]:
        """
        Retrieve all configuration items.
        """
        return db.query(ConfigItem).options(selectinload(ConfigItem.scope)).all()

    @classmethod
    async def get_config_item_by_id(cls, db: Session, item_id: int) -> Optional[ConfigItem]:
        """
        Retrieve a configuration item by ID.
        """
        return db.query(ConfigItem).filter(ConfigItem.id == item_id).options(selectinload(ConfigItem.scope)).first()

    @classmethod
    async def get_config_item_by_scope_and_key(cls, db: Session, scope_name: str, key: str) -> Optional[ConfigItem]:
        """
        Retrieve a configuration item by its scope name and key.
        """
        stmt = (
            select(ConfigItem)
            .join(ConfigScope)
            .where(ConfigScope.name == scope_name, ConfigItem.key == key)
            .options(selectinload(ConfigItem.scope))
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    # --- Cache Operations ---
