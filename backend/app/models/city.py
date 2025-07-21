"""
City Models

City management and Google Places integration.
"""

from enum import Enum

from sqlalchemy import String, Text, Numeric, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel


class CityStatus(str, Enum):
    """City consideration status."""
    CONSIDERING = "considering"
    DECIDED = "decided"
    REJECTED = "rejected"


class City(BaseModel):
    """City information cached from Google Places."""
    
    __tablename__ = "cities"
    
    google_place_id: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    
    country: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    
    formatted_address: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )
    
    latitude: Mapped[float] = mapped_column(
        Numeric(10, 8),
        nullable=True,
    )
    
    longitude: Mapped[float] = mapped_column(
        Numeric(11, 8),
        nullable=True,
    )
    
    photo_url: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )
    
    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Relationships
    trip_cities = relationship(
        "TripCity",
        back_populates="city",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        return f"<City(id={self.id}, name={self.name}, country={self.country})>"


class TripCity(BaseModel):
    """Cities being considered for a trip."""
    
    __tablename__ = "trip_cities"
    
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
    
    added_by: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    
    status: Mapped[CityStatus] = mapped_column(
        String(50),
        default=CityStatus.CONSIDERING,
        nullable=False,
        index=True,
    )
    
    position_in_itinerary: Mapped[int] = mapped_column(
        Integer,
        nullable=True,  # Only set for decided cities
    )
    
    duration_days: Mapped[int] = mapped_column(
        Integer,
        nullable=True,  # Only set for decided cities
    )
    
    decided_at: Mapped[str] = mapped_column(
        nullable=True,  # Timestamp when status changed to decided/rejected
    )
    
    # Relationships
    trip = relationship("Trip", back_populates="cities")
    city = relationship("City", back_populates="trip_cities")
    added_by_user = relationship("User", foreign_keys=[added_by])
    votes = relationship(
        "CityVote",
        back_populates="trip_city",
        cascade="all, delete-orphan",
    )
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("trip_id", "city_id", name="uq_trip_city"),
    )
    
    def __repr__(self) -> str:
        return f"<TripCity(trip_id={self.trip_id}, city_id={self.city_id}, status={self.status})>"