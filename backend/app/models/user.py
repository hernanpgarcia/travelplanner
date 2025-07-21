"""
User Model

User accounts and authentication management.
Supports Google OAuth integration.
"""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel


class User(BaseModel):
    """User account model."""
    
    __tablename__ = "users"
    
    # Google OAuth fields
    google_id: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    
    avatar_url: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Relationships
    owned_trips = relationship(
        "Trip",
        back_populates="owner",
        foreign_keys="Trip.owner_id",
        cascade="all, delete-orphan",
    )
    
    trip_memberships = relationship(
        "TripMember",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    
    votes = relationship(
        "CityVote",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    
    preferences = relationship(
        "UserPreference",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    
    created_invites = relationship(
        "InviteLink",
        back_populates="created_by_user",
        foreign_keys="InviteLink.created_by",
    )
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"