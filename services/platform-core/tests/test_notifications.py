"""
Tests for the notifications module.
"""

from datetime import datetime, timedelta

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notifications.models import (
    Notification,
    NotificationPriority,
    NotificationStatus,
    NotificationType,
)


@pytest.mark.asyncio
async def test_create_notification(async_client: AsyncClient, db_session: AsyncSession):
    """Test creating a notification."""
    # Create notification data
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "notification_type": NotificationType.SYSTEM.value,
        "priority": NotificationPriority.MEDIUM.value,
        "recipient_id": "user123",
        "recipient_type": "user",
        "sender_id": "system",
        "data": {"key": "value"},
    }

    # Send request
    response = await async_client.post("/api/v1/notifications/", json=notification_data)

    # Check response
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == notification_data["title"]
    assert data["message"] == notification_data["message"]
    assert data["notification_type"] == notification_data["notification_type"]
    assert data["priority"] == notification_data["priority"]
    assert data["recipient_id"] == notification_data["recipient_id"]
    assert data["status"] == NotificationStatus.PENDING.value

    # Check database
    result = await db_session.execute(select(Notification).where(Notification.id == data["id"]))
    db_notification = result.scalar_one()
    assert db_notification is not None
    assert db_notification.title == notification_data["title"]


@pytest.mark.asyncio
async def test_get_notifications(async_client: AsyncClient, db_session: AsyncSession):
    """Test getting notifications."""
    # Create test notifications
    for i in range(3):
        notification = Notification(
            title=f"Test Notification {i}",
            message=f"This is test notification {i}",
            notification_type=NotificationType.SYSTEM.value,
            priority=NotificationPriority.MEDIUM.value,
            recipient_id="user123",
            recipient_type="user",
            sender_id="system",
            data={"key": f"value{i}"},
        )
        db_session.add(notification)
    await db_session.commit()

    # Send request
    response = await async_client.get("/api/v1/notifications/?recipient_id=user123")

    # Check response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["recipient_id"] == "user123"


@pytest.mark.asyncio
async def test_mark_as_read(async_client: AsyncClient, db_session: AsyncSession):
    """Test marking a notification as read."""
    # Create test notification
    notification = Notification(
        title="Test Notification",
        message="This is a test notification",
        notification_type=NotificationType.SYSTEM.value,
        priority=NotificationPriority.MEDIUM.value,
        recipient_id="user123",
        recipient_type="user",
        sender_id="system",
        status=NotificationStatus.PENDING.value,
        data={"key": "value"},
    )
    db_session.add(notification)
    await db_session.commit()
    await db_session.refresh(notification)

    # Send request to mark as read
    response = await async_client.post(f"/api/v1/notifications/{notification.id}/read")

    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == NotificationStatus.READ.value

    # Check database
    result = await db_session.execute(select(Notification).where(Notification.id == notification.id))
    db_notification = result.scalar_one()
    assert db_notification.status == NotificationStatus.READ.value


@pytest.mark.asyncio
async def test_get_unread_count(async_client: AsyncClient, db_session: AsyncSession):
    """Test getting unread notification count."""
    # Create test notifications with different statuses
    for i, status in enumerate(
        [
            NotificationStatus.PENDING.value,
            NotificationStatus.DELIVERED.value,
            NotificationStatus.READ.value,
        ]
    ):
        notification = Notification(
            title=f"Test Notification {i}",
            message=f"This is test notification {i}",
            notification_type=NotificationType.SYSTEM.value,
            priority=NotificationPriority.MEDIUM.value,
            recipient_id="user123",
            recipient_type="user",
            sender_id="system",
            status=status,
            data={"key": f"value{i}"},
        )
        db_session.add(notification)
    await db_session.commit()

    # Send request
    response = await async_client.get("/api/v1/notifications/count?recipient_id=user123")

    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["recipient_id"] == "user123"
    assert data["unread_count"] == 2  # PENDING and DELIVERED are considered unread


@pytest.mark.asyncio
async def test_mark_all_as_read(async_client: AsyncClient, db_session: AsyncSession):
    """Test marking all notifications as read."""
    # Create test notifications
    for i in range(3):
        notification = Notification(
            title=f"Test Notification {i}",
            message=f"This is test notification {i}",
            notification_type=NotificationType.SYSTEM.value,
            priority=NotificationPriority.MEDIUM.value,
            recipient_id="user123",
            recipient_type="user",
            sender_id="system",
            status=NotificationStatus.PENDING.value,
            data={"key": f"value{i}"},
        )
        db_session.add(notification)
    await db_session.commit()

    # Send request to mark all as read
    response = await async_client.post("/api/v1/notifications/read-all?recipient_id=user123")

    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["recipient_id"] == "user123"
    assert data["marked_as_read"] == 3

    # Check database
    result = await db_session.execute(
        select(Notification).where(
            Notification.recipient_id == "user123",
            Notification.status == NotificationStatus.READ.value,
        )
    )
    db_notifications = result.scalars().all()
    assert len(db_notifications) == 3


@pytest.mark.asyncio
async def test_clean_expired_notifications(async_client: AsyncClient, db_session: AsyncSession):
    """Test cleaning expired notifications."""
    # Create expired notification
    expired_time = datetime.now() - timedelta(days=31)
    expired_notification = Notification(
        title="Expired Notification",
        message="This is an expired notification",
        notification_type=NotificationType.SYSTEM.value,
        priority=NotificationPriority.MEDIUM.value,
        recipient_id="user123",
        recipient_type="user",
        sender_id="system",
        status=NotificationStatus.PENDING.value,
        data={"key": "value"},
        created_at=expired_time,
        updated_at=expired_time,
        expires_at=expired_time,  # Set expires_at to a time in the past
    )
    db_session.add(expired_notification)

    # Create non-expired notification
    non_expired_notification = Notification(
        title="Non-expired Notification",
        message="This is a non-expired notification",
        notification_type=NotificationType.SYSTEM.value,
        priority=NotificationPriority.MEDIUM.value,
        recipient_id="user123",
        recipient_type="user",
        sender_id="system",
        status=NotificationStatus.PENDING.value,
        data={"key": "value"},
    )
    db_session.add(non_expired_notification)
    await db_session.commit()

    # Send request to clean expired notifications
    response = await async_client.post("/api/v1/notifications/clean-expired")

    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["deleted_count"] == 1
    assert "Deleted 1 expired notifications" in data["message"]

    # Check database
    result = await db_session.execute(select(Notification))
    db_notifications = result.scalars().all()
    assert len(db_notifications) == 1
    assert db_notifications[0].title == "Non-expired Notification"
