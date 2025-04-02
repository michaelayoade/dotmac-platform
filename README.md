# Dotmac Platform

A modern FastAPI-based platform with SQLAlchemy 2.0 integration.

## Project Structure

```
dotmac-platform/
├── docs/                    # Documentation
│   ├── guides/              # Developer guides
│   └── migration-guides/    # Migration guides
├── libs/                    # Shared libraries
│   └── shared-core/         # Core shared components
├── scripts/                 # Utility scripts
├── services/                # Microservices
│   └── platform-core/       # Core platform service
└── tests/                   # Global test utilities
```

## Development Setup

### Prerequisites

- Python 3.9+
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/dotmac-platform.git
   cd dotmac-platform
   ```

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   cd services/platform-core
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

4. Set up pre-commit hooks:
   ```bash
   pip install pre-commit
   pre-commit install
   ```

## SQLAlchemy 2.0 Style

This project uses SQLAlchemy 2.0 style with type annotations throughout the codebase. All models inherit from `BaseModel` defined in `shared_core.base.base_model`.

### Key Features

- Type annotations with `Mapped[]` types
- Common fields (`id`, `created_at`, `updated_at`) provided by `BaseModel`
- Async database operations

### Documentation

- [SQLAlchemy 2.0 Style Guide](docs/guides/sqlalchemy-2.0-style-guide.md)
- [SQLAlchemy Base Class Migration Guide](docs/migration-guides/sqlalchemy-base-class-migration.md)

### Linting

The project includes a custom SQLAlchemy style linter to enforce consistent usage:

```bash
python scripts/lint_sqlalchemy_style.py services/platform-core
```

## Testing

```bash
cd services/platform-core
pytest
```

## CI/CD

The project uses GitHub Actions for CI/CD. The workflow includes:

- Linting with black, isort, and ruff
- SQLAlchemy style checking
- Running tests with coverage reporting

## Configuration

The project uses Pydantic V2 for configuration management with a nested settings structure:

- Environment variables use double underscore delimiter for nested settings:
  - `API__NAME`, `API__ALLOWED_HOSTS`
  - `SERVER__PORT`
  - `DB__DATABASE_URL`
  - `CACHE__REDIS_URL`
  - `SECURITY__SECRET_KEY`

## License

[MIT License](LICENSE)
