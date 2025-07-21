"""
Base Model

Common fields and functionality for all database models.
Includes automatic timestamps, soft deletes, and audit trails.
"""

import uuid
from datetime import datetime
from typing import Any, Dict

from sqlalchemy import Column, DateTime, String, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TimestampMixin:
    """Mixin for automatic timestamp management."""
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class SoftDeleteMixin:
    """Mixin for soft delete functionality."""
    
    deleted_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True,
        index=True,
    )
    
    def soft_delete(self) -> None:
        """Mark record as deleted."""
        self.deleted_at = datetime.utcnow()
    
    def restore(self) -> None:
        """Restore soft deleted record."""
        self.deleted_at = None
    
    @property
    def is_deleted(self) -> bool:
        """Check if record is soft deleted."""
        return self.deleted_at is not None


class OptimisticLockMixin:
    """Mixin for optimistic locking with version control."""
    
    version: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )


class BaseModel(Base, TimestampMixin, SoftDeleteMixin, OptimisticLockMixin):
    """
    Base model class with common functionality.
    
    Includes:
    - UUID primary key
    - Automatic timestamps
    - Soft delete capability
    - Optimistic locking
    - Audit trail support
    """
    
    __abstract__ = True
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model instance to dictionary."""
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
            if not column.name.startswith('_')
        }
    
    def update_from_dict(self, data: Dict[str, Any]) -> None:
        """Update model instance from dictionary."""
        for key, value in data.items():
            if hasattr(self, key) and not key.startswith('_'):
                setattr(self, key, value)
    
    def __repr__(self) -> str:
        """String representation of model."""
        return f"<{self.__class__.__name__}(id={self.id})>"