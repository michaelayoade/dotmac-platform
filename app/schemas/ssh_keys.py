from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.ssh_key import SSHKeyType


class SSHKeyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    key_id: UUID
    label: str
    public_key: str
    fingerprint: str
    key_type: SSHKeyType
    bit_size: int | None = None
    created_by: str | None = None
    is_active: bool
    created_at: datetime | None = None


class SSHKeyCreateResponse(BaseModel):
    key_id: UUID
    label: str
    fingerprint: str


class SSHPublicKeyResponse(BaseModel):
    public_key: str
    fingerprint: str
