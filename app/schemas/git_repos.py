from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.git_repository import GitAuthType


class GitRepoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    repo_id: UUID
    label: str
    url: str | None = None
    auth_type: GitAuthType
    default_branch: str
    is_platform_default: bool
    registry_url: str | None = None
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None
