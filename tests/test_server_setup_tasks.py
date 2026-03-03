from __future__ import annotations

import subprocess
import uuid

import pytest

from app.models.server import Server
from app.tasks.server_setup import initialize_server


def _make_server(db_session) -> Server:
    server = Server(
        name=f"init-server-{uuid.uuid4().hex[:6]}",
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


@pytest.fixture(autouse=True)
def _stub_celery_update_state(monkeypatch):
    """Celery .run() has no worker context so self.request.id is None.

    Stub update_state to prevent ValueError('task_id must not be empty').
    """
    monkeypatch.setattr(initialize_server, "update_state", lambda *_args, **_kwargs: None)


def test_initialize_server_success(db_session, monkeypatch):
    from app.services.ssh_service import SSHResult

    server = _make_server(db_session)

    class FakeSSH:
        def exec_command(self, command: str, timeout: int = 12) -> SSHResult:
            return SSHResult(0, "DOTMAC_SSH_OK\n", "")

    monkeypatch.setattr("app.tasks.server_setup._resolve_bootstrap_ssh", lambda _server: (FakeSSH(), "test-auth"))
    monkeypatch.setattr(
        "app.tasks.server_setup._run_dependency_bootstrap",
        lambda _name: subprocess.CompletedProcess(args=["bootstrap"], returncode=0, stdout="ok", stderr=""),
    )
    monkeypatch.setattr(
        "app.tasks.server_setup.ServerService.test_connectivity",
        lambda _svc, _server_id: {"success": True, "message": "ok"},
    )

    result = initialize_server.run(str(server.server_id), "tester")
    db_session.refresh(server)

    assert result["success"] is True
    assert server.ssh_key_id is not None


def test_initialize_server_fails_when_no_bootstrap_access(db_session, monkeypatch):
    server = _make_server(db_session)

    monkeypatch.setattr("app.tasks.server_setup._resolve_bootstrap_ssh", lambda _server: (None, "auth failed"))

    result = initialize_server.run(str(server.server_id), "tester")

    assert result["success"] is False
    assert "Unable to reach server" in result["message"]
