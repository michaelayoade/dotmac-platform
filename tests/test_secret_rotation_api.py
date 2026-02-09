"""API tests for secret rotation endpoints (direct function calls)."""

import uuid
from datetime import UTC, datetime
from unittest.mock import MagicMock, patch

from app.api.instances import rotate_all_secrets, rotate_secret, secret_rotation_history
from app.models.instance import Instance, InstanceStatus
from app.models.secret_rotation import RotationStatus, SecretRotationLog
from app.models.server import Server
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


def test_rotate_secret_endpoint_enqueues_task(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    fake_task = MagicMock()
    fake_task.id = "task-123"

    with patch("app.tasks.secrets.rotate_secret_task") as task_mock:
        task_mock.delay.return_value = fake_task
        data = rotate_secret(
            instance.instance_id,
            secret_name="JWT_SECRET",
            confirm_destructive=False,
            db=db_session,
            auth={"person_id": "tester"},
        )

    assert data["task_id"] == "task-123"
    assert data["secret_name"] == "JWT_SECRET"


def test_rotate_all_endpoint_enqueues_task(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    fake_task = MagicMock()
    fake_task.id = "task-456"

    with patch("app.tasks.secrets.rotate_all_secrets_task") as task_mock:
        task_mock.delay.return_value = fake_task
        data = rotate_all_secrets(
            instance.instance_id,
            confirm_destructive=False,
            db=db_session,
            auth={"person_id": "tester"},
        )

    assert data["task_id"] == "task-456"


def test_rotation_history_endpoint(db_session):
    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    log = SecretRotationLog(
        instance_id=instance.instance_id,
        secret_name="JWT_SECRET",
        status=RotationStatus.success,
        rotated_by="tester",
        started_at=datetime.now(UTC),
        completed_at=datetime.now(UTC),
    )
    db_session.add(log)
    db_session.commit()

    data = secret_rotation_history(
        instance.instance_id,
        limit=25,
        offset=0,
        db=db_session,
        auth={"person_id": "tester"},
    )
    assert data[0]["secret_name"] == "JWT_SECRET"
