"""Tests for SSHService -- exec, retry, circuit breaker."""

import time
from unittest.mock import MagicMock, patch

import pytest

from app.services.ssh_service import (
    _CIRCUIT_FAILURE_THRESHOLD,
    _CIRCUIT_LOCK,
    _CIRCUIT_STATE,
    SSHResult,
    SSHService,
    _circuit_check,
    _circuit_record_failure,
    _circuit_record_success,
)


@pytest.fixture(autouse=True)
def clear_circuit_state():
    """Reset circuit breaker state between tests."""
    with _CIRCUIT_LOCK:
        _CIRCUIT_STATE.clear()
    yield
    with _CIRCUIT_LOCK:
        _CIRCUIT_STATE.clear()


class TestSSHResult:
    def test_ok_on_zero_exit(self):
        r = SSHResult(0, "output", "")
        assert r.ok is True
        assert r.exit_code == 0

    def test_not_ok_on_nonzero(self):
        r = SSHResult(1, "", "error")
        assert r.ok is False

    def test_repr(self):
        r = SSHResult(0, "", "")
        assert "exit_code=0" in repr(r)
        assert "ok=True" in repr(r)


class TestLocalExec:
    def test_exec_local_success(self):
        svc = SSHService(hostname="localhost", is_local=True)
        with patch("subprocess.run") as mock_run:
            mock_run.return_value = MagicMock(returncode=0, stdout="hello", stderr="")
            result = svc.exec_command("echo hello", timeout=5)
        assert result.ok is True
        assert result.stdout == "hello"

    def test_exec_local_failure(self):
        svc = SSHService(hostname="localhost", is_local=True)
        with patch("subprocess.run") as mock_run:
            mock_run.return_value = MagicMock(returncode=1, stdout="", stderr="fail")
            result = svc.exec_command("false", timeout=5)
        assert result.ok is False
        assert result.stderr == "fail"

    def test_exec_local_timeout(self):
        import subprocess

        svc = SSHService(hostname="localhost", is_local=True)
        with patch("subprocess.run", side_effect=subprocess.TimeoutExpired("cmd", 5)):
            result = svc.exec_command("sleep 100", timeout=5)
        assert result.ok is False
        assert "timed out" in result.stderr

    def test_exec_local_with_cwd(self):
        svc = SSHService(hostname="localhost", is_local=True)
        with patch("subprocess.run") as mock_run:
            mock_run.return_value = MagicMock(returncode=0, stdout="ok", stderr="")
            svc.exec_command("ls", timeout=5, cwd="/tmp")
            mock_run.assert_called_once()
            assert mock_run.call_args.kwargs["cwd"] == "/tmp"


class TestCircuitBreaker:
    def test_circuit_starts_closed(self):
        _circuit_check("server1")  # Should not raise

    def test_circuit_opens_after_threshold(self):
        for _ in range(_CIRCUIT_FAILURE_THRESHOLD):
            _circuit_record_failure("server2")
        with pytest.raises(ConnectionError, match="Circuit breaker open"):
            _circuit_check("server2")

    def test_circuit_resets_on_success(self):
        for _ in range(_CIRCUIT_FAILURE_THRESHOLD):
            _circuit_record_failure("server3")
        _circuit_record_success("server3")
        _circuit_check("server3")  # Should not raise after success

    def test_circuit_half_open_after_timeout(self):
        for _ in range(_CIRCUIT_FAILURE_THRESHOLD):
            _circuit_record_failure("server4")
        # Simulate time passing past the reset timeout
        with _CIRCUIT_LOCK:
            _CIRCUIT_STATE["server4"]["open_until"] = time.time() - 1
        # Half-open: should not raise (allows one attempt)
        _circuit_check("server4")

    def test_circuit_ignores_none_server_id(self):
        _circuit_record_failure(None)  # Should not crash
        _circuit_check(None)  # Should not raise
        _circuit_record_success(None)


class TestSSHRetry:
    def test_retries_on_connection_failure(self):
        svc = SSHService(hostname="remote.test", is_local=False, server_id="retry-test")
        mock_client = MagicMock()
        # Fail twice, succeed third time
        mock_client.connect.side_effect = [
            ConnectionError("fail1"),
            ConnectionError("fail2"),
            None,
        ]
        mock_transport = MagicMock()
        mock_transport.is_active.return_value = True
        mock_client.get_transport.return_value = mock_transport

        with patch("app.services.ssh_service.paramiko.SSHClient", return_value=mock_client):
            with patch("app.services.ssh_service.time.sleep"):  # Skip actual sleep
                client = svc._get_client()
        assert mock_client.connect.call_count == 3

    def test_raises_after_all_retries_fail(self):
        svc = SSHService(hostname="remote.test", is_local=False, server_id="fail-all")
        mock_client = MagicMock()
        mock_client.connect.side_effect = ConnectionError("always fail")

        with patch("app.services.ssh_service.paramiko.SSHClient", return_value=mock_client):
            with patch("app.services.ssh_service.time.sleep"):
                with pytest.raises(ConnectionError, match="always fail"):
                    svc._get_client()
        assert mock_client.connect.call_count == 3
