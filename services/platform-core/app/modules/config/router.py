from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path, Request, status
from redis import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.redis import get_redis
from app.db.session import get_db
from app.modules.config.models import (
    ConfigHistoryResponse,
    ConfigItemCreate,
    ConfigItemResponse,
    ConfigItemUpdate,
    ConfigScopeCreate,
    ConfigScopeResponse,
)
from app.modules.config.service import ConfigService
from app.utils.common import get_client_ip

router = APIRouter()


# Scope endpoints
@router.post(
    "/scopes",
    response_model=ConfigScopeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_scope(scope: ConfigScopeCreate, db: AsyncSession = Depends(get_db)) -> ConfigScopeResponse:
    """
    Create a new configuration scope.
    """
    return await ConfigService.create_scope(db, scope)


@router.get("/scopes", response_model=List[ConfigScopeResponse])
async def get_scopes(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)) -> List[ConfigScopeResponse]:
    """
    Get all configuration scopes.
    """
    return await ConfigService.get_scopes(db, skip, limit)


@router.get("/scopes/{scope_name}", response_model=ConfigScopeResponse)
async def get_scope(scope_name: str, db: AsyncSession = Depends(get_db)) -> ConfigScopeResponse:
    """
    Get a configuration scope by name.
    """
    scope = await ConfigService.get_scope_by_name(db, scope_name)
    if not scope:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scope '{scope_name}' not found",
        )
    return scope


# Config item endpoints
@router.post(
    "/{scope_name}",
    response_model=ConfigItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_config_item(
    scope_name: str,
    config: ConfigItemCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> ConfigItemResponse:
    """
    Create a new configuration item.
    """
    # In a real app, we would extract the user ID from the JWT token
    # For now, we'll use the client IP as a placeholder
    user_id = get_client_ip(request)

    config_item = await ConfigService.create_config_item(db, scope_name, config, user_id)

    # Cache the config item
    await ConfigService.cache_config(redis, scope_name, config.key, config.value)

    # Publish update event
    await ConfigService.publish_config_update(redis, scope_name, config.key)

    return config_item


@router.get("/{scope_name}", response_model=List[ConfigItemResponse])
async def get_config_items(
    scope_name: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> List[ConfigItemResponse]:
    """
    Get all configuration items for a scope.
    """
    return await ConfigService.get_config_items(db, scope_name, skip, limit)


@router.get("/{scope_name}/{key}", response_model=ConfigItemResponse)
async def get_config_item(
    scope_name: str,
    key: str,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> ConfigItemResponse:
    """
    Get a configuration item by scope and key.
    """
    # Try to get from cache first
    cached_value = await ConfigService.get_cached_config(redis, scope_name, key)

    # If not in cache, get from database and cache it
    if cached_value is None:
        config_item = await ConfigService.get_config_item(db, scope_name, key)
        if not config_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Config with key '{key}' not found in scope '{scope_name}'",
            )

        # Cache the config item
        await ConfigService.cache_config(redis, scope_name, key, config_item.value)

        return config_item
    else:
        # We still need to get the full item from the database for the response
        config_item = await ConfigService.get_config_item(db, scope_name, key)
        if not config_item:
            # This should not happen, but just in case
            await ConfigService.invalidate_config_cache(redis, scope_name, key)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Config with key '{key}' not found in scope '{scope_name}'",
            )

        return config_item


@router.put("/{scope_name}/{key}", response_model=ConfigItemResponse)
async def update_config_item(
    scope_name: str,
    key: str,
    config: ConfigItemUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> ConfigItemResponse:
    """
    Update a configuration item.
    """
    # In a real app, we would extract the user ID from the JWT token
    # For now, we'll use the client IP as a placeholder
    user_id = get_client_ip(request)

    config_item = await ConfigService.update_config_item(db, scope_name, key, config, user_id)

    # Update cache
    await ConfigService.cache_config(redis, scope_name, key, config_item.value)

    # Publish update event
    await ConfigService.publish_config_update(redis, scope_name, key)

    return config_item


@router.delete("/{scope_name}/{key}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_config_item(
    key: str = Path(..., description="The key of the configuration item to delete"),
    scope: str = Path(
        ...,
        description="The scope name of the configuration item (e.g., 'global')",
    ),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    """
    Delete a specific configuration item within a scope.

    Requires `config:delete` permission.
    """
    deleted = await ConfigService.delete_config_item(db, key=key, scope_name=scope)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Config key '{key}' not found in scope '{scope}'",
        )
    # No content to return on successful deletion
    # Invalidate cache
    await ConfigService.invalidate_config_cache(redis, scope, key)

    # Publish update event
    await ConfigService.publish_config_update(redis, scope, key)


@router.get(
    "/{scope_name}/{key}/history",
    response_model=List[ConfigHistoryResponse],
)
async def get_config_history(
    key: str = Path(..., description="The key of the configuration item"),
    scope: str = Path(
        ...,
        description="The scope name of the configuration item (e.g., 'global')",
    ),
    db: AsyncSession = Depends(get_db),
) -> list[ConfigHistoryResponse]:
    """
    Retrieve the history of changes for a specific configuration item within a scope.
    """
    history = await ConfigService.get_config_history(db, key=key, scope_name=scope)
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History not found for config key '{key}' in scope '{scope}'",
        )
    return [ConfigHistoryResponse.model_validate(h) for h in history]
