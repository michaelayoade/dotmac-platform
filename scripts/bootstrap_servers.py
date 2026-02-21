"""
Bootstrap remote servers for DotMac-managed deployments.

This script prepares servers to run instance deployments by installing OS-level
dependencies (Docker, docker compose plugin, Caddy) and creating required
directories (e.g. /opt/dotmac/instances).

Safety:
  - Defaults to dry-run: prints what it would do and performs only read-only checks.
  - Requires passwordless sudo ("sudo -n") for any mutating actions.
  - Currently supports Debian/Ubuntu via apt. Other distros will be skipped.

Typical usage (from this repo root):
  - Dry run:
      poetry run python scripts/bootstrap_servers.py --all
  - Execute:
      poetry run python scripts/bootstrap_servers.py --all --execute

If running inside Docker:
  docker compose exec -T app python scripts/bootstrap_servers.py --all --execute
"""

from __future__ import annotations

import sys
from pathlib import Path

# Allow running the script from any working directory (e.g. `python /app/scripts/...`)
# by ensuring the repo root (which contains the `app/` package) is on sys.path.
_REPO_ROOT = str(Path(__file__).resolve().parents[1])
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

import argparse
import shlex
from collections.abc import Iterable
from dataclasses import dataclass

from app.db import SessionLocal
from app.models.server import Server, ServerStatus
from app.services.ssh_service import SSHResult, get_ssh_for_server


@dataclass(frozen=True)
class Step:
    name: str
    command: str
    needs_sudo: bool = False
    timeout: int = 300


def _q(cmd: str) -> str:
    return shlex.quote(cmd)


def _bash(cmd: str) -> str:
    # Ensure we have a consistent shell for things like `source` and `set -e`.
    return f"bash -lc {_q(cmd)}"


def _run(ssh, cmd: str, timeout: int = 120) -> SSHResult:
    return ssh.exec_command(cmd, timeout=timeout)


def _print_result(server: Server, label: str, r: SSHResult) -> None:
    status = "ok" if r.ok else f"fail({r.exit_code})"
    msg = (r.stderr or r.stdout or "").strip().splitlines()[:8]
    tail = "\n".join(msg)
    if tail:
        tail = f"\n{tail}"
    print(f"[{server.name}] {label}: {status}{tail}")


def _detect_os_id(ssh) -> tuple[str | None, str | None]:
    r = _run(ssh, _bash('source /etc/os-release 2>/dev/null && echo "$ID" && echo "$VERSION_ID"'), timeout=10)
    if not r.ok:
        return None, None
    lines = [ln.strip() for ln in r.stdout.splitlines() if ln.strip()]
    if len(lines) < 2:
        return None, None
    return lines[0], lines[1]


def _has_nopasswd_sudo(ssh) -> bool:
    r = _run(ssh, _bash("sudo -n true"), timeout=10)
    return r.ok


def _check_only_steps(server: Server, ssh) -> None:
    checks = [
        Step("whoami", "whoami", timeout=10),
        Step("os-release", 'source /etc/os-release 2>/dev/null && echo "$PRETTY_NAME"', timeout=10),
        Step("docker", "command -v docker && docker --version", timeout=15),
        Step("docker compose", "docker compose version", timeout=15),
        Step("git", "command -v git && git --version", timeout=15),
        Step("caddy", "command -v caddy && caddy version", timeout=15),
        Step(
            "dotmac dirs", "ls -ld /opt/dotmac /opt/dotmac/instances /opt/dotmac/keys 2>/dev/null || true", timeout=10
        ),
        Step(
            "caddy dirs",
            "ls -ld /etc/caddy /etc/caddy/sites-enabled 2>/dev/null || true",
            timeout=10,
        ),
        Step(
            "sudo -n",
            "sudo -n true && echo SUDO_NOPASSWD_OK || echo SUDO_NOPASSWD_NO",
            timeout=10,
        ),
    ]

    for st in checks:
        r = _run(ssh, _bash(st.command), timeout=st.timeout)
        _print_result(server, st.name, r)


def _bootstrap_steps_debian(server: Server, ssh, *, execute: bool) -> None:
    os_id, os_version = _detect_os_id(ssh)
    if os_id not in {"ubuntu", "debian"}:
        print(f"[{server.name}] skip: unsupported OS (id={os_id!r}, version={os_version!r})")
        return

    if not execute:
        print(f"[{server.name}] dry-run: would bootstrap via apt (use --execute to apply changes)")
        return

    if not _has_nopasswd_sudo(ssh):
        print(
            f"[{server.name}] skip: passwordless sudo not available for {server.ssh_user}. "
            "Configure sudoers to allow non-interactive sudo (sudo -n) and retry."
        )
        return

    user = server.ssh_user
    steps = [
        Step(
            "install docker + compose",
            # Ubuntu/Debian repos differ: some have docker-compose-v2, others only docker-compose (v1),
            # and docker-compose-plugin is typically from Docker's upstream repo.
            "sudo -n apt-get update"
            " && sudo -n apt-get install -y docker.io"
            " && (sudo -n apt-get install -y docker-compose-v2"
            "     || sudo -n apt-get install -y docker-compose-plugin"
            "     || sudo -n apt-get install -y docker-compose)",
            needs_sudo=True,
            timeout=900,
        ),
        Step("enable docker", "sudo -n systemctl enable --now docker", needs_sudo=True, timeout=120),
        Step(
            "add user to docker group", f"sudo -n usermod -aG docker {shlex.quote(user)}", needs_sudo=True, timeout=30
        ),
        Step("install caddy", "sudo -n apt-get install -y caddy", needs_sudo=True, timeout=300),
        Step("enable caddy", "sudo -n systemctl enable --now caddy", needs_sudo=True, timeout=120),
        Step(
            "create dotmac dirs",
            "sudo -n mkdir -p /opt/dotmac/instances /opt/dotmac/keys /opt/dotmac/backups",
            needs_sudo=True,
            timeout=30,
        ),
        Step(
            "chown /opt/dotmac",
            f"sudo -n chown -R {shlex.quote(user)}:{shlex.quote(user)} /opt/dotmac",
            needs_sudo=True,
            timeout=60,
        ),
        Step("create caddy dirs", "sudo -n mkdir -p /etc/caddy/sites-enabled", needs_sudo=True, timeout=30),
        Step(
            "ensure Caddyfile imports sites-enabled",
            # Append an import only if not present; keep it simple and idempotent.
            "sudo -n bash -lc \"grep -qE '^\\s*import\\s+/etc/caddy/sites-enabled/\\*' /etc/caddy/Caddyfile || echo 'import /etc/caddy/sites-enabled/*' >> /etc/caddy/Caddyfile\"",
            needs_sudo=True,
            timeout=30,
        ),
        Step("reload caddy", "sudo -n systemctl reload caddy", needs_sudo=True, timeout=30),
    ]

    for st in steps:
        r = _run(ssh, _bash(st.command), timeout=st.timeout)
        _print_result(server, st.name, r)
        if not r.ok:
            print(f"[{server.name}] stop: failed step {st.name!r}")
            return

    print(
        f"[{server.name}] note: group membership changes (docker group) require {user} to log out/in before `docker ps` works."
    )


def _iter_target_servers(db, *, all_servers: bool, server_names: list[str] | None) -> Iterable[Server]:
    q = db.query(Server)
    servers = list(q.order_by(Server.created_at.desc()).all())
    if server_names:
        want = {n.strip() for n in server_names if n.strip()}
        return [s for s in servers if s.name in want]
    if all_servers:
        return servers
    # Default: only servers marked "connected" (best-effort; can be stale).
    return [s for s in servers if getattr(s, "status", None) == ServerStatus.connected]


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(description="Bootstrap DotMac-managed servers (Docker/Caddy/dirs).")
    p.add_argument("--execute", action="store_true", help="Apply changes (default is dry-run checks only).")
    p.add_argument("--all", action="store_true", help="Target all servers (default: only connected).")
    p.add_argument("--server", action="append", help="Target specific server name(s). Can be repeated.")
    args = p.parse_args(argv)

    with SessionLocal() as db:
        targets = list(_iter_target_servers(db, all_servers=args.all, server_names=args.server))

    if not targets:
        print("No servers matched.")
        return 1

    for s in targets:
        print(f"\n== {s.name} ({s.hostname}) ==")
        ssh = get_ssh_for_server(s)
        _check_only_steps(s, ssh)
        _bootstrap_steps_debian(s, ssh, execute=args.execute)

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
