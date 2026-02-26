import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    VERSION: str = os.getenv("VERSION", "0.1.0")

    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5434/dotmac_platform",
    )
    db_pool_size: int = int(os.getenv("DB_POOL_SIZE", "5"))
    db_max_overflow: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    db_pool_timeout: int = int(os.getenv("DB_POOL_TIMEOUT", "30"))
    db_pool_recycle: int = int(os.getenv("DB_POOL_RECYCLE", "1800"))

    # Avatar settings
    avatar_upload_dir: str = os.getenv("AVATAR_UPLOAD_DIR", "static/avatars")
    avatar_max_size_bytes: int = int(os.getenv("AVATAR_MAX_SIZE_BYTES", str(2 * 1024 * 1024)))
    avatar_allowed_types: str = os.getenv("AVATAR_ALLOWED_TYPES", "image/jpeg,image/png,image/gif,image/webp")
    avatar_url_prefix: str = os.getenv("AVATAR_URL_PREFIX", "/static/avatars")

    # Branding
    brand_name: str = os.getenv("BRAND_NAME", "DotMac Platform")
    brand_tagline: str = os.getenv("BRAND_TAGLINE", "Deployment Control Plane")
    brand_logo_url: str | None = os.getenv("BRAND_LOGO_URL") or None

    # Runtime flags
    testing: bool = os.getenv("TESTING", "").lower() in {"1", "true", "yes", "on"}
    use_cdn_assets: bool = os.getenv("USE_CDN_ASSETS", "true").lower() in {"1", "true", "yes", "on"}

    # Platform-specific
    dotmac_source_path: str = os.getenv("DOTMAC_SOURCE_PATH", "/opt/dotmac")
    platform_ssh_keys_dir: str = os.getenv("PLATFORM_SSH_KEYS_DIR", "/root/.ssh")
    default_deploy_path: str = os.getenv("DEFAULT_DEPLOY_PATH", "/opt/dotmac/instances")
    health_poll_interval_seconds: int = int(os.getenv("HEALTH_POLL_INTERVAL", "60"))
    health_checks_to_keep: int = int(os.getenv("HEALTH_CHECKS_TO_KEEP", "100"))
    health_stale_seconds: int = int(os.getenv("HEALTH_STALE_SECONDS", "180"))


settings = Settings()
