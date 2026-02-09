"""Tests for SSHKeyService."""

import uuid
from unittest.mock import MagicMock, patch

from app.models.server import Server
from app.services.ssh_key_service import SSHKeyService
from app.services.ssh_service import SSHResult
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


def test_generate_key(db_session):
    svc = SSHKeyService(db_session)
    key = svc.generate_key("test-key")
    assert key.label == "test-key"
    assert key.public_key
    assert key.private_key_encrypted
    assert key.fingerprint


def test_import_key(db_session):
    svc = SSHKeyService(db_session)
    import io

    import paramiko

    rsa = paramiko.RSAKey.generate(2048)
    buf = io.StringIO()
    rsa.write_private_key(buf)
    private_pem = buf.getvalue()

    imported = svc.import_key("imported", private_pem)
    assert imported.label == "imported"
    assert imported.public_key
    assert imported.fingerprint


def test_deploy_to_server_sets_ssh_key_id(db_session):
    server = _make_server(db_session)
    svc = SSHKeyService(db_session)
    key = svc.generate_key("deploy")

    fake_ssh = MagicMock()
    fake_ssh.exec_command.return_value = SSHResult(0, "ok", "")

    with patch("app.services.ssh_key_service.get_ssh_for_server", return_value=fake_ssh):
        svc.deploy_to_server(key.key_id, server.server_id)

    assert server.ssh_key_id == key.key_id
