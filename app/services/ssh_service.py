"""
SSH Service — Paramiko wrapper for remote server management.

Provides connection pooling, command execution, SFTP operations,
and circuit breaker for unreachable servers.
"""

from __future__ import annotations

import logging
import os
import shlex
import threading
import time

import paramiko

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Circuit breaker: track per-server failure counts
# ---------------------------------------------------------------------------
_CIRCUIT_STATE: dict[str, dict] = {}  # server_id -> {"failures": int, "open_until": float}
_CIRCUIT_LOCK = threading.Lock()
_CIRCUIT_FAILURE_THRESHOLD = 3
_CIRCUIT_RESET_TIMEOUT = 60  # seconds


def _circuit_check(server_id: str | None) -> None:
    """Raise if circuit is open for this server."""
    if not server_id:
        return
    with _CIRCUIT_LOCK:
        state = _CIRCUIT_STATE.get(server_id)
        if state and state["failures"] >= _CIRCUIT_FAILURE_THRESHOLD:
            if time.time() < state["open_until"]:
                raise ConnectionError(
                    f"Circuit breaker open for server {server_id}: {state['failures']} consecutive failures"
                )
            # Half-open: allow one attempt
            state["failures"] = _CIRCUIT_FAILURE_THRESHOLD - 1


def _circuit_record_success(server_id: str | None) -> None:
    if not server_id:
        return
    with _CIRCUIT_LOCK:
        _CIRCUIT_STATE.pop(server_id, None)


def _circuit_record_failure(server_id: str | None) -> None:
    if not server_id:
        return
    with _CIRCUIT_LOCK:
        state = _CIRCUIT_STATE.setdefault(server_id, {"failures": 0, "open_until": 0})
        state["failures"] += 1
        if state["failures"] >= _CIRCUIT_FAILURE_THRESHOLD:
            state["open_until"] = time.time() + _CIRCUIT_RESET_TIMEOUT
            logger.warning(
                "Circuit breaker opened for server %s after %d failures",
                server_id,
                state["failures"],
            )


# Connection cache: server_id -> {"client": SSHClient, "ts": float, "lock": Lock}
_SSH_POOL: dict[str, dict] = {}
_SSH_POOL_LOCK = threading.Lock()
_POOL_TTL = 300  # 5 minutes
_POOL_MAX = 100


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
        """Get or create an SSH client, with connection caching and circuit breaker."""
        _circuit_check(self.server_id)

        with _SSH_POOL_LOCK:
            if self.server_id and self.server_id in _SSH_POOL:
                entry = _SSH_POOL[self.server_id]
                client = entry["client"]
                ts = entry["ts"]
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

        # Retry connection up to 3 times with backoff
        last_err: Exception | None = None
        for attempt in range(3):
            try:
                client.connect(**connect_kwargs)
                _circuit_record_success(self.server_id)
                break
            except Exception as e:
                last_err = e
                if attempt < 2:
                    wait = (attempt + 1) * 2
                    logger.warning(
                        "SSH connect attempt %d/3 to %s failed: %s (retry in %ds)",
                        attempt + 1,
                        self.hostname,
                        e,
                        wait,
                    )
                    time.sleep(wait)
        else:
            _circuit_record_failure(self.server_id)
            raise last_err  # type: ignore[misc]

        with _SSH_POOL_LOCK:
            if self.server_id:
                _SSH_POOL[self.server_id] = {
                    "client": client,
                    "ts": time.time(),
                    "lock": threading.Lock(),
                }
                # Evict oldest entries if pool exceeds max size.
                while len(_SSH_POOL) > _POOL_MAX:
                    oldest_id = min(_SSH_POOL.items(), key=lambda item: item[1]["ts"])[0]
                    entry = _SSH_POOL.pop(oldest_id, None)
                    if entry:
                        try:
                            entry["client"].close()
                        except Exception:
                            pass

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
        lock = None
        if self.server_id:
            with _SSH_POOL_LOCK:
                entry = _SSH_POOL.get(self.server_id)
                lock = entry.get("lock") if entry else None

        def _run() -> SSHResult:
            _, stdout_ch, stderr_ch = client.exec_command(full_cmd, timeout=timeout)
            channel = stdout_ch.channel
            stdout_chunks: list[bytes] = []
            stderr_chunks: list[bytes] = []
            start = time.time()
            while True:
                if channel.recv_ready():
                    stdout_chunks.append(channel.recv(4096))
                if channel.recv_stderr_ready():
                    stderr_chunks.append(channel.recv_stderr(4096))
                if channel.exit_status_ready():
                    # drain remaining output
                    while channel.recv_ready():
                        stdout_chunks.append(channel.recv(4096))
                    while channel.recv_stderr_ready():
                        stderr_chunks.append(channel.recv_stderr(4096))
                    break
                if time.time() - start > timeout:
                    channel.close()
                    return SSHResult(1, "", f"Command timed out after {timeout}s")
                time.sleep(0.05)
            stdout = b"".join(stdout_chunks).decode("utf-8", errors="replace")
            stderr = b"".join(stderr_chunks).decode("utf-8", errors="replace")
            exit_code = channel.recv_exit_status()
            return SSHResult(exit_code, stdout, stderr)

        if lock:
            with lock:
                return _run()
        return _run()

    def _exec_local(self, command: str, timeout: int, cwd: str | None) -> SSHResult:
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
            sftp.get_channel().settimeout(30)
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
            sftp.get_channel().settimeout(30)
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
            sftp.get_channel().settimeout(30)
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
            sftp.get_channel().settimeout(30)
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
                entry = _SSH_POOL.pop(self.server_id)
                try:
                    entry["client"].close()
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
