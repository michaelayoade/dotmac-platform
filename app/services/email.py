import html
import logging
import os
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

_SMTP_MAX_RETRIES = 2
_SMTP_RETRY_DELAY = 1  # seconds


def _env_value(name: str) -> str | None:
    value = os.getenv(name)
    if value is None or value == "":
        return None
    return value


def _env_int(name: str, default: int) -> int:
    raw = _env_value(name)
    if raw is None:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    raw = _env_value(name)
    if raw is None:
        return default
    return raw.lower() in {"1", "true", "yes", "on"}


def _get_smtp_config() -> dict:
    return {
        "host": _env_value("SMTP_HOST") or "localhost",
        "port": _env_int("SMTP_PORT", 587),
        "username": _env_value("SMTP_USERNAME"),
        "password": _env_value("SMTP_PASSWORD"),
        "use_tls": _env_bool("SMTP_USE_TLS", True),
        "use_ssl": _env_bool("SMTP_USE_SSL", False),
        "from_email": _env_value("SMTP_FROM_EMAIL") or "noreply@example.com",
        "from_name": _env_value("SMTP_FROM_NAME") or _env_value("BRAND_NAME") or "DotMac Platform",
    }


def _sanitize_header(value: str, field: str) -> str:
    if "\r" in value or "\n" in value:
        raise ValueError(f"Invalid header value for {field}")
    return value


def send_email(
    _db: Session | None,
    to_email: str,
    subject: str,
    body_html: str,
    body_text: str | None = None,
) -> bool:
    config = _get_smtp_config()
    subject = _sanitize_header(subject, "subject")
    to_email = _sanitize_header(to_email, "to_email")
    from_email = _sanitize_header(config["from_email"], "from_email")
    from_name = _sanitize_header(config["from_name"], "from_name")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{from_name} <{from_email}>"
    msg["To"] = to_email

    if body_text:
        msg.attach(MIMEText(body_text, "plain"))
    msg.attach(MIMEText(body_html, "html"))

    last_err: Exception | None = None
    for attempt in range(_SMTP_MAX_RETRIES + 1):
        server = None
        try:
            if config["use_ssl"]:
                server = smtplib.SMTP_SSL(config["host"], config["port"])
            else:
                server = smtplib.SMTP(config["host"], config["port"])

            if config["use_tls"] and not config["use_ssl"]:
                server.starttls()

            if config["username"] and config["password"]:
                server.login(config["username"], config["password"])

            server.sendmail(config["from_email"], to_email, msg.as_string())

            logger.info("Email sent to %s", to_email)
            return True
        except smtplib.SMTPAuthenticationError as exc:
            # Auth errors are not retryable
            logger.error("Failed to send email to %s: %s", to_email, exc)
            return False
        except Exception as exc:
            last_err = exc
            if attempt < _SMTP_MAX_RETRIES:
                logger.warning(
                    "SMTP attempt %d/%d to %s failed: %s",
                    attempt + 1,
                    _SMTP_MAX_RETRIES + 1,
                    to_email,
                    exc,
                )
                time.sleep(_SMTP_RETRY_DELAY * (attempt + 1))
        finally:
            if server is not None:
                try:
                    server.quit()
                except Exception:
                    pass

    logger.error("Failed to send email to %s after %d attempts: %s", to_email, _SMTP_MAX_RETRIES + 1, last_err)
    return False


def send_password_reset_email(
    db: Session | None,
    to_email: str,
    reset_token: str,
    person_name: str | None = None,
) -> bool:
    name = person_name or "there"
    safe_name = html.escape(name)
    app_url = _env_value("APP_URL") or "http://localhost:8000"
    reset_link = f"{app_url.rstrip('/')}/auth/reset-password?token={reset_token}"
    subject = "Reset your password"
    body_html = (
        f"<p>Hi {safe_name},</p>"
        "<p>Use the link below to reset your password:</p>"
        f'<p><a href="{reset_link}">Reset password</a></p>'
    )
    body_text = f"Hi {name}, use this link to reset your password: {reset_link}"
    return send_email(db, to_email, subject, body_html, body_text)
