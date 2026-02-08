"""Tests for CaddyService — Caddyfile generation and domain validation."""

from __future__ import annotations

import pytest

from app.services.caddy_service import CaddyService, _validate_domain


class TestValidateDomain:
    """Test _validate_domain() accepts valid domains and rejects invalid ones."""

    def test_valid_simple_domain(self) -> None:
        assert _validate_domain("example.com") == "example.com"

    def test_valid_subdomain(self) -> None:
        assert _validate_domain("app.example.com") == "app.example.com"

    def test_valid_deep_subdomain(self) -> None:
        assert _validate_domain("a.b.c.example.com") == "a.b.c.example.com"

    def test_valid_hyphenated(self) -> None:
        assert _validate_domain("my-app.example.com") == "my-app.example.com"

    def test_valid_numeric(self) -> None:
        assert _validate_domain("123.example.com") == "123.example.com"

    def test_empty_string(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("")

    def test_too_long(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("a" * 254)

    def test_injection_semicolon(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("example.com; rm -rf /")

    def test_injection_newline(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("example.com\nimport malicious")

    def test_injection_curly_braces(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("example.com { respond 200 }")

    def test_injection_spaces(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("example.com malicious.com")

    def test_leading_dot(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain(".example.com")

    def test_trailing_dot(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("example.com.")

    def test_leading_hyphen(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("-example.com")

    def test_underscore_rejected(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            _validate_domain("my_app.example.com")


class TestGenerateCaddyfile:
    """Test CaddyService.generate_caddyfile() output."""

    def setup_method(self) -> None:
        self.svc = CaddyService()

    def test_contains_domain(self) -> None:
        result = self.svc.generate_caddyfile("app.example.com", 8001)
        assert "app.example.com {" in result

    def test_contains_reverse_proxy(self) -> None:
        result = self.svc.generate_caddyfile("app.example.com", 8001)
        assert "reverse_proxy localhost:8001" in result

    def test_contains_gzip(self) -> None:
        result = self.svc.generate_caddyfile("app.example.com", 8001)
        assert "encode gzip" in result

    def test_contains_security_headers(self) -> None:
        result = self.svc.generate_caddyfile("app.example.com", 8001)
        assert 'X-Content-Type-Options "nosniff"' in result
        assert 'X-Frame-Options "DENY"' in result
        assert "Strict-Transport-Security" in result

    def test_contains_static_caching(self) -> None:
        result = self.svc.generate_caddyfile("app.example.com", 8001)
        assert "@static path /static/*" in result
        assert "Cache-Control" in result

    def test_different_port(self) -> None:
        result = self.svc.generate_caddyfile("tenant.example.com", 9500)
        assert "reverse_proxy localhost:9500" in result

    def test_output_is_valid_structure(self) -> None:
        """Caddyfile should open and close braces correctly."""
        result = self.svc.generate_caddyfile("test.example.com", 8001)
        # Top-level block opens with domain { and closes with }
        lines = result.strip().splitlines()
        assert lines[0].strip().startswith("test.example.com {")
        assert lines[-1].strip() == "}"


class TestConfigureInstance:
    """Test CaddyService.configure_instance() with mocked SSH."""

    def setup_method(self) -> None:
        self.svc = CaddyService()

    def test_skips_when_no_domain(self) -> None:
        """Should silently return when instance has no domain."""

        class FakeInstance:
            domain: str | None = None
            app_port: int = 8001

        # Should not raise
        self.svc.configure_instance(FakeInstance(), object())

    def test_writes_and_reloads_on_success(self) -> None:
        """Should write config, validate, move, and reload."""

        class FakeInstance:
            domain = "test.example.com"
            app_port = 8001

        class FakeResult:
            ok = True
            stderr = ""

        commands: list[str] = []
        written_files: list[tuple[str, str]] = []

        class FakeSSH:
            def sftp_put_string(self, content: str, path: str) -> None:
                written_files.append((path, content))

            def exec_command(self, cmd: str, **kwargs: object) -> FakeResult:
                commands.append(cmd)
                return FakeResult()

        self.svc.configure_instance(FakeInstance(), FakeSSH())

        assert len(written_files) == 1
        assert written_files[0][0] == "/etc/caddy/sites-enabled/test.example.com.tmp"
        assert "test.example.com {" in written_files[0][1]

        assert any("caddy validate" in c for c in commands)
        assert any("systemctl reload caddy" in c for c in commands)

    def test_removes_tmp_on_validation_failure(self) -> None:
        """Should remove tmp file and raise when caddy validate fails."""

        class FakeInstance:
            domain = "test.example.com"
            app_port = 8001

        class FailResult:
            ok = False
            stderr = "config error"

        commands: list[str] = []

        class FakeSSH:
            def sftp_put_string(self, content: str, path: str) -> None:
                pass

            def exec_command(self, cmd: str, **kwargs: object) -> FailResult:
                commands.append(cmd)
                return FailResult()

        with pytest.raises(RuntimeError, match="caddy validate failed"):
            self.svc.configure_instance(FakeInstance(), FakeSSH())

        assert any("rm -f" in c for c in commands)

    def test_rejects_invalid_domain(self) -> None:
        """Should raise ValueError for injection attempts."""

        class FakeInstance:
            domain = "evil; rm -rf /"
            app_port = 8001

        with pytest.raises(ValueError, match="Invalid domain"):
            self.svc.configure_instance(FakeInstance(), object())


class TestRemoveInstanceConfig:
    """Test CaddyService.remove_instance_config()."""

    def setup_method(self) -> None:
        self.svc = CaddyService()

    def test_removes_and_reloads(self) -> None:
        commands: list[str] = []

        class FakeResult:
            ok = True
            stderr = ""

        class FakeSSH:
            def exec_command(self, cmd: str, **kwargs: object) -> FakeResult:
                commands.append(cmd)
                return FakeResult()

        self.svc.remove_instance_config("test.example.com", FakeSSH())

        assert any("rm -f" in c and "test.example.com" in c for c in commands)
        assert any("systemctl reload caddy" in c for c in commands)

    def test_rejects_invalid_domain(self) -> None:
        with pytest.raises(ValueError, match="Invalid domain"):
            self.svc.remove_instance_config("bad domain!", object())
