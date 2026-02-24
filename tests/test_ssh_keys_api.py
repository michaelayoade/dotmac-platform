"""API tests for SSH keys (direct function calls)."""

import uuid
from uuid import UUID

import pytest

from app.api.ssh_keys import (
    delete_key,
    generate_key,
    get_public_key,
    import_key,
    list_keys,
)
from app.models.server import Server
from app.models.ssh_key import SSHKey
from app.services.ssh_key_service import SSHKeyService
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


@pytest.fixture(autouse=True)
def _clean_ssh_keys(db_session):
    db_session.query(SSHKey).delete()
    db_session.commit()
    yield


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


def test_generate_and_list_keys(db_session):
    data = generate_key(
        label="test",
        key_type="rsa",
        bit_size=2048,
        db=db_session,
        auth={"person_id": "tester"},
    )
    assert data["label"] == "test"

    keys = list_keys(active_only=True, db=db_session, auth={"person_id": "tester"})
    assert len(keys) == 1


def test_import_and_get_public(db_session):
    import io

    import paramiko

    rsa = paramiko.RSAKey.generate(2048)
    buf = io.StringIO()
    rsa.write_private_key(buf)
    private_pem = buf.getvalue()

    imported = import_key(
        label="imported",
        private_key_pem=private_pem,
        db=db_session,
        auth={"person_id": "tester"},
    )
    pub = get_public_key(UUID(imported["key_id"]), db=db_session, auth={"person_id": "tester"})
    assert pub["public_key"].startswith("ssh-")


def test_delete_key(db_session):
    svc = SSHKeyService(db_session)
    key = svc.generate_key("todelete", key_type="rsa", bit_size=2048)

    resp = delete_key(key.key_id, db=db_session, auth={"person_id": "tester"})
    assert resp["deleted"] == str(key.key_id)
