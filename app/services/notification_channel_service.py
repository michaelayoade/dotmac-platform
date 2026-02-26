"""Notification Channel Service — CRUD and validation for external dispatch targets."""

from __future__ import annotations

import json
import logging
import re
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.notification_channel import ChannelType, NotificationChannel
from app.services.settings_crypto import decrypt_value, encrypt_value

logger = logging.getLogger(__name__)


class NotificationChannelService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_channel(
        self,
        person_id: UUID | None,
        channel_type: ChannelType,
        label: str,
        config: dict[str, str],
        events: dict[str, list[str]] | None = None,
    ) -> NotificationChannel:
        """Create a new notification channel with encrypted config."""
        if not label.strip():
            raise ValueError("Label is required")
        _validate_config(channel_type, config)
        channel = NotificationChannel(
            person_id=person_id,
            channel_type=channel_type,
            label=label.strip()[:120],
            config_encrypted=encrypt_value(json.dumps(config)),
            events=json.dumps(events) if events else None,
            is_active=True,
        )
        self.db.add(channel)
        self.db.flush()
        return channel

    def update_channel(
        self,
        channel_id: UUID,
        person_id: UUID | None,
        **kwargs: object,
    ) -> NotificationChannel:
        """Update a notification channel. person_id is checked for ownership."""
        channel = self._get_owned(channel_id, person_id)
        if "label" in kwargs and kwargs["label"] is not None:
            label = str(kwargs["label"]).strip()
            if not label:
                raise ValueError("Label is required")
            channel.label = label[:120]
        if "config" in kwargs and kwargs["config"] is not None:
            config = kwargs["config"]
            if not isinstance(config, dict):
                raise ValueError("Config must be a dict")
            _validate_config(channel.channel_type, config)
            channel.config_encrypted = encrypt_value(json.dumps(config))
        if "events" in kwargs:
            events = kwargs["events"]
            channel.events = json.dumps(events) if events else None
        if "is_active" in kwargs and kwargs["is_active"] is not None:
            channel.is_active = bool(kwargs["is_active"])
        self.db.flush()
        return channel

    def delete_channel(self, channel_id: UUID, person_id: UUID | None) -> None:
        """Soft-delete a notification channel."""
        channel = self._get_owned(channel_id, person_id)
        channel.is_active = False
        self.db.flush()

    def list_channels(self, person_id: UUID | None) -> list[NotificationChannel]:
        """List personal + global channels for a person."""
        from sqlalchemy import or_

        stmt = (
            select(NotificationChannel)
            .where(
                NotificationChannel.is_active.is_(True),
                or_(
                    NotificationChannel.person_id == person_id,
                    NotificationChannel.person_id.is_(None),
                ),
            )
            .order_by(NotificationChannel.created_at.desc())
        )
        return list(self.db.scalars(stmt).all())

    def get_channels_for_notification(self, notification: Notification) -> list[NotificationChannel]:
        """Find all channels that should receive this notification."""
        from sqlalchemy import or_

        if notification.person_id:
            # Personal notification: person's channels + global channels
            stmt = select(NotificationChannel).where(
                NotificationChannel.is_active.is_(True),
                or_(
                    NotificationChannel.person_id == notification.person_id,
                    NotificationChannel.person_id.is_(None),
                ),
            )
        else:
            # Broadcast: global channels only
            stmt = select(NotificationChannel).where(
                NotificationChannel.is_active.is_(True),
                NotificationChannel.person_id.is_(None),
            )

        channels = list(self.db.scalars(stmt).all())
        return [ch for ch in channels if _matches_event_filter(ch, notification)]

    def decrypt_config(self, channel: NotificationChannel) -> dict[str, str]:
        """Decrypt a channel's config JSON."""
        if not channel.config_encrypted:
            return {}
        try:
            raw = decrypt_value(channel.config_encrypted)
            data = json.loads(raw)
            return data if isinstance(data, dict) else {}
        except Exception:
            logger.warning("Failed to decrypt channel config for %s", channel.channel_id)
            return {}

    def test_channel(
        self,
        channel_id: UUID,
        person_id: UUID | None,
        title: str = "Test notification",
        message: str = "This is a test message from DotMac Platform.",
    ) -> bool:
        """Send a test message to a channel. Returns True on success."""
        channel = self._get_owned(channel_id, person_id)
        config = self.decrypt_config(channel)

        from app.services.notification_dispatch_service import NotificationDispatchService

        dispatch_svc = NotificationDispatchService(self.db)
        return dispatch_svc.send_test(channel.channel_type, config, title=title, message=message)

    def list_channels_enriched(self, person_id: UUID | None) -> list[dict]:
        """List channels with masked config and is_global flag for web display."""
        channels = self.list_channels(person_id)
        return [
            {
                "channel": ch,
                "config_masked": self.mask_config(ch),
                "is_global": ch.person_id is None,
            }
            for ch in channels
        ]

    def toggle_active(self, channel_id: UUID, person_id: UUID | None) -> None:
        """Toggle a channel's is_active flag."""
        ch = self.get_by_id(channel_id)
        if not ch:
            raise ValueError("Channel not found")
        self.update_channel(channel_id, person_id, is_active=not ch.is_active)

    def get_by_id(self, channel_id: UUID) -> NotificationChannel | None:
        """Get a channel by ID."""
        return self.db.get(NotificationChannel, channel_id)

    def mask_config(self, channel: NotificationChannel) -> str:
        """Return a masked summary of the config for display."""
        config = self.decrypt_config(channel)
        if channel.channel_type == ChannelType.slack:
            url = config.get("webhook_url", "")
            if len(url) > 40:
                return url[:35] + "...***"
            return url[:10] + "***" if url else "(not set)"
        if channel.channel_type == ChannelType.telegram:
            chat_id = config.get("chat_id", "")
            return f"chat:{chat_id}" if chat_id else "(not set)"
        if channel.channel_type == ChannelType.email:
            email = config.get("email", "")
            return email if email else "(not set)"
        return "(configured)"

    @staticmethod
    def serialize_channel(channel: NotificationChannel, config_masked: str = "") -> dict[str, object]:
        events = None
        if channel.events:
            try:
                events = json.loads(channel.events)
            except (json.JSONDecodeError, TypeError):
                pass
        return {
            "channel_id": str(channel.channel_id),
            "person_id": str(channel.person_id) if channel.person_id else None,
            "channel_type": channel.channel_type.value,
            "label": channel.label,
            "config_masked": config_masked,
            "events": events,
            "is_active": channel.is_active,
            "created_at": channel.created_at.isoformat() if channel.created_at else None,
        }

    def _get_owned(self, channel_id: UUID, person_id: UUID | None) -> NotificationChannel:
        channel = self.db.get(NotificationChannel, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        # person_id=None means admin editing a global channel — allow
        if person_id is not None and channel.person_id is not None and channel.person_id != person_id:
            raise ValueError("Not authorized to modify this channel")
        return channel


def _validate_config(channel_type: ChannelType, config: dict[str, str]) -> None:
    """Validate config dict for a given channel type."""
    if channel_type == ChannelType.email:
        email = config.get("email", "")
        if not email or "@" not in email:
            raise ValueError("Config must include a valid 'email' address")
    elif channel_type == ChannelType.slack:
        url = config.get("webhook_url", "")
        if not url or not url.startswith("https://hooks.slack.com/"):
            raise ValueError("Config must include a valid Slack 'webhook_url'")
    elif channel_type == ChannelType.telegram:
        bot_token = config.get("bot_token", "")
        chat_id = config.get("chat_id", "")
        if not bot_token:
            raise ValueError("Config must include 'bot_token'")
        if not re.match(r"^\d+:.+$", bot_token):
            raise ValueError("Invalid Telegram bot_token format")
        if not chat_id:
            raise ValueError("Config must include 'chat_id'")


def _matches_event_filter(channel: NotificationChannel, notification: Notification) -> bool:
    """Check if a channel's event filter matches the notification."""
    if not channel.events:
        return True  # No filter = match all
    try:
        events = json.loads(channel.events)
    except (json.JSONDecodeError, TypeError):
        return True

    categories = events.get("categories")
    if categories and notification.category.value not in categories:
        return False

    severities = events.get("severities")
    if severities and notification.severity.value not in severities:
        return False

    return True
