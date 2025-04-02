"""
Models for the logging module.
"""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel as PydanticBaseModel
from pydantic import ConfigDict, Field
from shared_core.base.base_model import BaseModel
from sqlalchemy import DateTime, Index, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column


class LogEntry(BaseModel):
    """
    Model for storing structured log entries in the database.
    """

    __tablename__ = "log_entries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), index=True)
    level: Mapped[str] = mapped_column(String(10), index=True)  # INFO, WARNING, ERROR, DEBUG, etc.
    service: Mapped[str] = mapped_column(String(100), index=True)  # Service or component name
    message: Mapped[str] = mapped_column(Text)
    context: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)  # Additional context data
    trace_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)  # For distributed tracing
    span_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # For distributed tracing
    user_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)  # User ID if applicable
    ip_address: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Client IP address if applicable

    # Create indexes for common query patterns
    __table_args__ = (
        Index("ix_log_entries_timestamp_level", "timestamp", "level"),
        Index("ix_log_entries_service_timestamp", "service", "timestamp"),
    )


# Pydantic models for API
class LogEntryBase(PydanticBaseModel):
    """
    Base schema for log entries.
    """

    level: str = Field(..., max_length=10)
    service: str = Field(..., max_length=100)
    message: str
    context: Optional[Dict[str, Any]] = None
    trace_id: Optional[str] = None
    span_id: Optional[str] = None
    user_id: Optional[str] = None
    ip_address: Optional[str] = None


class LogEntryCreate(LogEntryBase):
    """
    Schema for creating a new log entry.
    """

    pass


class LogEntryResponse(LogEntryBase):
    """
    Schema for log entry response.
    """

    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class LogQueryParams(PydanticBaseModel):
    """
    Schema for log query parameters.
    """

    level: Optional[str] = None
    service: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    limit: int = 100
    offset: int = 0


class ExportRequest(PydanticBaseModel):
    """
    Schema for export request.
    """

    level: Optional[str] = None
    service_name: Optional[str] = Field(None, alias="service")
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class ExportResponse(PydanticBaseModel):
    """
    Schema for export response.
    """

    message: str
    export_id: str  # Could be a task ID for background processing


class LogStatsSummary(PydanticBaseModel):
    """
    Schema for log stats summary.
    """

    total_logs: int
    levels_count: Dict[str, int]
    services_count: Dict[str, int]
