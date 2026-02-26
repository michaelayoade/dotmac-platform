"""Tests for NotificationDispatchService — multi-channel dispatch."""

from __future__ import annotations

import uuid
from unittest.mock import MagicMock, patch

import pytest

from tests.conftest import Base, _test_engine


@pytest.fixture(autouse=True)
def _create_tables():
    Base.metadata.create_all(_test_engine)


@pytest.fixture()
def email_channel(db_session, person):
    from app.models.notification_channel import ChannelType
    from app.services.notification_channel_service import NotificationChannelService

    svc = NotificationChannelService(db_session)
    ch = svc.create_channel(
        person_id=person.id,
        channel_type=ChannelType.email,
        label=f"DispatchEmail-{uuid.uuid4().hex[:6]}",
        config={"email": "dispatch@example.com"},
    )
    db_session.commit()
    return ch


@pytest.fixture()
def notification(db_session, person):
    from app.models.notification import Notification, NotificationCategory, NotificationSeverity

    n = Notification(
        person_id=person.id,
        category=NotificationCategory.deploy,
        severity=NotificationSeverity.info,
        title="Test Deploy",
        message="Deployment completed successfully.",
        link="/instances/123",
    )
    db_session.add(n)
    db_session.commit()
    db_session.refresh(n)
    return n


class TestDispatch:
    @patch("app.tasks.notifications.dispatch_to_channel.delay")
    def test_dispatch_queues_tasks(self, mock_delay, db_session, notification, email_channel):
        from app.services.notification_dispatch_service import NotificationDispatchService

        svc = NotificationDispatchService(db_session)
        count = svc.dispatch(notification)
        assert count >= 1
        assert mock_delay.called


class TestDispatchToChannel:
    @patch("app.services.notification_dispatch_service._send_email", return_value=True)
    def test_dispatch_email(self, mock_send, db_session, notification, email_channel):
        from app.services.notification_dispatch_service import NotificationDispatchService

        svc = NotificationDispatchService(db_session)
        ok = svc.dispatch_to_channel(notification.notification_id, email_channel.channel_id)
        assert ok is True
        assert mock_send.called

    def test_dispatch_missing_notification(self, db_session, email_channel):
        from app.services.notification_dispatch_service import NotificationDispatchService

        svc = NotificationDispatchService(db_session)
        ok = svc.dispatch_to_channel(uuid.uuid4(), email_channel.channel_id)
        assert ok is False

    def test_dispatch_missing_channel(self, db_session, notification):
        from app.services.notification_dispatch_service import NotificationDispatchService

        svc = NotificationDispatchService(db_session)
        ok = svc.dispatch_to_channel(notification.notification_id, uuid.uuid4())
        assert ok is False


class TestSendEmail:
    @patch("app.services.email.send_email", return_value=True)
    def test_send_email_success(self, mock_smtp, db_session, notification):
        from app.services.notification_dispatch_service import _send_email

        ok = _send_email(notification, {"email": "user@example.com"})
        assert ok is True
        assert mock_smtp.called
        call_args = mock_smtp.call_args
        assert "user@example.com" in call_args.args or call_args[0][1] == "user@example.com"

    def test_send_email_no_address(self, notification):
        from app.services.notification_dispatch_service import _send_email

        ok = _send_email(notification, {})
        assert ok is False


class TestSendSlack:
    @patch("app.services.notification_dispatch_service.httpx.post")
    def test_send_slack_success(self, mock_post, notification):
        from app.services.notification_dispatch_service import _send_slack

        mock_post.return_value = MagicMock(status_code=200)
        ok = _send_slack(notification, {"webhook_url": "https://hooks.slack.com/services/test"})
        assert ok is True
        assert mock_post.called

    @patch("app.services.notification_dispatch_service.httpx.post")
    def test_send_slack_failure(self, mock_post, notification):
        from app.services.notification_dispatch_service import _send_slack

        mock_post.return_value = MagicMock(status_code=500, text="Server Error")
        ok = _send_slack(notification, {"webhook_url": "https://hooks.slack.com/services/test"})
        assert ok is False

    def test_send_slack_no_url(self, notification):
        from app.services.notification_dispatch_service import _send_slack

        ok = _send_slack(notification, {})
        assert ok is False


class TestSendTelegram:
    @patch("app.services.notification_dispatch_service.httpx.post")
    def test_send_telegram_success(self, mock_post, notification):
        from app.services.notification_dispatch_service import _send_telegram

        mock_post.return_value = MagicMock(status_code=200)
        ok = _send_telegram(notification, {"bot_token": "123:ABC", "chat_id": "-100123"})
        assert ok is True
        assert mock_post.called

    @patch("app.services.notification_dispatch_service.httpx.post")
    def test_send_telegram_failure(self, mock_post, notification):
        from app.services.notification_dispatch_service import _send_telegram

        mock_post.return_value = MagicMock(status_code=400, text="Bad Request")
        ok = _send_telegram(notification, {"bot_token": "123:ABC", "chat_id": "-100123"})
        assert ok is False

    def test_send_telegram_missing_config(self, notification):
        from app.services.notification_dispatch_service import _send_telegram

        ok = _send_telegram(notification, {"bot_token": "123:ABC"})
        assert ok is False


class TestSendTest:
    @patch("app.services.notification_dispatch_service._send_email", return_value=True)
    def test_send_test_email(self, mock_send, db_session):
        from app.models.notification_channel import ChannelType
        from app.services.notification_dispatch_service import NotificationDispatchService

        svc = NotificationDispatchService(db_session)
        ok = svc.send_test(ChannelType.email, {"email": "test@example.com"})
        assert ok is True
        assert mock_send.called
        sent_notification = mock_send.call_args.args[0]
        assert sent_notification.message == "Seabone test notification"
