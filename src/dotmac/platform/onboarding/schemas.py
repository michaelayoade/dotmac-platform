"""
Onboarding schemas.

Pydantic models for onboarding requests and responses.
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class OnboardingRequest(BaseModel):
    """Request to onboard a new tenant."""

    model_config = ConfigDict()

    # Tenant info
    tenant_name: str = Field(..., min_length=2, max_length=100)
    tenant_slug: str | None = Field(None, pattern=r"^[a-z0-9-]+$", max_length=50)
    email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")

    # Plan selection
    plan_type: str = Field(default="starter")  # free, starter, professional, enterprise

    # License configuration
    max_subscribers: int = Field(default=100, ge=1)
    max_activations: int = Field(default=1, ge=1)
    trial_days: int | None = Field(default=14, ge=0)

    # Deployment preferences
    deployment_backend: str = Field(default="docker_compose")  # kubernetes, docker_compose, awx_ansible
    deployment_region: str | None = None

    # Additional metadata
    company_name: str | None = None
    company_size: str | None = None
    industry: str | None = None
    country: str | None = None


class DeploymentCredentials(BaseModel):
    """Credentials needed to deploy ISP instance."""

    model_config = ConfigDict()

    tenant_id: str
    license_key: str
    service_secret: str
    platform_url: str


class DockerComposeConfig(BaseModel):
    """Docker Compose configuration for tenant deployment."""

    model_config = ConfigDict()

    compose_yaml: str
    env_file_content: str
    deployment_instructions: str


class OnboardingResponse(BaseModel):
    """Response from tenant onboarding."""

    model_config = ConfigDict()

    success: bool
    message: str

    # Tenant details
    tenant_id: str
    tenant_name: str
    tenant_slug: str

    # License details
    license_id: str
    license_key: str
    license_expires_at: datetime | None

    # Deployment credentials
    credentials: DeploymentCredentials

    # Docker Compose configuration (if docker_compose backend)
    docker_compose: DockerComposeConfig | None = None

    # Features
    features: dict[str, Any]

    # Plan limits
    limits: dict[str, int]


class OnboardingStatusResponse(BaseModel):
    """Status of tenant onboarding."""

    model_config = ConfigDict()

    tenant_id: str
    status: str  # pending, active, provisioning, failed
    license_status: str
    deployment_status: str | None
    created_at: datetime
    activated_at: datetime | None
