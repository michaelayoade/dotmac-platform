"""
Pytest configuration for the platform core service.
"""

import asyncio
import logging
import os
import sys
from pathlib import Path
from typing import AsyncGenerator

import fakeredis.aioredis
import pytest
import pytest_asyncio
from dotenv import load_dotenv
from fastapi import FastAPI
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import PlatformCoreSettings, get_settings, load_settings
from app.db.session import get_db
from app.db.redis import get_redis
from app.main import create_app

# Ensure the local libs directory is first in sys.path
project_root = Path(__file__).resolve().parent.parent.parent
libs_dir = project_root / "libs"
sys.path.insert(0, str(libs_dir))
print(f"DEBUG: Using libs directory: {libs_dir}")
print(f"DEBUG: sys.path[0]: {sys.path[0]}")

# Explicitly load environment variables from .env.test
env_test_path = Path(__file__).parent.parent / ".env.test"
print(
    f"DEBUG: Loading environment from: {env_test_path} "
    f"(exists: {env_test_path.exists()})"
)
load_dotenv(env_test_path, override=True)

# Print environment variables to verify they're loaded
env_vars = {
    k: v 
    for k, v in os.environ.items() 
    if k.startswith(("DB__", "API__", "SERVER__", "CACHE__", "SECURITY__", "ENV"))
}
print(f"DEBUG: Loaded env vars: {env_vars}")

# Clear cache before importing settings
load_settings.cache_clear()

# Configure logging for tests
logging.basicConfig(level=logging.DEBUG)  # Use DEBUG for tests
log = logging.getLogger(__name__)

# --- Environment Variables are now handled by Pydantic settings ---


# Override settings for testing
def get_settings_override() -> PlatformCoreSettings:
    """
    Returns test-specific settings with proper environment variables.
    This overrides the default settings for testing purposes.
    """
    settings = load_settings(PlatformCoreSettings)
    # Ensure test DB URL is used
    settings.DB.DATABASE_URL = os.getenv("DB__DATABASE_URL", settings.DB.DATABASE_URL)
    # Use fakeredis for tests
    # This URL doesn't matter, we'll patch Redis
    settings.CACHE.REDIS_URL = "redis://fake:6379/1"
    return settings


@pytest.fixture(scope="session")
def app() -> FastAPI:
    """
    Provide the FastAPI application instance for testing.
    """
    # Apply overrides before returning the app
    app = create_app()
    app.dependency_overrides[get_settings] = get_settings_override
    return app


# Fixture to patch Redis initialization and closure for tests
# Uses monkeypatch to prevent real Redis connections during app lifespan startup.
@pytest.fixture(autouse=True, scope="function")
def prevent_real_redis_calls(monkeypatch):
    """
    Prevent real Redis connections during tests by patching the Redis client.
    This is important for unit tests that should not depend on external services.
    """

    # Mock the Redis connection functions to prevent actual connections
    # during app startup/shutdown lifecycle
    # Replace with no-op functions for testing
    async def mock_initialize_redis_pool():
        log.info("Using mock Redis initialization for testing")
        return None

    async def mock_close_redis_pool():
        log.info("Using mock Redis closure for testing")
        return None

    # Apply the patches
    monkeypatch.setattr(
        "app.db.redis.initialize_redis_pool", 
        mock_initialize_redis_pool
    )
    monkeypatch.setattr(
        "app.db.redis.close_redis_pool", 
        mock_close_redis_pool
    )

    # Continue with the test
    yield

    # No need to restore as monkeypatch handles that automatically


# Use pytest_asyncio.fixture instead of async def for the fixture
@pytest_asyncio.fixture(scope="function")
async def fake_redis_client():
    """Provide a fakeredis client instance for testing."""
    # Ensure fakeredis is patched *before* the client is created
    fake_redis = fakeredis.aioredis.FakeRedis()
    yield fake_redis

    # Ensure fake_redis connection is closed if needed
    if hasattr(fake_redis, "aclose"):
        try:
            await fake_redis.aclose()
        except Exception as e:
            print(f"Error closing fake_redis with aclose: {e}")
    elif hasattr(fake_redis, "close"):
        # Fallback for older versions or sync close
        try:
            close_method = getattr(fake_redis, "close")
            if asyncio.iscoroutinefunction(close_method):
                await close_method()
            else:
                # Handle potential deprecation warning/sync close
                import warnings

                with warnings.catch_warnings():
                    warnings.filterwarnings("ignore", category=DeprecationWarning)
                    close_method()
        except Exception as e:
            print(f"Error closing fake_redis with close: {e}")

    # Also clear fake redis data between tests
    if hasattr(fake_redis, "flushall"):
        await fake_redis.flushall()


# Override the get_redis dependency using the fake client fixture
@pytest_asyncio.fixture(scope="function", autouse=True)
async def override_get_redis(
    app: FastAPI, 
    fake_redis_client: fakeredis.aioredis.FakeRedis
):
    """
    Override the get_redis dependency to yield the fakeredis client.
    Ensures tests use the fake client instead of trying to connect.
    """

    async def _override_get_redis():
        yield fake_redis_client

    app.dependency_overrides[get_redis] = _override_get_redis
    yield
    # Clean up the override after the test
    app.dependency_overrides.pop(get_redis, None)


@pytest.fixture(scope="session")
def event_loop():
    """
    Create an event loop for the session.
    This overrides the default function-scoped event_loop fixture from pytest-asyncio.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def settings_override() -> PlatformCoreSettings:
    settings = load_settings(PlatformCoreSettings)
    # Override Redis URL to use fakeredis
    # This URL doesn't matter, we'll patch Redis
    settings.CACHE.REDIS_URL = "redis://fake:6379/1"
    # Use SQLite file-based database for testing to ensure all connections share the same database
    settings.DB.DATABASE_URL = "sqlite+aiosqlite:///./test_db.sqlite"
    settings.DB.DB_ECHO = False
    print("DEBUG: Test settings loaded:", settings.model_dump())
    return settings


# Use the fixture above for dependency overrides
@pytest_asyncio.fixture(scope="session", autouse=True)
def setup_test_environment(settings_override):
    # This ensures settings are loaded once per session using the override
    pass


# Shared engine instance for all tests
_shared_engine = None


@pytest_asyncio.fixture(scope="session")
async def db_engine(settings_override: PlatformCoreSettings):
    """Create a shared database engine for all tests."""
    global _shared_engine

    db_url = str(settings_override.DB.DATABASE_URL)
    db_echo = settings_override.DB.DB_ECHO

    # Import BaseModel from shared_core.base.base_model
    from shared_core.base.base_model import BaseModel

    # Now import all models to ensure they're registered with BaseModel.metadata
    # These imports are required for SQLAlchemy table registration
    # noqa comments are added to silence flake8 warnings about unused imports
    from app.modules.audit.models import AuditLog  # noqa: F401
    from app.modules.config.models import (  # noqa: F401
        ConfigHistory,
        ConfigItem,
        ConfigScope,
    )
    from app.modules.feature_flags.models import FeatureFlag  # noqa: F401
    from app.modules.logging.models import LogEntry  # noqa: F401
    from app.modules.notifications.models import Notification  # noqa: F401
    from app.modules.webhooks.models import (  # noqa: F401
        WebhookDelivery,
        WebhookEndpoint,
        WebhookSubscription,
    )

    # Verify that all tables are registered
    table_names = [table.name for table in BaseModel.metadata.sorted_tables]
    log.info(f"Registered tables: {table_names}")

    # SQLite compatibility for PostgreSQL-specific column types
    if "sqlite" in db_url:
        # Replace JSONB with JSON for SQLite compatibility
        import sqlalchemy.dialects.sqlite.base as sqlite_base
        from sqlalchemy import JSON

        # Add JSONB to SQLite dialect's known types
        sqlite_base.ischema_names["jsonb"] = JSON

        # Define a custom visit_JSONB method for SQLite dialect
        def visit_JSONB(self, type_, **kw):
            return self.visit_JSON(type_, **kw)

        # Add the method to SQLite's type compiler
        from sqlalchemy.dialects.sqlite.base import SQLiteTypeCompiler

        SQLiteTypeCompiler.visit_JSONB = visit_JSONB

    # For file-based SQLite database, remove the file if it exists
    if "sqlite" in db_url and ":memory:" not in db_url:
        import os
        from pathlib import Path

        # Extract the file path from the URL
        db_path = Path(db_url.replace("sqlite+aiosqlite:///", ""))

        # Remove the file if it exists
        if db_path.exists():
            os.remove(db_path)

    # Create a shared async engine
    _shared_engine = create_async_engine(db_url, echo=db_echo)

    # Create all tables in the database
    async with _shared_engine.begin() as conn:
        log.debug("Creating all tables in SQLite database")
        await conn.run_sync(BaseModel.metadata.create_all)

    yield _shared_engine

    # Close the engine at the end of all tests
    await _shared_engine.dispose()

    # Remove the database file after tests
    if "sqlite" in db_url and ":memory:" not in db_url:
        import os
        from pathlib import Path

        # Extract the file path from the URL
        db_path = Path(db_url.replace("sqlite+aiosqlite:///", ""))

        # Remove the file if it exists
        if db_path.exists():
            os.remove(db_path)


@pytest_asyncio.fixture(scope="function")
async def db_session(app: FastAPI, db_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create a fresh database session for each test using the shared engine."""
    # Create session factory
    async_session_maker = sessionmaker(
        db_engine, 
        class_=AsyncSession, 
        expire_on_commit=False
    )

    # Import BaseModel for table operations
    from shared_core.base.base_model import BaseModel

    # Ensure all tables are created before each test
    async with db_engine.begin() as conn:
        # Drop all tables first to ensure a clean state
        await conn.run_sync(BaseModel.metadata.drop_all)
        # Create all tables
        await conn.run_sync(BaseModel.metadata.create_all)

    # Create and yield a new session for each test
    async with async_session_maker() as session:
        # Override the get_db dependency for the duration of this test
        async def override_get_db():
            yield session

        # Apply the override
        app.dependency_overrides[get_db] = override_get_db

        yield session

        # Clean up the override after the test
        app.dependency_overrides.pop(get_db, None)


@pytest_asyncio.fixture
async def async_client(
    app: FastAPI, 
    db_session: AsyncSession
) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async client for testing the FastAPI application.
    This fixture depends on the db_session fixture to ensure the database is set up 
    before tests run.
    """
    # Create a test client that uses the FastAPI app
    async with AsyncClient(
        base_url="http://test",
        transport=ASGITransport(app=app),
        follow_redirects=True,
    ) as client:
        yield client
