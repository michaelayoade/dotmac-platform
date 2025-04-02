"""
Shared logging configuration utilities for Dotmac platform services.

This module can be expanded to provide standardized logging setup,
for example, configuring structured JSON logging using loguru or
the standard logging library.
"""

import logging
import sys

from shared_core.config.settings import BaseCoreSettings, load_settings

# Load minimal settings just for logging config
# Note: This assumes BaseCoreSettings is sufficient or uses defaults
# for LOG_LEVEL. If specific service settings affect logging, that
# service needs its own logger setup.
core_settings = load_settings(BaseCoreSettings, _env_file=None)


# Configure root logger
logging.basicConfig(
    level=core_settings.LOG_LEVEL.upper(),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        # Log to stdout for container environments
        logging.StreamHandler(sys.stdout)
    ],
)


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance with the specified name."""
    return logging.getLogger(name)


# Example placeholder (can be expanded later)
def setup_logging(log_level: str = "INFO"):
    """Placeholder function for setting up logging."""
    # This should ideally configure based on settings, but is a placeholder
    # Use get_logger(__name__).info(...) for actual logging
    pass
