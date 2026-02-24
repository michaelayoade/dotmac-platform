from __future__ import annotations

import uuid
from types import SimpleNamespace
from unittest.mock import patch

from app.models.deployment_log import DeployStepStatus
from app.models.instance import Instance
from app.models.server import Server
from app.services.deploy_service import DeployService
from app.services.instance_service import InstanceService


def _make_instance(db_session, *, org_code: str = "TST", deployed_git_ref: str | None = None) -> Instance:
    server = Server(name="srv-1", hostname="server.local", base_domain="example.test")
    db_session.add(server)
    db_session.flush()

    instance = Instance(
        server_id=server.server_id,
        org_code=org_code,
        org_name="Test Org",
        org_uuid="00000000-0000-0000-0000-000000000001",
        app_port=8011,
        db_port=5441,
        redis_port=6391,
        deploy_path=f"/opt/dotmac/instances/{org_code.lower()}",
        deployed_git_ref=deployed_git_ref,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_generate_docker_compose_always_uses_image(db_session):
    instance = _make_instance(db_session, org_code=f"TST_{uuid.uuid4().hex[:6].upper()}")
    content = InstanceService(db_session).generate_docker_compose(instance)

    assert "image: ${DOTMAC_IMAGE}" in content
    assert "build:" not in content
    assert "dockerfile: Dockerfile" not in content


def test_generate_env_no_build_context(db_session):
    instance = _make_instance(db_session, org_code=f"TST_{uuid.uuid4().hex[:6].upper()}")
    svc = InstanceService(db_session)
    content = svc.generate_env(instance, admin_password="secret")

    assert "APP_BUILD_CONTEXT" not in content


def test_setup_script_no_build_flag(db_session):
    instance = _make_instance(db_session, org_code=f"TST_{uuid.uuid4().hex[:6].upper()}")
    svc = InstanceService(db_session)
    content = svc.generate_setup_script(instance)

    assert "--build" not in content
    assert "Pulling and starting" in content


def test_step_backup_skips_when_db_container_missing(db_session):
    code = f"TST_{uuid.uuid4().hex[:6].upper()}"
    instance = _make_instance(db_session, org_code=code, deployed_git_ref="main")
    svc = DeployService(db_session)
    update_calls: list[tuple] = []

    def _capture_update(*args, **kwargs):
        update_calls.append((args, kwargs))

    svc._update_step = _capture_update  # type: ignore[method-assign]

    fake_backup = SimpleNamespace(
        status=SimpleNamespace(value="failed"),
        error_message=f"Error response from daemon: No such container: dotmac_{code.lower()}_db",
        file_path=None,
        size_bytes=None,
    )
    with patch("app.services.backup_service.BackupService.create_backup", return_value=fake_backup):
        ok = svc._step_backup(instance, "dep-test-1")

    assert ok is True
    assert any(
        call_args[0][3] == DeployStepStatus.skipped and "skipping backup" in call_args[0][4].lower()
        for call_args in update_calls
    )
