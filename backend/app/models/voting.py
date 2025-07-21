"""
Voting System Models

Collaborative voting on travel destinations.
"""

from enum import Enum

from sqlalchemy import String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel


class VoteType(str, Enum):
    """Vote type enumeration."""
    LIKE = "like"
    DONT_MIND = "dont_mind"
    DISLIKE = "dislike"


class CityVote(BaseModel):
    """User votes on cities for trips."""
    
    __tablename__ = "city_votes"
    
    trip_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("trips.id"),
        nullable=False,
    )
    
    city_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cities.id"),
        nullable=False,
    )
    
    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    
    vote_type: Mapped[VoteType] = mapped_column(
        String(20),
        nullable=False,
    )
    
    comment: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Relationships
    trip = relationship("Trip", back_populates="votes")
    city = relationship("City")
    user = relationship("User", back_populates="votes")
    trip_city = relationship(
        "TripCity",
        back_populates="votes",
        primaryjoin="and_(CityVote.trip_id == TripCity.trip_id, CityVote.city_id == TripCity.city_id)",
        foreign_keys=[trip_id, city_id],
        viewonly=True,
    )
    
    # Constraints - one vote per user per city per trip
    __table_args__ = (
        UniqueConstraint("trip_id", "city_id", "user_id", name="uq_city_vote"),
    )
    
    def __repr__(self) -> str:
        return f"<CityVote(trip_id={self.trip_id}, city_id={self.city_id}, user_id={self.user_id}, vote={self.vote_type})>"