"""Server setup tasks: SSH key provisioning and dependency bootstrap."""

from __future__ import annotations

import os
import subprocess
import sys
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal
from app.models.server import Server
from app.services.server_service import ServerService
from app.services.ssh_key_service import SSHKeyService
from app.services.ssh_service import SSHService, get_ssh_for_server


def _bootstrap_key_path() -> str | None:
    value = os.getenv("BOOTSTRAP_SSH_KEY_PATH", "").strip()
    return value or None


def _tail_output(proc: subprocess.CompletedProcess[str]) -> str:
    output = (proc.stdout or "").strip()
    err = (proc.stderr or "").strip()
    return "\n".join((output + ("\n" + err if err else "")).splitlines()[-30:])


def _run_dependency_bootstrap(server_name: str) -> subprocess.CompletedProcess[str]:
    cmd = [sys.executable, "scripts/bootstrap_servers.py", "--server", server_name, "--execute"]
    return subprocess.run(
        cmd,
        cwd="/app",
        capture_output=True,
        text=True,
        timeout=1800,
        check=False,
    )


def _bootstrap_failure_message(output_tail: str) -> str:
    lowered = (output_tail or "").lower()
    if "authenticationexception" in lowered or "authentication failed" in lowered:
        return (
            "Bootstrap failed: worker could not authenticate to the server with the configured SSH key. "
            "Re-run Initialize Server with password or verify the server user's authorized_keys."
        )
    if "sudo -n" in lowered and ("not available" in lowered or "requires" in lowered):
        return "Bootstrap failed: remote user does not have passwordless sudo (sudo -n)."
    return "Bootstrap failed."


def _resolve_bootstrap_ssh(server: Server) -> tuple[SSHService | None, str]:
    attempts: list[tuple[str, SSHService]] = [("server auth", get_ssh_for_server(server))]

    bootstrap_path = _bootstrap_key_path()
    if bootstrap_path and not getattr(server, "ssh_key_id", None):
        attempts.append(
            (
                f"bootstrap key ({bootstrap_path})",
                SSHService(
                    hostname=server.hostname,
                    port=server.ssh_port,
                    username=server.ssh_user,
                    key_path=bootstrap_path,
                    expected_host_key_fingerprint=server.ssh_host_key_fingerprint,
                    is_local=server.is_local,
                    server_id=None,  # don't poison pooled connection state while probing candidates
                ),
            )
        )

    errors: list[str] = []
    for label, ssh in attempts:
        try:
            result = ssh.exec_command("echo DOTMAC_SSH_OK", timeout=12)
            if result.ok and "DOTMAC_SSH_OK" in (result.stdout or ""):
                return ssh, label
            detail = (result.stderr or result.stdout or f"exit_code={result.exit_code}").strip()
            errors.append(f"{label}: {detail}")
        except Exception as exc:
            errors.append(f"{label}: {exc}")

    return None, " | ".join(errors)


@shared_task(bind=True)
def setup_server_ssh_key(self, server_id: str, created_by: str | None = None) -> dict:
    """Generate an SSH key and try to deploy it to the server via existing connectivity."""
    with SessionLocal() as db:
        server = db.get(Server, UUID(server_id))
        if not server:
            return {"success": False, "message": "Server not found"}

        if server.ssh_key_id:
            return {"success": True, "message": "Server already has an assigned SSH key."}

        self.update_state(state="PROGRESS", meta={"message": "Generating SSH key..."})
        key_svc = SSHKeyService(db)
        key = key_svc.generate_key(
            label=f"{server.name}-auto-{str(server.server_id)[:8]}",
            key_type="ed25519",
            created_by=created_by,
        )
        db.commit()

        self.update_state(state="PROGRESS", meta={"message": "Deploying key to server..."})
        try:
            key_svc.deploy_to_server(key.key_id, server.server_id)
            db.commit()
        except Exception as exc:
            db.rollback()
            return {
                "success": False,
                "message": "Automatic key deployment failed. Install the generated public key manually, then retry.",
                "error": str(exc),
                "public_key": key.public_key,
                "fingerprint": key.fingerprint,
            }

        self.update_state(state="PROGRESS", meta={"message": "Verifying server connectivity..."})
        test_result = ServerService(db).test_connectivity(server.server_id)
        db.commit()
        if not test_result.get("success"):
            return {
                "success": False,
                "message": "Key deployed, but connectivity verification failed.",
                "error": test_result.get("message", "unknown"),
                "public_key": key.public_key,
                "fingerprint": key.fingerprint,
            }

        return {
            "success": True,
            "message": "SSH key created, deployed, and connectivity verified.",
            "fingerprint": key.fingerprint,
        }


@shared_task(bind=True)
def bootstrap_server_dependencies(self, server_id: str) -> dict:
    """Run the existing bootstrap script for one server in execute mode."""
    with SessionLocal() as db:
        server = db.get(Server, UUID(server_id))
        if not server:
            return {"success": False, "message": "Server not found"}
        server_name = server.name

    self.update_state(state="PROGRESS", meta={"message": "Running dependency bootstrap..."})
    proc = _run_dependency_bootstrap(server_name)
    tail = _tail_output(proc)

    with SessionLocal() as db:
        try:
            ServerService(db).test_connectivity(UUID(server_id))
            db.commit()
        except Exception:
            db.rollback()

    if proc.returncode != 0:
        return {
            "success": False,
            "message": _bootstrap_failure_message(tail),
            "output": tail or "No output captured.",
        }
    return {
        "success": True,
        "message": "Dependency bootstrap completed.",
        "output": tail or "Bootstrap finished.",
    }


@shared_task(bind=True)
def initialize_server(self, server_id: str, created_by: str | None = None) -> dict:
    """One-click server init: ensure SSH key + verify + dependency bootstrap."""
    with SessionLocal() as db:
        server = db.get(Server, UUID(server_id))
        if not server:
            return {"success": False, "message": "Server not found"}

        self.update_state(state="PROGRESS", meta={"message": "Resolving SSH access..."})
        bootstrap_ssh, source = _resolve_bootstrap_ssh(server)
        if not bootstrap_ssh:
            return {
                "success": False,
                "message": "Unable to reach server with configured auth.",
                "output": (
                    source
                    or "No valid SSH access path found. Configure BOOTSTRAP_SSH_KEY_PATH or install a key manually."
                ),
            }

        fingerprint = None
        public_key = None
        if not server.ssh_key_id:
            self.update_state(state="PROGRESS", meta={"message": "Generating per-server SSH key..."})
            key_svc = SSHKeyService(db)
            key = key_svc.generate_key(
                label=f"{server.name}-auto-{str(server.server_id)[:8]}",
                key_type="ed25519",
                created_by=created_by,
            )
            fingerprint = key.fingerprint
            public_key = key.public_key
            db.commit()

            self.update_state(state="PROGRESS", meta={"message": "Installing per-server SSH key..."})
            try:
                key_svc.deploy_to_server(key.key_id, server.server_id, ssh=bootstrap_ssh)
                db.commit()
            except Exception as exc:
                db.rollback()
                return {
                    "success": False,
                    "message": "Failed to install generated SSH key.",
                    "error": str(exc),
                    "output": f"Connected via: {source}",
                    "public_key": public_key,
                    "fingerprint": fingerprint,
                }

        self.update_state(state="PROGRESS", meta={"message": "Verifying key-based connectivity..."})
        test_result = ServerService(db).test_connectivity(server.server_id)
        db.commit()
        if not test_result.get("success"):
            return {
                "success": False,
                "message": "SSH key is configured but connectivity verification failed.",
                "output": test_result.get("message", "unknown"),
                "public_key": public_key,
                "fingerprint": fingerprint,
            }

        self.update_state(state="PROGRESS", meta={"message": "Installing server dependencies..."})
        proc = _run_dependency_bootstrap(server.name)
        tail = _tail_output(proc)

    with SessionLocal() as db:
        try:
            ServerService(db).test_connectivity(UUID(server_id))
            db.commit()
        except Exception:
            db.rollback()

    if proc.returncode != 0:
        return {
            "success": False,
            "message": _bootstrap_failure_message(tail),
            "output": tail or "No output captured.",
        }

    return {
        "success": True,
        "message": "Server initialized (SSH + dependencies).",
        "fingerprint": fingerprint,
        "output": tail or "Initialization finished.",
    }
