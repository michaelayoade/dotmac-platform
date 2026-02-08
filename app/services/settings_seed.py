import logging
import os

from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.models.domain_settings import SettingValueType
from app.models.scheduler import ScheduledTask, ScheduleType
from app.services.domain_settings import audit_settings, auth_settings, scheduler_settings
from app.services.secrets import is_openbao_ref


def _csv_list(raw: str | None, upper: bool = True) -> list[str] | None:
    if not raw:
        return None
    items = [item.strip() for item in raw.split(",") if item.strip()]
    if upper:
        return [item.upper() for item in items]
    return items


def seed_auth_settings(db: Session) -> None:
    auth_settings.ensure_by_key(
        db,
        key="jwt_algorithm",
        value_type=SettingValueType.string,
        value_text=os.getenv("JWT_ALGORITHM", "HS256"),
    )
    auth_settings.ensure_by_key(
        db,
        key="jwt_access_ttl_minutes",
        value_type=SettingValueType.integer,
        value_text=os.getenv("JWT_ACCESS_TTL_MINUTES", "15"),
    )
    auth_settings.ensure_by_key(
        db,
        key="jwt_refresh_ttl_days",
        value_type=SettingValueType.integer,
        value_text=os.getenv("JWT_REFRESH_TTL_DAYS", "30"),
    )
    auth_settings.ensure_by_key(
        db,
        key="refresh_cookie_name",
        value_type=SettingValueType.string,
        value_text=os.getenv("REFRESH_COOKIE_NAME", "refresh_token"),
    )
    auth_settings.ensure_by_key(
        db,
        key="refresh_cookie_secure",
        value_type=SettingValueType.boolean,
        value_text=os.getenv("REFRESH_COOKIE_SECURE", "false"),
    )
    auth_settings.ensure_by_key(
        db,
        key="refresh_cookie_samesite",
        value_type=SettingValueType.string,
        value_text=os.getenv("REFRESH_COOKIE_SAMESITE", "lax"),
    )
    auth_settings.ensure_by_key(
        db,
        key="refresh_cookie_domain",
        value_type=SettingValueType.string,
        value_text=os.getenv("REFRESH_COOKIE_DOMAIN"),
    )
    auth_settings.ensure_by_key(
        db,
        key="refresh_cookie_path",
        value_type=SettingValueType.string,
        value_text=os.getenv("REFRESH_COOKIE_PATH", "/auth"),
    )
    auth_settings.ensure_by_key(
        db,
        key="totp_issuer",
        value_type=SettingValueType.string,
        value_text=os.getenv("TOTP_ISSUER", "starter_template"),
    )
    auth_settings.ensure_by_key(
        db,
        key="api_key_rate_window_seconds",
        value_type=SettingValueType.integer,
        value_text=os.getenv("API_KEY_RATE_WINDOW_SECONDS", "60"),
    )
    auth_settings.ensure_by_key(
        db,
        key="api_key_rate_max",
        value_type=SettingValueType.integer,
        value_text=os.getenv("API_KEY_RATE_MAX", "5"),
    )
    auth_settings.ensure_by_key(
        db,
        key="default_auth_provider",
        value_type=SettingValueType.string,
        value_text=os.getenv("AUTH_DEFAULT_AUTH_PROVIDER", "local"),
    )
    jwt_secret = os.getenv("JWT_SECRET")
    if jwt_secret and is_openbao_ref(jwt_secret):
        auth_settings.ensure_by_key(
            db,
            key="jwt_secret",
            value_type=SettingValueType.string,
            value_text=jwt_secret,
            is_secret=True,
        )
    totp_key = os.getenv("TOTP_ENCRYPTION_KEY")
    if totp_key and is_openbao_ref(totp_key):
        auth_settings.ensure_by_key(
            db,
            key="totp_encryption_key",
            value_type=SettingValueType.string,
            value_text=totp_key,
            is_secret=True,
        )


def seed_audit_settings(db: Session) -> None:
    audit_settings.ensure_by_key(
        db,
        key="enabled",
        value_type=SettingValueType.boolean,
        value_text=os.getenv("AUDIT_ENABLED", "true"),
    )
    methods_env = os.getenv("AUDIT_METHODS")
    methods_value = _csv_list(methods_env, upper=True)
    audit_settings.ensure_by_key(
        db,
        key="methods",
        value_type=SettingValueType.json,
        value_json=methods_value or ["POST", "PUT", "PATCH", "DELETE"],
    )
    skip_paths_env = os.getenv("AUDIT_SKIP_PATHS")
    skip_paths_value = _csv_list(skip_paths_env, upper=False)
    audit_settings.ensure_by_key(
        db,
        key="skip_paths",
        value_type=SettingValueType.json,
        value_json=skip_paths_value or ["/static", "/web", "/health"],
    )
    audit_settings.ensure_by_key(
        db,
        key="read_trigger_header",
        value_type=SettingValueType.string,
        value_text=os.getenv("AUDIT_READ_TRIGGER_HEADER", "x-audit-read"),
    )
    audit_settings.ensure_by_key(
        db,
        key="read_trigger_query",
        value_type=SettingValueType.string,
        value_text=os.getenv("AUDIT_READ_TRIGGER_QUERY", "audit"),
    )


def seed_scheduler_settings(db: Session) -> None:
    broker = os.getenv("CELERY_BROKER_URL") or os.getenv("REDIS_URL") or "redis://localhost:6379/0"
    backend = os.getenv("CELERY_RESULT_BACKEND") or os.getenv("REDIS_URL") or "redis://localhost:6379/1"
    scheduler_settings.ensure_by_key(
        db,
        key="broker_url",
        value_type=SettingValueType.string,
        value_text=broker,
        is_secret=True,
    )
    scheduler_settings.ensure_by_key(
        db,
        key="result_backend",
        value_type=SettingValueType.string,
        value_text=backend,
        is_secret=True,
    )
    scheduler_settings.ensure_by_key(
        db,
        key="timezone",
        value_type=SettingValueType.string,
        value_text=os.getenv("CELERY_TIMEZONE", "UTC"),
    )
    scheduler_settings.ensure_by_key(
        db,
        key="beat_max_loop_interval",
        value_type=SettingValueType.integer,
        value_text=os.getenv("CELERY_BEAT_MAX_LOOP_INTERVAL", "5"),
    )
    scheduler_settings.ensure_by_key(
        db,
        key="beat_refresh_seconds",
        value_type=SettingValueType.integer,
        value_text=os.getenv("CELERY_BEAT_REFRESH_SECONDS", "30"),
    )


def seed_scheduled_tasks(db: Session) -> None:
    """Ensure core scheduled tasks exist for health, alerts, usage, drift, cleanup."""
    defaults = [
        {
            "name": "Poll instance health",
            "task_name": "app.tasks.health.poll_instance_health",
            "interval_seconds": 60,
        },
        {
            "name": "Evaluate alert rules",
            "task_name": "app.tasks.monitoring.evaluate_alert_rules",
            "interval_seconds": 60,
        },
        {
            "name": "Collect usage metrics",
            "task_name": "app.tasks.monitoring.collect_usage_metrics",
            "interval_seconds": 3600,
        },
        {
            "name": "Detect config drift",
            "task_name": "app.tasks.monitoring.detect_config_drift",
            "interval_seconds": 21600,
        },
        {
            "name": "Cleanup expired sessions",
            "task_name": "app.tasks.cleanup.cleanup_expired_sessions",
            "interval_seconds": 86400,
        },
        {
            "name": "Cleanup old health checks",
            "task_name": "app.tasks.cleanup.cleanup_old_health_checks",
            "interval_seconds": 3600,
        },
    ]

    for item in defaults:
        existing = db.query(ScheduledTask).filter(ScheduledTask.task_name == item["task_name"]).first()
        if existing:
            continue
        task = ScheduledTask(
            name=item["name"],
            task_name=item["task_name"],
            schedule_type=ScheduleType.interval,
            interval_seconds=item["interval_seconds"],
            args_json=[],
            kwargs_json={},
            enabled=True,
        )
        db.add(task)
