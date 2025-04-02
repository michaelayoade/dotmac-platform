"""Tests for shared core components."""

from datetime import datetime, timedelta, timezone

import pytest
from pydantic import Field, ValidationError
from pydantic_settings import SettingsConfigDict
from shared_core.config.settings import BaseCoreSettings, load_settings
from shared_core.errors.exceptions import (
    BadRequestError,
    BasePlatformException,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
)
from shared_core.schemas.response import BaseResponse

# Define required vars for testing BaseCoreSettings directly
REQUIRED_SETTINGS_VARS = {
    # Add any absolutely required vars for BaseCoreSettings if they exist
}


# --- Fixtures ---


@pytest.fixture(autouse=True)
def clear_settings_cache():
    """Clears the settings cache before each test."""
    load_settings.cache_clear()
    yield  # Run the test


@pytest.fixture(autouse=True)
def clear_and_set_env_vars(monkeypatch):
    """Clears potentially interfering env vars and sets test defaults."""
    # Clear known vars used in tests
    vars_to_clear = [
        "ENV",
        "DEBUG",
        "DATABASE_URL",
        "REDIS_URL",
        "LOG_LEVEL",
        "TEST_VAR",  # Clear vars potentially set by other tests/env
        "REQUIRED_VAR",
        "INT_VAR",
    ]
    for var in vars_to_clear:
        monkeypatch.delenv(var, raising=False)

    # Set required vars if BaseCoreSettings needs them (unlikely for base)
    for key, value in REQUIRED_SETTINGS_VARS.items():
        monkeypatch.setenv(key, value)


def test_load_settings_defaults(monkeypatch):
    """Tests loading BaseCoreSettings with defaults and minimal env."""
    # Set required variables (including ENV now)
    monkeypatch.setenv("ENV", "testing")  # Set ENV for this test
    for key, value in REQUIRED_SETTINGS_VARS.items():
        monkeypatch.setenv(key, value)

    # Load settings without relying on a .env file
    settings = load_settings(BaseCoreSettings)

    assert settings.ENV == "testing"  # Default from BaseCoreSettings
    assert settings.DEBUG is False  # 'testing' env means DEBUG is False
    assert settings.LOG_LEVEL == "INFO"  # Default from BaseCoreSettings
    assert settings.DATABASE_URL is None  # Default
    assert settings.REDIS_URL is None  # Default


def test_load_settings_validation_error(monkeypatch):
    """Tests that validation fails if required env vars are missing."""

    # Create a temporary settings class with a required field
    class SettingsWithRequired(BaseCoreSettings):
        REQUIRED_VAR: str

    # Ensure the required var is NOT set
    monkeypatch.delenv("REQUIRED_VAR", raising=False)

    with pytest.raises(ValidationError) as exc_info:
        load_settings(SettingsWithRequired)

    assert "REQUIRED_VAR" in str(exc_info.value)
    assert "Field required" in str(exc_info.value)


def test_load_settings_env_override(monkeypatch):
    """Tests loading settings with environment variable overrides."""
    monkeypatch.setenv("ENV", "production")
    monkeypatch.setenv("LOG_LEVEL", "WARNING")
    monkeypatch.setenv(
        "DATABASE_URL", "postgresql://user:pass@host:5432/prod_db"
    )
    monkeypatch.setenv("REDIS_URL", "redis://prod_redis:6379/0")
    # Set required vars if any
    for key, value in REQUIRED_SETTINGS_VARS.items():
        monkeypatch.setenv(key, value)

    settings = load_settings(BaseCoreSettings)  # Disable .env load

    assert settings.ENV == "production"
    assert settings.DEBUG is False
    assert settings.LOG_LEVEL == "WARNING"
    assert (
        str(settings.DATABASE_URL)
        == "postgresql://user:pass@host:5432/prod_db"
    )
    assert str(settings.REDIS_URL) == "redis://prod_redis:6379/0"


def test_load_settings_dotenv_override(monkeypatch, tmp_path):
    """Tests loading settings primarily from a .env file."""
    # Create a dummy .env file
    env_content = (
        "ENV=staging\n"
        "LOG_LEVEL=INFO\n"
        "DATABASE_URL=postgresql+psycopg2://dotenv:dotenv@host/dotenvdb\n"
        "REDIS_URL=redis://dotenv_redis:6380/0\n"
        "# COMMENTED_VAR=should_be_ignored\n"
        "EMPTY_VAR=\n"  # Test empty var handling
    )
    env_file = tmp_path / ".env_test_dotenv"
    env_file.write_text(env_content)

    # Set an env var that should take precedence over .env
    monkeypatch.setenv("LOG_LEVEL", "ERROR")
    # Set required vars if any
    for key, value in REQUIRED_SETTINGS_VARS.items():
        monkeypatch.setenv(key, value)

    # Load settings from the specified temporary file
    # We need a way to tell BaseCoreSettings to load *this* file instead of default
    # Temporarily modify model_config for this test instance (less ideal)
    # TODO: Find a better way if this becomes complex

    # Option 1: Patch the class config (might affect other tests if not careful)
    # original_config = BaseCoreSettings.model_config
    # BaseCoreSettings.model_config = SettingsConfigDict(
    #     env_file=str(env_file), env_file_encoding='utf-8'
    # )
    # settings = load_settings(BaseCoreSettings)
    # BaseCoreSettings.model_config = original_config # Restore

    # Option 2: Create a temporary subclass (cleaner)
    class TempSettings(BaseCoreSettings):
        model_config = SettingsConfigDict(
            env_file=str(env_file),
            env_file_encoding="utf-8",
            case_sensitive=True,
            extra="ignore",
        )

    settings = load_settings(TempSettings)
    # Clear cache for the temp class if necessary, although fixture should handle Base
    load_settings.cache_clear()  # Clear cache after using TempSettings

    assert settings.ENV == "staging"
    assert settings.DEBUG is False  # Staging is not development
    assert settings.LOG_LEVEL == "ERROR"  # Env var takes precedence
    assert (
        str(settings.DATABASE_URL)
        == "postgresql+psycopg2://dotenv:dotenv@host/dotenvdb"
    )
    assert str(settings.REDIS_URL) == "redis://dotenv_redis:6380/0"


# --- Test Exceptions ---


@pytest.mark.parametrize(
    "exception_cls, expected_status, expected_detail",
    [
        (BasePlatformException, 500, "An internal server error occurred."),
        (NotFoundError, 404, "Resource not found."),
        (BadRequestError, 400, "Bad request."),
        (UnauthorizedError, 401, "Authentication required."),
        (ForbiddenError, 403, "Operation forbidden."),
        (ConflictError, 409, "Resource conflict."),
    ],
)
def test_exceptions(exception_cls, expected_status, expected_detail):
    """Tests standard exception status codes and details."""
    exc = exception_cls()
    assert exc.status_code == expected_status
    assert exc.detail == expected_detail


def test_exception_custom_detail():
    """Tests providing a custom detail message."""
    custom_message = "Specific item not found here."
    exc = NotFoundError(detail=custom_message)
    assert exc.status_code == 404
    assert exc.detail == custom_message


# --- Test BaseResponse Schema ---


def test_base_response_schema():
    """Tests the BaseResponse Pydantic schema."""
    now = datetime.now(timezone.utc)
    response_data = {
        "id": 123,
        "created_at": now,
        "updated_at": now + timedelta(minutes=5),  # Simulate update
        "extra_field": "some_value",  # Should be included
    }

    # Need a concrete class inheriting from BaseResponse for validation
    class SpecificResponse(BaseResponse):
        extra_field: str = Field(...)

    response_obj = SpecificResponse(**response_data)

    assert response_obj.id == 123
    assert response_obj.created_at == now
    assert response_obj.updated_at == now + timedelta(minutes=5)
    assert response_obj.extra_field == "some_value"

    # Test serialization includes all fields
    serialized = response_obj.model_dump()
    assert serialized["id"] == 123
    assert serialized["created_at"] == now
    assert serialized["updated_at"] == now + timedelta(minutes=5)
    assert serialized["extra_field"] == "some_value"


# Note: Testing SQLAlchemy BaseModel requires a database session fixture,
# which belongs in the service-specific tests (like platform-core),
# not in shared-core tests.
# Unused imports (like os, SQLAlchemyBaseModel) were removed.
