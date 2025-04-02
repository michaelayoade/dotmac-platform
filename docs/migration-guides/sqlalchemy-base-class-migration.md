# SQLAlchemy Base Class Migration Guide

## Overview

This guide explains how to migrate from the SQLAlchemy 1.x style `declarative_base()` to the SQLAlchemy 2.0 style `BaseModel` from `shared_core.base.base_model` in the Dotmac Platform.

## Why Migrate?

1. **Consistency**: Using a single base class across the codebase improves maintainability
2. **Modern Features**: SQLAlchemy 2.0 provides better type annotations and improved async support
3. **Common Fields**: The `BaseModel` includes common fields like `id`, `created_at`, and `updated_at`
4. **DRY Principle**: Avoid duplicating code for common model functionality

## Migration Steps

### 1. Remove Old Import and Base Declaration

```python
# REMOVE these lines
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
```

### 2. Import BaseModel from shared_core

```python
# ADD this import
from shared_core.base.base_model import BaseModel
```

### 3. Update Model Definitions

#### Before:

```python
from sqlalchemy import Column, Integer, String
from app.db.session import Base

class MyModel(Base):
    __tablename__ = "my_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
```

#### After:

```python
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from shared_core.base.base_model import BaseModel

class MyModel(BaseModel):
    __tablename__ = "my_models"

    # id, created_at, and updated_at are inherited from BaseModel
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
```

### 4. Update Database Operations

#### Before:

```python
# Creating tables
Base.metadata.create_all(bind=engine)

# Querying
db.query(MyModel).filter(MyModel.id == 1).first()
```

#### After:

```python
# Creating tables
BaseModel.metadata.create_all(bind=engine)

# Querying (unchanged)
db.query(MyModel).filter(MyModel.id == 1).first()
```

## Common Fields Provided by BaseModel

The `BaseModel` class automatically provides these fields:

```python
class BaseModel(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=False)
```

## Testing

When writing tests, use the same `BaseModel` for creating test tables:

```python
# In conftest.py or test setup
from shared_core.base.base_model import BaseModel

# Create tables for testing
BaseModel.metadata.create_all(bind=engine)
```

## Troubleshooting

If you encounter issues after migration:

1. Check that all models inherit from `BaseModel` instead of `Base`
2. Ensure all database operations use `BaseModel.metadata` instead of `Base.metadata`
3. Verify that you're not importing the old `Base` class anywhere in your code
