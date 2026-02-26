# API Reference

Base path: `/api/v1`

All authenticated endpoints require a `Bearer` token in the `Authorization` header (or a valid session cookie for web routes).

---

## Health

### GET /health/ready

Readiness probe. No authentication required.

**Response 200**
```json
{
  "status": "ready",
  "timestamp": "2026-02-26T21:00:00.123456+00:00"
}
```

---

### GET /health/db-pool

Returns the current SQLAlchemy connection pool statistics. No authentication required.

**Response 200**
```json
{
  "pool_size": 5,
  "checked_in": 3,
  "checked_out": 2,
  "overflow": 0
}
```

**Response 500** — pool status string could not be parsed.

---

## Audit Events

### GET /audit-events

List audit log entries with optional filtering and pagination.

**Query parameters**

| Parameter    | Type    | Description                          |
|--------------|---------|--------------------------------------|
| actor_id     | string  | Filter by actor UUID                 |
| actor_type   | string  | Filter by actor type                 |
| action       | string  | Filter by action name                |
| entity_type  | string  | Filter by entity type                |
| request_id   | string  | Filter by request ID                 |
| is_success   | boolean | Filter by success/failure            |
| status_code  | integer | Filter by HTTP status code           |
| is_active    | boolean | Filter by active flag                |
| order_by     | string  | Sort field (default: `occurred_at`)  |
| order_dir    | string  | `asc` or `desc` (default: `desc`)    |
| limit        | integer | 1–200 (default: 50)                  |
| offset       | integer | Pagination offset (default: 0)       |

**Response 200**
```json
{
  "items": [...],
  "total": 142,
  "limit": 50,
  "offset": 0
}
```

---

### GET /audit-events/{event_id}

Retrieve a single audit event by ID.

**Response 200** — `AuditEventRead` object.

---

### GET /audit/export

Export all active audit log entries as a CSV file download.

**Response 200** — `text/csv` with `Content-Disposition: attachment; filename="audit-log.csv"`

CSV columns: `timestamp`, `user`, `action`, `resource`, `detail`

Example:
```
timestamp,user,action,resource,detail
2026-02-26T21:00:00+00:00,user-uuid,instance.deploy,instance:abc123,"{""env"":""prod""}"
```

> **Note:** Sensitive query parameters (`api_key`, `token`, `access_token`, `secret`, `password`, `key`, `authorization`) are redacted to `***` in the `detail` column.

---

## Authentication

### POST /auth/login

**Request body**
```json
{
  "username": "admin",
  "password": "s3cr3t"
}
```

**Response headers** (rate-limit context)
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1740607260
```

Rate limit: 10 requests per 60 seconds per IP.

---

## Instances

### POST /instances/webhooks

Register a webhook for an instance. Credentials are passed in the JSON body to prevent them appearing in logs.

**Request body**
```json
{
  "instance_id": "uuid",
  "url": "https://example.com/hooks/dotmac",
  "events": ["deploy.completed", "deploy.failed"],
  "secret": "webhook-hmac-secret",
  "description": "Production deploy notifications"
}
```

**Response 200** — created webhook object.

> **Security:** `secret` must be sent in the JSON body. Query-parameter delivery was removed in PR #30.

---

## Notification Channels

### POST /notification-channels/{channel_id}/test

Send a test notification to the specified channel.

**Path parameter:** `channel_id` — UUID of the notification channel.

**Response 200**
```json
{
  "status": "sent"
}
```

**Response 404** — channel not found.

---

## Scheduler

### GET /scheduler/status

Returns counts of scheduled jobs by state. Requires admin role.

**Response 200**
```json
{
  "pending": 3,
  "running": 1,
  "completed": 47
}
```

---

## Settings

### GET /settings/export

Download all non-secret platform settings as a JSON attachment.

**Response 200** — `application/json` with `Content-Disposition: attachment; filename="settings.json"`

Response body is an array of setting objects (secrets are excluded).

---

## Organizations

Organizations now include a computed `instance_count` field in all read responses.

**Example**
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "org_code": "acme",
  "instance_count": 4
}
```

---

## SSH Keys

SSH key responses now include a computed `fingerprint` field (SHA-256 hash of the public key, base64-encoded).

**Example**
```json
{
  "id": "uuid",
  "name": "deploy-key",
  "public_key": "ssh-ed25519 AAAA...",
  "fingerprint": "SHA256:abc123..."
}
```

---

## Common Response Headers

Every API response includes:

| Header          | Description                             |
|-----------------|-----------------------------------------|
| `X-API-Version` | Application version (e.g. `0.1.0`)     |

---

## Rate Limiting

Rate limits are enforced per IP using a Redis-backed sliding window. When Redis is unavailable, an in-memory fallback is used (not shared across workers).

| Endpoint              | Limit          |
|-----------------------|----------------|
| POST /auth/login      | 10 / 60 s      |
| POST /auth/refresh    | 10 / 60 s      |
| POST /auth/password-reset-request | 5 / 300 s |
| POST /auth/mfa/verify | 5 / 300 s      |
| POST /auth/password-change | 10 / 60 s |

Configure `TRUSTED_PROXY_IPS` (comma-separated) so that `X-Forwarded-For` headers are trusted only from known proxies.

---

## CORS

Allowed origins are configured via the `CORS_ORIGINS` environment variable (comma-separated list). Default: `http://localhost:3000`.

All methods and headers are permitted for listed origins. Credentials (`Authorization`, cookies) are supported.
