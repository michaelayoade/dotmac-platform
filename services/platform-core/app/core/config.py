"""
Core configuration for the Platform Core service.

This module defines the settings for the Platform Core service.
"""

import logging

from pydantic import BaseModel, Field, PostgresDsn, RedisDsn, field_validator
from pydantic_settings import SettingsConfigDict

# Import shared core components
from shared_core.config.settings import BaseCoreSettings, load_settings

log = logging.getLogger(__name__)


# --- Component Settings Classes (Use BaseModel for simple structure) ---


class ApiSettings(BaseModel):
    """API settings."""

    NAME: str = "Platform Core API"
    VERSION: str = "v1"
    DESCRIPTION: str = None
    DOCS_URL: str = "/docs"
    REDOC_URL: str = "/redoc"
    OPENAPI_URL: str = "/openapi.json"
    ALLOWED_HOSTS: list[str] = ["*"]  # Default to allow all
    API_V1_STR: str = "/api/v1"

    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        """Parse CORS origins from str or list."""
        if isinstance(v, str) and not v.startswith("["):
            # Parse comma-separated list
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            # Already a list
            return v
        elif isinstance(v, str) and v.startswith("["):
            # String representation of a list (e.g., from env var)
            try:
                import json

                return json.loads(v)
            except json.JSONDecodeError:
                raise ValueError(f"Invalid JSON format for ALLOWED_HOSTS: {v}")
        # Return as is if it's already a list or '*' etc.
        return v


class ServerSettings(BaseModel):
    """Server settings."""

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    RELOAD: bool = False


class DatabaseSettings(BaseModel):
    """Database settings."""

    DATABASE_URL: PostgresDsn | str
    DB_ECHO: bool = False  # Added for SQLAlchemy logging control

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v):
        """Validate and convert DATABASE_URL to PostgresDsn."""
        if isinstance(v, str):
            # Handle SQLite URLs for testing
            if v.startswith("sqlite"):
                return v
            # Try to parse as PostgresDsn
            return PostgresDsn(v)
        return v


class RedisSettings(BaseModel):
    """Redis settings."""

    REDIS_URL: RedisDsn | str

    @field_validator("REDIS_URL", mode="before")
    @classmethod
    def validate_redis_url(cls, v):
        """Validate and convert REDIS_URL to RedisDsn."""
        if isinstance(v, str):
            # Try to parse as RedisDsn
            return RedisDsn(v)
        return v


class SecuritySettings(BaseModel):
    """Security settings."""

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


# --- Main Application Settings Class (inherits BaseCoreSettings for common ones) ---
class PlatformCoreSettings(BaseCoreSettings):  # Inherit from BaseCoreSettings
    """Main settings model combining all components."""

    # General
    ENV: str = Field(default="development", description="Application environment")
    PROJECT_NAME: str = Field(default="Platform Core", description="Name of the project")
    VERSION: str = Field(default="0.1.0", description="API version")

    # Components (Declare type only)
    API: ApiSettings
    SERVER: ServerSettings
    DB: DatabaseSettings
    CACHE: RedisSettings
    SECURITY: SecuritySettings

    model_config = SettingsConfigDict(
        extra="ignore",
        # Let Pydantic load .env files directly
        env_file=(".env", ".env.test"),  # Load .env then .env.test (overrides)
        env_file_encoding="utf-8",  # Specify encoding
        env_nested_delimiter="__",
        case_sensitive=False,
    )


# Load settings using the shared function
settings: PlatformCoreSettings = load_settings(PlatformCoreSettings)

log.info(f"Settings loaded successfully for ENV: {settings.ENV}")


# Function for dependency injection
def get_settings() -> PlatformCoreSettings:
    """
    Returns the settings instance for dependency injection.
    This allows for easier testing and mocking of settings.
    """
    return settings
