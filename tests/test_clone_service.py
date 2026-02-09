"""Tests for CloneService enhanced workflow."""

import uuid
from unittest.mock import patch

from app.models.clone_operation import CloneStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.clone_service import CloneService
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


def _make_instance(db_session, server_id, org_code=None):
    instance = Instance(
        server_id=server_id,
        org_code=org_code or f"ORG{uuid.uuid4().hex[:6].upper()}",
        org_name="Source Org",
        app_port=8001,
        db_port=5433,
        redis_port=6380,
        status=InstanceStatus.running,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_clone_operation_created(db_session):
    server = _make_server(db_session)
    source = _make_instance(db_session, server.server_id)
    svc = CloneService(db_session)

    op = svc.clone_instance(
        source.instance_id,
        "clone01",
        "Clone Org",
        include_data=False,
        admin_password="Passw0rd!",
    )
    db_session.commit()

    assert op.status == CloneStatus.pending
    assert op.admin_password_encrypted
    assert op.new_org_code == "CLONE01"


def test_run_clone_completes_without_data(db_session):
    server = _make_server(db_session)
    source = _make_instance(db_session, server.server_id)
    svc = CloneService(db_session)

    op = svc.clone_instance(
        source.instance_id,
        "clone02",
        "Clone Org 2",
        include_data=False,
        admin_password="Passw0rd!",
    )
    db_session.commit()

    with patch("app.services.deploy_service.DeployService.run_deployment", return_value={"success": True}):
        result = svc.run_clone(op.clone_id)

    assert result["success"] is True
    refreshed = db_session.get(type(op), op.clone_id)
    assert refreshed is not None
    assert refreshed.status == CloneStatus.completed
    assert refreshed.target_instance_id is not None
