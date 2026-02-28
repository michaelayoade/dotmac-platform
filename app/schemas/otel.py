from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class OtelConfigCreate(BaseModel):
    endpoint_url: str = Field(..., min_length=1, max_length=512)
    protocol: str = Field(default="http/protobuf")
    headers: dict[str, str] | None = None
    export_interval_seconds: int = Field(default=60, ge=10, le=3600)

    @field_validator("endpoint_url")
    @classmethod
    def validate_endpoint_url(cls, v: str) -> str:
        v = v.strip()
        if not v.startswith(("http://", "https://")):
            raise ValueError("Endpoint URL must start with http:// or https://")
        return v

    @field_validator("protocol")
    @classmethod
    def validate_protocol(cls, v: str) -> str:
        allowed = {"grpc", "http/protobuf", "http/json"}
        if v not in allowed:
            raise ValueError(f"Protocol must be one of: {', '.join(sorted(allowed))}")
        return v


class OtelConfigRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    instance_id: uuid.UUID
    endpoint_url: str
    protocol: str
    export_interval_seconds: int
    is_active: bool
    last_export_at: datetime | None = None
    last_error: str | None = None
    created_at: datetime
    updated_at: datetime


class OtelTestResult(BaseModel):
    success: bool
    message: str
    latency_ms: float | None = None

    class Config:
        extra = "ignore"
