"""Tests for instance approvals API endpoint."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from app.models.auth import Session as AuthSession
from app.models.auth import SessionStatus
from app.models.deploy_approval import ApprovalStatus, DeployApproval
from app.models.instance import Instance, InstanceStatus
from app.models.organization import Organization
from app.models.organization_member import OrganizationMember
from app.models.person import Person
from app.models.server import Server
from tests.conftest import _create_access_token


def _make_server(db_session) -> Server:
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
    return server


def _make_instance(db_session, server: Server, org_id) -> Instance:
    code = f"ORG{uuid.uuid4().hex[:6].upper()}"
    instance = Instance(
        server_id=server.server_id,
        org_id=org_id,
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


def _make_org_user_headers(db_session) -> tuple[dict[str, str], uuid.UUID]:
    org = Organization(
        org_code=f"ORG_{uuid.uuid4().hex[:6].upper()}",
        org_name="Org B",
        is_active=True,
    )
    person = Person(
        first_name="Org",
        last_name="B",
        email=f"user-{uuid.uuid4().hex}@example.com",
    )
    db_session.add(org)
    db_session.add(person)
    db_session.commit()
    db_session.refresh(org)
    db_session.refresh(person)

    db_session.add(OrganizationMember(org_id=org.org_id, person_id=person.id, is_active=True))
    db_session.commit()

    session = AuthSession(
        person_id=person.id,
        org_id=org.org_id,
        token_hash=f"session-{uuid.uuid4().hex}",
        status=SessionStatus.active,
        ip_address="127.0.0.1",
        user_agent="pytest",
        expires_at=datetime.now(UTC) + timedelta(days=30),
    )
    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)

    token = _create_access_token(str(person.id), str(session.id), org_id=str(org.org_id))
    return {"Authorization": f"Bearer {token}"}, org.org_id


def test_list_pending_approvals_scoped_to_authenticated_org(client, db_session, admin_headers, admin_org_id):
    server = _make_server(db_session)
    org_b_headers, org_b_id = _make_org_user_headers(db_session)

    instance_a = _make_instance(db_session, server, admin_org_id)
    instance_b = _make_instance(db_session, server, org_b_id)

    approval_a = DeployApproval(
        instance_id=instance_a.instance_id,
        requested_by=str(uuid.uuid4()),
        requested_by_name="Org A",
        status=ApprovalStatus.pending,
    )
    approval_b = DeployApproval(
        instance_id=instance_b.instance_id,
        requested_by=str(uuid.uuid4()),
        requested_by_name="Org B",
        status=ApprovalStatus.pending,
    )
    db_session.add(approval_a)
    db_session.add(approval_b)
    db_session.commit()
    db_session.refresh(approval_a)
    db_session.refresh(approval_b)

    response_a = client.get("/instances/approvals?limit=200", headers=admin_headers)
    assert response_a.status_code == 200
    approval_ids_a = {item["approval_id"] for item in response_a.json()}
    assert str(approval_a.approval_id) in approval_ids_a
    assert str(approval_b.approval_id) not in approval_ids_a

    response_b = client.get("/instances/approvals?limit=200", headers=org_b_headers)
    assert response_b.status_code == 200
    approval_ids_b = {item["approval_id"] for item in response_b.json()}
    assert str(approval_b.approval_id) in approval_ids_b
    assert str(approval_a.approval_id) not in approval_ids_b
