"""
Models for the webhooks module.
"""

import enum
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel as PydanticBaseModel
from pydantic import ConfigDict, Field, HttpUrl
from shared_core.base.base_model import BaseModel
from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


class WebhookEventType(str, enum.Enum):
    """
    Enum for webhook event types.
    """

    CONFIG_CREATED = "config.created"
    CONFIG_UPDATED = "config.updated"
    CONFIG_DELETED = "config.deleted"
    FEATURE_FLAG_CREATED = "feature_flag.created"
    FEATURE_FLAG_UPDATED = "feature_flag.updated"
    FEATURE_FLAG_DELETED = "feature_flag.deleted"
    AUDIT_EVENT = "audit.event"
    SYSTEM_ALERT = "system.alert"


class WebhookStatus(str, enum.Enum):
    """
    Enum for webhook status.
    """

    ACTIVE = "active"
    INACTIVE = "inactive"
    FAILED = "failed"  # Too many failures


class WebhookEndpoint(BaseModel):
    """
    Model for storing webhook endpoints.
    Inherits id, created_at, updated_at from BaseModel (implicitly).
    """

    __tablename__ = "webhook_endpoints"

    # id, created_at, updated_at are inherited from BaseModel

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    url: Mapped[str] = mapped_column(
        String(500), nullable=False
    )  # Use String, HttpUrl validation is Pydantic
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    secret: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True
    )  # For HMAC signature verification
    status: Mapped[str] = mapped_column(
        String(20), default=WebhookStatus.ACTIVE.value
    )
    created_by: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True
    )
    headers: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON, nullable=True
    )  # Custom headers
    retry_count: Mapped[int] = mapped_column(
        Integer, default=3
    )  # Number of retries
    timeout_seconds: Mapped[int] = mapped_column(Integer, default=5)  # Timeout

    # Relationships (example, adjust if needed)
    subscriptions: Mapped[List["WebhookSubscription"]] = relationship(
        back_populates="endpoint"
    )
    deliveries: Mapped[List["WebhookDelivery"]] = relationship(
        back_populates="endpoint"
    )

    # Create indexes for common query patterns
    __table_args__ = (Index("idx_webhook_endpoints_status", status),)


class WebhookSubscription(BaseModel):
    """
    Model for storing webhook subscriptions to event types.
    Inherits id, created_at, updated_at from BaseModel (implicitly).
    """

    __tablename__ = "webhook_subscriptions"

    # id, created_at, updated_at are inherited from BaseModel

    endpoint_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("webhook_endpoints.id", ondelete="CASCADE"),
        nullable=False,
    )
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    filter_conditions: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON, nullable=True
    )  # Optional conditions for triggering

    # Relationship
    endpoint: Mapped["WebhookEndpoint"] = relationship(
        back_populates="subscriptions"
    )

    # Create indexes for common query patterns
    __table_args__ = (
        Index(
            "idx_webhook_subscriptions_endpoint_event", endpoint_id, event_type
        ),
    )


class WebhookDelivery(BaseModel):
    """
    Model for storing webhook delivery attempts.
    Inherits id, created_at, updated_at from BaseModel (implicitly).
    """

    __tablename__ = "webhook_deliveries"

    # id, created_at, updated_at are inherited from BaseModel

    endpoint_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("webhook_endpoints.id", ondelete="CASCADE"),
        nullable=False,
    )
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    request_headers: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON, nullable=True
    )
    response_status: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True
    )
    response_body: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    success: Mapped[bool] = mapped_column(Boolean, default=False)
    attempt_count: Mapped[int] = mapped_column(Integer, default=1)
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True
    )
    next_retry_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True, index=True
    )

    # Relationship
    endpoint: Mapped["WebhookEndpoint"] = relationship(
        back_populates="deliveries"
    )

    # Create indexes for common query patterns
    __table_args__ = (
        Index("idx_webhook_deliveries_success", success),
        # Index on next_retry_at already added via mapped_column
    )


# Pydantic models for API - Use aliased PydanticBaseModel


class WebhookEndpointBase(PydanticBaseModel):
    name: str = Field(..., description="Name of the webhook endpoint")
    url: HttpUrl = Field(..., description="URL of the webhook endpoint")
    description: Optional[str] = Field(
        None, description="Description of the webhook endpoint"
    )
    secret: Optional[str] = Field(
        None, description="Secret for HMAC signature verification"
    )
    headers: Optional[Dict[str, str]] = Field(
        None, description="Custom headers to include in requests"
    )
    retry_count: Optional[int] = Field(
        3, ge=0, le=10, description="Number of retries (0-10)"
    )
    timeout_seconds: Optional[int] = Field(
        5, ge=1, le=30, description="Timeout in seconds (1-30)"
    )

    model_config = ConfigDict(from_attributes=True)


class WebhookEndpointCreate(WebhookEndpointBase):
    pass


class WebhookEndpointUpdate(PydanticBaseModel):
    name: Optional[str] = Field(
        None, description="Name of the webhook endpoint"
    )
    url: Optional[HttpUrl] = Field(
        None, description="URL of the webhook endpoint"
    )
    description: Optional[str] = Field(
        None, description="Description of the webhook endpoint"
    )
    secret: Optional[str] = Field(
        None, description="Secret for HMAC signature verification"
    )
    status: Optional[WebhookStatus] = Field(
        None, description="Status of the webhook endpoint"
    )
    headers: Optional[Dict[str, str]] = Field(
        None, description="Custom headers to include in requests"
    )
    retry_count: Optional[int] = Field(
        None, ge=0, le=10, description="Number of retries (0-10)"
    )
    timeout_seconds: Optional[int] = Field(
        None, ge=1, le=30, description="Timeout in seconds (1-30)"
    )


class WebhookSubscriptionBase(PydanticBaseModel):
    event_type: WebhookEventType = Field(
        ..., description="Event type to subscribe to"
    )
    filter_conditions: Optional[Dict[str, Any]] = Field(
        None, description="Optional conditions for triggering"
    )


class WebhookSubscriptionCreate(WebhookSubscriptionBase):
    pass


class WebhookEndpointResponse(WebhookEndpointBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class WebhookEndpointListResponse(WebhookEndpointResponse):
    secret: Optional[str] = Field(
        None, exclude=True
    )  # Explicitly exclude secret


class WebhookSubscriptionResponse(WebhookSubscriptionBase):
    id: int
    endpoint_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WebhookDeliveryResponse(PydanticBaseModel):
    id: int
    endpoint_id: int
    event_type: str
    payload: Dict[str, Any]
    response_status: Optional[int] = None
    success: bool
    attempt_count: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    next_retry_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class WebhookTestRequest(PydanticBaseModel):
    event_type: WebhookEventType = Field(..., description="Event type to test")
    payload: Dict[str, Any] = Field(..., description="Test payload data")
