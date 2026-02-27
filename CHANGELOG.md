# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project uses semantic versioning.

## [Unreleased] — 2026-02-27

### Added

- [Added] Unit tests for `DeployService.run_deployment()` in `tests/test_deploy_service.py` covering successful full deploy, mid-pipeline `DeployError` with rollback, and instance-not-found early-return (PR #54)
- [Added] `max_rows` (default 100,000, max 1,000,000), `started_after`, and `started_before` query parameters on `GET /audit/export` to cap result size and filter by time window; `X-Row-Limit` response header reports the applied limit (PR #35)
- [Added] GET /api/v1/health/ready readiness endpoint returning status and UTC timestamp (PR #13)
- [Added] GET /api/v1/health/db-pool endpoint returning SQLAlchemy connection pool metrics: pool_size, checked_in, checked_out, overflow (PR #28)
- [Added] GET /api/v1/audit/export endpoint streaming all active audit log entries as a CSV file download (PR #29)
- [Added] POST /api/v1/notification-channels/{channel_id}/test endpoint to send a test notification to a channel (PR #26)
- [Added] GET /api/v1/scheduler/status endpoint returning counts of pending, running, and completed scheduled jobs (PR #22)
- [Added] GET /api/v1/settings/export endpoint returning all non-secret platform settings as a JSON download (PR #25)
- [Added] `fingerprint` (SHA-256) field computed and returned in SSH key response schema (PR #21)
- [Added] `instance_count` computed field added to Organization response schema (PR #24)
- [Added] `uptime_seconds` computed field added to instance detail response (PR #16)
- [Added] `search` query parameter on catalog list endpoint for partial match on name or description (PR #20)
- [Added] `search` query parameter on instance list for filtering by name (PR #8)
- [Added] `purge_old_backups` method in backup service with configurable `retention_days` (default 30) (PR #7)
- [Added] `X-API-Version` response header on all API responses (PR #23)
- [Added] CORS middleware with configurable allowed origins via `CORS_ORIGINS` env var (PR #27)
- [Added] `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` response headers on the login endpoint (PR #9)

### Changed

- [Changed] `python-jose` 3.3.0 replaced with `PyJWT` >=2.8.0 — drops the abandoned library and its CVE-2024-33663/CVE-2024-33664 JWT algorithm confusion vulnerabilities; `jwt.encode()`/`jwt.decode()` API is identical (PR #72)
- [Changed] `get_dashboard_stats()` in `HealthService` now uses SQL aggregations (`GROUP BY status`, `GROUP BY server_id/version`) instead of loading all Instance rows into memory — eliminates full in-memory table scan (PR #78)
- [Changed] `response_model=` added to 12 API route handlers that were missing it: `catalog.py` (list_releases, list_bundles, list_catalog_items), `observability.py` (metrics_summary, list_log_streams, get_logs), `git_repos.py` (list_repos, update_repo), `ssh_keys.py` (list, generate, import), `notifications.py` (list, unread_count) — responses are now validated and serialized via Pydantic schemas (PR #80)
- [Changed] `list_for_web()` in `InstanceService` now pushes text search (ILIKE on name/org_code), status filter, and LIMIT/OFFSET pagination into the SQLAlchemy query — eliminates full in-memory table scan (PR #56)
- [Changed] `_safe_slug()` helper consolidated from 5 duplicate definitions into `app/services/common.py`; backup, clone, deploy, metrics_export, and secret_rotation services now import the shared version (PR #63)
- [Changed] Repeated `MetricsExportService.record_deployment()` try/except block in `DeployService.run_deployment()` extracted into private `_record_deploy_metric()` helper — 4 duplicate call sites replaced (PR #64)
- [Changed] Redundant `shlex.quote()` removed from container name f-string in `InstanceService.run_migrations()` — slug is already validated against `^[a-zA-Z0-9_-]+$` (PR #55)
- [Changed] `passlib` dependency removed; password hashing in `auth_flow.py` migrated to `bcrypt` directly (`bcrypt.hashpw`/`checkpw`), resolving incompatibility with bcrypt ≥ 4.1 (2abd1f4)
- [Changed] `httpx` bumped 0.27 → ^0.28 (stale connection pool fix) and `anyio` bumped 4.2 → ^4.9 (task group cancellation fix) (PR #58)
- [Changed] `pydantic` bumped to >=2.11.0,<3 and `opentelemetry-sdk`/`opentelemetry-exporter-otlp` bumped to >=1.32.0/0.53b0; `poetry.lock` regenerated to resolve post-merge version conflicts (81a8434)
- [Changed] `celery[redis]` bumped to ^5.5, `sqlalchemy` to 2.0.41, `alembic` to ^1.14, `redis` to ^5.2, `python-dotenv` to ^1.2 (b7fbfef)
- [Changed] POST /api/v1/instances/webhooks now accepts JSON body (`url`, `events`, `secret`, `description`, `instance_id`) instead of query parameters (PR #30)
- [Changed] Rate limiting upgraded from in-memory to Redis-backed sliding window implementation, enforced globally across all worker processes; falls back to in-memory when Redis is unavailable (PR #31)

### Fixed

- [Fixed] `UpgradeService.run_upgrade()` early-return guard now includes `UpgradeStatus.running` — previously two concurrent Celery workers could both pass the guard and double-execute the same upgrade (PR #74)
- [Fixed] Catalog `DELETE` endpoints (`delete_release`, `delete_bundle`, `delete_catalog_item`) now return HTTP 204 No Content with `status_code=status.HTTP_204_NO_CONTENT` — previously returned 200 with an empty body (PR #75)
- [Fixed] Bare `except Exception: pass` blocks in `generate_env()` around `FeatureFlagService` and `PlanService` calls replaced with `logger.warning()` — errors are now surfaced in logs instead of being silently swallowed (PR #76)
- [Fixed] `BackupService.transfer_backup_file()` temp file now always cleaned up in try/finally — previously leaked to disk when `sftp_put()` raised (PR #51)
- [Fixed] `CloneService._restore_backup_to_instance()` temp file now always cleaned up in try/finally — previously leaked to disk when any restore command raised (PR #62)
- [Fixed] `channel_config` on notification channel endpoints now raises HTTP 422 on invalid JSON instead of silently coercing to `None` (PR #47)
- [Fixed] CI test `test_export_audit_events_csv_v1_filters_started_window` corrected time window bounds (PR #47)
- [Fixed] Startup health check removed duplicate `SessionLocal()` and fixed import ordering (PR #12)

### Security

- [Security] `cryptography` bumped from 42.0.8 to >=44.0.2 — fixes CVE-2024-12797 (RSA-PSS padding oracle attack) and all CVEs in the 43.x/44.x range (PR #65)
- [Security] Jinja2 bumped from 3.1.4 to >=3.1.6 — fixes CVE-2024-56201 (sandbox escape via code generation) and CVE-2024-56326 (sandbox breakout via `__init_subclass__` override) (PR #57)
- [Security] Webhook secret no longer exposed in server access logs or audit log metadata — moved from query params to JSON body (PR #30)
- [Security] Rate limits now shared across all worker processes via Redis sorted-set sliding window (PR #31)
- [Security] Sensitive query parameters (`api_key`, `token`, `access_token`, `secret`, `password`, `key`, `authorization`) are redacted to `***` in audit log metadata before storage (PR #33)
- [Security] `DATABASE_URL` hard-coded default with insecure credentials (`postgres:postgres`) removed; value is now required in production and validated at startup (PR #34)
- [Security] Audit CSV export now enforces a configurable row limit (`max_rows`) to prevent out-of-memory conditions on large datasets (PR #35)
- [Security] Warning logged at startup when `TRUSTED_PROXY_IPS` is not configured — rate-limit tracking may collapse to the proxy IP when behind a load balancer (PR #37)
- [Security] RBAC web `role_id` form parameter now validated as UUID; redirect URL built with `urllib.parse.urlencode` to prevent query-parameter injection (PR #38)
- [Security] Avatar upload now validates magic bytes (JPEG, PNG, GIF, WebP) against actual file content; HTTP 422 returned if magic bytes do not match the declared type (PR #39)
- [Security] `admin_password` and other user-supplied strings in generated `.env` files are now quoted and escaped (double-quotes and newlines), preventing `.env` key-value injection (PR #40)
- [Security] Warning logged at startup when `CSRF_SECRET_KEY` is absent — an ephemeral random key is used, which invalidates all CSRF tokens on every process restart (PR #41)
- [Security] `PUT /instances/{instance_id}/version` now validates `git_branch` and `git_tag` against a safe-ref regex (`^[a-zA-Z0-9._/\-]{1,200}$`); HTTP 422 returned on invalid format (PR #42)
- [Security] `GET /instances/approvals` now scoped to the caller's organisation — cross-tenant pending approval leak closed (PR #43)
- [Security] `GET /instances/alerts/rules` and `GET /instances/alerts/events` now scoped to the caller's organisation; cross-tenant alert data exposure closed (PR #44)
- [Security] Warning logged when API key hashing degrades to plain SHA-256 due to missing `API_KEY_HASH_SECRET` and `JWT_SECRET` configuration (PR #45)
- [Security] JWT algorithm for per-domain auth settings restricted to allowlist `{HS256, HS384, HS512}`; runtime guard in `_jwt_algorithm()` raises HTTP 500 if an unsafe algorithm is resolved (PR #46)
- [Security] `python-jose` migrated to `PyJWT` — fixes CVE-2024-33663 (algorithm confusion allowing auth bypass) and CVE-2024-33664 (unsafe signature handling); library was abandoned with no upstream security patches (PR #72)
- [Security] Scheduler settings `broker_url` and `result_backend` marked `is_secret=True` — previously any authenticated user could read Celery/Redis connection strings containing passwords via `GET /settings/scheduler` (PR #68)
- [Security] `_quote_env_value` in `instance_service.py` now escapes backslashes as the first transformation step — a trailing backslash in a password previously produced a malformed `.env` entry (e.g. `p4ss\` → unclosed `p4ss\"`) (PR #69)
- [Security] `GET /settings/audit` and `GET /settings/audit/{key}` now require admin role — previously any authenticated user could read audit `skip_paths` and sentinel headers, providing a roadmap for evading the audit trail (PR #70)
- [Security] `ApiKeys.generate_with_rate_limit` now uses `_get_client_ip()` helper that respects `TRUSTED_PROXY_IPS` — previously all requests appeared to originate from the proxy IP when behind a load balancer, effectively disabling per-client rate limiting for API key generation (PR #71)
- [Security] Refresh token stored in DB now hashed with HMAC-SHA256 keyed on `SESSION_TOKEN_HASH_SECRET` when set, instead of plain SHA-256 — prevents brute-force token recovery if the database is read-compromised; falls back to plain SHA-256 when the env var is absent (5540a3d)

### CI / Housekeeping

- [Fixed] Rate-limit wrapper now correctly handles `Response` objects returned by `login_response`; previously caused a 500 on login when the wrapper unwrapped the response early (PR #48)
- [Fixed] Platform-settings unknown-key test narrowed to query a specific key so it no longer matches unrelated settings rows added by other tests (PR #49)
- [Fixed] Trailing whitespace on blank lines (W293) and import ordering (I001) corrected across `auth_flow.py`, `settings.py`, `main.py`, `rate_limit.py`, `auth.py` to restore CI lint pass (434e9aa)
- [Fixed] Whitespace (W293), line-length (E501), and import-ordering (I001) ruff errors in `backup_service.py`, `clone_service.py`, and `tests/test_deploy_service.py` (12a07d0)
- [Fixed] Ruff auto-format applied to 8 files (`app/main.py`, `app/services/audit.py`, `app/services/avatar.py`, `app/services/instance_service.py`, `tests/test_api_instances_webhooks.py`, `tests/test_avatar_services.py`, `tests/test_ghcr_deploy.py`, `tests/test_platform_settings.py`) to restore CI format check (ef4bd69)
- [Fixed] Ruff format applied to `app/services/backup_service.py`, `app/services/instance_service.py`, and `tests/test_deploy_service.py` to restore CI format check after passlib migration (2abd1f4)
- [Fixed] `tests/test_api_settings.py` audit settings tests updated to use `admin_headers` — CI broke after audit GET endpoints were restricted to admin role in PR #70 (d677892)
- [Added] Tests covering security-cycle-3 fixes: `test_api_settings.py` verifies broker_url/result_backend masking in `GET /settings/scheduler`; `test_instance_service.py` verifies backslash escaping in `_quote_env_value`; `test_api_audit.py` + `test_api_settings.py` verify regular users get 403 on `GET /settings/audit` and `GET /settings/audit/{key}` (PR #73)
- [Added] `tests/test_upgrade_service.py` with 3 unit tests for `UpgradeService.run_upgrade()`: successful upgrade, failed upgrade (RuntimeError → status=failed + error_message), and concurrent early-return guard (PR #79)
- [Fixed] Ruff lint errors corrected directly on main: import ordering (I001) in `observability.py` and unused import (F401) in `caddy_service.py` to restore CI lint pass (7ac3db5)
