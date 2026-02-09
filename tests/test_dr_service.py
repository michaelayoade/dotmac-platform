"""Tests for DisasterRecoveryService."""

import uuid
from unittest.mock import patch

from app.models.backup import Backup, BackupStatus, BackupType
from app.models.dr_plan import DRTestStatus
from app.models.instance import Instance
from app.models.server import Server
from app.services.dr_service import DisasterRecoveryService
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


def _make_instance(db_session, server_id):
    instance = Instance(
        server_id=server_id,
        org_code=f"ORG{uuid.uuid4().hex[:6].upper()}",
        org_name="Test Org",
        app_port=8001,
        db_port=5433,
        redis_port=6380,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _make_backup(instance_id):
    backup = Backup(
        instance_id=instance_id,
        backup_type=BackupType.db_only,
        status=BackupStatus.completed,
        file_path="/tmp/backup.sql.gz",
    )
    return backup


def test_create_dr_plan(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id)
    svc = DisasterRecoveryService(db_session)

    plan = svc.create_dr_plan(instance.instance_id, backup_schedule_cron="0 1 * * *", retention_days=7)
    db_session.commit()

    assert plan.instance_id == instance.instance_id
    assert plan.retention_days == 7


def test_run_scheduled_backup_updates_last_backup(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id)
    svc = DisasterRecoveryService(db_session)
    plan = svc.create_dr_plan(instance.instance_id)
    db_session.commit()

    fake_backup = _make_backup(instance.instance_id)

    with patch("app.services.backup_service.BackupService.create_backup", return_value=fake_backup):
        backup = svc.run_scheduled_backup(plan.dr_plan_id)

    assert backup.status == BackupStatus.completed
    refreshed = db_session.get(type(plan), plan.dr_plan_id)
    assert refreshed.last_backup_at is not None


def test_test_dr_marks_failed_without_target(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id)
    svc = DisasterRecoveryService(db_session)
    plan = svc.create_dr_plan(instance.instance_id)
    db_session.commit()

    fake_backup = _make_backup(instance.instance_id)

    with patch("app.services.backup_service.BackupService.create_backup", return_value=fake_backup):
        result = svc.test_dr(plan.dr_plan_id)

    assert result["success"] is False
    refreshed = db_session.get(type(plan), plan.dr_plan_id)
    assert refreshed.last_test_status == DRTestStatus.failed
