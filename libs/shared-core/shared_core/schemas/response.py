"""
Common Pydantic response schemas for Dotmac platform services.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BaseResponse(BaseModel):
    """
    A base Pydantic schema for API responses including common fields.
    Configured to work with ORM models (from_attributes=True).
    """

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
