"""SSH Key Service — manage SSH keys and deployment to servers."""

from __future__ import annotations

import io
import logging
import shlex
from uuid import UUID

import paramiko
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.server import Server
from app.models.ssh_key import SSHKey, SSHKeyType
from app.services.settings_crypto import decrypt_value, encrypt_value
from app.services.ssh_service import SSHService, get_ssh_for_server

logger = logging.getLogger(__name__)


class SSHKeyService:
    def __init__(self, db: Session):
        self.db = db

    def generate_key(
        self,
        label: str,
        key_type: str = "ed25519",
        bit_size: int | None = None,
        created_by: str | None = None,
    ) -> SSHKey:
        key_type_enum = SSHKeyType(key_type)
        key, private_pem = _generate_key(key_type_enum, bit_size)
        public_key = _public_key_line(key)
        fingerprint = _fingerprint(key)

        ssh_key = SSHKey(
            label=label,
            public_key=public_key,
            private_key_encrypted=encrypt_value(private_pem),
            fingerprint=fingerprint,
            key_type=key_type_enum,
            bit_size=bit_size,
            created_by=created_by,
            is_active=True,
        )
        self.db.add(ssh_key)
        self.db.flush()
        return ssh_key

    def import_key(self, label: str, private_key_pem: str, created_by: str | None = None) -> SSHKey:
        key = _load_private_key(private_key_pem)
        public_key = _public_key_line(key)
        fingerprint = _fingerprint(key)
        existing = self.db.scalar(select(SSHKey).where(SSHKey.fingerprint == fingerprint))
        if existing:
            raise ValueError("SSH key already exists")
        key_type = _normalize_key_type(key.get_name())
        bit_size = getattr(key, "get_bits", lambda: None)()  # type: ignore[misc]

        ssh_key = SSHKey(
            label=label,
            public_key=public_key,
            private_key_encrypted=encrypt_value(private_key_pem),
            fingerprint=fingerprint,
            key_type=key_type,
            bit_size=bit_size,
            created_by=created_by,
            is_active=True,
        )
        self.db.add(ssh_key)
        self.db.flush()
        return ssh_key

    def get_public_key(self, key_id: UUID) -> str:
        key = self._get_key(key_id)
        return key.public_key

    def get_private_key_pem(self, key_id: UUID) -> str:
        key = self._get_key(key_id)
        return decrypt_value(key.private_key_encrypted)

    def deploy_to_server(self, key_id: UUID, server_id: UUID) -> None:
        key = self._get_key(key_id)
        server = self._get_server(server_id)

        ssh = get_ssh_for_server(server)
        self._ensure_authorized_key(ssh, key.public_key)

        server.ssh_key_id = key.key_id
        self.db.flush()

    def rotate_key(self, server_id: UUID, new_key_id: UUID) -> None:
        server = self._get_server(server_id)
        old_key_id = server.ssh_key_id

        new_key = self._get_key(new_key_id)
        ssh = get_ssh_for_server(server)
        self._ensure_authorized_key(ssh, new_key.public_key)

        if not server.is_local:
            self._verify_key(server, new_key)

        if old_key_id and old_key_id != new_key_id:
            old_key = self._get_key(old_key_id)
            self._remove_authorized_key(ssh, old_key.public_key)

        server.ssh_key_id = new_key.key_id
        self.db.flush()

    def list_keys(self, active_only: bool = True) -> list[SSHKey]:
        stmt = select(SSHKey)
        if active_only:
            stmt = stmt.where(SSHKey.is_active.is_(True))
        stmt = stmt.order_by(SSHKey.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def delete_key(self, key_id: UUID) -> None:
        key = self._get_key(key_id)
        in_use = self.db.scalar(select(Server).where(Server.ssh_key_id == key.key_id))
        if in_use:
            raise ValueError("SSH key is assigned to a server")
        key.is_active = False
        self.db.flush()

    def _get_key(self, key_id: UUID) -> SSHKey:
        key = self.db.get(SSHKey, key_id)
        if not key:
            raise ValueError("SSH key not found")
        return key

    def _get_server(self, server_id: UUID) -> Server:
        server = self.db.get(Server, server_id)
        if not server:
            raise ValueError("Server not found")
        return server

    def _ensure_authorized_key(self, ssh: SSHService, public_key: str) -> None:
        key_q = shlex.quote(public_key)
        cmd = (
            "mkdir -p ~/.ssh && chmod 700 ~/.ssh && touch ~/.ssh/authorized_keys && "
            "chmod 600 ~/.ssh/authorized_keys && "
            f"(grep -qxF {key_q} ~/.ssh/authorized_keys || echo {key_q} >> ~/.ssh/authorized_keys)"
        )
        result = ssh.exec_command(cmd, timeout=30)
        if not result.ok:
            detail = (result.stderr or result.stdout or "Failed to deploy SSH key")[:2000]
            raise ValueError(detail)

    def _remove_authorized_key(self, ssh: SSHService, public_key: str) -> None:
        key_q = shlex.quote(public_key)
        cmd = "bash -lc " + shlex.quote(
            f"grep -vF {key_q} ~/.ssh/authorized_keys > ~/.ssh/authorized_keys.tmp && "
            "mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys"
        )
        result = ssh.exec_command(cmd, timeout=30)
        if not result.ok:
            logger.warning("Failed to remove old SSH key: %s", result.stderr or result.stdout)

    def _verify_key(self, server: Server, key: SSHKey) -> None:
        private_pem = decrypt_value(key.private_key_encrypted)
        verifier = SSHService(
            hostname=server.hostname,
            port=server.ssh_port,
            username=server.ssh_user,
            pkey_data=private_pem,
            is_local=server.is_local,
            server_id=None,
        )
        result = verifier.exec_command("hostname", timeout=10)
        if not result.ok:
            raise ValueError("Failed to verify new SSH key")


def _generate_key(key_type: SSHKeyType, bit_size: int | None) -> tuple[paramiko.PKey, str]:
    if key_type == SSHKeyType.ed25519:
        try:
            from cryptography.hazmat.primitives import serialization
            from cryptography.hazmat.primitives.asymmetric import ed25519

            raw_key = ed25519.Ed25519PrivateKey.generate()
            pem = raw_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.OpenSSH,
                encryption_algorithm=serialization.NoEncryption(),
            ).decode("utf-8")
            return paramiko.Ed25519Key.from_private_key(io.StringIO(pem)), pem
        except Exception as exc:
            raise ValueError("Ed25519 key generation failed") from exc
    bits = bit_size or 4096
    key = paramiko.RSAKey.generate(bits)
    return key, _private_key_pem(key)


def _private_key_pem(key: paramiko.PKey) -> str:
    buf = io.StringIO()
    key.write_private_key(buf)
    return buf.getvalue()


def _public_key_line(key: paramiko.PKey) -> str:
    return f"{key.get_name()} {key.get_base64()}"


def _fingerprint(key: paramiko.PKey) -> str:
    raw = key.get_fingerprint()
    return "MD5:" + ":".join(f"{b:02x}" for b in raw)


def _load_private_key(private_key_pem: str) -> paramiko.PKey:
    for key_cls in (paramiko.Ed25519Key, paramiko.RSAKey, paramiko.ECDSAKey):
        try:
            return key_cls.from_private_key(io.StringIO(private_key_pem))
        except Exception:
            continue
    raise ValueError("Unsupported or invalid private key")


def _normalize_key_type(name: str) -> SSHKeyType:
    if name in {"ssh-ed25519", "ed25519"}:
        return SSHKeyType.ed25519
    if name in {"ssh-rsa", "rsa"}:
        return SSHKeyType.rsa
    raise ValueError(f"Unsupported key type: {name}")
