# DotMac Platform Management

A production-ready platform management control plane built on FastAPI. It includes enterprise-grade authentication, RBAC, audit logging, background jobs, observability, and a web UI for managing instances, servers, deployments, and platform settings.

## Features

- **Authentication & Security**
  - JWT-based authentication with refresh token rotation
  - Multi-factor authentication (TOTP, SMS, Email)
  - API key management with Redis-backed rate limiting (shared across workers)
  - Session management with token hashing
  - Password policies and account lockout
  - CORS middleware with configurable allowed origins

- **Authorization**
  - Role-based access control (RBAC)
  - Fine-grained permissions system
  - Scope-based API access

- **Audit & Compliance**
  - Comprehensive audit logging with CSV export
  - Request/response tracking
  - Actor and IP address logging
  - Sensitive query parameter redaction in audit metadata

- **Background Jobs**
  - Celery workers with Redis broker
  - Database-backed Beat scheduler
  - Persistent scheduled tasks

- **Observability**
  - Prometheus metrics
  - OpenTelemetry distributed tracing
  - Structured JSON logging

- **Web UI**
  - Jinja2 server-side rendering
  - Static file serving
  - Avatar upload handling

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | FastAPI 0.111.0 |
| Database | PostgreSQL 16 |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Cache/Broker | Redis 7 |
| Task Queue | Celery 5.5 |
| Auth | PyJWT, bcrypt, pyotp |
| Tracing | OpenTelemetry |
| Metrics | Prometheus |

## Project Structure

```
├── app/
│   ├── api/              # Route handlers
│   ├── models/           # SQLAlchemy ORM models
│   ├── schemas/          # Pydantic validation schemas
│   ├── services/         # Business logic layer
│   ├── tasks/            # Celery background tasks
│   ├── main.py           # FastAPI app initialization
│   ├── config.py         # Application settings
│   ├── db.py             # Database configuration
│   ├── celery_app.py     # Celery configuration
│   └── telemetry.py      # OpenTelemetry setup
├── templates/            # Jinja2 HTML templates
├── static/               # Static assets
├── alembic/              # Database migrations
├── scripts/              # Utility scripts
├── tests/                # Test suite
├── docker-compose.yml    # Container orchestration
└── Dockerfile            # Container image
```

## Getting Started

### Prerequisites

- Python 3.11 or 3.12
- PostgreSQL 16
- Redis 7
- [Poetry](https://python-poetry.org/) (recommended) or pip

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd starter_template
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Using Poetry (recommended)
   poetry install

   # Or using pip
   pip install -r requirements.txt
   ```

### Running with Docker (Recommended)

The easiest way to run the application is with Docker Compose:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down
```

Services:
- **App**: http://localhost:8001
- **PostgreSQL**: localhost:5434
- **Redis**: localhost:6379

### Running Locally

1. **Start PostgreSQL and Redis** (or use Docker for just the databases)
   ```bash
   docker compose up -d db redis
   ```

2. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

3. **Seed initial data**
   ```bash
   # Initialize RBAC roles and permissions
   python scripts/seed_rbac.py

   # Create admin user
   python scripts/seed_admin.py --username admin --password <password>

   # Sync settings
   python scripts/settings_sync.py
   ```

4. **Start the application**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```

5. **Start Celery worker** (in a separate terminal)
   ```bash
   celery -A app.celery_app worker -l info
   ```

6. **Start Celery Beat scheduler** (in a separate terminal)
   ```bash
   celery -A app.celery_app beat -l info
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | **Required** (no default) |
| `REDIS_URL` | Redis connection string | `redis://:redis@localhost:6379/0` |
| `CORS_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:3000` |
| `TRUSTED_PROXY_IPS` | Comma-separated list of trusted proxy IPs for `X-Forwarded-For` | _(empty)_ |
| `CELERY_BROKER_URL` | Celery broker URL | `redis://:redis@localhost:6379/0` |
| `CELERY_RESULT_BACKEND` | Celery result backend | `redis://:redis@localhost:6379/1` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `JWT_ACCESS_TTL_MINUTES` | Access token TTL | `15` |
| `JWT_REFRESH_TTL_DAYS` | Refresh token TTL | `30` |
| `TOTP_ISSUER` | TOTP issuer name | `starter_template` |
| `TOTP_ENCRYPTION_KEY` | TOTP secret encryption key | Required |
| `OTEL_ENABLED` | Enable OpenTelemetry | `false` |
| `OTEL_SERVICE_NAME` | Service name for tracing | `starter_template` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector endpoint | - |

### OpenBao Integration

Secrets can be resolved from OpenBao by using the `openbao://` prefix:

```bash
JWT_SECRET=openbao://secret/data/starter_template#jwt_secret
```

Configure OpenBao connection:
```bash
OPENBAO_ADDR=https://vault.example.com
OPENBAO_TOKEN=<token>
OPENBAO_NAMESPACE=<namespace>
OPENBAO_KV_VERSION=2
```

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and revoke session |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/me` | Update current user profile |
| POST | `/auth/password-change` | Change password |
| POST | `/auth/password-reset-request` | Request password reset |
| POST | `/auth/password-reset` | Complete password reset |
| POST | `/auth/mfa/setup` | Setup MFA |
| POST | `/auth/mfa/verify` | Verify MFA code |
| GET | `/auth/sessions` | List user sessions |
| DELETE | `/auth/sessions/{id}` | Revoke session |

### People (`/people`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/people` | Create person |
| GET | `/people` | List people |
| GET | `/people/{id}` | Get person |
| PUT | `/people/{id}` | Update person |
| DELETE | `/people/{id}` | Delete person |

### RBAC (`/roles`, `/permissions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/roles` | Create role |
| GET | `/roles` | List roles |
| PUT | `/roles/{id}` | Update role |
| DELETE | `/roles/{id}` | Delete role |
| POST | `/permissions` | Create permission |
| GET | `/permissions` | List permissions |

### Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/health/ready` | Readiness probe |
| GET | `/health/db-pool` | Database connection pool stats |
| GET | `/metrics` | Prometheus metrics |
| GET | `/scheduler/status` | Scheduler job counts by state |

## Development

### Code Style

The project follows standard Python conventions with:
- Type hints throughout
- Pydantic for data validation
- SQLAlchemy 2.0 mapped column syntax

### Adding New Endpoints

1. Create model in `app/models/`
2. Create schemas in `app/schemas/`
3. Implement service logic in `app/services/`
4. Add route handlers in `app/api/`
5. Register router in `app/main.py`

### Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth_flow.py
```

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/seed_admin.py` | Create admin user |
| `scripts/seed_rbac.py` | Initialize roles and permissions |
| `scripts/settings_sync.py` | Sync settings with database |
| `scripts/settings_validate.py` | Validate settings configuration |

## Releases & Versioning

The project uses **semantic versioning** (`MAJOR.MINOR.PATCH`) for Docker image tags published to GHCR.

### How It Works

Every push to `main` builds and pushes:
- `ghcr.io/michaelayoade/dotmac-platform:latest`
- `ghcr.io/michaelayoade/dotmac-platform:<commit-sha>`

When you tag a release, additional versioned tags are created:
- `:1.2.3` — exact version (pin this in production)
- `:1.2` — receives patch updates automatically
- `:1` — receives minor + patch updates automatically

### Cutting a Release

```bash
# Tag the current commit
git tag v1.2.3 -m "v1.2.3 — Brief description of changes"

# Push the tag (triggers CI build + versioned image push)
git push origin v1.2.3
```

### Deploying a Specific Version

```bash
# Pull and run a pinned version
docker pull ghcr.io/michaelayoade/dotmac-platform:1.2.3
```

Or in `docker-compose.yml` / `.env`:
```yaml
services:
  app:
    image: ghcr.io/michaelayoade/dotmac-platform:1.2.3
```

### Rolling Back

```bash
# Change the image tag to the previous known-good version
# In docker-compose.yml or .env:
#   IMAGE_TAG=1.1.0

docker compose pull app
docker compose up -d app
```

## Managed Server Prerequisites (For Deployments)

The platform can register servers over SSH, but **deploying instances to a server requires OS-level dependencies on that server**.

Minimum requirements on each managed server:
- Docker Engine + `docker compose` plugin available to the SSH user
- `git` available (for cloning repos)
- Writable deploy paths: `/opt/dotmac/instances` and `/opt/dotmac/keys` for the SSH user
- Caddy installed and running (if you want HTTPS + domains via the platform): `/etc/caddy/sites-enabled/` and a `Caddyfile` that imports it
- If any step needs elevated privileges (installing packages, reloading Caddy), the SSH user must have **non-interactive sudo** (no password prompt), or you must use an SSH user with the required privileges (e.g. `root`)

### Bootstrap Script

This repo includes a helper that can check and (optionally) install these prerequisites over SSH for all servers in the platform DB:

```bash
# Dry run (checks only)
docker compose exec -T app python scripts/bootstrap_servers.py --all

# Apply changes (requires passwordless sudo on the target servers)
docker compose exec -T app python scripts/bootstrap_servers.py --all --execute
```

Note: Installing Docker and changing group membership typically requires the SSH user to log out/in before `docker ps` works.

On Ubuntu/Debian, the compose package name varies by repository:
- Common: `docker-compose-v2` (provides `docker compose`)
- Fallback: `docker-compose` (legacy `docker-compose` binary)
- `docker-compose-plugin` is typically provided by Docker's upstream apt repo, not Ubuntu's default repo.

### Version History

| Version | Date | Highlights |
|---------|------|------------|
| v1.0.0 | 2026-02-09 | First versioned release — SSH keys, git repos, DR plans, secret rotation, clone operations, metrics export, resource enforcement, observability, Caddy HTTPS, alert notifications |

## License

[Add your license here]
