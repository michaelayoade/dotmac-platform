#!/usr/bin/env python
"""
Scheduler for Platform Core maintenance tasks.

This script runs scheduled tasks such as:
- Cleaning up expired notifications
- Retrying failed webhook deliveries
- Pruning old log entries
"""
import argparse
import asyncio
import logging
import sys
from datetime import datetime, timedelta

from app.db.session import SessionLocal
from app.modules.logging.service import LoggingService
from app.modules.notifications.service import NotificationsService
from app.modules.webhooks.service import WebhooksService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


async def clean_expired_notifications():
    """Clean up expired notifications."""
    logger.info("Starting cleanup of expired notifications")
    db = SessionLocal()
    try:
        count = await NotificationsService.clean_expired_notifications(db)
        logger.info(f"Deleted {count} expired notifications")
    except Exception as e:
        logger.error(f"Error cleaning up expired notifications: {e}")
    finally:
        db.close()


async def retry_failed_webhooks():
    """Retry failed webhook deliveries."""
    logger.info("Starting retry of failed webhook deliveries")
    db = SessionLocal()
    try:
        count = await WebhooksService.retry_failed_deliveries(db)
        logger.info(f"Queued {count} failed webhook deliveries for retry")
    except Exception as e:
        logger.error(f"Error retrying failed webhook deliveries: {e}")
    finally:
        db.close()


async def prune_old_logs(days: int = 30):
    """
    Prune log entries older than the specified number of days.

    Args:
        days: Number of days to keep logs for
    """
    logger.info(f"Starting pruning of logs older than {days} days")
    db = SessionLocal()
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)

        # Create query params with the cutoff date
        from app.modules.logging.models import LogQueryParams

        query_params = LogQueryParams(end_time=cutoff_date, limit=10000)  # Set a high limit to delete in batches

        # Get old logs
        old_logs = await LoggingService.get_log_entries(db, query_params)

        # Delete old logs
        for log in old_logs:
            db.delete(log)

        db.commit()
        logger.info(f"Deleted {len(old_logs)} log entries older than {days} days")
    except Exception as e:
        logger.error(f"Error pruning old logs: {e}")
    finally:
        db.close()


async def run_all_tasks(log_retention_days: int = 30):
    """Run all maintenance tasks."""
    logger.info("Starting all maintenance tasks")

    # Run tasks concurrently
    await asyncio.gather(
        clean_expired_notifications(),
        retry_failed_webhooks(),
        prune_old_logs(log_retention_days),
    )

    logger.info("All maintenance tasks completed")


def main():
    """Main entry point for the scheduler."""
    parser = argparse.ArgumentParser(description="Run Platform Core maintenance tasks")
    parser.add_argument(
        "--task",
        type=str,
        choices=["all", "clean-notifications", "retry-webhooks", "prune-logs"],
        default="all",
        help="Task to run",
    )
    parser.add_argument(
        "--log-retention-days",
        type=int,
        default=30,
        help="Number of days to keep logs for",
    )

    args = parser.parse_args()

    # Run the specified task
    if args.task == "all":
        asyncio.run(run_all_tasks(args.log_retention_days))
    elif args.task == "clean-notifications":
        asyncio.run(clean_expired_notifications())
    elif args.task == "retry-webhooks":
        asyncio.run(retry_failed_webhooks())
    elif args.task == "prune-logs":
        asyncio.run(prune_old_logs(args.log_retention_days))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Scheduler interrupted")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Unhandled exception: {e}")
        sys.exit(1)
