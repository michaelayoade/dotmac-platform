from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.instance import AccountingFramework, SectorType


class InstanceCreateRequest(BaseModel):
    server_id: UUID
    org_code: str = Field(min_length=1, max_length=40)
    org_name: str = Field(min_length=1, max_length=200)
    sector_type: SectorType | None = None
    framework: AccountingFramework | None = None
    currency: str | None = Field(default=None, max_length=3)
    admin_email: EmailStr | None = None
    admin_username: str = Field(default="admin", min_length=1, max_length=80)
    domain: str | None = Field(default=None, max_length=255)
    catalog_item_id: UUID
    app_port: int | None = Field(default=None, ge=1, le=65535)
    db_port: int | None = Field(default=None, ge=1, le=65535)
    redis_port: int | None = Field(default=None, ge=1, le=65535)


class InstanceCreateResponse(BaseModel):
    instance_id: UUID
    server_id: UUID
    org_code: str
    org_name: str
    app_url: str | None = None
    domain: str | None = None
    status: str
    catalog_item_id: UUID | None = None
