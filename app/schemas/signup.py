from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class SignupStartRequest(BaseModel):
    org_name: str = Field(min_length=1, max_length=200)
    org_code: str | None = Field(default=None, max_length=40)
    catalog_item_id: UUID
    admin_email: EmailStr
    admin_username: str = Field(default="admin", min_length=1, max_length=80)
    admin_password: str = Field(min_length=8, max_length=255)
    domain: str | None = Field(default=None, max_length=255)
    server_id: UUID | None = None
    trial_days: int | None = Field(default=None, ge=1, le=90)


class SignupStartResponse(BaseModel):
    signup_id: UUID
    status: str
    email_sent: bool


class SignupResendRequest(BaseModel):
    signup_id: UUID


class SignupResendResponse(BaseModel):
    signup_id: UUID
    status: str
    email_sent: bool


class SignupVerifyRequest(BaseModel):
    signup_id: UUID
    token: str = Field(min_length=8, max_length=200)


class SignupVerifyResponse(BaseModel):
    signup_id: UUID
    status: str
    verified_at: datetime | None = None


class SignupBillingConfirmRequest(BaseModel):
    billing_reference: str | None = Field(default=None, max_length=120)


class SignupBillingConfirmResponse(BaseModel):
    signup_id: UUID
    status: str
    billing_confirmed_at: datetime


class SignupProvisionResponse(BaseModel):
    signup_id: UUID
    instance_id: UUID
    deployment_id: str
    status: str
    app_url: str | None = None
