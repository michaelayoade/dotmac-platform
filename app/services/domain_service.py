"""
Domain Service — Manage custom domains for tenant instances.

Handles DNS verification, SSL provisioning, and domain lifecycle.
"""
from __future__ import annotations

import logging
import re
import secrets
import shlex
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.instance import Instance
from app.models.instance_domain import DomainStatus, InstanceDomain
from app.models.server import Server
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)


def _validate_domain(domain: str) -> str:
    """Validate and normalize a domain name."""
    domain = domain.strip().lower()
    if len(domain) > 253:
        raise ValueError("Domain too long (max 253 characters)")
    if not re.match(r'^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$', domain):
        raise ValueError(f"Invalid domain format: {domain}")
    return domain


class DomainService:
    def __init__(self, db: Session):
        self.db = db

    def _get_for_instance(self, instance_id: UUID, domain_id: UUID) -> InstanceDomain:
        inst_domain = self.db.get(InstanceDomain, domain_id)
        if not inst_domain or inst_domain.instance_id != instance_id:
            raise ValueError("Domain not found")
        return inst_domain

    def list_for_instance(self, instance_id: UUID) -> list[InstanceDomain]:
        stmt = (
            select(InstanceDomain)
            .where(InstanceDomain.instance_id == instance_id)
            .order_by(InstanceDomain.is_primary.desc(), InstanceDomain.created_at)
        )
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, domain_id: UUID) -> InstanceDomain | None:
        return self.db.get(InstanceDomain, domain_id)

    def add_domain(
        self,
        instance_id: UUID,
        domain: str,
        is_primary: bool = False,
    ) -> InstanceDomain:
        """Add a new domain to an instance. Generates a DNS verification token."""
        domain = _validate_domain(domain)

        # Check for duplicates
        existing = self.db.scalar(
            select(InstanceDomain).where(InstanceDomain.domain == domain)
        )
        if existing:
            raise ValueError(f"Domain {domain} is already registered")

        # If setting as primary, unset current primary
        if is_primary:
            self._unset_primary(instance_id)

        verification_token = f"dotmac-verify-{secrets.token_hex(16)}"

        inst_domain = InstanceDomain(
            instance_id=instance_id,
            domain=domain,
            is_primary=is_primary,
            status=DomainStatus.pending_verification,
            verification_token=verification_token,
        )
        self.db.add(inst_domain)
        self.db.flush()
        logger.info("Added domain %s for instance %s", domain, instance_id)
        return inst_domain

    def verify_domain(self, instance_id: UUID, domain_id: UUID) -> dict:
        """Check DNS TXT record for verification token."""
        inst_domain = self._get_for_instance(instance_id, domain_id)

        # In production, this would query DNS for a TXT record.
        # For now, we check via the server's dig command.
        instance = self.db.get(Instance, inst_domain.instance_id)
        if not instance:
            raise ValueError("Instance not found")

        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        ssh = get_ssh_for_server(server)
        q_domain = shlex.quote(inst_domain.domain)
        result = ssh.exec_command(
            f"dig +short TXT _dotmac-verification.{q_domain}",
            timeout=15,
        )

        expected = inst_domain.verification_token
        if expected in result.stdout:
            inst_domain.status = DomainStatus.verified
            inst_domain.verified_at = datetime.now(timezone.utc)
            self.db.flush()
            logger.info("Domain verified: %s", inst_domain.domain)
            return {"verified": True}

        return {
            "verified": False,
            "message": f"Add a TXT record for _dotmac-verification.{inst_domain.domain} with value: {expected}",
        }

    def provision_ssl(self, instance_id: UUID, domain_id: UUID) -> dict:
        """Run certbot to provision SSL for a verified domain."""
        inst_domain = self._get_for_instance(instance_id, domain_id)

        if inst_domain.status not in (DomainStatus.verified, DomainStatus.active):
            raise ValueError("Domain must be verified before SSL provisioning")

        instance = self.db.get(Instance, inst_domain.instance_id)
        server = self.db.get(Server, instance.server_id)
        ssh = get_ssh_for_server(server)

        q_domain = shlex.quote(inst_domain.domain)
        result = ssh.exec_command(
            f"certbot certonly --nginx -d {q_domain} --non-interactive --agree-tos --register-unsafely-without-email",
            timeout=60,
        )

        if result.ok:
            inst_domain.status = DomainStatus.ssl_provisioned
            inst_domain.ssl_provisioned_at = datetime.now(timezone.utc)
            self.db.flush()
            logger.info("SSL provisioned for %s", inst_domain.domain)
            return {"success": True}

        inst_domain.error_message = result.stderr[:500]
        self.db.flush()
        return {"success": False, "error": result.stderr[:500]}

    def activate_domain(self, instance_id: UUID, domain_id: UUID) -> InstanceDomain:
        """Mark a domain as fully active (SSL provisioned + nginx configured)."""
        inst_domain = self._get_for_instance(instance_id, domain_id)
        inst_domain.status = DomainStatus.active
        self.db.flush()
        return inst_domain

    def remove_domain(self, instance_id: UUID, domain_id: UUID) -> None:
        """Remove a domain from an instance."""
        inst_domain = self._get_for_instance(instance_id, domain_id)
        self.db.delete(inst_domain)
        self.db.flush()
        logger.info("Removed domain: %s", inst_domain.domain)

    def set_primary(self, instance_id: UUID, domain_id: UUID) -> InstanceDomain:
        """Set a domain as the primary domain for its instance."""
        inst_domain = self._get_for_instance(instance_id, domain_id)
        self._unset_primary(inst_domain.instance_id)
        inst_domain.is_primary = True
        self.db.flush()
        return inst_domain

    def _unset_primary(self, instance_id: UUID) -> None:
        stmt = select(InstanceDomain).where(
            InstanceDomain.instance_id == instance_id,
            InstanceDomain.is_primary.is_(True),
        )
        for d in self.db.scalars(stmt).all():
            d.is_primary = False

    def get_expiring_certs(self, days_until_expiry: int = 14) -> list[InstanceDomain]:
        """Find domains with SSL certificates expiring soon."""
        from datetime import timedelta
        cutoff = datetime.now(timezone.utc) + timedelta(days=days_until_expiry)
        stmt = select(InstanceDomain).where(
            InstanceDomain.ssl_expires_at.isnot(None),
            InstanceDomain.ssl_expires_at <= cutoff,
            InstanceDomain.status.in_([DomainStatus.ssl_provisioned, DomainStatus.active]),
        )
        return list(self.db.scalars(stmt).all())
