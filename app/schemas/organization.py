from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class OrganizationBase(BaseModel):
    org_code: str = Field(min_length=2, max_length=40)
    org_name: str = Field(min_length=2, max_length=200)
    is_active: bool = True


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    org_name: str | None = Field(default=None, min_length=2, max_length=200)
    is_active: bool | None = None


class OrganizationRead(OrganizationBase):
    org_id: UUID
    member_count: int | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class OrganizationMemberCreate(BaseModel):
    person_id: UUID


class OrganizationMemberRead(BaseModel):
    org_id: UUID
    person_id: UUID
    is_active: bool = True
    created_at: datetime | None = None
