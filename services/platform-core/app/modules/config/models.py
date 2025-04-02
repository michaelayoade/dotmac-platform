from datetime import datetime
from typing import Any, List, Optional

# Alias Pydantic BaseModel
from pydantic import BaseModel as PydanticBaseModel
from pydantic import ConfigDict, Field
from shared_core.base.base_model import BaseModel
from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship


class ConfigScope(BaseModel):
    """
    Configuration scope model (e.g., 'auth', 'billing').
    """

    __tablename__ = "configscope"

    # Use mapped_column for explicit column definitions
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationship - Mapped[List[...]] is standard for one-to-many
    items: Mapped[List["ConfigItem"]] = relationship("ConfigItem", back_populates="scope", cascade="all, delete-orphan")


class ConfigItem(BaseModel):
    """
    Configuration item model.
    """

    __tablename__ = "configitem"

    key: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        comment="Unique key for the config item",
    )
    value: Mapped[Any] = mapped_column(JSONB, comment="Value of the config item, stored as JSON")
    scope_id: Mapped[int] = mapped_column(
        ForeignKey("configscope.id"),
        comment="Scope this config item belongs to",
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True, comment="Description of the config item")
    version: Mapped[int] = mapped_column(Integer, default=1, comment="Version number, incremented on update")
    is_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        comment="Whether the config item is currently enabled",
    )

    # Foreign keys - use Mapped[int] for the type, keep ForeignKey in mapped_column

    # Relationships
    scope: Mapped["ConfigScope"] = relationship("ConfigScope", back_populates="items")
    history: Mapped[List["ConfigHistory"]] = relationship(
        "ConfigHistory",
        back_populates="config_item",
        cascade="all, delete-orphan",
    )

    # Constraints
    __table_args__ = (UniqueConstraint("scope_id", "key", name="uix_config_scope_key"),)


class ConfigHistory(BaseModel):
    """
    Configuration history model for tracking changes.
    """

    __tablename__ = "confighistory"

    value: Mapped[str] = mapped_column(Text, nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    changed_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Foreign Key
    config_id: Mapped[int] = mapped_column(ForeignKey("configitem.id"), nullable=False)

    # Relationship
    config_item: Mapped["ConfigItem"] = relationship("ConfigItem", back_populates="history")


# Pydantic models for API


# Use aliased PydanticBaseModel
class ConfigScopeBase(PydanticBaseModel):
    name: str = Field(..., max_length=100, description="Scope name (e.g., 'auth')")
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# Use aliased PydanticBaseModel
class ConfigScopeCreate(ConfigScopeBase):
    pass


# Use aliased PydanticBaseModel
class ConfigScopeUpdate(ConfigScopeBase):
    name: Optional[str] = None  # Allow partial updates

    model_config = ConfigDict(from_attributes=True)


# Use aliased PydanticBaseModel
class ConfigScopeResponse(ConfigScopeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Use aliased PydanticBaseModel
class ConfigItemBase(PydanticBaseModel):
    key: str = Field(..., max_length=255, description="Configuration key")
    value: str = Field(..., description="Configuration value")
    description: Optional[str] = None
    is_enabled: bool = False

    model_config = ConfigDict(from_attributes=True)


# Use aliased PydanticBaseModel
class ConfigItemCreate(ConfigItemBase):
    scope_id: int

    model_config = ConfigDict(from_attributes=True)


# Use aliased PydanticBaseModel
class ConfigItemUpdate(PydanticBaseModel):  # Separate base for update flexibility
    value: Optional[str] = None
    description: Optional[str] = None
    is_enabled: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


# Use aliased PydanticBaseModel
class ConfigItemResponse(ConfigItemBase):
    id: int
    scope_id: int
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Use aliased PydanticBaseModel
class ConfigHistoryResponse(PydanticBaseModel):
    id: int
    config_id: int
    version: int
    key: str
    value: str
    description: Optional[str]
    is_enabled: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
