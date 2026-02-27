"""Unit tests for DeployService.run_deployment()."""

from __future__ import annotations

import uuid
from collections.abc import Callable
from unittest.mock import MagicMock, patch

from app.models.deployment_log import DeploymentLog, DeployStepStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.deploy_service import DEPLOY_STEPS, DeployError, DeployService
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


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


def _make_instance(db_session, server: Server) -> Instance:
    code = f"org{uuid.uuid4().hex[:6]}"
    instance = Instance(
        server_id=server.server_id,
        org_code=code,
        org_name=f"Org {code}",
        org_uuid=str(uuid.uuid4()),
        app_port=8080,
        db_port=5432,
        redis_port=6379,
        deploy_path=f"/tmp/{code}",
        status=InstanceStatus.provisioned,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _create_pending_deployment(svc: DeployService, instance: Instance) -> str:
    deployment_id = svc.create_deployment(instance.instance_id, admin_password="Secret123!", deployment_type="full")
    svc.db.commit()
    return deployment_id


def _success_step(svc: DeployService, step: str) -> Callable[[Instance, str, object, object, object, object], bool]:
    def _side_effect(instance: Instance, deployment_id: str, *args, **kwargs) -> bool:
        svc._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.success, f"{step} ok")
        return True

    return _side_effect


def _step_statuses(db_session, instance_id, deployment_id: str) -> dict[str, DeployStepStatus]:
    logs = (
        db_session.query(DeploymentLog)
        .filter(DeploymentLog.instance_id == instance_id, DeploymentLog.deployment_id == deployment_id)
        .all()
    )
    return {log.step: log.status for log in logs}


class TestRunDeployment:
    def test_successful_full_deploy_sets_instance_running_and_records_success(self, db_session):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server)
        svc = DeployService(db_session)
        deployment_id = _create_pending_deployment(svc, instance)
        fake_ssh = MagicMock(name="ssh")

        with patch("app.services.deploy_service.get_ssh_for_server", return_value=fake_ssh) as mock_get_ssh:
            with patch("app.services.deploy_service.SSHService") as mock_ssh_service:
                with patch.object(svc, "_dispatch_webhook") as mock_dispatch:
                    with patch.object(svc, "_step_backup", side_effect=_success_step(svc, "backup")) as step_backup:
                        with patch.object(
                            svc, "_step_generate", side_effect=_success_step(svc, "generate")
                        ) as step_generate:
                            with patch.object(
                                svc, "_step_transfer", side_effect=_success_step(svc, "transfer")
                            ) as step_transfer:
                                with patch.object(
                                    svc, "_step_pull_image", side_effect=_success_step(svc, "pull_image")
                                ) as step_pull_image:
                                    with patch.object(
                                        svc, "_step_start_infra", side_effect=_success_step(svc, "start_infra")
                                    ) as step_start_infra:
                                        with patch.object(
                                            svc, "_step_start_app", side_effect=_success_step(svc, "start_app")
                                        ) as step_start_app:
                                            with patch.object(
                                                svc, "_step_migrate", side_effect=_success_step(svc, "migrate")
                                            ) as step_migrate:
                                                with patch.object(
                                                    svc, "_step_bootstrap", side_effect=_success_step(svc, "bootstrap")
                                                ) as step_bootstrap:
                                                    with patch.object(
                                                        svc, "_step_caddy", side_effect=_success_step(svc, "caddy")
                                                    ) as step_caddy:
                                                        with patch.object(
                                                            svc,
                                                            "_step_verify",
                                                            side_effect=_success_step(svc, "verify"),
                                                        ) as step_verify:
                                                            result = svc.run_deployment(
                                                                instance_id=instance.instance_id,
                                                                deployment_id=deployment_id,
                                                                admin_password="Secret123!",
                                                                deployment_type="full",
                                                            )

        db_session.refresh(instance)
        statuses = _step_statuses(db_session, instance.instance_id, deployment_id)

        assert result["success"] is True
        assert result["results"] == {step: True for step in DEPLOY_STEPS}
        assert instance.status == InstanceStatus.running
        assert statuses == {step: DeployStepStatus.success for step in DEPLOY_STEPS}

        mock_get_ssh.assert_called_once_with(server)
        mock_ssh_service.assert_not_called()
        assert step_backup.call_count == 1
        assert step_generate.call_count == 1
        assert step_transfer.call_count == 1
        assert step_pull_image.call_count == 1
        assert step_start_infra.call_count == 1
        assert step_start_app.call_count == 1
        assert step_migrate.call_count == 1
        assert step_bootstrap.call_count == 1
        assert step_caddy.call_count == 1
        assert step_verify.call_count == 1
        mock_dispatch.assert_any_call("deploy_started", instance, deployment_id)
        mock_dispatch.assert_any_call("deploy_success", instance, deployment_id)

    def test_mid_pipeline_deploy_error_triggers_rollback_and_marks_failed(self, db_session):
        server = _make_server(db_session)
        instance = _make_instance(db_session, server)
        svc = DeployService(db_session)
        deployment_id = _create_pending_deployment(svc, instance)
        fake_ssh = MagicMock(name="ssh")

        with patch("app.services.deploy_service.get_ssh_for_server", return_value=fake_ssh):
            with patch.object(svc, "_dispatch_webhook") as mock_dispatch:
                with patch.object(svc, "_rollback_containers") as mock_rollback:
                    with patch.object(svc, "_step_backup", side_effect=_success_step(svc, "backup")):
                        with patch.object(svc, "_step_generate", side_effect=_success_step(svc, "generate")):
                            with patch.object(svc, "_step_transfer", side_effect=_success_step(svc, "transfer")):
                                with patch.object(
                                    svc, "_step_pull_image", side_effect=_success_step(svc, "pull_image")
                                ):
                                    with patch.object(
                                        svc, "_step_start_infra", side_effect=_success_step(svc, "start_infra")
                                    ):
                                        with patch.object(
                                            svc, "_step_start_app", side_effect=DeployError("start_app", "boom")
                                        ):
                                            result = svc.run_deployment(
                                                instance_id=instance.instance_id,
                                                deployment_id=deployment_id,
                                                admin_password="Secret123!",
                                                deployment_type="full",
                                            )

        db_session.refresh(instance)
        statuses = _step_statuses(db_session, instance.instance_id, deployment_id)

        assert result["success"] is False
        assert result["step"] == "start_app"
        assert result["error"] == "Deploy failed at start_app: boom"
        assert instance.status == InstanceStatus.error
        assert statuses["backup"] == DeployStepStatus.success
        assert statuses["generate"] == DeployStepStatus.success
        assert statuses["transfer"] == DeployStepStatus.success
        assert statuses["pull_image"] == DeployStepStatus.success
        assert statuses["start_infra"] == DeployStepStatus.success
        assert statuses["start_app"] == DeployStepStatus.skipped
        assert statuses["migrate"] == DeployStepStatus.skipped
        assert statuses["bootstrap"] == DeployStepStatus.skipped
        assert statuses["caddy"] == DeployStepStatus.skipped
        assert statuses["verify"] == DeployStepStatus.skipped

        mock_rollback.assert_called_once_with(instance, fake_ssh, "start_app")
        mock_dispatch.assert_any_call("deploy_started", instance, deployment_id)
        assert any(
            call.args[:3] == ("deploy_failed", instance, deployment_id) and call.kwargs.get("error") == result["error"]
            for call in mock_dispatch.call_args_list
        )

    def test_instance_not_found_returns_early_without_ssh_calls(self, db_session):
        svc = DeployService(db_session)
        missing_instance_id = uuid.uuid4()

        with patch("app.services.deploy_service.get_ssh_for_server") as mock_get_ssh:
            with patch("app.services.deploy_service.SSHService") as mock_ssh_service:
                with patch.object(svc, "_step_backup") as mock_step_backup:
                    result = svc.run_deployment(
                        instance_id=missing_instance_id,
                        deployment_id="dep-missing",
                        admin_password="Secret123!",
                        deployment_type="full",
                    )

        assert result == {"success": False, "error": "Instance not found"}
        mock_get_ssh.assert_not_called()
        mock_ssh_service.assert_not_called()
        mock_step_backup.assert_not_called()
