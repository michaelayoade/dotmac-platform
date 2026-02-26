"""Tests for notification channel API endpoints."""

from __future__ import annotations

from unittest.mock import patch

import pytest


@pytest.fixture()
def notification_channel(db_session, person):
    from app.models.notification_channel import ChannelType
    from app.services.notification_channel_service import NotificationChannelService

    svc = NotificationChannelService(db_session)
    channel = svc.create_channel(
        person_id=person.id,
        channel_type=ChannelType.email,
        label="Primary Email",
        config={"email": "alerts@example.com"},
    )
    db_session.commit()
    db_session.refresh(channel)
    return channel


class TestNotificationChannelTestEndpoint:
    @patch("app.services.notification_dispatch_service.NotificationDispatchService.send_test", return_value=True)
    def test_v1_test_endpoint_sends_seabone_message(
        self,
        mock_send_test,
        client,
        auth_headers,
        notification_channel,
    ):
        from app.models.notification_channel import ChannelType

        response = client.post(
            f"/api/v1/notification-channels/{notification_channel.channel_id}/test",
            headers=auth_headers,
        )

        assert response.status_code == 200
        assert response.json() == {"success": True}
        assert mock_send_test.call_count == 1

        call_args, call_kwargs = mock_send_test.call_args
        assert call_args[0] == ChannelType.email
        assert call_args[1] == {"email": "alerts@example.com"}
        assert call_kwargs["title"] == "Seabone test notification"
        assert call_kwargs["message"] == "Seabone test notification"
