# DotMac Platform — Project Instructions

## Project

FastAPI deployment control plane for multi-tenant ERP instances.
PostgreSQL + Redis + Celery stack, Docker-based, Python 3.12.

## Commands

```bash
poetry run ruff check app/ tests/              # lint (line-length = 120)
poetry run ruff format app/ tests/             # format
poetry run mypy app/ --ignore-missing-imports   # type check
poetry run pytest tests/ -x -q --tb=short       # test (357 tests)
poetry run pytest tests/ --cov=app              # test with coverage
```

Always use `poetry run` — there is no global venv or Makefile.

## Architecture

```
app/api/          # API routes (thin wrappers, return JSON)
app/web/          # Web routes (Jinja2 templates, cookie auth)
app/services/     # Business logic (all logic lives here)
app/models/       # SQLAlchemy 2.0 models (Mapped[] annotations)
app/schemas/      # Pydantic v2 schemas (ConfigDict, extra="forbid" on Create)
app/tasks/        # Celery async tasks
templates/        # Jinja2 HTML templates
tests/            # pytest test suite
```

### Key patterns
- **Auth**: JWT bearer tokens (API) + session cookies (web). Refresh token rotation with reuse detection.
- **Web helpers**: `app/web/helpers.py` — CSRF tokens, `ctx()` for template context, `require_admin()`.
- **SSH**: `app/services/ssh_service.py` — Paramiko connection pool with circuit breaker + retry.
- **Deploy pipeline**: 10-step process in `app/services/deploy_service.py`.
- **Settings**: `app/services/domain_settings.py` — per-domain config with optional Fernet encryption.

### Model PK names (don't guess — read the model)
- `Person` -> `id`
- `Instance` -> `instance_id`
- `Server` -> `server_id`
- Most auth models -> `id`

## Testing Gotchas

- **SQLite in-memory**: Tests use SQLite, not PostgreSQL. `with_for_update()`, JSON operators, and PG-specific features won't work in tests.
- **Rate limiters are singletons**: `login_limiter` and `password_reset_limiter` in `app/rate_limit.py` persist state across tests. The `_reset_rate_limiters` autouse fixture in `conftest.py` handles this.
- **`settings.testing = True`**: The audit middleware short-circuits when `settings.testing` is True. Tests that exercise audit middleware must patch `settings.testing = False`.
- **Shared in-memory DB**: All tests share one SQLite DB. `prune_all` tests may see instances from other tests. Use unique names (`uuid.uuid4().hex[:8]` suffix).
- **Admin auth in tests**: Mutation endpoints (scheduler, settings, delete) require admin role. Use `admin_headers` fixture, not `auth_headers`.
- **bcrypt pinned to 4.0.1**: passlib 1.7.4 is incompatible with bcrypt >= 4.1. Do not upgrade bcrypt.

## Security Patterns

- Shell commands: always `shlex.quote()` user-controlled values
- `_safe_slug()` validates org_code before use in container names
- `_validate_domain()` in nginx_service validates domain format
- CSRF tokens tied to session cookie + HMAC
- SSH pool: `paramiko.WarningPolicy()` (not `AutoAddPolicy()`)
- Services raise `ValueError`/`RuntimeError`, not `HTTPException`

## Code Style

- Line length: **120** (set in `pyproject.toml [tool.ruff]`)
- Ruff rules: E, F, W, I, N, UP, B, S, T20 (S101/S603/S607 ignored)
- Imports: stdlib -> third-party -> local (absolute). Circular deps: import inside function.
- Pagination: `offset: int = Query(0, ge=0)`, `limit: int = Query(25, ge=1, le=100)`
