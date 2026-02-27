from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CatalogReleaseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    release_id: UUID
    name: str
    version: str
    git_ref: str
    git_repo_id: UUID
    notes: str | None = None
    is_active: bool
    created_at: datetime | None = None


class CatalogBundleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    bundle_id: UUID
    name: str
    description: str | None = None
    module_slugs: list[str]
    flag_keys: list[str]
    is_active: bool
    created_at: datetime | None = None


class CatalogItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    catalog_id: UUID
    label: str
    release_id: UUID
    bundle_id: UUID
    is_active: bool
    created_at: datetime | None = None
