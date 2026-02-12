"""Tests for HealthService -- polling, pruning, and query methods."""

import uuid
from datetime import UTC, datetime, timedelta
from unittest.mock import MagicMock, patch

from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


def _make_server(db_session, *, is_local=True):
    server = Server(
        name=f"test-server-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=is_local,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)
    return server


def _make_instance(db_session, server, *, status=InstanceStatus.running, org_code=None):
    code = org_code or f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=status,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _make_checks(db_session, instance_id, count, *, base_time=None):
    base = base_time or datetime.now(UTC)
    checks = []
    for i in range(count):
        hc = HealthCheck(
            instance_id=instance_id,
            checked_at=base - timedelta(minutes=i),
            status=HealthStatus.healthy,
            response_ms=50 + i,
        )
        db_session.add(hc)
        checks.append(hc)
    db_session.commit()
    for c in checks:
        db_session.refresh(c)
    return checks


class TestPollLocal:
    def test_healthy_response(self, db_session):
        from app.services.health_service import HealthService

        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"db": True, "redis": True}
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = mock_response
        with patch("app.services.health_service.httpx.Client", return_value=mock_client):
            svc = HealthService(db_session)
            check = svc.poll_instance(instance)
        assert check.status == HealthStatus.healthy
        assert check.db_healthy is True
        assert check.redis_healthy is True

    def test_unhealthy_response(self, db_session):
        from app.services.health_service import HealthService

        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        mock_response = MagicMock()
        mock_response.status_code = 503
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = mock_response
        with patch("app.services.health_service.httpx.Client", return_value=mock_client):
            svc = HealthService(db_session)
            check = svc.poll_instance(instance)
        assert check.status == HealthStatus.unhealthy
        assert "503" in check.error_message

    def test_unreachable_on_exception(self, db_session):
        from app.services.health_service import HealthService

        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.side_effect = ConnectionError("refused")
        with patch("app.services.health_service.httpx.Client", return_value=mock_client):
            svc = HealthService(db_session)
            check = svc.poll_instance(instance)
        assert check.status == HealthStatus.unreachable
        assert "refused" in check.error_message


class TestPollRemote:
    def test_invalid_json_marks_unhealthy(self, db_session):
        from app.services.health_service import HealthService
        from app.services.ssh_service import SSHResult

        server = _make_server(db_session, is_local=False)
        instance = _make_instance(db_session, server)

        fake_ssh = MagicMock()
        fake_ssh.exec_command.return_value = SSHResult(0, "not-json", "")

        with patch("app.services.health_service.get_ssh_for_server", return_value=fake_ssh):
            svc = HealthService(db_session)
            check = svc.poll_instance(instance)

        assert check.status == HealthStatus.unhealthy
        assert "Invalid health JSON" in (check.error_message or "")


class TestPruneOldChecks:
    @patch("app.services.health_service.platform_settings")
    def test_prune_keeps_n_latest(self, mock_settings, db_session):
        from app.services.health_service import HealthService

        mock_settings.health_checks_to_keep = 3
        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        _make_checks(db_session, instance.instance_id, 7)
        svc = HealthService(db_session)
        deleted = svc.prune_old_checks(instance.instance_id)
        db_session.commit()
        assert deleted == 4
        remaining = svc.get_recent_checks(instance.instance_id, limit=100)
        assert len(remaining) == 3

    @patch("app.services.health_service.platform_settings")
    def test_prune_nothing_when_under_limit(self, mock_settings, db_session):
        from app.services.health_service import HealthService

        mock_settings.health_checks_to_keep = 10
        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        _make_checks(db_session, instance.instance_id, 5)
        svc = HealthService(db_session)
        deleted = svc.prune_old_checks(instance.instance_id)
        assert deleted == 0


class TestPruneAllOldChecks:
    @patch("app.services.health_service.platform_settings")
    def test_prunes_across_multiple_instances(self, mock_settings, db_session):
        from app.services.health_service import HealthService

        mock_settings.health_checks_to_keep = 2
        server = _make_server(db_session, is_local=True)
        inst1 = _make_instance(db_session, server, status=InstanceStatus.running)
        inst2 = _make_instance(db_session, server, status=InstanceStatus.running)
        _make_checks(db_session, inst1.instance_id, 5)
        _make_checks(db_session, inst2.instance_id, 4)
        svc = HealthService(db_session)
        total = svc.prune_all_old_checks()
        # At minimum we should prune (5-2) + (4-2) = 5 from our instances
        assert total >= 5

    @patch("app.services.health_service.platform_settings")
    def test_stopped_instance_not_pruned(self, mock_settings, db_session):
        from app.services.health_service import HealthService

        mock_settings.health_checks_to_keep = 1
        server = _make_server(db_session, is_local=True)
        stopped = _make_instance(db_session, server, status=InstanceStatus.stopped)
        _make_checks(db_session, stopped.instance_id, 5)
        svc = HealthService(db_session)
        # The stopped instance's checks should not be pruned
        remaining_before = svc.get_recent_checks(stopped.instance_id, limit=100)
        svc.prune_all_old_checks()
        remaining_after = svc.get_recent_checks(stopped.instance_id, limit=100)
        assert len(remaining_after) == len(remaining_before)


class TestQueryMethods:
    def test_get_latest_check(self, db_session):
        from app.services.health_service import HealthService

        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        checks = _make_checks(db_session, instance.instance_id, 5)
        svc = HealthService(db_session)
        latest = svc.get_latest_check(instance.instance_id)
        assert latest is not None
        assert latest.id == checks[0].id  # checks[0] is the most recent

    def test_get_latest_check_returns_none_when_empty(self, db_session):
        from app.services.health_service import HealthService

        svc = HealthService(db_session)
        assert svc.get_latest_check(uuid.uuid4()) is None

    def test_get_recent_checks_respects_limit(self, db_session):
        from app.services.health_service import HealthService

        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        _make_checks(db_session, instance.instance_id, 10)
        svc = HealthService(db_session)
        recent = svc.get_recent_checks(instance.instance_id, limit=3)
        assert len(recent) == 3

    def test_get_recent_checks_ordered_desc(self, db_session):
        from app.services.health_service import HealthService

        server = _make_server(db_session, is_local=True)
        instance = _make_instance(db_session, server)
        _make_checks(db_session, instance.instance_id, 5)
        svc = HealthService(db_session)
        recent = svc.get_recent_checks(instance.instance_id, limit=5)
        for i in range(len(recent) - 1):
            assert recent[i].checked_at >= recent[i + 1].checked_at
