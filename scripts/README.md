# Dotmac Platform Scripts

This directory contains utility scripts for the Dotmac Platform project.

## SQLAlchemy Style Linter

The `lint_sqlalchemy_style.py` script helps enforce consistent SQLAlchemy 2.0 style across the codebase.

### Usage

```bash
# Check a specific directory
python scripts/lint_sqlalchemy_style.py services/platform-core

# Check the current directory
python scripts/lint_sqlalchemy_style.py
```

### Configuration

The linter is configured in `pyproject.toml` under the `[tool.sqlalchemy-linter]` section:

```toml
[tool.sqlalchemy-linter]
check_patterns = [
    "declarative_base",
    "base_declaration",
    "column_usage",
    "base_inheritance"
]
exclude = [
    ".git",
    "__pycache__",
    "venv",
    "env",
    ".venv",
    ".env",
    "migrations"
]
```

- `check_patterns`: List of patterns to check for
- `exclude`: List of directories to exclude from linting

### Pre-commit Integration

The linter is integrated with pre-commit. To use it:

1. Install pre-commit:
   ```bash
   pip install pre-commit
   ```

2. Install the pre-commit hooks:
   ```bash
   pre-commit install
   ```

3. The linter will run automatically on each commit.

### CI/CD Integration

The linter is also integrated with the CI/CD pipeline. It runs as part of the lint job in GitHub Actions.
