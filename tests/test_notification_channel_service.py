"""Tests for NotificationChannelService — CRUD and validation."""

from __future__ import annotations

import uuid

import pytest

from tests.conftest import Base, _test_engine


@pytest.fixture(autouse=True)
def _create_tables():
    Base.metadata.create_all(_test_engine)


class TestCreateChannel:
    def test_create_email_channel(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label="My Email",
            config={"email": "alert@example.com"},
        )
        db_session.commit()
        assert ch.channel_id is not None
        assert ch.label == "My Email"
        assert ch.channel_type == ChannelType.email
        assert ch.is_active is True

    def test_create_slack_channel(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.slack,
            label="My Slack",
            config={"webhook_url": "https://hooks.slack.com/services/T123/B456/xyz"},
        )
        db_session.commit()
        assert ch.channel_type == ChannelType.slack

    def test_create_telegram_channel(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.telegram,
            label="My Telegram",
            config={"bot_token": "123456:ABC-xyz", "chat_id": "-100123456"},
        )
        db_session.commit()
        assert ch.channel_type == ChannelType.telegram

    def test_create_global_channel(self, db_session):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=None,
            channel_type=ChannelType.email,
            label="Global Email",
            config={"email": "ops@example.com"},
        )
        db_session.commit()
        assert ch.person_id is None

    def test_invalid_email_config(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        with pytest.raises(ValueError, match="valid.*email"):
            svc.create_channel(
                person_id=person.id,
                channel_type=ChannelType.email,
                label="Bad Email",
                config={"email": "not-an-email"},
            )

    def test_invalid_slack_config(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        with pytest.raises(ValueError, match="Slack"):
            svc.create_channel(
                person_id=person.id,
                channel_type=ChannelType.slack,
                label="Bad Slack",
                config={"webhook_url": "https://not-slack.com/webhook"},
            )

    def test_invalid_telegram_config(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        with pytest.raises(ValueError, match="bot_token"):
            svc.create_channel(
                person_id=person.id,
                channel_type=ChannelType.telegram,
                label="Bad TG",
                config={"bot_token": "", "chat_id": "123"},
            )

    def test_empty_label_raises(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        with pytest.raises(ValueError, match="Label"):
            svc.create_channel(
                person_id=person.id,
                channel_type=ChannelType.email,
                label="  ",
                config={"email": "test@example.com"},
            )


class TestUpdateChannel:
    def test_update_label(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label="Original",
            config={"email": "test@example.com"},
        )
        db_session.flush()
        updated = svc.update_channel(ch.channel_id, person.id, label="Updated")
        assert updated.label == "Updated"

    def test_update_deactivate(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label="Deactivate Me",
            config={"email": "test@example.com"},
        )
        db_session.flush()
        updated = svc.update_channel(ch.channel_id, person.id, is_active=False)
        assert updated.is_active is False

    def test_update_wrong_person_raises(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label="Private",
            config={"email": "test@example.com"},
        )
        db_session.flush()
        with pytest.raises(ValueError, match="Not authorized"):
            svc.update_channel(ch.channel_id, uuid.uuid4(), label="Hacked")


class TestDeleteChannel:
    def test_soft_delete(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label="Delete Me",
            config={"email": "test@example.com"},
        )
        db_session.flush()
        svc.delete_channel(ch.channel_id, person.id)
        db_session.flush()
        assert ch.is_active is False


class TestListChannels:
    def test_lists_personal_and_global(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label=f"Personal-{uuid.uuid4().hex[:6]}",
            config={"email": "personal@example.com"},
        )
        svc.create_channel(
            person_id=None,
            channel_type=ChannelType.email,
            label=f"Global-{uuid.uuid4().hex[:6]}",
            config={"email": "global@example.com"},
        )
        db_session.flush()
        channels = svc.list_channels(person.id)
        assert len(channels) >= 2


class TestDecryptConfig:
    def test_decrypt_email(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label="Decrypt Test",
            config={"email": "secret@example.com"},
        )
        db_session.flush()
        config = svc.decrypt_config(ch)
        assert config["email"] == "secret@example.com"


class TestMaskConfig:
    def test_mask_slack(self, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.slack,
            label="Mask Test",
            config={"webhook_url": "https://hooks.slack.com/services/T123456/B789/verylongsecretstring"},
        )
        db_session.flush()
        masked = svc.mask_config(ch)
        assert "***" in masked
        assert "verylongsecretstring" not in masked


class TestEventFilter:
    def test_matches_all_when_no_filter(self, db_session, person):
        from app.models.notification import Notification, NotificationCategory, NotificationSeverity
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label=f"NoFilter-{uuid.uuid4().hex[:6]}",
            config={"email": "test@example.com"},
            events=None,
        )
        db_session.flush()

        notification = Notification(
            person_id=person.id,
            category=NotificationCategory.deploy,
            severity=NotificationSeverity.critical,
            title="Test",
            message="Test msg",
        )
        db_session.add(notification)
        db_session.flush()

        channels = svc.get_channels_for_notification(notification)
        assert any(c.channel_id == ch.channel_id for c in channels)

    def test_filters_by_category(self, db_session, person):
        from app.models.notification import Notification, NotificationCategory, NotificationSeverity
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        ch = svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label=f"FilterCat-{uuid.uuid4().hex[:6]}",
            config={"email": "test@example.com"},
            events={"categories": ["alert"]},
        )
        db_session.flush()

        notification = Notification(
            person_id=person.id,
            category=NotificationCategory.deploy,
            severity=NotificationSeverity.info,
            title="Deploy Test",
            message="Deploy msg",
        )
        db_session.add(notification)
        db_session.flush()

        channels = svc.get_channels_for_notification(notification)
        # Should NOT match since channel filters for 'alert' only
        assert not any(c.channel_id == ch.channel_id for c in channels)
