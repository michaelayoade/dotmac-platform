# Contributing to dotmac-platform

Thank you for your interest in contributing to dotmac-platform! This document outlines the coding standards and workflow we follow to maintain high-quality code.

## Code Style Guidelines

We follow PEP 8 style guidelines with the following principles:

1. **DRY (Don't Repeat Yourself)**: Use functions and dependencies to avoid code duplication.
2. **Configuration over hardcoding**: Use config settings instead of hardcoding values.
3. **SQLAlchemy 2.0 style**: Use `BaseModel` from `shared_core.base.base_model` throughout the application.

## Linting and Formatting

We use several tools to ensure code quality:

1. **Black**: Code formatter with 79 character line length
2. **isort**: Import sorting with Black compatibility
3. **flake8**: Linting with docstring checks
4. **ruff**: Fast linting with auto-fixes
5. **Custom SQLAlchemy style linter**: Ensures consistent SQLAlchemy usage

### Pre-commit Hooks

We use pre-commit hooks to automatically check code quality before committing:

```bash
# Install pre-commit
pip install pre-commit

# Install the git hooks
pre-commit install

# Run against all files
pre-commit run --all-files
```

### Flake8 Configuration

Our `.flake8` configuration is set up to work with Black and includes pragmatic exceptions for line length in specific cases:

```ini
[flake8]
max-line-length = 79
extend-ignore = E203, W503
exclude = .git,__pycache__,venv,env,.venv,.env,migrations,build,dist
per-file-ignores =
    # Allow unused imports in __init__.py files
    __init__.py: F401
    # Ignore line length in test files
    tests/*: E501
    # Ignore line length in alembic files
    alembic/*: E501
    # Ignore line length in docstrings and comments
    *.py: E501
```

## Continuous Integration

We use GitHub Actions to automatically run linting checks on push to main/master and on pull requests. The workflow includes:

1. Running all pre-commit hooks
2. Running flake8 on the platform-core service
3. Running the custom SQLAlchemy style linter

## Pull Request Process

1. Ensure your code passes all linting checks
2. Update documentation if necessary
3. Include tests for new functionality
4. Submit a pull request with a clear description of the changes

## SQLAlchemy Style Guide

We follow SQLAlchemy 2.0 style throughout the application:

1. Use `BaseModel` from `shared_core.base.base_model` for all models
2. Avoid using the deprecated SQLAlchemy 1.x style (`Base = declarative_base()`)
3. Use the new-style Column syntax
4. Follow the patterns established in existing models

Our custom SQLAlchemy style linter will help catch any violations of these guidelines.
