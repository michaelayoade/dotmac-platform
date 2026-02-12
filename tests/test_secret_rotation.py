"""Tests for SecretRotationService."""

import uuid
from datetime import UTC, datetime
from unittest.mock import MagicMock, patch

import pytest

from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.instance_service import parse_env_file
from app.services.secret_rotation_service import SecretRotationService
from app.services.ssh_service import SSHResult
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


def _make_server(db_session):
    server = Server(
        name=f"test-server-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)
    return server


def _make_instance(db_session, server):
    code = f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
        deploy_path=f"/tmp/{code}",
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _base_env(instance: Instance) -> str:
    return (
        f"POSTGRES_PASSWORD=oldpg\n"
        f"POSTGRES_DB=dotmac_{instance.org_code.lower()}\n"
        f"DATABASE_URL=postgresql+psycopg://postgres:oldpg@db:5432/dotmac_{instance.org_code.lower()}\n"
        f"REDIS_PASSWORD=oldredis\n"
        f"REDIS_URL=redis://:oldredis@redis:6379/0\n"
        f"CELERY_BROKER_URL=redis://:oldredis@redis:6379/0\n"
        f"CELERY_RESULT_BACKEND=redis://:oldredis@redis:6379/1\n"
        f"JWT_SECRET=oldjwt\n"
        f"TOTP_ENCRYPTION_KEY=oldt\n"
        f"OPENBAO_TOKEN=oldbao\n"
    )


def test_rotate_jwt_secret_updates_env_and_log(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    fake_ssh = MagicMock()
    fake_ssh.sftp_read_string.return_value = _base_env(instance)
    fake_ssh.exec_command.return_value = SSHResult(0, "ok", "")

    with patch("app.services.secret_rotation_service.get_ssh_for_server", return_value=fake_ssh):
        with patch("app.services.secret_rotation_service.time.sleep", return_value=None):
            with patch("app.services.health_service.HealthService") as mock_health:
                mock_health.return_value.poll_instance.return_value = HealthCheck(
                    instance_id=instance.instance_id,
                    status=HealthStatus.healthy,
                    checked_at=datetime.now(UTC),
                )
                svc = SecretRotationService(db_session)
                log = svc.rotate_secret(instance.instance_id, "JWT_SECRET", rotated_by="tester")

    assert log.status.value == "success"
    assert fake_ssh.sftp_put_string.called

    new_env = parse_env_file(fake_ssh.sftp_put_string.call_args.args[0])
    assert new_env["JWT_SECRET"] != "oldjwt"


def test_rotate_totp_requires_confirm(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    svc = SecretRotationService(db_session)
    try:
        svc.rotate_secret(instance.instance_id, "TOTP_ENCRYPTION_KEY")
    except ValueError as e:
        assert "confirm_destructive" in str(e)
    else:
        raise AssertionError("expected ValueError")


def test_rotate_postgres_updates_database_url(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    fake_ssh = MagicMock()
    fake_ssh.sftp_read_string.return_value = _base_env(instance)
    fake_ssh.exec_command.return_value = SSHResult(0, "ok", "")

    with patch("app.services.secret_rotation_service.get_ssh_for_server", return_value=fake_ssh):
        with patch("app.services.secret_rotation_service.time.sleep", return_value=None):
            with patch("app.services.health_service.HealthService") as mock_health:
                mock_health.return_value.poll_instance.return_value = HealthCheck(
                    instance_id=instance.instance_id,
                    status=HealthStatus.healthy,
                    checked_at=datetime.now(UTC),
                )
                svc = SecretRotationService(db_session)
                log = svc.rotate_secret(instance.instance_id, "POSTGRES_PASSWORD", rotated_by="tester")

    assert log.status.value == "success"
    new_env = parse_env_file(fake_ssh.sftp_put_string.call_args.args[0])
    assert new_env["POSTGRES_PASSWORD"] in new_env["DATABASE_URL"]


def test_rotate_postgres_rolls_back_on_restart_failure(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)
    env_content = _base_env(instance)

    fake_ssh = MagicMock()
    fake_ssh.sftp_read_string.return_value = env_content
    fake_ssh.exec_command.return_value = SSHResult(0, "ok", "")

    with patch("app.services.secret_rotation_service.get_ssh_for_server", return_value=fake_ssh):
        with patch("app.services.secret_rotation_service.time.sleep", return_value=None):
            with patch("app.services.secret_rotation_service.secrets.token_urlsafe", return_value="newpass"):
                with patch.object(SecretRotationService, "_rotate_postgres_password") as rotate_pg:
                    with patch.object(SecretRotationService, "_recreate_services", side_effect=ValueError("boom")):
                        with patch("app.services.health_service.HealthService") as mock_health:
                            mock_health.return_value.poll_instance.return_value = HealthCheck(
                                instance_id=instance.instance_id,
                                status=HealthStatus.healthy,
                                checked_at=datetime.now(UTC),
                            )
                            svc = SecretRotationService(db_session)
                            with pytest.raises(ValueError):
                                svc.rotate_secret(instance.instance_id, "POSTGRES_PASSWORD", rotated_by="tester")

    passwords = [call.args[-1] for call in rotate_pg.call_args_list]
    assert passwords == ["newpass", "oldpg"]

    assert fake_ssh.sftp_put_string.call_count == 2
    assert fake_ssh.sftp_put_string.call_args_list[-1].args[0] == env_content
