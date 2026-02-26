# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project uses semantic versioning.

## [Unreleased] — 2026-02-26

### Added

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

- [Changed] POST /api/v1/instances/webhooks now accepts JSON body (`url`, `events`, `secret`, `description`, `instance_id`) instead of query parameters (PR #30)
- [Changed] Rate limiting upgraded from in-memory to Redis-backed sliding window implementation, enforced globally across all worker processes; falls back to in-memory when Redis is unavailable (PR #31)

### Fixed

- [Fixed] Startup health check removed duplicate `SessionLocal()` and fixed import ordering (PR #12)

### Security

- [Security] Webhook secret no longer exposed in server access logs or audit log metadata — moved from query params to JSON body (PR #30)
- [Security] Rate limits now shared across all worker processes via Redis sorted-set sliding window (PR #31)
- [Security] Sensitive query parameters (`api_key`, `token`, `access_token`, `secret`, `password`, `key`, `authorization`) are redacted to `***` in audit log metadata before storage (PR #33)
- [Security] `DATABASE_URL` hard-coded default with insecure credentials (`postgres:postgres`) removed; value is now required in production and validated at startup (PR #34)
