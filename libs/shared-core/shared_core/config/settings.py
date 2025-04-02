from functools import lru_cache
from pathlib import Path
from typing import Type, TypeVar, Any

from pydantic import PostgresDsn, RedisDsn, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DotenvType = list[Path] | tuple[Path, ...] | Path | str | None


class BaseCoreSettings(BaseSettings):
    """
    Base settings common to all core services.
    Loaded from environment variables and .env file.
    """

    # Environment
    ENV: str  # Removed default, loaded from env/dotenv
    DEBUG: bool = False  # Default to False, calculated by validator

    # Database (Optional: services might not always need both)
    DATABASE_URL: PostgresDsn | None = None

    # Redis (Optional)
    REDIS_URL: RedisDsn | None = None

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",  # Ignore extra fields from env/dotenv
    )

    @model_validator(mode="after")
    def calculate_debug(cls, values: Any) -> Any:
        if isinstance(
            values, dict
        ):  # Check if it's the dict during validation
            env = values.get(
                "ENV", "development"
            )  # Default to dev if missing before validation
            values["DEBUG"] = env == "development"
        return values


SettingsT = TypeVar("SettingsT", bound=BaseSettings)


@lru_cache()
def load_settings(settings_cls: Type[SettingsT]) -> SettingsT:
    """
    Load and cache settings from a specific BaseSettings subclass.
    The settings class itself should define which .env files to load via
    its model_config.

    Args:
        settings_cls: The Pydantic BaseSettings class to instantiate.

    Returns:
        An instance of the provided settings class.
    """
    # For debugging, print environment variables
    import os

    print(f"DEBUG: Environment variables for {settings_cls.__name__}:")
    env_vars = {
        k: v
        for k, v in os.environ.items()
        if k.startswith(
            ("DB__", "API__", "SERVER__", "CACHE__", "SECURITY__", "ENV")
        )
    }
    print(f"DEBUG: Relevant env vars: {env_vars}")

    # Let the settings class handle its own .env loading via its config
    return settings_cls()


# Example of how a specific service would use this:
#
# from shared_core.config.settings import BaseCoreSettings, load_settings
#
# class MyServiceSettings(BaseCoreSettings):
#     SERVICE_SPECIFIC_VAR: str
#     # Add other service-specific settings here
#
# # Load settings, potentially from a specific file
# # settings = load_settings(MyServiceSettings, _env_file='.env.myservice')
# settings = load_settings(MyServiceSettings)
