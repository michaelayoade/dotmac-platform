"""
Caddy Service — Generate and deploy Caddyfile snippets for ERP instances.

Caddy handles automatic HTTPS via Let's Encrypt, replacing the previous
nginx + certbot setup.  Each instance gets a per-domain Caddyfile snippet
in /etc/caddy/sites-enabled/.
"""

from __future__ import annotations

import logging
import re
import shlex
import textwrap

logger = logging.getLogger(__name__)

_DOMAIN_RE = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$")


def _validate_domain(domain: str) -> str:
    """Validate domain name to prevent injection in Caddyfile configs and shell commands."""
    if not domain or len(domain) > 253 or not _DOMAIN_RE.match(domain):
        raise ValueError(f"Invalid domain: {domain!r}")
    return domain


class CaddyService:
    """Generate and deploy Caddyfile snippets for ERP instances."""

    def generate_caddyfile(self, domain: str, app_port: int) -> str:
        """Generate a Caddyfile site block for a domain.

        Caddy automatically provisions and renews Let's Encrypt certificates,
        so no separate SSL step is needed.
        """
        return textwrap.dedent(f"""\
            {domain} {{
                reverse_proxy localhost:{app_port}

                encode gzip

                header {{
                    X-Content-Type-Options "nosniff"
                    X-Frame-Options "DENY"
                    Strict-Transport-Security "max-age=31536000; includeSubDomains"
                }}

                @static path /static/*
                handle @static {{
                    header Cache-Control "public, max-age=2592000, immutable"
                    reverse_proxy localhost:{app_port}
                }}
            }}
        """)

    def configure_instance(self, instance: object, ssh: object) -> None:
        """Write Caddyfile snippet and reload Caddy for an instance."""
        domain = getattr(instance, "domain", None)
        if not domain:
            return

        domain = _validate_domain(domain)
        app_port: int = int(getattr(instance, "app_port", 0))
        caddyfile_content = self.generate_caddyfile(domain, app_port)
        site_path = f"/etc/caddy/sites-enabled/{domain}"
        tmp_path = f"{site_path}.tmp"

        ssh.sftp_put_string(caddyfile_content, tmp_path)  # type: ignore[attr-defined]
        logger.info("Wrote Caddyfile snippet: %s", tmp_path)

        # Validate config before activating
        test_result = ssh.exec_command("caddy validate --config /etc/caddy/Caddyfile")  # type: ignore[attr-defined]
        if test_result.ok:
            ssh.exec_command(  # type: ignore[attr-defined]
                f"mv {shlex.quote(tmp_path)} {shlex.quote(site_path)}"
            )
            ssh.exec_command("systemctl reload caddy")  # type: ignore[attr-defined]
            logger.info("Caddy reloaded for %s", domain)
        else:
            ssh.exec_command(f"rm -f {shlex.quote(tmp_path)}")  # type: ignore[attr-defined]
            logger.warning(
                "Caddy config validation failed for %s: %s",
                domain,
                test_result.stderr,
            )
            raise RuntimeError(f"caddy validate failed: {test_result.stderr}")

    def remove_instance_config(self, domain: str, ssh: object) -> None:
        """Remove a Caddyfile snippet and reload Caddy."""
        domain = _validate_domain(domain)
        site_path = f"/etc/caddy/sites-enabled/{domain}"
        ssh.exec_command(f"rm -f {shlex.quote(site_path)}")  # type: ignore[attr-defined]
        ssh.exec_command("systemctl reload caddy")  # type: ignore[attr-defined]
        logger.info("Removed Caddy config and reloaded for %s", domain)
