"""Approval expiry behavior."""

import uuid
from datetime import UTC, datetime, timedelta

from app.models.deploy_approval import ApprovalStatus, DeployApproval
from app.models.instance import Instance
from app.models.server import Server
from app.services.approval_service import ApprovalService
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


def test_expire_pending_approvals(db_session):
    server = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)

    instance = Instance(
        server_id=server.server_id,
        org_code=f"ORG-{uuid.uuid4().hex[:6]}",
        org_name="Test Org",
        app_port=8000,
        db_port=5432,
        redis_port=6379,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)

    approval = DeployApproval(
        instance_id=instance.instance_id,
        requested_by="user",
        deployment_type="full",
        created_at=datetime.now(UTC) - timedelta(days=10),
    )
    db_session.add(approval)
    db_session.commit()

    svc = ApprovalService(db_session)
    expired = svc.expire_pending(max_age_days=7)
    db_session.commit()

    assert expired == 1
    db_session.refresh(approval)
    assert approval.status == ApprovalStatus.expired
