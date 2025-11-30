"""
Re-export celery_app from shared library.

This module provides backwards compatibility for imports like:
    from dotmac.platform.celery_app import celery_app
"""

from dotmac.shared.celery_app import celery_app, create_celery_app, get_celery_app

__all__ = [
    "create_celery_app",
    "get_celery_app",
    "celery_app",
]
