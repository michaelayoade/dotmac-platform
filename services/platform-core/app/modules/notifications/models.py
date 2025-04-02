"""
Models for the notifications module.
"""

import enum
from datetime import datetime
from typing import Any, Dict, List, Optional

# Alias Pydantic BaseModel
from pydantic import BaseModel as PydanticBaseModel
from pydantic import ConfigDict, Field

# Remove incorrect Base import
# from app.db.base_model import Base
# Import correct BaseModel
from shared_core.base.base_model import BaseModel
from sqlalchemy import JSON, DateTime, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class NotificationType(str, enum.Enum):
    """
    Enum for notification types.
    """

    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"
    SYSTEM = "system"


class NotificationPriority(str, enum.Enum):
    """
    Enum for notification priorities.
    """

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class NotificationStatus(str, enum.Enum):
    """
    Enum for notification status.
    """

    PENDING = "pending"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"


class Notification(BaseModel):
    """
    Model for storing notifications.
    Inherits id, created_at, updated_at from BaseModel (implicitly).
    """

    __tablename__ = "notifications"

    # id, created_at, updated_at are inherited from BaseModel

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[str] = mapped_column(String(20), nullable=False, default=NotificationType.INFO.value)
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default=NotificationPriority.MEDIUM.value)
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=NotificationStatus.PENDING.value,
        index=True,  # Added index here
    )
    recipient_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    recipient_type: Mapped[str] = mapped_column(String(20), nullable=False)  # "user" or "group"
    sender_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    action_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Create indexes for common query patterns
    __table_args__ = (
        Index("idx_notifications_recipient_status", recipient_id, status),
        # Index("idx_notifications_created_at", created_at), # created_at is already indexed via BaseModel
    )


# Pydantic models for API - Use aliased PydanticBaseModel
class NotificationBase(PydanticBaseModel):
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification message")
    notification_type: NotificationType = Field(NotificationType.INFO, description="Type of notification")
    priority: NotificationPriority = Field(NotificationPriority.MEDIUM, description="Priority of notification")
    sender_id: Optional[str] = Field(None, description="ID of the sender (user or system)")
    expires_at: Optional[datetime] = Field(None, description="Optional expiration time")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional data for the notification")
    action_url: Optional[str] = Field(None, description="Optional URL for action button")

    model_config = ConfigDict(from_attributes=True)


class NotificationCreate(NotificationBase):
    recipient_id: str = Field(..., description="ID of the recipient (user or group)")
    recipient_type: str = Field(..., description="Type of recipient ('user' or 'group')")

    model_config = ConfigDict(from_attributes=True)


class NotificationUpdate(PydanticBaseModel):
    status: Optional[NotificationStatus] = Field(None, description="Status of the notification")
    read_at: Optional[datetime] = Field(None, description="Time when the notification was read")

    model_config = ConfigDict(from_attributes=True)


class NotificationResponse(NotificationBase):
    id: int
    status: str
    recipient_id: str
    recipient_type: str
    created_at: datetime
    delivered_at: Optional[datetime] = None
    read_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class NotificationBulkCreate(NotificationBase):
    recipient_ids: List[str] = Field(..., description="List of recipient IDs")
    recipient_type: str = Field(..., description="Type of recipients ('user' or 'group')")

    model_config = ConfigDict(from_attributes=True)
