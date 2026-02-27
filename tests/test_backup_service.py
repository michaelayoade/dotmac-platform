"""Unit tests for BackupService."""

import uuid
from datetime import UTC, datetime
from unittest.mock import MagicMock, patch

import pytest

from app.models.backup import Backup, BackupStatus, BackupType
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.backup_service import BackupService
from app.services.ssh_service import SSHResult
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


@pytest.fixture()
def server(db_session):
    row = Server(
        name=f"server-{uuid.uuid4().hex[:8]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(row)
    db_session.commit()
    db_session.refresh(row)
    return row


@pytest.fixture()
def instance(db_session, server):
    code = f"ORG{uuid.uuid4().hex[:6].upper()}"
    row = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
    )
    db_session.add(row)
    db_session.commit()
    db_session.refresh(row)
    return row


@pytest.fixture()
def completed_backup(db_session, instance):
    row = Backup(
        instance_id=instance.instance_id,
        backup_type=BackupType.db_only,
        status=BackupStatus.completed,
        file_path="/tmp/test-backup.sql.gz",
        created_at=datetime.now(UTC),
    )
    db_session.add(row)
    db_session.commit()
    db_session.refresh(row)
    return row


def test_create_backup_creates_completed_backup_when_ssh_succeeds(db_session, instance):
    svc = BackupService(db_session)
    fake_ssh = MagicMock()

    def _exec(command, timeout=120):
        if command.startswith("mkdir -p "):
            return SSHResult(0, "", "")
        if command.startswith("bash -lc "):
            return SSHResult(0, "", "")
        if command.startswith("stat -c%s "):
            return SSHResult(0, "2048\n", "")
        return SSHResult(1, "", f"unexpected command: {command}")

    fake_ssh.exec_command.side_effect = _exec

    with patch("app.services.backup_service.get_ssh_for_server", return_value=fake_ssh):
        with patch.object(BackupService, "_notify_backup", return_value=None):
            backup = svc.create_backup(instance.instance_id)

    assert backup.instance_id == instance.instance_id
    assert backup.status == BackupStatus.completed
    assert backup.backup_type == BackupType.db_only
    assert backup.size_bytes == 2048
    assert backup.file_path is not None

    saved = db_session.get(Backup, backup.backup_id)
    assert saved is not None
    assert saved.status == BackupStatus.completed
    assert saved.size_bytes == 2048


def test_create_backup_marks_backup_failed_when_ssh_raises(db_session, instance):
    svc = BackupService(db_session)

    with patch("app.services.backup_service.get_ssh_for_server", side_effect=RuntimeError("ssh unavailable")):
        with patch.object(BackupService, "_notify_backup", return_value=None):
            backup = svc.create_backup(instance.instance_id)

    assert backup.instance_id == instance.instance_id
    assert backup.status == BackupStatus.failed
    assert backup.error_message is not None
    assert "ssh unavailable" in backup.error_message

    saved = db_session.get(Backup, backup.backup_id)
    assert saved is not None
    assert saved.status == BackupStatus.failed


def test_restore_backup_sets_instance_status_when_ssh_succeeds(db_session, instance, completed_backup):
    svc = BackupService(db_session)
    fake_ssh = MagicMock()
    fake_ssh.exec_command.return_value = SSHResult(0, "ok", "")

    instance.status = InstanceStatus.stopped
    db_session.commit()

    with patch("app.services.backup_service.get_ssh_for_server", return_value=fake_ssh):
        result = svc.restore_backup(instance.instance_id, completed_backup.backup_id)

    assert result == {"success": True, "message": "Restore completed"}
    db_session.refresh(instance)
    assert instance.status == InstanceStatus.running


def test_restore_backup_raises_for_missing_instance(db_session, instance, completed_backup):
    svc = BackupService(db_session)

    db_session.delete(instance)
    db_session.commit()

    with pytest.raises(ValueError, match="Instance not found"):
        svc.restore_backup(completed_backup.instance_id, completed_backup.backup_id)


def test_purge_old_backups_returns_zero_when_nothing_qualifies(db_session, completed_backup):
    svc = BackupService(db_session)

    with patch.object(svc, "delete_backup") as mock_delete:
        purged = svc.purge_old_backups(retention_days=30)

    assert purged == 0
    mock_delete.assert_not_called()
    assert db_session.get(Backup, completed_backup.backup_id) is not None
