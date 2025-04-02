import json
import logging
from typing import Any, Dict, List, Optional

import redis
from app.db.redis import get_redis
from app.db.session import get_db
from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from .models import FeatureFlagCreate, FeatureFlagResponse, FeatureFlagUpdate
from .service import FeatureFlagsService

router = APIRouter()
logger = logging.getLogger(__name__)

FEATURE_FLAG_TAG = "Feature Flags"


# --- Feature Flag Endpoints ---


@router.post(
    "/",
    response_model=FeatureFlagResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Feature Flag",
    description="Creates a new feature flag.",
    tags=[FEATURE_FLAG_TAG],
)
async def create_feature_flag(
    flag_in: FeatureFlagCreate,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
) -> FeatureFlagResponse:
    """Create a new feature flag definition."""
    try:
        flag = await FeatureFlagsService.create_feature_flag(
            db, redis_client, flag_in=flag_in
        )
    except ValueError as e:
        logger.warning(
            f"Failed to create feature flag '{flag_in.key}': " f"{e}"
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=str(e)
        )
    return flag


@router.get(
    "/",
    response_model=List[FeatureFlagResponse],
    summary="List Feature Flags",
    description="Retrieves a list of all defined feature flags.",
    tags=[FEATURE_FLAG_TAG],
)
async def list_feature_flags(
    is_active: Optional[bool] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> List[FeatureFlagResponse]:
    """Retrieve feature flags, optionally filtered by active status."""
    return await FeatureFlagsService.get_feature_flags(
        db, is_active=is_active, skip=skip, limit=limit
    )


@router.get(
    "/{flag_key}",
    response_model=FeatureFlagResponse,
    summary="Get Feature Flag by Key",
    description="Retrieves details of a specific feature flag by its key.",
    tags=[FEATURE_FLAG_TAG],
)
async def get_feature_flag(
    flag_key: str,
    db: AsyncSession = Depends(get_db),
) -> FeatureFlagResponse:
    """Retrieve a specific feature flag by key."""
    db_flag = await FeatureFlagsService.get_feature_flag_by_key(db, flag_key)
    if db_flag is None:
        logger.warning(f"Feature flag with key '{flag_key}' not found.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feature flag not found",
        )
    return db_flag


@router.put(
    "/{flag_key}",
    response_model=FeatureFlagResponse,
    summary="Update Feature Flag",
    description="Updates an existing feature flag.",
    tags=[FEATURE_FLAG_TAG],
)
async def update_feature_flag(
    flag_key: str,
    flag_update: FeatureFlagUpdate,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
) -> FeatureFlagResponse:
    """Update a feature flag."""
    db_flag = await FeatureFlagsService.update_feature_flag(
        db, redis_client, flag_key=flag_key, flag_update=flag_update
    )
    if db_flag is None:
        logger.warning(
            f"Feature flag with key '{flag_key}' not found for update."
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feature flag not found",
        )
    return db_flag


@router.delete(
    "/{flag_key}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Feature Flag",
    description="Deletes a feature flag and its associated segments.",
    tags=[FEATURE_FLAG_TAG],
)
async def delete_feature_flag(
    key: str = Path(
        ..., description="Unique key of the feature flag to delete"
    ),
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
) -> None:
    """
    Delete a feature flag by its key.

    Requires `feature_flags:delete` permission.
    """
    success = await FeatureFlagsService.delete_feature_flag(db, key=key)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature flag with key '{key}' not found",
        )

    # Invalidate cache
    await FeatureFlagsService.invalidate_cache(redis_client, key=key)

    # Publish update event
    await FeatureFlagsService.publish_update(
        redis_client, key=key, action="deleted"
    )

    # No content to return on success
    return None


@router.get(
    "/evaluate/{flag_key}",
    response_model=bool,
    summary="Evaluate Feature Flag",
    description=(
        "Evaluates a feature flag for a given context "
        "(e.g., user ID, group)."
    ),
    tags=[FEATURE_FLAG_TAG],
)
async def evaluate_feature_flag(
    flag_key: str,
    context_str: Optional[str] = Query(None, alias="context"),
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
) -> bool:
    """
    Evaluate a feature flag based on the provided context.
    The context is expected as a JSON string in the query parameter 'context'.
    Example: /evaluate/my-flag?context={"user_id":"abc","region":"eu"}
    """
    context_dict: Dict[str, Any] = {}
    if context_str:
        try:
            context_dict = json.loads(context_str)
            if not isinstance(context_dict, dict):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid context format: must be a JSON object.",
                )
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Invalid context format: could not parse JSON.",
            )

    try:
        result = await FeatureFlagsService.is_feature_enabled(
            db, redis_client, flag_key=flag_key, context=context_dict
        )
        return result
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feature flag not found",
        )
    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error evaluating flag {flag_key}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error evaluating feature flag",
        )
