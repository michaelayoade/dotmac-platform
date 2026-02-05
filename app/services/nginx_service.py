"""
Nginx Service — Generate and deploy nginx vhost configs for ERP instances.
"""
from __future__ import annotations

import logging
import re
import shlex
import textwrap

logger = logging.getLogger(__name__)

_DOMAIN_RE = re.compile(r'^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$')


def _validate_domain(domain: str) -> str:
    """Validate domain name to prevent injection in nginx configs and shell commands."""
    if not domain or len(domain) > 253 or not _DOMAIN_RE.match(domain):
        raise ValueError(f"Invalid domain: {domain!r}")
    return domain


class NginxService:
    """Generate and deploy nginx server blocks for ERP instances."""

    def generate_vhost(self, domain: str, app_port: int) -> str:
        """Generate nginx server block configuration."""
        upstream_name = domain.replace(".", "_")
        return textwrap.dedent(f"""\
            upstream {upstream_name} {{
                server 127.0.0.1:{app_port};
            }}

            server {{
                listen 80;
                server_name {domain};
                return 301 https://$host$request_uri;
            }}

            server {{
                listen 443 ssl http2;
                server_name {domain};

                # SSL certs will be managed by certbot
                # ssl_certificate /etc/letsencrypt/live/{domain}/fullchain.pem;
                # ssl_certificate_key /etc/letsencrypt/live/{domain}/privkey.pem;

                client_max_body_size 50M;

                location / {{
                    proxy_pass http://{upstream_name};
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header X-Forwarded-Proto $scheme;
                    proxy_read_timeout 300;
                    proxy_connect_timeout 300;
                }}

                location /static/ {{
                    proxy_pass http://{upstream_name};
                    proxy_set_header Host $host;
                    expires 30d;
                    add_header Cache-Control "public, immutable";
                }}
            }}
        """)

    def configure_instance(self, instance, ssh) -> None:
        """Write nginx config and reload for an instance."""
        if not instance.domain:
            return

        domain = _validate_domain(instance.domain)
        vhost_content = self.generate_vhost(domain, instance.app_port)
        vhost_path = f"/etc/nginx/sites-enabled/{domain}"

        ssh.sftp_put_string(vhost_content, vhost_path)
        logger.info("Wrote nginx vhost: %s", vhost_path)

        # Test and reload
        test_result = ssh.exec_command("nginx -t")
        if test_result.ok:
            ssh.exec_command("systemctl reload nginx")
            logger.info("Nginx reloaded for %s", domain)

            # Try certbot (non-blocking)
            certbot_result = ssh.exec_command(
                f"certbot --nginx -d {shlex.quote(domain)} --non-interactive --agree-tos "
                f"--register-unsafely-without-email || true",
                timeout=60,
            )
            if certbot_result.ok:
                logger.info("SSL configured for %s", domain)
        else:
            logger.warning(
                "Nginx config test failed for %s: %s",
                domain,
                test_result.stderr,
            )
            raise RuntimeError(f"nginx -t failed: {test_result.stderr}")
