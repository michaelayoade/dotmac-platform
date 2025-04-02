# Shared Core Library

This package contains shared, reusable components for the Dotmac platform microservices.

## Components

*   **Base:** Base classes for services, models, etc.
*   **Config:** Settings management.
*   **Errors:** Custom exceptions and handlers.
*   **Logging:** Structured logging setup.
*   **Schemas:** Common Pydantic schemas (responses, pagination).

## SQLAlchemy Models

All SQLAlchemy models in the Dotmac platform should inherit from `BaseModel` in `shared_core.base.base_model`. This class uses SQLAlchemy 2.0 style with type annotations and provides common fields like `id`, `created_at`, and `updated_at`.

Example usage:

```python
from shared_core.base.base_model import BaseModel
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

class MyModel(BaseModel):
    __tablename__ = "my_models"

    # id, created_at, and updated_at are inherited from BaseModel
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
```

Do not use `declarative_base()` from SQLAlchemy directly as it's not compatible with the project's standardized approach.

## Installation

For local development:
```bash
pip install -e .
```

## Usage

Import components as needed in other services:

```python
from shared_core.base import BaseService
from shared_core.config import get_settings
# ...
```
