import uuid

from app.models.deployment_log import DeploymentLog
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.models.webhook import WebhookEndpoint


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


def _make_instance(db_session, server):
    code = f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.stopped,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_delete_instance_cleans_dependencies(db_session):
    from app.services.instance_service import InstanceService

    server = _make_server(db_session)
    instance = _make_instance(db_session, server)

    log = DeploymentLog(
        instance_id=instance.instance_id,
        deployment_id=str(uuid.uuid4()),
        step="deploy_start",
    )
    endpoint = WebhookEndpoint(
        url="https://example.com/hook",
        events=["deploy_success"],
        instance_id=instance.instance_id,
    )
    db_session.add_all([log, endpoint])
    db_session.commit()
    db_session.refresh(log)
    db_session.refresh(endpoint)

    # Capture IDs before delete — accessing attributes after commit + delete
    # would trigger a lazy-load on a deleted row.
    log_id = log.id
    instance_id = instance.instance_id

    InstanceService(db_session).delete(instance_id)
    db_session.commit()

    assert db_session.get(Instance, instance_id) is None
    assert db_session.get(DeploymentLog, log_id) is None

    persisted_endpoint = db_session.get(WebhookEndpoint, endpoint.endpoint_id)
    assert persisted_endpoint is not None
    assert persisted_endpoint.instance_id is None
