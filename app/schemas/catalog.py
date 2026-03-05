from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CatalogItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    catalog_id: UUID
    label: str
    version: str
    git_ref: str
    git_repo_id: UUID
    notes: str | None = None
    module_slugs: list[str] = []
    flag_keys: list[str] = []
    is_active: bool
    created_at: datetime | None = None
