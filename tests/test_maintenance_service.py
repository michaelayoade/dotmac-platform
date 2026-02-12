"""Tests for MaintenanceService."""

import uuid
from datetime import UTC, datetime, time
from zoneinfo import ZoneInfo

from app.models.instance import Instance
from app.models.maintenance_window import MaintenanceWindow
from app.models.server import Server
from app.services.maintenance_service import MaintenanceService
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
        org_code=f"org-{uuid.uuid4().hex[:6]}",
        org_name="Test Org",
        app_port=8001,
        db_port=5433,
        redis_port=6380,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_is_deploy_allowed_no_windows(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id)

    svc = MaintenanceService(db_session)
    assert svc.is_deploy_allowed(instance.instance_id) is True


def test_is_deploy_disallowed_inside_window(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id)

    now = datetime(2025, 1, 6, 10, 30, tzinfo=UTC)  # Monday
    window = MaintenanceWindow(
        instance_id=instance.instance_id,
        day_of_week=now.weekday(),
        start_time=time(9, 0),
        end_time=time(11, 0),
        timezone="UTC",
        is_active=True,
    )
    db_session.add(window)
    db_session.commit()

    svc = MaintenanceService(db_session)
    assert svc.is_deploy_allowed(instance.instance_id, now=now) is False


def test_is_deploy_uses_window_timezone(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id)

    now = datetime(2025, 1, 6, 12, 0, tzinfo=UTC)  # Monday
    tz = ZoneInfo("America/Los_Angeles")
    local = now.astimezone(tz)
    window = MaintenanceWindow(
        instance_id=instance.instance_id,
        day_of_week=local.weekday(),
        start_time=time(local.hour - 1, local.minute),
        end_time=time(local.hour + 1, local.minute),
        timezone="America/Los_Angeles",
        is_active=True,
    )
    db_session.add(window)
    db_session.commit()

    svc = MaintenanceService(db_session)
    assert svc.is_deploy_allowed(instance.instance_id, now=now) is False
