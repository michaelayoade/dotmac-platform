"""Tests for alert email notification channel."""

from __future__ import annotations

import uuid
from unittest.mock import patch

import pytest

from app.models.alert_rule import AlertChannel, AlertMetric, AlertOperator
from app.services.alert_service import AlertService


@pytest.fixture()
def svc(db_session):
    return AlertService(db_session)


@pytest.fixture()
def _instance(db_session):
    """Create a test instance (with server) for alerts."""
    from app.models.instance import Instance, InstanceStatus
    from app.models.server import Server, ServerStatus

    server = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname=f"srv-{uuid.uuid4().hex[:6]}.example.com",
        status=ServerStatus.connected,
    )
    db_session.add(server)
    db_session.flush()

    code = f"testemail{uuid.uuid4().hex[:6]}"
    inst = Instance(
        org_code=code,
        org_name=f"Org {code}",
        status=InstanceStatus.running,
        server_id=server.server_id,
        app_port=8080,
        db_port=5432,
        redis_port=6379,
    )
    db_session.add(inst)
    db_session.commit()
    db_session.refresh(inst)
    return inst


class TestNotifyEmail:
    @patch("app.services.email.send_email")
    def test_sends_to_channel_config_recipients(self, mock_send, svc, _instance, db_session):
        rule = svc.create_rule(
            name="CPU Alert",
            metric=AlertMetric.cpu_percent,
            operator=AlertOperator.gt,
            threshold=80.0,
            channel=AlertChannel.email,
            channel_config={"recipients": ["admin@example.com", "ops@example.com"]},
            instance_id=_instance.instance_id,
        )
        db_session.commit()

        mock_send.return_value = True
        svc._notify_email(rule, _instance.instance_id, 95.0)

        assert mock_send.call_count == 2
        calls = [c.args[1] for c in mock_send.call_args_list]
        assert "admin@example.com" in calls
        assert "ops@example.com" in calls

    @patch("app.services.email.send_email")
    def test_fallback_to_env_recipients(self, mock_send, svc, _instance, db_session):
        rule = svc.create_rule(
            name="Mem Alert",
            metric=AlertMetric.memory_mb,
            operator=AlertOperator.gt,
            threshold=1024.0,
            channel=AlertChannel.email,
        )
        db_session.commit()

        mock_send.return_value = True
        with patch.dict("os.environ", {"ALERT_EMAIL_RECIPIENTS": "fallback@example.com"}):
            svc._notify_email(rule, _instance.instance_id, 2048.0)

        assert mock_send.call_count == 1
        assert mock_send.call_args.args[1] == "fallback@example.com"

    @patch("app.services.email.send_email")
    def test_no_recipients_logs_warning(self, mock_send, svc, _instance, db_session, caplog):
        rule = svc.create_rule(
            name="No Recip",
            metric=AlertMetric.cpu_percent,
            operator=AlertOperator.gt,
            threshold=80.0,
            channel=AlertChannel.email,
        )
        db_session.commit()

        with patch.dict("os.environ", {}, clear=False):
            # Ensure ALERT_EMAIL_RECIPIENTS is not set
            import os

            os.environ.pop("ALERT_EMAIL_RECIPIENTS", None)
            svc._notify_email(rule, _instance.instance_id, 95.0)

        mock_send.assert_not_called()

    @patch("app.services.email.send_email")
    def test_send_email_exception_does_not_propagate(self, mock_send, svc, _instance, db_session):
        rule = svc.create_rule(
            name="Err Alert",
            metric=AlertMetric.cpu_percent,
            operator=AlertOperator.gt,
            threshold=80.0,
            channel=AlertChannel.email,
            channel_config={"recipients": ["admin@example.com"]},
        )
        db_session.commit()

        mock_send.side_effect = RuntimeError("SMTP down")
        # Should not raise
        svc._notify_email(rule, _instance.instance_id, 95.0)

    @patch("app.services.email.send_email")
    def test_email_subject_contains_rule_name(self, mock_send, svc, _instance, db_session):
        rule = svc.create_rule(
            name="Disk Full",
            metric=AlertMetric.disk_usage_mb,
            operator=AlertOperator.gt,
            threshold=50000.0,
            channel=AlertChannel.email,
            channel_config={"recipients": ["admin@example.com"]},
            instance_id=_instance.instance_id,
        )
        db_session.commit()

        mock_send.return_value = True
        svc._notify_email(rule, _instance.instance_id, 60000.0)

        subject = mock_send.call_args.args[2]
        assert "Disk Full" in subject
