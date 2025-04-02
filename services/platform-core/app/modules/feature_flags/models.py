from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel as PydanticBaseModel
from pydantic import ConfigDict, Field
from shared_core.base.base_model import BaseModel
from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column


class FeatureFlag(BaseModel):
    """
    Model for feature flags.
    Inherits id, created_at, updated_at from BaseModel.
    """

    __tablename__ = "featureflag"

    key: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        comment="Unique key for the feature flag",
    )
    name: Mapped[str] = mapped_column(String(255), comment="Human-readable name for the feature flag")
    description: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, comment="Detailed description of the feature flag"
    )
    is_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        index=True,
        comment="Global kill switch for the flag",
    )
    targeting_rules: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        comment=("JSON defining specific targeting rules " "(e.g., users, percentages)"),
    )
    created_by: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Identifier of the user who created the flag",
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Identifier of the user who last updated the flag",
    )
    version: Mapped[int] = mapped_column(
        Integer,
        default=1,
        comment="Version number, incremented on each update",
    )

    def __repr__(self) -> str:
        return f"<FeatureFlag(key='{self.key}', is_enabled={self.is_enabled})>"


# --- Pydantic Models for API Input/Output ---
class FeatureFlagBase(PydanticBaseModel):
    """Base Pydantic model for common feature flag attributes."""

    key: str = Field(..., max_length=255, description="Unique key for the feature flag")
    name: str = Field(
        ...,
        max_length=255,
        description="Human-readable name for the feature flag",
    )
    description: Optional[str] = Field(None, description="Detailed description of the feature flag")
    is_enabled: bool = Field(False, description="Whether the feature flag is globally enabled")
    targeting_rules: Optional[dict] = Field(
        None,
        description=("JSON defining specific targeting rules " "(e.g., users, percentages)"),
    )


class FeatureFlagCreate(FeatureFlagBase):
    """
    Schema for creating a feature flag.
    """

    created_by: Optional[str] = Field(None, description="Identifier of the user who created the flag")


class FeatureFlagUpdate(PydanticBaseModel):
    """
    Schema for updating a feature flag.
    """

    name: Optional[str] = Field(None, description="Name of the feature flag")
    description: Optional[str] = Field(None, description="Description of the feature flag")
    is_enabled: Optional[bool] = Field(None, description="Whether the feature flag is enabled")
    targeting_rules: Optional[dict] = Field(
        None,
        description=("JSON defining specific targeting rules " "(e.g., users, percentages)"),
    )
    updated_by: Optional[str] = Field(None, description="Identifier of the user who last updated the flag")


class FeatureFlagResponse(FeatureFlagBase):
    """
    Schema for feature flag response.
    """

    id: int
    is_enabled: bool
    targeting_rules: Optional[dict] = Field(
        None,
        description=("JSON defining specific targeting rules " "(e.g., users, percentages)"),
    )
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = Field(None, description="Identifier of the user who created the flag")
    updated_by: Optional[str] = Field(None, description="Identifier of the user who last updated the flag")
    version: int = Field(..., description="Version number, incremented on each update")

    model_config = ConfigDict(from_attributes=True)


class FeatureFlagCheck(PydanticBaseModel):
    """
    Schema for checking if a feature flag is enabled for a user.
    """

    user_id: Optional[str] = Field(None, description="User ID")
    groups: Optional[List[str]] = Field(None, description="List of groups")
    attributes: Optional[Dict[str, Any]] = Field(None, description="User attributes")


class FeatureFlagCheckResponse(PydanticBaseModel):
    """
    Schema for feature flag check response.
    """

    key: str
    is_enabled: bool
