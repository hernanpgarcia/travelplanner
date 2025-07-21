"""
Trip Models

Trip management, membership, and collaboration features.
"""

from datetime import date, datetime
from enum import Enum

from sqlalchemy import String, Text, Date, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel


class TripStatus(str, Enum):
    """Trip status enumeration."""
    PLANNING = "planning"
    DECIDED = "decided"
    ARCHIVED = "archived"


class TripRole(str, Enum):
    """Trip member role enumeration."""
    OWNER = "owner"
    MEMBER = "member"


class Trip(BaseModel):
    """Trip planning session model."""
    
    __tablename__ = "trips"
    
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    
    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )
    
    owner_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    estimated_start_date: Mapped[date] = mapped_column(
        Date,
        nullable=True,
    )
    
    estimated_end_date: Mapped[date] = mapped_column(
        Date,
        nullable=True,
    )
    
    status: Mapped[TripStatus] = mapped_column(
        String(50),
        default=TripStatus.PLANNING,
        nullable=False,
        index=True,
    )
    
    # Relationships
    owner = relationship(
        "User",
        back_populates="owned_trips",
        foreign_keys=[owner_id],
    )
    
    members = relationship(
        "TripMember",
        back_populates="trip",
        cascade="all, delete-orphan",
    )
    
    cities = relationship(
        "TripCity",
        back_populates="trip",
        cascade="all, delete-orphan",
    )
    
    votes = relationship(
        "CityVote",
        back_populates="trip",
        cascade="all, delete-orphan",
    )
    
    invite_links = relationship(
        "InviteLink",
        back_populates="trip",
        cascade="all, delete-orphan",
    )
    
    preferences = relationship(
        "UserPreference",
        back_populates="trip",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        return f"<Trip(id={self.id}, name={self.name}, status={self.status})>"


class TripMember(BaseModel):
    """Trip membership model."""
    
    __tablename__ = "trip_members"
    
    trip_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("trips.id"),
        nullable=False,
    )
    
    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    
    role: Mapped[TripRole] = mapped_column(
        String(50),
        default=TripRole.MEMBER,
        nullable=False,
    )
    
    joined_at: Mapped[datetime] = mapped_column(
        nullable=False,
        default=datetime.utcnow,
    )
    
    # Relationships
    trip = relationship("Trip", back_populates="members")
    user = relationship("User", back_populates="trip_memberships")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("trip_id", "user_id", name="uq_trip_member"),
    )
    
    def __repr__(self) -> str:
        return f"<TripMember(trip_id={self.trip_id}, user_id={self.user_id}, role={self.role})>"


class InviteLink(BaseModel):
    """Trip invitation link model."""
    
    __tablename__ = "invite_links"
    
    trip_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("trips.id"),
        nullable=False,
    )
    
    token: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    
    created_by: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    
    expires_at: Mapped[datetime] = mapped_column(
        nullable=True,
    )
    
    # Relationships
    trip = relationship("Trip", back_populates="invite_links")
    created_by_user = relationship(
        "User",
        back_populates="created_invites",
        foreign_keys=[created_by],
    )
    
    @property
    def is_expired(self) -> bool:
        """Check if invite link is expired."""
        if self.expires_at is None:
            return False
        return datetime.utcnow() > self.expires_at
    
    def __repr__(self) -> str:
        return f"<InviteLink(id={self.id}, trip_id={self.trip_id}, token={self.token[:8]}...)>"


class UserPreference(BaseModel):
    """User preferences per trip model."""
    
    __tablename__ = "user_preferences"
    
    trip_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("trips.id"),
        nullable=False,
    )
    
    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    
    budget_range: Mapped[str] = mapped_column(
        String(50),
        nullable=True,  # low, medium, high
    )
    
    climate_preference: Mapped[str] = mapped_column(
        Text,  # JSON string: ["hot", "temperate", "cold"]
        nullable=True,
    )
    
    activity_preferences: Mapped[str] = mapped_column(
        Text,  # JSON string: ["beach", "culture", "adventure", "nightlife"]
        nullable=True,
    )
    
    accommodation_type: Mapped[str] = mapped_column(
        Text,  # JSON string: ["hotel", "airbnb", "hostel", "any"]
        nullable=True,
    )
    
    # Relationships
    trip = relationship("Trip", back_populates="preferences")
    user = relationship("User", back_populates="preferences")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("trip_id", "user_id", name="uq_user_preference"),
    )
    
    def __repr__(self) -> str:
        return f"<UserPreference(trip_id={self.trip_id}, user_id={self.user_id})>"