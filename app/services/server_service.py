"""
Server Service — CRUD and connectivity management for VPS servers.
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.server import Server, ServerStatus
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)


class ServerService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Server]:
        stmt = select(Server).order_by(Server.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, server_id: UUID) -> Server | None:
        return self.db.get(Server, server_id)

    def get_or_404(self, server_id: UUID) -> Server:
        server = self.get_by_id(server_id)
        if not server:
            raise ValueError(f"Server {server_id} not found")
        return server

    def create(
        self,
        name: str,
        hostname: str,
        ssh_port: int = 22,
        ssh_user: str = "root",
        ssh_key_path: str = "/root/.ssh/id_rsa",
        base_domain: str | None = None,
        is_local: bool = False,
        notes: str | None = None,
    ) -> Server:
        server = Server(
            name=name,
            hostname=hostname,
            ssh_port=ssh_port,
            ssh_user=ssh_user,
            ssh_key_path=ssh_key_path,
            base_domain=base_domain,
            is_local=is_local,
            notes=notes,
        )
        self.db.add(server)
        self.db.flush()
        logger.info("Created server: %s (%s)", name, hostname)
        return server

    def update(self, server_id: UUID, **kwargs) -> Server:
        server = self.get_or_404(server_id)
        allowed = {
            "name",
            "hostname",
            "ssh_port",
            "ssh_user",
            "ssh_key_path",
            "base_domain",
            "is_local",
            "notes",
        }
        for key, value in kwargs.items():
            if key in allowed and value is not None:
                setattr(server, key, value)
        self.db.flush()
        return server

    def delete(self, server_id: UUID) -> None:
        server = self.get_or_404(server_id)
        count = self.instance_count(server_id)
        if count > 0:
            raise ValueError(
                f"Cannot delete server '{server.name}' — it still has {count} instance(s). "
                "Delete or migrate them first."
            )
        self.db.delete(server)
        self.db.flush()
        logger.info("Deleted server: %s", server.name)

    def test_connectivity(self, server_id: UUID) -> dict:
        """Test SSH connectivity to a server."""
        server = self.get_or_404(server_id)
        ssh = get_ssh_for_server(server)

        try:
            result = ssh.test_connection()
            if result.ok:
                server.status = ServerStatus.connected
                server.last_connected = datetime.now(UTC)
                self.db.flush()
                return {
                    "success": True,
                    "hostname": result.stdout.strip(),
                    "message": "Connection successful",
                }
            else:
                server.status = ServerStatus.unreachable
                self.db.flush()
                return {
                    "success": False,
                    "message": result.stderr.strip() or "Command failed",
                }
        except Exception as e:
            server.status = ServerStatus.unreachable
            self.db.flush()
            return {"success": False, "message": str(e)}

    def get_docker_info(self, server_id: UUID) -> dict:
        """Get Docker info from a server."""
        server = self.get_or_404(server_id)
        ssh = get_ssh_for_server(server)

        result = ssh.exec_command("docker info --format '{{.ServerVersion}}'")
        containers = ssh.exec_command("docker ps --format '{{.Names}}\t{{.Status}}'")

        return {
            "docker_version": result.stdout.strip() if result.ok else None,
            "containers": containers.stdout.strip() if containers.ok else None,
            "error": result.stderr.strip() if not result.ok else None,
        }

    def instance_count(self, server_id: UUID) -> int:
        """Count instances on a server."""
        from sqlalchemy import func

        from app.models.instance import Instance

        return self.db.scalar(select(func.count(Instance.instance_id)).where(Instance.server_id == server_id)) or 0

    def instance_counts_batch(self, server_ids: list[UUID]) -> dict[UUID, int]:
        """Count instances for multiple servers in a single query."""
        if not server_ids:
            return {}
        from sqlalchemy import func

        from app.models.instance import Instance

        rows = self.db.execute(
            select(Instance.server_id, func.count(Instance.instance_id))
            .where(Instance.server_id.in_(server_ids))
            .group_by(Instance.server_id)
        ).all()
        return {row[0]: row[1] for row in rows}

    def get_list_bundle(self) -> list[dict]:
        from app.services.ssh_key_service import SSHKeyService

        servers = self.list_all()
        counts = self.instance_counts_batch([s.server_id for s in servers])
        keys = SSHKeyService(self.db).list_keys(active_only=False)
        key_labels = {k.key_id: k.label for k in keys}
        return [
            {
                "server": s,
                "instance_count": counts.get(s.server_id, 0),
                "ssh_key_label": key_labels.get(s.ssh_key_id),
            }
            for s in servers
        ]

    def get_detail_bundle(self, server_id: UUID) -> dict:
        from app.models.ssh_key import SSHKey
        from app.services.instance_service import InstanceService
        from app.services.ssh_key_service import SSHKeyService

        server = self.get_or_404(server_id)
        instances = InstanceService(self.db).list_for_server(server_id)
        ssh_key = None
        ssh_key_label = None
        if server.ssh_key_id:
            try:
                ssh_key = SSHKeyService(self.db).get_public_key(server.ssh_key_id)
                key_row = self.db.get(SSHKey, server.ssh_key_id)
                ssh_key_label = key_row.label if key_row else None
            except Exception:
                ssh_key = None
        return {
            "server": server,
            "instances": instances,
            "ssh_key": ssh_key,
            "ssh_key_label": ssh_key_label,
        }
