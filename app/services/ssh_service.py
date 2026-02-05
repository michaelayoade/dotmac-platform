"""
SSH Service — Paramiko wrapper for remote server management.

Provides connection pooling, command execution, and SFTP operations.
"""
from __future__ import annotations

import logging
import os
import shlex
import stat
import threading
import time
from typing import Optional

import paramiko

logger = logging.getLogger(__name__)

# Connection cache: server_id -> (client, timestamp)
_SSH_POOL: dict[str, tuple[paramiko.SSHClient, float]] = {}
_SSH_POOL_LOCK = threading.Lock()
_POOL_TTL = 300  # 5 minutes


class SSHResult:
    """Result of an SSH command execution."""

    def __init__(self, exit_code: int, stdout: str, stderr: str):
        self.exit_code = exit_code
        self.stdout = stdout
        self.stderr = stderr
        self.ok = exit_code == 0

    def __repr__(self) -> str:
        return f"SSHResult(exit_code={self.exit_code}, ok={self.ok})"


class SSHService:
    """Paramiko wrapper for SSH operations."""

    def __init__(
        self,
        hostname: str,
        port: int = 22,
        username: str = "root",
        key_path: str = "/root/.ssh/id_rsa",
        is_local: bool = False,
        server_id: str | None = None,
    ):
        self.hostname = hostname
        self.port = port
        self.username = username
        self.key_path = key_path
        self.is_local = is_local
        self.server_id = server_id

    def _get_client(self) -> paramiko.SSHClient:
        """Get or create an SSH client, with connection caching."""
        with _SSH_POOL_LOCK:
            if self.server_id and self.server_id in _SSH_POOL:
                client, ts = _SSH_POOL[self.server_id]
                if time.time() - ts < _POOL_TTL:
                    transport = client.get_transport()
                    if transport and transport.is_active():
                        return client
                # Stale connection
                try:
                    client.close()
                except Exception:
                    pass
                del _SSH_POOL[self.server_id]

        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.WarningPolicy())

        connect_kwargs: dict = {
            "hostname": self.hostname,
            "port": self.port,
            "username": self.username,
            "timeout": 10,
        }

        # Try key-based auth
        if self.key_path and os.path.isfile(self.key_path):
            connect_kwargs["key_filename"] = self.key_path
        else:
            connect_kwargs["allow_agent"] = True
            connect_kwargs["look_for_keys"] = True

        client.connect(**connect_kwargs)

        with _SSH_POOL_LOCK:
            if self.server_id:
                _SSH_POOL[self.server_id] = (client, time.time())

        return client

    def exec_command(
        self,
        command: str,
        timeout: int = 120,
        cwd: str | None = None,
    ) -> SSHResult:
        """Execute a command on the remote server."""
        if self.is_local:
            return self._exec_local(command, timeout, cwd)

        full_cmd = command
        if cwd:
            full_cmd = f"cd {shlex.quote(cwd)} && {command}"

        logger.info("SSH exec [%s]: %s", self.hostname, full_cmd[:200])

        client = self._get_client()
        _, stdout_ch, stderr_ch = client.exec_command(full_cmd, timeout=timeout)

        stdout = stdout_ch.read().decode("utf-8", errors="replace")
        stderr = stderr_ch.read().decode("utf-8", errors="replace")
        exit_code = stdout_ch.channel.recv_exit_status()

        return SSHResult(exit_code, stdout, stderr)

    def _exec_local(
        self, command: str, timeout: int, cwd: str | None
    ) -> SSHResult:
        """Execute a command locally (for is_local servers)."""
        import subprocess

        logger.info("Local exec: %s", command[:200])

        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=cwd,
            )
            return SSHResult(result.returncode, result.stdout, result.stderr)
        except subprocess.TimeoutExpired:
            return SSHResult(1, "", f"Command timed out after {timeout}s")
        except Exception as e:
            return SSHResult(1, "", str(e))

    def sftp_put(
        self,
        local_path: str,
        remote_path: str,
    ) -> None:
        """Upload a file via SFTP."""
        if self.is_local:
            import shutil

            os.makedirs(os.path.dirname(remote_path), exist_ok=True)
            shutil.copy2(local_path, remote_path)
            return

        client = self._get_client()
        sftp = client.open_sftp()
        try:
            sftp.put(local_path, remote_path)
        finally:
            sftp.close()

    def sftp_put_string(
        self,
        content: str,
        remote_path: str,
        mode: int = 0o644,
    ) -> None:
        """Write string content to a remote file via SFTP."""
        if self.is_local:
            os.makedirs(os.path.dirname(remote_path), exist_ok=True)
            with open(remote_path, "w") as f:
                f.write(content)
            os.chmod(remote_path, mode)
            return

        client = self._get_client()
        sftp = client.open_sftp()
        try:
            with sftp.file(remote_path, "w") as f:
                f.write(content)
            sftp.chmod(remote_path, mode)
        finally:
            sftp.close()

    def sftp_read_string(self, remote_path: str) -> str | None:
        """Read a remote file as a string. Returns None if file doesn't exist."""
        if self.is_local:
            if os.path.isfile(remote_path):
                with open(remote_path) as f:
                    return f.read()
            return None

        client = self._get_client()
        sftp = client.open_sftp()
        try:
            with sftp.file(remote_path, "r") as f:
                return f.read().decode("utf-8", errors="replace")
        except FileNotFoundError:
            return None
        finally:
            sftp.close()

    def sftp_mkdir_p(self, remote_path: str) -> None:
        """Create remote directory recursively (like mkdir -p)."""
        if self.is_local:
            os.makedirs(remote_path, exist_ok=True)
            return

        client = self._get_client()
        sftp = client.open_sftp()
        try:
            parts = remote_path.split("/")
            current = ""
            for part in parts:
                if not part:
                    current = "/"
                    continue
                current = f"{current}/{part}" if current != "/" else f"/{part}"
                try:
                    sftp.stat(current)
                except FileNotFoundError:
                    sftp.mkdir(current)
        finally:
            sftp.close()

    def test_connection(self) -> SSHResult:
        """Test SSH connectivity by running hostname."""
        return self.exec_command("hostname && uname -a", timeout=10)

    def close(self) -> None:
        """Close the SSH connection."""
        with _SSH_POOL_LOCK:
            if self.server_id and self.server_id in _SSH_POOL:
                client, _ = _SSH_POOL.pop(self.server_id)
                try:
                    client.close()
                except Exception:
                    pass


def get_ssh_for_server(server) -> SSHService:
    """Create an SSHService from a Server model instance."""
    return SSHService(
        hostname=server.hostname,
        port=server.ssh_port,
        username=server.ssh_user,
        key_path=server.ssh_key_path,
        is_local=server.is_local,
        server_id=str(server.server_id),
    )
