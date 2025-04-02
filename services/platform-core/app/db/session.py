import logging
from typing import AsyncGenerator

# Import BaseModel for metadata registration
from shared_core.base.base_model import BaseModel  # noqa: F401
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Import settings from core config
from app.core.config import get_settings

logger = logging.getLogger(__name__)

# Get database connection string from settings
settings = get_settings()
DATABASE_URL = settings.DB.DATABASE_URL

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
    ConfigHistory,
    ConfigItem,
    ConfigScope,
)
from app.modules.feature_flags.models import FeatureFlag  # noqa
from app.modules.logging.models import LogEntry  # noqa
from app.modules.notifications.models import Notification  # noqa
from app.modules.webhooks.models import (  # noqa
    WebhookDelivery,
    WebhookEndpoint,
    WebhookSubscription,
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
