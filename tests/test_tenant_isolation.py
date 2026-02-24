import uuid

import pytest
from fastapi import HTTPException

from app.api.deps import require_instance_access
from app.models.instance import Instance, InstanceStatus
from app.models.organization import Organization
from app.models.server import Server
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


@pytest.fixture(autouse=True)
def _clean_tenant_tables(db_session):
    db_session.query(Instance).delete()
    db_session.query(Organization).delete()
    db_session.query(Server).delete()
    db_session.commit()
    yield


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


def _make_org(db_session, code: str):
    org = Organization(org_code=code, org_name=f"Org {code}", is_active=True)
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


def _make_instance(db_session, server, org):
    instance = Instance(
        server_id=server.server_id,
        org_id=org.org_id,
        org_code=org.org_code,
        org_name=org.org_name,
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        status=InstanceStatus.running,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_require_instance_access_allows_same_org(db_session):
    server = _make_server(db_session)
    suffix = uuid.uuid4().hex[:6]
    org = _make_org(db_session, f"ORG_A_{suffix}")
    instance = _make_instance(db_session, server, org)

    auth = {"org_id": str(org.org_id)}
    resolved = require_instance_access(instance.instance_id, db=db_session, auth=auth)
    assert resolved.instance_id == instance.instance_id


def test_require_instance_access_forbids_other_org(db_session):
    server = _make_server(db_session)
    suffix = uuid.uuid4().hex[:6]
    org_a = _make_org(db_session, f"ORG_A_{suffix}")
    org_b = _make_org(db_session, f"ORG_B_{suffix}")
    instance = _make_instance(db_session, server, org_a)

    auth = {"org_id": str(org_b.org_id)}
    with pytest.raises(HTTPException) as exc:
        require_instance_access(instance.instance_id, db=db_session, auth=auth)
    assert exc.value.status_code == 403
