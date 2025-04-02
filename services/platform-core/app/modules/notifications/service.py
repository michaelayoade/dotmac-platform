"""
Service for the notifications module.
"""

import json
import logging
from datetime import datetime
from typing import List, Optional

import redis
from fastapi import BackgroundTasks
from sqlalchemy import and_, desc, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notifications.models import (
    Notification,
    NotificationBulkCreate,
    NotificationCreate,
    NotificationStatus,
    NotificationUpdate,
)
from app.utils.common import json_serializer

logger = logging.getLogger(__name__)


class NotificationsService:
    """
    Service for managing notifications.
    """

    @staticmethod
    async def create_notification(db: AsyncSession, notification: NotificationCreate) -> Notification:
        """
        Create a new notification.

        Args:
            db: Database session
            notification: Notification data

        Returns:
            Created notification
        """
        db_notification = Notification(
            title=notification.title,
            message=notification.message,
            notification_type=notification.notification_type.value,
            priority=notification.priority.value,
            recipient_id=notification.recipient_id,
            recipient_type=notification.recipient_type,
            sender_id=notification.sender_id,
            expires_at=notification.expires_at,
            data=notification.data,
            action_url=notification.action_url,
        )
        db.add(db_notification)
        await db.commit()
        await db.refresh(db_notification)
        return db_notification

    @staticmethod
    async def create_bulk_notifications(db: AsyncSession, notification: NotificationBulkCreate) -> List[Notification]:
        """
        Create multiple notifications at once.

        Args:
            db: Database session
            notification: Bulk notification data

        Returns:
            List of created notifications
        """
        created_notifications = []

        for recipient_id in notification.recipient_ids:
            db_notification = Notification(
                title=notification.title,
                message=notification.message,
                notification_type=notification.notification_type.value,
                priority=notification.priority.value,
                recipient_id=recipient_id,
                recipient_type=notification.recipient_type,
                sender_id=notification.sender_id,
                expires_at=notification.expires_at,
                data=notification.data,
                action_url=notification.action_url,
            )
            db.add(db_notification)
            created_notifications.append(db_notification)

        await db.commit()

        # Refresh all notifications
        for notification in created_notifications:
            await db.refresh(notification)

        return created_notifications

    @staticmethod
    async def update_notification(
        db: AsyncSession, notification_id: int, update_data: NotificationUpdate
    ) -> Optional[Notification]:
        """
        Update a notification.

        Args:
            db: Database session
            notification_id: ID of the notification to update
            update_data: Updated notification data

        Returns:
            Updated notification if found, None otherwise
        """
        db_notification = (
            await db.execute(select(Notification).filter(Notification.id == notification_id))
        ).scalar_one_or_none()
        if not db_notification:
            return None

        # Update fields
        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(db_notification, key, value)

        # If status is being updated to "delivered", set delivered_at time
        if update_dict.get("status") == NotificationStatus.DELIVERED.value and not db_notification.delivered_at:
            db_notification.delivered_at = datetime.utcnow()

        # If status is being updated to "read", set read_at time
        if update_dict.get("status") == NotificationStatus.READ.value and not db_notification.read_at:
            db_notification.read_at = datetime.utcnow()

        await db.commit()
        await db.refresh(db_notification)
        return db_notification

    @staticmethod
    async def mark_as_read(db: AsyncSession, notification_id: int) -> Optional[Notification]:
        """
        Mark a notification as read.

        Args:
            db: Database session
            notification_id: ID of the notification to mark as read

        Returns:
            Updated notification if found, None otherwise
        """
        update_data = NotificationUpdate(status=NotificationStatus.READ, read_at=datetime.utcnow())
        return await NotificationsService.update_notification(db, notification_id, update_data)

    @staticmethod
    async def mark_all_as_read(db: AsyncSession, recipient_id: str) -> int:
        """
        Mark all notifications for a recipient as read.

        Args:
            db: Database session
            recipient_id: ID of the recipient

        Returns:
            Number of notifications marked as read
        """
        now = datetime.utcnow()

        # Get all unread notifications for the recipient
        unread_notifications = (
            (
                await db.execute(
                    select(Notification).filter(
                        and_(
                            Notification.recipient_id == recipient_id,
                            Notification.status.in_(
                                [
                                    NotificationStatus.PENDING.value,
                                    NotificationStatus.DELIVERED.value,
                                ]
                            ),
                        )
                    )
                )
            )
            .scalars()
            .all()
        )

        # Update all notifications
        for notification in unread_notifications:
            notification.status = NotificationStatus.READ.value
            notification.read_at = now

        await db.commit()
        return len(unread_notifications)

    @staticmethod
    async def delete_notification(db: AsyncSession, notification_id: int) -> bool:
        """
        Delete a notification.

        Args:
            db: Database session
            notification_id: ID of the notification to delete

        Returns:
            True if deleted, False if not found
        """
        db_notification = (
            await db.execute(select(Notification).filter(Notification.id == notification_id))
        ).scalar_one_or_none()
        if not db_notification:
            return False

        await db.delete(db_notification)
        await db.commit()
        return True

    @staticmethod
    async def get_notification(db: AsyncSession, notification_id: int) -> Optional[Notification]:
        """
        Get a notification by ID.

        Args:
            db: Database session
            notification_id: ID of the notification

        Returns:
            Notification if found, None otherwise
        """
        return (await db.execute(select(Notification).filter(Notification.id == notification_id))).scalar_one_or_none()

    @staticmethod
    async def get_notifications(
        db: AsyncSession,
        recipient_id: Optional[str] = None,
        status: Optional[NotificationStatus] = None,
        notification_type: Optional[str] = None,
        priority: Optional[str] = None,
        include_expired: bool = False,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Notification]:
        """
        Get notifications with optional filtering.

        Args:
            db: Database session
            recipient_id: Optional recipient ID filter
            status: Optional status filter
            notification_type: Optional notification type filter
            priority: Optional priority filter
            include_expired: Whether to include expired notifications
            skip: Number of notifications to skip
            limit: Maximum number of notifications to return

        Returns:
            List of notifications
        """
        query = select(Notification)

        # Apply filters
        if recipient_id:
            query = query.filter(Notification.recipient_id == recipient_id)

        if status:
            query = query.filter(Notification.status == status.value)

        if notification_type:
            query = query.filter(Notification.notification_type == notification_type)

        if priority:
            query = query.filter(Notification.priority == priority)

        # Filter out expired notifications if not included
        if not include_expired:
            now = datetime.utcnow()
            query = query.filter(
                or_(
                    Notification.expires_at.is_(None),
                    Notification.expires_at > now,
                )
            )

        # Order by created_at (newest first)
        query = query.order_by(desc(Notification.created_at))

        # Apply pagination
        query = query.offset(skip).limit(limit)

        return (await db.execute(query)).scalars().all()

    @staticmethod
    async def get_unread_count(db: AsyncSession, recipient_id: str) -> int:
        """
        Get the count of unread notifications for a recipient.

        Args:
            db: Database session
            recipient_id: Recipient ID

        Returns:
            Count of unread notifications
        """
        now = datetime.utcnow()

        # Count unread notifications that are not expired
        result = await db.execute(
            select(Notification).filter(
                and_(
                    Notification.recipient_id == recipient_id,
                    Notification.status.in_(
                        [
                            NotificationStatus.PENDING.value,
                            NotificationStatus.DELIVERED.value,
                        ]
                    ),
                    or_(
                        Notification.expires_at.is_(None),
                        Notification.expires_at > now,
                    ),
                )
            )
        )

        # Convert to list and get the count
        notifications = result.scalars().all()
        return len(notifications)

    @staticmethod
    async def publish_notification(redis_client: redis.Redis, notification: Notification) -> bool:
        """
        Publish a notification to Redis for real-time delivery.

        Args:
            redis_client: Redis client
            notification: Notification to publish

        Returns:
            True if published successfully, False otherwise
        """
        try:
            # Create channel name based on recipient
            channel = f"notifications:{notification.recipient_type}:{notification.recipient_id}"

            # Serialize notification to JSON
            notification_dict = {
                "id": notification.id,
                "title": notification.title,
                "message": notification.message,
                "notification_type": notification.notification_type,
                "priority": notification.priority,
                "recipient_id": notification.recipient_id,
                "recipient_type": notification.recipient_type,
                "sender_id": notification.sender_id,
                "created_at": notification.created_at.isoformat(),
                "data": notification.data,
                "action_url": notification.action_url,
            }

            notification_json = json.dumps(notification_dict, default=json_serializer)

            # Publish to Redis
            await redis_client.publish(channel, notification_json)

            # Also publish to a global channel for system-wide listeners
            await redis_client.publish("notifications:all", notification_json)

            logger.info(f"Published notification {notification.id} to channel {channel}")
            return True

        except Exception as e:
            logger.error(f"Error publishing notification to Redis: {str(e)}")
            return False

    @staticmethod
    async def create_and_publish_notification(
        db: AsyncSession,
        redis_client: redis.Redis,
        notification: NotificationCreate,
        background_tasks: Optional[BackgroundTasks] = None,
    ) -> Notification:
        """
        Create a notification and publish it to Redis for real-time delivery.

        Args:
            db: Database session
            redis_client: Redis client
            notification: Notification data
            background_tasks: FastAPI background tasks (optional)

        Returns:
            Created notification
        """
        # Create notification in database
        db_notification = await NotificationsService.create_notification(db, notification)

        # Publish to Redis (either in background or directly)
        if background_tasks:
            background_tasks.add_task(
                NotificationsService.publish_notification,
                redis_client,
                db_notification,
            )
        else:
            # Publish directly if no background_tasks provided
            await NotificationsService.publish_notification(
                redis_client,
                db_notification,
            )

        return db_notification

    @staticmethod
    async def create_and_publish_bulk_notifications(
        db: AsyncSession,
        redis_client: redis.Redis,
        notification: NotificationBulkCreate,
        background_tasks: BackgroundTasks,
    ) -> List[Notification]:
        """
        Create multiple notifications and publish them to Redis for real-time delivery.

        Args:
            db: Database session
            redis_client: Redis client
            notification: Bulk notification data
            background_tasks: FastAPI background tasks

        Returns:
            List of created notifications
        """
        # Create notifications in database
        db_notifications = await NotificationsService.create_bulk_notifications(db, notification)

        # Publish to Redis in background
        for db_notification in db_notifications:
            background_tasks.add_task(
                NotificationsService.publish_notification,
                redis_client,
                db_notification,
            )

        return db_notifications

    @staticmethod
    async def clean_expired_notifications(db: AsyncSession) -> int:
        """
        Clean up expired notifications.

        Args:
            db: Database session

        Returns:
            Number of notifications deleted
        """
        now = datetime.utcnow()

        # Find expired notifications
        expired_notifications = (
            (
                await db.execute(
                    select(Notification).filter(
                        and_(
                            Notification.expires_at.isnot(None),
                            Notification.expires_at <= now,
                        )
                    )
                )
            )
            .scalars()
            .all()
        )

        # Delete expired notifications
        for notification in expired_notifications:
            await db.delete(notification)

        await db.commit()
        return len(expired_notifications)
