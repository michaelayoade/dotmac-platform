"""Unit tests for UpgradeService.run_upgrade()."""

import uuid
from unittest.mock import patch

from app.models.app_upgrade import AppUpgrade, UpgradeStatus
from app.models.catalog import AppBundle, AppCatalogItem, AppRelease
from app.models.git_repository import GitAuthType, GitRepository
from app.models.instance import Instance
from app.models.server import Server
from app.services.upgrade_service import UpgradeService
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


def _make_catalog_item(db_session):
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
        is_active=True,
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

    catalog_item = AppCatalogItem(
        label="Standard",
        release_id=release.release_id,
        bundle_id=bundle.bundle_id,
        is_active=True,
    )
    db_session.add(catalog_item)
    db_session.commit()
    db_session.refresh(catalog_item)
    return catalog_item


def _make_instance(db_session, server_id):
    instance = Instance(
        server_id=server_id,
        org_code=f"ORG-{uuid.uuid4().hex[:6]}",
        org_name="Test Org",
        app_port=8000,
        db_port=5432,
        redis_port=6379,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _make_upgrade(db_session, instance_id, catalog_item_id, status=UpgradeStatus.scheduled):
    upgrade = AppUpgrade(
        instance_id=instance_id,
        catalog_item_id=catalog_item_id,
        status=status,
    )
    db_session.add(upgrade)
    db_session.commit()
    db_session.refresh(upgrade)
    return upgrade


def test_run_upgrade_marks_upgrade_completed_when_deploy_succeeds(db_session):
    server = _make_server(db_session)
    catalog_item = _make_catalog_item(db_session)
    instance = _make_instance(db_session, server.server_id)
    upgrade = _make_upgrade(db_session, instance.instance_id, catalog_item.catalog_id)

    with patch("app.services.deploy_service.DeployService.create_deployment", return_value="dep-1"):
        with patch(
            "app.services.deploy_service.DeployService.run_deployment",
            return_value={"success": True},
        ):
            UpgradeService(db_session).run_upgrade(upgrade.upgrade_id)

    db_session.refresh(upgrade)
    assert upgrade.status == UpgradeStatus.completed


def test_run_upgrade_marks_upgrade_failed_and_sets_error_when_deploy_raises(db_session):
    server = _make_server(db_session)
    catalog_item = _make_catalog_item(db_session)
    instance = _make_instance(db_session, server.server_id)
    upgrade = _make_upgrade(db_session, instance.instance_id, catalog_item.catalog_id)

    with patch("app.services.deploy_service.DeployService.create_deployment", return_value="dep-2"):
        with patch(
            "app.services.deploy_service.DeployService.run_deployment",
            side_effect=RuntimeError("deployment exploded"),
        ):
            UpgradeService(db_session).run_upgrade(upgrade.upgrade_id)

    db_session.refresh(upgrade)
    assert upgrade.status == UpgradeStatus.failed
    assert upgrade.error_message is not None
    assert "deployment exploded" in upgrade.error_message


def test_run_upgrade_returns_early_when_upgrade_is_already_running(db_session):
    server = _make_server(db_session)
    catalog_item = _make_catalog_item(db_session)
    instance = _make_instance(db_session, server.server_id)
    upgrade = _make_upgrade(db_session, instance.instance_id, catalog_item.catalog_id, status=UpgradeStatus.running)

    with patch("app.services.deploy_service.DeployService.create_deployment") as mock_create:
        with patch("app.services.deploy_service.DeployService.run_deployment") as mock_run:
            result = UpgradeService(db_session).run_upgrade(upgrade.upgrade_id)

    db_session.refresh(upgrade)
    assert result == {"success": False}
    assert upgrade.status == UpgradeStatus.running
    mock_create.assert_not_called()
    mock_run.assert_not_called()
