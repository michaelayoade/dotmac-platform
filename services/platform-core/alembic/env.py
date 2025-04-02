import os
import sys
from logging.config import fileConfig
from pathlib import Path

from dotenv import load_dotenv
from shared_core.base.base_model import BaseModel
from sqlalchemy import engine_from_config, pool

import alembic
from app.core.config import settings

# --- Load Environment Variables --- #
# Assuming alembic is run from the project root (platform-core)
project_root = Path(__file__).parent.parent
dotenv_path = project_root / ".env"
print(f"Alembic: Loading environment variables from: {dotenv_path}")
loaded = load_dotenv(dotenv_path=dotenv_path)
print(f"Alembic: .env loaded: {loaded}")

# Adjust the path according to your actual project structure
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..")))

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = alembic.context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = BaseModel.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # Get URL directly from loaded settings
    url = str(settings.DB.DATABASE_URL)
    alembic.context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with alembic.context.begin_transaction():
        alembic.context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    configuration = config.get_section(config.config_ini_section)
    # Set URL directly from loaded settings
    configuration["sqlalchemy.url"] = str(settings.DB.DATABASE_URL)
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        alembic.context.configure(connection=connection, target_metadata=target_metadata)

        with alembic.context.begin_transaction():
            alembic.context.run_migrations()


if alembic.context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
