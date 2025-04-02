import logging
import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Import BaseModel for metadata registration
from shared_core.base.base_model import BaseModel  # noqa: F401

logger = logging.getLogger(__name__)

# Get database connection string from environment variable
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set. " "Please set it to a valid database connection string."
    )

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
)

# Create sessionmaker
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Import all models here so they are registered with BaseModel.metadata
# These imports are needed for SQLAlchemy to create tables
# noqa comments are added to silence flake8 warnings about unused imports
from app.modules.audit.models import AuditLog  # noqa

# Import config models with explicit imports to avoid unused import warnings
from app.modules.config.models import (  # noqa
    ConfigItem,
    ConfigScope,
    ConfigHistory,
)
from app.modules.feature_flags.models import FeatureFlag  # noqa
from app.modules.logging.models import LogEntry  # noqa
from app.modules.notifications.models import Notification  # noqa
from app.modules.webhooks.models import (  # noqa
    WebhookEndpoint,
    WebhookSubscription,
    WebhookDelivery,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Get a database session.

    This function is used as a dependency in FastAPI endpoints.
    It yields an AsyncSession that can be used to interact with the database.
    The session is automatically closed when the request is complete.

    Yields:
        AsyncSession: A SQLAlchemy AsyncSession instance.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
