"""
Router for the notifications module.
"""

from typing import List, Optional

import redis
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.redis import get_redis
from app.db.session import get_db
from app.modules.notifications.models import (
    NotificationBulkCreate,
    NotificationCreate,
    NotificationPriority,
    NotificationResponse,
    NotificationStatus,
    NotificationType,
    NotificationUpdate,
)
from app.modules.notifications.service import NotificationsService

router = APIRouter()


@router.post("/", response_model=NotificationResponse, status_code=201)
async def create_notification(
    notification: NotificationCreate,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
):
    """
    Create a new notification and publish it for real-time delivery.
    """
    return await NotificationsService.create_and_publish_notification(db, redis_client, notification)


@router.post("/bulk", response_model=List[NotificationResponse], status_code=201)
async def create_bulk_notifications(
    notification: NotificationBulkCreate,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
):
    """
    Create multiple notifications at once and publish them for real-time delivery.
    """
    return await NotificationsService.create_and_publish_bulk_notifications(db, redis_client, notification)


@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    recipient_id: Optional[str] = Query(None, description="Filter by recipient ID"),
    status: Optional[NotificationStatus] = Query(None, description="Filter by status"),
    notification_type: Optional[NotificationType] = Query(None, description="Filter by notification type"),
    priority: Optional[NotificationPriority] = Query(None, description="Filter by priority"),
    include_expired: bool = Query(False, description="Include expired notifications"),
    skip: int = Query(0, ge=0, description="Number of notifications to skip"),
    limit: int = Query(
        100,
        ge=1,
        le=100,
        description="Maximum number of notifications to return",
    ),
    db: AsyncSession = Depends(get_db),
):
    """
    Get notifications with optional filtering.
    """
    return await NotificationsService.get_notifications(
        db,
        recipient_id,
        status,
        notification_type.value if notification_type else None,
        priority.value if priority else None,
        include_expired,
        skip,
        limit,
    )


@router.get("/count", response_model=dict)
async def get_unread_count(
    recipient_id: str = Query(..., description="Recipient ID"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the count of unread notifications for a recipient.
    """
    count = await NotificationsService.get_unread_count(db, recipient_id)
    return {"recipient_id": recipient_id, "unread_count": count}


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(notification_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a specific notification by ID.
    """
    notification = await NotificationsService.get_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification


@router.put("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: int,
    update_data: NotificationUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update a notification.
    """
    updated_notification = await NotificationsService.update_notification(db, notification_id, update_data)
    if not updated_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return updated_notification


@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(notification_id: int, db: AsyncSession = Depends(get_db)):
    """
    Mark a notification as read.
    """
    updated_notification = await NotificationsService.mark_as_read(db, notification_id)
    if not updated_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return updated_notification


@router.post("/read-all")
async def mark_all_as_read(
    recipient_id: str = Query(..., description="Recipient ID"),
    db: AsyncSession = Depends(get_db),
):
    """
    Mark all notifications for a recipient as read.
    """
    count = await NotificationsService.mark_all_as_read(db, recipient_id)
    return {"recipient_id": recipient_id, "marked_as_read": count}


@router.delete("/{notification_id}", status_code=204)
async def delete_notification(notification_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a notification.
    """
    deleted = await NotificationsService.delete_notification(db, notification_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Notification not found")
    return None


@router.post("/clean-expired")
async def clean_expired_notifications(db: AsyncSession = Depends(get_db)):
    """
    Clean up expired notifications.
    """
    count = await NotificationsService.clean_expired_notifications(db)
    return {
        "deleted_count": count,
        "message": f"Deleted {count} expired notifications",
    }
