"""
Onboarding Service.

Handles tenant onboarding workflow:
1. Create tenant
2. Create license
3. Generate service credentials
4. Generate deployment instructions
"""

import secrets
from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

import structlog
import yaml
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dotmac.platform.licensing.models import License, LicenseModel, LicenseStatus, LicenseType
from dotmac.platform.tenant.models import Tenant, TenantPlanType, TenantStatus

from .schemas import (
    DeploymentCredentials,
    DockerComposeConfig,
    OnboardingRequest,
    OnboardingResponse,
)

logger = structlog.get_logger(__name__)

# Plan configurations
PLAN_CONFIGS = {
    "free": {
        "max_subscribers": 50,
        "max_activations": 1,
        "max_users": 2,
        "max_api_calls_per_month": 5000,
        "max_storage_gb": 1,
        "features": {
            "radius_enabled": True,
            "customer_portal": True,
            "email_notifications": True,
            "sms_notifications": False,
            "fiber_management": False,
            "field_service": False,
        },
    },
    "starter": {
        "max_subscribers": 500,
        "max_activations": 2,
        "max_users": 5,
        "max_api_calls_per_month": 25000,
        "max_storage_gb": 10,
        "features": {
            "radius_enabled": True,
            "customer_portal": True,
            "email_notifications": True,
            "sms_notifications": True,
            "fiber_management": False,
            "field_service": False,
        },
    },
    "professional": {
        "max_subscribers": 2500,
        "max_activations": 5,
        "max_users": 25,
        "max_api_calls_per_month": 100000,
        "max_storage_gb": 50,
        "features": {
            "radius_enabled": True,
            "customer_portal": True,
            "email_notifications": True,
            "sms_notifications": True,
            "fiber_management": True,
            "field_service": True,
        },
    },
    "enterprise": {
        "max_subscribers": 10000,
        "max_activations": 10,
        "max_users": 100,
        "max_api_calls_per_month": 500000,
        "max_storage_gb": 200,
        "features": {
            "radius_enabled": True,
            "customer_portal": True,
            "email_notifications": True,
            "sms_notifications": True,
            "fiber_management": True,
            "field_service": True,
            "voltha_enabled": True,
            "genieacs_enabled": True,
        },
    },
}


class OnboardingService:
    """Service for tenant onboarding."""

    def __init__(
        self,
        db: AsyncSession,
        platform_url: str = "https://platform.dotmac.io",
    ):
        self.db = db
        self.platform_url = platform_url

    async def onboard_tenant(
        self,
        request: OnboardingRequest,
        created_by: str | None = None,
    ) -> OnboardingResponse:
        """
        Complete tenant onboarding workflow.

        Steps:
        1. Create tenant record
        2. Create license with features based on plan
        3. Generate service credentials
        4. Generate deployment instructions
        """
        logger.info(
            "onboarding.start",
            tenant_name=request.tenant_name,
            plan_type=request.plan_type,
            deployment_backend=request.deployment_backend,
        )

        # Get plan config
        plan_config = PLAN_CONFIGS.get(request.plan_type, PLAN_CONFIGS["starter"])

        # Generate slug if not provided
        slug = request.tenant_slug or self._generate_slug(request.tenant_name)

        # Check if tenant with slug exists
        existing = await self.db.execute(
            select(Tenant).where(Tenant.slug == slug)
        )
        if existing.scalar_one_or_none():
            raise ValueError(f"Tenant with slug '{slug}' already exists")

        # Create tenant
        tenant_id = str(uuid4())
        tenant = Tenant(
            id=tenant_id,
            name=request.tenant_name,
            slug=slug,
            email=request.email,
            status=TenantStatus.TRIAL if request.trial_days else TenantStatus.ACTIVE,
            plan_type=TenantPlanType(request.plan_type),
            trial_ends_at=datetime.now(UTC) + timedelta(days=request.trial_days) if request.trial_days else None,
            max_users=plan_config["max_users"],
            max_api_calls_per_month=plan_config["max_api_calls_per_month"],
            max_storage_gb=plan_config["max_storage_gb"],
            features=plan_config["features"],
            settings={},
            company_size=request.company_size,
            industry=request.industry,
            country=request.country,
            created_by=created_by,
        )
        self.db.add(tenant)
        await self.db.flush()

        logger.info(
            "onboarding.tenant_created",
            tenant_id=tenant_id,
            slug=slug,
        )

        # Generate license key and service secret
        license_key = self._generate_license_key()
        service_secret = secrets.token_urlsafe(32)

        # Calculate expiry
        expiry_date = None
        if request.trial_days:
            expiry_date = datetime.now(UTC) + timedelta(days=request.trial_days)

        # Build license features
        license_features = {
            "features": [
                {"code": "max_subscribers", "value": request.max_subscribers or plan_config["max_subscribers"]},
                *[{"code": k, "value": v} for k, v in plan_config["features"].items()],
            ],
            "plan_type": request.plan_type,
        }

        # Create license
        license_id = str(uuid4())
        license_obj = License(
            id=license_id,
            license_key=license_key,
            product_id="dotmac-isp",
            product_name="DotMac ISP Platform",
            product_version="1.0",
            license_type=LicenseType.TRIAL if request.trial_days else LicenseType.SUBSCRIPTION,
            license_model=LicenseModel.SITE_LICENSE,
            tenant_id=tenant_id,
            issued_to=request.tenant_name,
            max_activations=request.max_activations or plan_config["max_activations"],
            current_activations=0,
            features=license_features,
            restrictions={},
            issued_date=datetime.now(UTC),
            expiry_date=expiry_date,
            status=LicenseStatus.ACTIVE,
            trial_period_days=request.trial_days,
            grace_period_days=7,
            extra_data={
                "service_secret_hash": secrets.token_hex(16),  # Store hash, not actual secret
                "onboarded_at": datetime.now(UTC).isoformat(),
                "created_by": created_by,  # Track who created (None for self-service)
            },
        )
        self.db.add(license_obj)

        logger.info(
            "onboarding.license_created",
            license_id=license_id,
            tenant_id=tenant_id,
        )

        # Build credentials
        credentials = DeploymentCredentials(
            tenant_id=tenant_id,
            license_key=license_key,
            service_secret=service_secret,
            platform_url=self.platform_url,
        )

        # Generate docker-compose if requested
        docker_compose = None
        if request.deployment_backend == "docker_compose":
            docker_compose = self._generate_docker_compose(
                credentials=credentials,
                tenant_name=request.tenant_name,
                plan_type=request.plan_type,
            )

        await self.db.commit()

        logger.info(
            "onboarding.complete",
            tenant_id=tenant_id,
            license_id=license_id,
        )

        return OnboardingResponse(
            success=True,
            message=f"Tenant '{request.tenant_name}' onboarded successfully",
            tenant_id=tenant_id,
            tenant_name=request.tenant_name,
            tenant_slug=slug,
            license_id=license_id,
            license_key=license_key,
            license_expires_at=expiry_date,
            credentials=credentials,
            docker_compose=docker_compose,
            features=plan_config["features"],
            limits={
                "max_subscribers": request.max_subscribers or plan_config["max_subscribers"],
                "max_activations": request.max_activations or plan_config["max_activations"],
                "max_users": plan_config["max_users"],
                "max_api_calls_per_month": plan_config["max_api_calls_per_month"],
                "max_storage_gb": plan_config["max_storage_gb"],
            },
        )

    def _generate_slug(self, name: str) -> str:
        """Generate URL-safe slug from name."""
        import re
        slug = name.lower()
        slug = re.sub(r"[^a-z0-9]+", "-", slug)
        slug = slug.strip("-")
        # Add random suffix for uniqueness
        suffix = secrets.token_hex(4)
        return f"{slug}-{suffix}"

    def _generate_license_key(self) -> str:
        """Generate a license key in format: LIC-XXXX-XXXX-XXXX-XXXX."""
        parts = [secrets.token_hex(2).upper() for _ in range(4)]
        return f"LIC-{'-'.join(parts)}"

    def _generate_docker_compose(
        self,
        credentials: DeploymentCredentials,
        tenant_name: str,
        plan_type: str,
    ) -> DockerComposeConfig:
        """Generate docker-compose configuration for tenant."""

        # Resource allocation based on plan
        resources = {
            "free": {"cpu": "1", "memory": "2g"},
            "starter": {"cpu": "2", "memory": "4g"},
            "professional": {"cpu": "4", "memory": "8g"},
            "enterprise": {"cpu": "8", "memory": "16g"},
        }.get(plan_type, {"cpu": "2", "memory": "4g"})

        compose = {
            "version": "3.8",
            "services": {
                "isp-api": {
                    "image": "dotmac/isp:latest",
                    "container_name": "dotmac-isp-api",
                    "restart": "unless-stopped",
                    "environment": [
                        "PLATFORM_URL=${PLATFORM_URL}",
                        "TENANT_ID=${TENANT_ID}",
                        "ISP_LICENSE_KEY=${ISP_LICENSE_KEY}",
                        "PLATFORM_SERVICE_TOKEN=${PLATFORM_SERVICE_TOKEN}",
                        "DATABASE_URL=postgresql://dotmac:${DB_PASSWORD}@postgres:5432/dotmac",
                        "REDIS_URL=redis://redis:6379/0",
                        "SECRET_KEY=${SECRET_KEY}",
                    ],
                    "ports": ["8000:8000"],
                    "depends_on": ["postgres", "redis"],
                    "deploy": {
                        "resources": {
                            "limits": {
                                "cpus": resources["cpu"],
                                "memory": resources["memory"],
                            },
                        },
                    },
                },
                "postgres": {
                    "image": "postgres:15-alpine",
                    "container_name": "dotmac-postgres",
                    "restart": "unless-stopped",
                    "environment": [
                        "POSTGRES_USER=dotmac",
                        "POSTGRES_PASSWORD=${DB_PASSWORD}",
                        "POSTGRES_DB=dotmac",
                    ],
                    "volumes": ["postgres_data:/var/lib/postgresql/data"],
                },
                "redis": {
                    "image": "redis:7-alpine",
                    "container_name": "dotmac-redis",
                    "restart": "unless-stopped",
                    "volumes": ["redis_data:/data"],
                },
            },
            "volumes": {
                "postgres_data": {},
                "redis_data": {},
            },
        }

        compose_yaml = yaml.dump(compose, default_flow_style=False)

        # Generate .env file
        env_content = f"""# DotMac ISP Configuration
# Tenant: {tenant_name}
# Generated: {datetime.now(UTC).isoformat()}

# Platform Connection
PLATFORM_URL={credentials.platform_url}
TENANT_ID={credentials.tenant_id}
ISP_LICENSE_KEY={credentials.license_key}
PLATFORM_SERVICE_TOKEN={credentials.service_secret}

# Database
DB_PASSWORD={secrets.token_urlsafe(24)}

# Application
SECRET_KEY={secrets.token_urlsafe(32)}

# Optional: Custom domain (update after DNS setup)
# DOMAIN_NAME=isp.yourdomain.com
"""

        instructions = f"""# DotMac ISP Deployment Instructions

## Tenant: {tenant_name}
## Plan: {plan_type}

### Prerequisites
- Docker and Docker Compose installed
- At least {resources['cpu']} CPU cores and {resources['memory']} memory available
- Ports 8000 exposed (or configure reverse proxy)

### Quick Start

1. **Save the configuration files**
   - Save `docker-compose.yml` to your deployment directory
   - Save `.env` file in the same directory (keep this secure!)

2. **Start the services**
   ```bash
   docker-compose up -d
   ```

3. **Verify the deployment**
   ```bash
   docker-compose ps
   curl http://localhost:8000/health
   ```

4. **View logs**
   ```bash
   docker-compose logs -f isp-api
   ```

### Important Notes

- **Keep your credentials secure!** The `.env` file contains sensitive information.
- The ISP service will automatically validate its license on startup.
- Configuration is synced from the Platform every 5 minutes.
- Usage metrics are reported to the Platform for license enforcement.

### Upgrading

```bash
docker-compose pull
docker-compose up -d
```

### Troubleshooting

- Check logs: `docker-compose logs isp-api`
- Verify license: The service will fail to start if the license is invalid
- Check Platform connectivity: Ensure the service can reach {credentials.platform_url}

### Support

Visit https://docs.dotmac.io or contact support@dotmac.io
"""

        return DockerComposeConfig(
            compose_yaml=compose_yaml,
            env_file_content=env_content,
            deployment_instructions=instructions,
        )
