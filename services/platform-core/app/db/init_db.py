import logging

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal, engine
from shared_core.base.base_model import BaseModel
from app.modules.audit.models import AuditLog  # noqa: F401
from app.modules.config.models import ConfigScope  # noqa: F401
from app.modules.feature_flags.models import FeatureFlag  # noqa: F401
from app.modules.logging.models import LogEntry  # noqa: F401
from app.modules.notifications.models import Notification  # noqa: F401

logger = logging.getLogger(__name__)


def init_db() -> None:
    """
    Initialize the database by creating all tables.
    """
    try:
        # Create tables
        BaseModel.metadata.create_all(bind=engine)
        db_url = settings.DB.DATABASE_URL.render_as_string(hide_password=True)
        logger.info("Database tables created successfully. " f"Database URL: {db_url}")

        # Initialize default data if needed
        db = SessionLocal()
        try:
            init_default_data(db)
        finally:
            db.close()
    except Exception as e:
        logger.error(
            f"Error initializing database: {e}. " "If your models have changed, you might need to run " "migrations."
        )
        raise


def init_default_data(db: Session) -> None:
    """
    Initialize default data in the database.
    """
    # Create default config scopes if they don't exist
    default_scopes = ["system", "auth", "logging", "notifications"]
    for scope_name in default_scopes:
        scope = db.query(ConfigScope).filter(ConfigScope.name == scope_name).first()
        if not scope:
            scope = ConfigScope(
                name=scope_name,
                description=f"Default {scope_name} configuration scope",
                is_system=True,
            )
            db.add(scope)

    # Create default feature flags if needed
    default_flags = [
        {
            "key": "enable_audit_logging",
            "name": "Enable Audit Logging",
            "description": "Enable audit logging for all operations",
            "is_enabled": True,
            "version": 1,
        },
        {
            "key": "enable_notifications",
            "name": "Enable Notifications",
            "description": "Enable system notifications",
            "is_enabled": True,
            "version": 1,
        },
    ]

    for flag_data in default_flags:
        flag = db.query(FeatureFlag).filter(FeatureFlag.key == flag_data["key"]).first()
        if not flag:
            flag = FeatureFlag(**flag_data)
            db.add(flag)

    # Create initial data
    try:
        # Check if we need to create initial data
        if settings.INIT_DB.CREATE_INITIAL_DATA:
            logger.info("Creating initial data...")

            # Create initial config items
            # await create_initial_config_items(db)

            # Create initial feature flags
            # await create_initial_feature_flags(db)

            logger.info("Initial data created successfully")
    except Exception as e:
        logger.error(f"Error creating initial data: {e}")

    db.commit()
    logger.info("Default data initialized successfully")
