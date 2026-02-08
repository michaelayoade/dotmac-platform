import uuid
from datetime import time

import pytest

from app.models.backup import Backup, BackupStatus, BackupType
from app.models.instance import Instance, InstanceStatus
from app.models.instance_domain import DomainStatus, InstanceDomain
from app.models.maintenance_window import MaintenanceWindow
from app.models.server import Server
from app.services.backup_service import BackupService
from app.services.domain_service import DomainService
from app.services.maintenance_service import MaintenanceService
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


def _make_server(db_session):
    server = Server(
        name=f"server-{uuid.uuid4().hex[:6]}",
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


def _make_instance(db_session, server, *, org_code=None):
    code = org_code or f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_backup_restore_requires_instance_match(db_session):
    server = _make_server(db_session)
    instance_a = _make_instance(db_session, server)
    instance_b = _make_instance(db_session, server)

    backup = Backup(
        instance_id=instance_a.instance_id,
        backup_type=BackupType.db_only,
        status=BackupStatus.completed,
        file_path="/tmp/test.sql.gz",
    )
    db_session.add(backup)
    db_session.commit()

    svc = BackupService(db_session)
    with pytest.raises(ValueError):
        svc.restore_backup(instance_b.instance_id, backup.backup_id)


def test_domain_operations_require_instance_match(db_session):
    server = _make_server(db_session)
    instance_a = _make_instance(db_session, server)
    instance_b = _make_instance(db_session, server)

    domain = InstanceDomain(
        instance_id=instance_a.instance_id,
        domain=f"example-{uuid.uuid4().hex[:6]}.com",
        status=DomainStatus.pending_verification,
        verification_token="token",
    )
    db_session.add(domain)
    db_session.commit()

    svc = DomainService(db_session)
    with pytest.raises(ValueError):
        svc.remove_domain(instance_b.instance_id, domain.domain_id)


def test_maintenance_delete_requires_instance_match(db_session):
    server = _make_server(db_session)
    instance_a = _make_instance(db_session, server)
    instance_b = _make_instance(db_session, server)

    window = MaintenanceWindow(
        instance_id=instance_a.instance_id,
        day_of_week=0,
        start_time=time(1, 0),
        end_time=time(2, 0),
        timezone="UTC",
    )
    db_session.add(window)
    db_session.commit()

    svc = MaintenanceService(db_session)
    with pytest.raises(ValueError):
        svc.delete_window(instance_b.instance_id, window.window_id)
    db_session.refresh(window)
    assert window.is_active is True

    svc.delete_window(instance_a.instance_id, window.window_id)
    db_session.refresh(window)
    assert window.is_active is False
