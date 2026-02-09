"""Approval gating for upgrades."""

import uuid
from datetime import UTC, datetime, timedelta

from app.api.instances import create_upgrade
from app.models.app_upgrade import AppUpgrade
from app.models.catalog import AppBundle, AppCatalogItem, AppRelease
from app.models.deploy_approval import DeployApproval
from app.models.git_repository import GitAuthType, GitRepository
from app.models.instance import Instance
from app.models.instance_tag import InstanceTag
from app.models.server import Server
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


def _make_server(db_session):
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


def _make_catalog(db_session):
    repo = GitRepository(
        label=f"repo-{uuid.uuid4().hex[:6]}",
        url="git@example.com:repo.git",
        auth_type=GitAuthType.none,
        is_active=True,
    )
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)

    release = AppRelease(
        name="Release A",
        version="1.2.3",
        git_ref="v1.2.3",
        git_repo_id=repo.repo_id,
    )
    bundle = AppBundle(
        name="Core",
        description="Core bundle",
        module_slugs=["core"],
        flag_keys=["feature_x"],
    )
    db_session.add_all([release, bundle])
    db_session.commit()
    db_session.refresh(release)
    db_session.refresh(bundle)

    item = AppCatalogItem(label="Standard", release_id=release.release_id, bundle_id=bundle.bundle_id)
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


def _make_instance(db_session, server_id):
    inst = Instance(
        server_id=server_id,
        org_code=f"ORG-{uuid.uuid4().hex[:6]}",
        org_name="Test Org",
        app_port=8000,
        db_port=5432,
        redis_port=6379,
    )
    db_session.add(inst)
    db_session.commit()
    db_session.refresh(inst)
    return inst


def test_upgrade_creates_approval_when_required(db_session):
    server = _make_server(db_session)
    catalog_item = _make_catalog(db_session)
    instance = _make_instance(db_session, server.server_id)

    tag = InstanceTag(instance_id=instance.instance_id, key="requires_approval", value="true")
    db_session.add(tag)
    db_session.commit()

    resp = create_upgrade(
        instance.instance_id,
        catalog_item.catalog_id,
        scheduled_for=(datetime.now(UTC) + timedelta(hours=1)).isoformat(),
        db=db_session,
        auth={"person_id": "admin-user"},
    )

    assert resp["approval_required"] is True

    from sqlalchemy import select

    approval = db_session.scalar(select(DeployApproval).where(DeployApproval.instance_id == instance.instance_id))
    assert approval is not None
    assert approval.deployment_type == "upgrade"

    upgrade = db_session.get(AppUpgrade, uuid.UUID(resp["upgrade_id"]))
    assert approval.upgrade_id == upgrade.upgrade_id


def test_upgrade_response_includes_approval_id(db_session):
    server = _make_server(db_session)
    catalog_item = _make_catalog(db_session)
    instance = _make_instance(db_session, server.server_id)

    tag = InstanceTag(instance_id=instance.instance_id, key="requires_approval", value="true")
    db_session.add(tag)
    db_session.commit()

    resp = create_upgrade(
        instance.instance_id,
        catalog_item.catalog_id,
        scheduled_for=None,
        db=db_session,
        auth={"person_id": "admin-user"},
    )

    assert resp["approval_required"] is True
    assert resp["approval_id"]
