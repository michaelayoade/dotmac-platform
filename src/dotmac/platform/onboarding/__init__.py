"""
Tenant Onboarding Module.

Handles the complete tenant onboarding flow:
- License key generation
- Service secret generation
- Docker-compose template generation
- Deployment instructions
"""

from .router import router
from .service import OnboardingService
from .schemas import (
    OnboardingRequest,
    OnboardingResponse,
    DeploymentCredentials,
    DockerComposeConfig,
)

__all__ = [
    "router",
    "OnboardingService",
    "OnboardingRequest",
    "OnboardingResponse",
    "DeploymentCredentials",
    "DockerComposeConfig",
]
