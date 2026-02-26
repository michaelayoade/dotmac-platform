"""Notification Dispatch Service — send notifications to external channels."""

from __future__ import annotations

import html
import logging
from uuid import UUID

import httpx
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.notification_channel import ChannelType, NotificationChannel

logger = logging.getLogger(__name__)


class NotificationDispatchService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def dispatch(self, notification: Notification) -> int:
        """Queue channel dispatches for a notification. Returns count queued."""
        from app.services.notification_channel_service import NotificationChannelService

        channel_svc = NotificationChannelService(self.db)
        channels = channel_svc.get_channels_for_notification(notification)

        count = 0
        for channel in channels:
            try:
                from app.tasks.notifications import dispatch_to_channel

                dispatch_to_channel.delay(str(notification.notification_id), str(channel.channel_id))
                count += 1
            except Exception:
                logger.debug("Failed to queue dispatch for channel %s", channel.channel_id, exc_info=True)
        return count

    def dispatch_to_channel(self, notification_id: UUID, channel_id: UUID) -> bool:
        """Send a notification to a specific channel. Returns True on success."""
        notification = self.db.get(Notification, notification_id)
        if not notification:
            logger.warning("Notification %s not found for dispatch", notification_id)
            return False

        channel = self.db.get(NotificationChannel, channel_id)
        if not channel or not channel.is_active:
            logger.warning("Channel %s not found or inactive", channel_id)
            return False

        from app.services.notification_channel_service import NotificationChannelService

        config = NotificationChannelService(self.db).decrypt_config(channel)
        if not config:
            logger.warning("Empty config for channel %s", channel_id)
            return False

        if channel.channel_type == ChannelType.email:
            return _send_email(notification, config)
        if channel.channel_type == ChannelType.slack:
            return _send_slack(notification, config)
        if channel.channel_type == ChannelType.telegram:
            return _send_telegram(notification, config)

        logger.warning("Unknown channel type %s", channel.channel_type)
        return False

    def send_test(self, channel_type: ChannelType, config: dict[str, str]) -> bool:
        """Send a test message to validate channel config."""
        from app.models.notification import NotificationCategory, NotificationSeverity

        # Create a temporary notification-like object for testing
        test_notification = Notification(
            category=NotificationCategory.system,
            severity=NotificationSeverity.info,
            title="Seabone test notification",
            message="Seabone test notification",
            link=None,
        )

        if channel_type == ChannelType.email:
            return _send_email(test_notification, config)
        if channel_type == ChannelType.slack:
            return _send_slack(test_notification, config)
        if channel_type == ChannelType.telegram:
            return _send_telegram(test_notification, config)

        return False


def _send_email(notification: Notification, config: dict[str, str]) -> bool:
    """Send notification via email."""
    email = config.get("email")
    if not email:
        return False

    try:
        from app.services.email import send_email

        severity_label = notification.severity.value.upper() if notification.severity else "INFO"
        subject = f"[{severity_label}] {notification.title}"

        safe_title = html.escape(notification.title or "")
        safe_message = html.escape(notification.message or "")
        category_badge = html.escape(notification.category.value) if notification.category else ""

        body_html = f"""
        <div style="font-family: sans-serif; max-width: 600px;">
            <h2>{safe_title}</h2>
            <p>{safe_message}</p>
            <p style="color: #666; font-size: 12px;">
                Category: {category_badge} | Severity: {severity_label}
            </p>
        """
        if notification.link:
            safe_link = html.escape(notification.link)
            body_html += f'<p><a href="{safe_link}">View details</a></p>'
        body_html += "</div>"

        return send_email(None, email, subject, body_html)
    except Exception:
        logger.exception("Failed to send email notification to %s", email)
        return False


def _send_slack(notification: Notification, config: dict[str, str]) -> bool:
    """Send notification via Slack webhook."""
    webhook_url = config.get("webhook_url")
    if not webhook_url:
        return False

    severity_colors = {
        "info": "#36a64f",
        "warning": "#daa520",
        "critical": "#dc3545",
    }
    color = severity_colors.get(notification.severity.value if notification.severity else "info", "#36a64f")

    blocks: list[dict[str, object]] = [
        {
            "type": "header",
            "text": {"type": "plain_text", "text": (notification.title or "Notification")[:150]},
        },
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": notification.message or ""},
        },
    ]
    if notification.link:
        blocks.append(
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": f"<{notification.link}|View details>"},
            }
        )

    payload: dict[str, object] = {
        "blocks": blocks,
        "attachments": [{"color": color, "text": ""}],
    }

    try:
        resp = httpx.post(webhook_url, json=payload, timeout=10.0)
        if resp.status_code == 200:
            logger.info("Slack notification sent for: %s", notification.title)
            return True
        logger.warning("Slack webhook returned %d: %s", resp.status_code, resp.text[:500])
        return False
    except Exception:
        logger.exception("Failed to send Slack notification")
        return False


def _send_telegram(notification: Notification, config: dict[str, str]) -> bool:
    """Send notification via Telegram Bot API."""
    bot_token = config.get("bot_token")
    chat_id = config.get("chat_id")
    if not bot_token or not chat_id:
        return False

    safe_title = html.escape(notification.title or "Notification")
    safe_message = html.escape(notification.message or "")
    severity_label = notification.severity.value.upper() if notification.severity else "INFO"

    text = f"<b>{safe_title}</b>\n\n{safe_message}\n\n<i>{severity_label}</i>"
    if notification.link:
        safe_link = html.escape(notification.link)
        text += f'\n<a href="{safe_link}">View details</a>'

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }

    try:
        resp = httpx.post(url, json=payload, timeout=10.0)
        if resp.status_code == 200:
            logger.info("Telegram notification sent for: %s", notification.title)
            return True
        logger.warning("Telegram API returned %d: %s", resp.status_code, resp.text[:500])
        return False
    except Exception:
        logger.exception("Failed to send Telegram notification")
        return False
