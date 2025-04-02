from datetime import datetime

from sqlalchemy import DateTime, MetaData, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class BaseModel(DeclarativeBase):
    """
    Base model for all SQLAlchemy models in Dotmac platform services.

    Includes common fields like primary key (id) and timestamps
    (created_at, updated_at) using SQLAlchemy 2.0 syntax.
    """

    # Type annotation for metadata (useful for Alembic)
    metadata: MetaData = MetaData()

    # Primary key using Mapped and mapped_column
    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Timestamps using Mapped and mapped_column
    # Explicitly specify DateTime type in mapped_column
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),  # Use onupdate for subsequent updates
        nullable=False,
    )
