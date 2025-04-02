from datetime import datetime
from typing import Any, Dict, Optional

import sqlalchemy as sa

# Alias Pydantic's BaseModel to avoid conflict
from pydantic import BaseModel as PydanticBaseModel
from pydantic import ConfigDict, Field
from shared_core.base.base_model import BaseModel
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column


class AuditLog(BaseModel):
    """
    Audit log model for tracking sensitive actions.
    Inherits id, created_at, updated_at from BaseModel.
    """

    # Explicitly define tablename (though BaseModel should handle it)
    __tablename__ = "auditlog"

    actor_id: Mapped[str] = mapped_column(sa.String(255), index=True)
    event_type: Mapped[str] = mapped_column(sa.String(100), index=True)
    resource_type: Mapped[str] = mapped_column(sa.String(100), index=True)
    resource_id: Mapped[str] = mapped_column(
        sa.String(255),
        index=True,
        comment="Identifier of the resource being acted upon",
    )
    action: Mapped[str] = mapped_column(
        sa.String(50),
        index=True,
        comment="Type of action performed (e.g., CREATE, UPDATE, DELETE)",
    )
    old_value: Mapped[Optional[str]] = mapped_column(sa.Text, nullable=True)
    new_value: Mapped[Optional[str]] = mapped_column(sa.Text, nullable=True)
    event_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(
        sa.String(45),
        nullable=True,
        comment="IP address from which the action originated",
    )
    user_agent: Mapped[Optional[str]] = mapped_column(
        sa.String(255),
        nullable=True,
        comment="User agent string of the client performing the action",
    )
    details: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        comment="Detailed information about the change (e.g., before/after values)",
    )
    timestamp: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True))


# Pydantic models for API
class AuditLogCreate(PydanticBaseModel):
    """
    Schema for creating an audit log entry.
    """

    actor_id: str
    event_type: str = Field(
        ...,
        max_length=50,
        description="Type of the event (e.g., 'user_login', 'config_update')",
    )
    resource_type: Optional[str] = Field(
        None,
        max_length=50,
        description="Type of the resource being acted upon (e.g., 'user', 'config')",
    )
    resource_id: Optional[str] = Field(
        None,
        max_length=255,
        description="Identifier of the specific resource being acted upon",
    )
    action: str = Field(
        ...,
        max_length=50,
        description="Action performed (e.g., 'create', 'update')",
    )
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    event_metadata: Optional[Dict[str, Any]] = Field(None, description="Additional contextual information as JSON")
    ip_address: Optional[str] = None


class AuditLogResponse(PydanticBaseModel):
    """
    Schema for audit log response.
    """

    id: int
    actor_id: str
    event_type: str
    resource_type: Optional[str]  # Allow optional based on ORM
    resource_id: Optional[str]  # Allow optional based on ORM
    action: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    event_metadata: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime

    # Use Pydantic V2 config
    model_config = ConfigDict(from_attributes=True)
