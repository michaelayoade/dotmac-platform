# SQLAlchemy 2.0 Style Guide for Dotmac Platform

## Introduction

This guide explains the SQLAlchemy 2.0 style used throughout the Dotmac Platform project. Following these guidelines ensures consistency and leverages the full power of SQLAlchemy's modern features.

## Core Principles

1. Use type annotations with `Mapped[]` types
2. Use `mapped_column()` instead of `Column()`
3. Inherit from `BaseModel` from `shared_core.base.base_model`
4. Follow PEP 8 style guidelines
5. Apply the DRY principle by reusing common components

## BaseModel

All models in the Dotmac Platform inherit from the `BaseModel` class, which provides:

```python
class BaseModel(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=False)
```

## Type Annotations

SQLAlchemy 2.0 supports Python type annotations, which provide better IDE support and type checking:

```python
# Recommended
name: Mapped[str] = mapped_column(String(100), nullable=False)

# Not recommended
name = Column(String(100), nullable=False)
```

## Column Types

Use the appropriate SQLAlchemy types for your data:

```python
# String fields
name: Mapped[str] = mapped_column(String(100), nullable=False)

# Text fields (unlimited length)
description: Mapped[str] = mapped_column(Text, nullable=True)

# Boolean fields
is_active: Mapped[bool] = mapped_column(Boolean, default=True)

# Integer fields
count: Mapped[int] = mapped_column(Integer, default=0)

# Float fields
price: Mapped[float] = mapped_column(Float, default=0.0)

# Date and time fields
due_date: Mapped[date] = mapped_column(Date, nullable=True)
start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

# JSON fields
metadata: Mapped[dict] = mapped_column(JSONB, default={})

# Enum fields
status: Mapped[str] = mapped_column(
    String(20),
    default="pending",
    nullable=False,
)
```

## Optional Fields

For nullable fields, use `Optional[]` in the type annotation:

```python
from typing import Optional

description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
```

## Relationships

Define relationships using the `relationship()` function with appropriate type annotations:

```python
# One-to-many relationship
from typing import List

# In the parent model
children: Mapped[List["ChildModel"]] = relationship(back_populates="parent")

# In the child model
parent_id: Mapped[int] = mapped_column(ForeignKey("parents.id"))
parent: Mapped["ParentModel"] = relationship(back_populates="children")
```

## Indexes and Constraints

Define indexes and constraints at the class level:

```python
class MyModel(BaseModel):
    __tablename__ = "my_models"
    
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Define unique constraint
    __table_args__ = (
        UniqueConstraint("name", "email", name="uq_name_email"),
    )
```

## Async Usage

When using SQLAlchemy with FastAPI, leverage async operations:

```python
from sqlalchemy.ext.asyncio import AsyncSession

async def get_items(db: AsyncSession):
    result = await db.execute(select(Item))
    return result.scalars().all()

async def create_item(db: AsyncSession, item: ItemCreate):
    db_item = Item(**item.model_dump())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item
```

## Configuration

Use the settings system for database configuration:

```python
from app.core.config import settings

# Database URL from settings
engine = create_async_engine(
    str(settings.DB.DATABASE_URL),
    echo=settings.DB.DB_ECHO,
)
```

## Testing

In tests, use the same `BaseModel` for creating test tables:

```python
from shared_core.base.base_model import BaseModel

# Create tables for testing
BaseModel.metadata.create_all(bind=engine)
```

## Best Practices

1. **Use meaningful names** for models, fields, and relationships
2. **Document complex models** with docstrings
3. **Create indexes** for fields used in filtering and sorting
4. **Use appropriate field lengths** for string fields
5. **Add validation** where needed using SQLAlchemy validators or Pydantic models
6. **Follow the single responsibility principle** by keeping models focused
7. **Use migrations** for database schema changes in production

## Resources

- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [SQLAlchemy 2.0 ORM Quickstart](https://docs.sqlalchemy.org/en/20/orm/quickstart.html)
- [SQLAlchemy 2.0 Type Annotations](https://docs.sqlalchemy.org/en/20/orm/declarative_styles.html#declarative-with-type-annotated-mapped-columns)
