"""
TravelPlanner FastAPI Application - Database Connected Version

Database-connected version of the simplified FastAPI app.
Replaces mock data with PostgreSQL persistence while maintaining simple structure.
"""

import asyncio
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Database imports
from app.core.database import get_db, init_db, close_db
from app.models.base import BaseModel as DBBaseModel
from app.models.city import City
from app.models.trip import Trip


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - setup and cleanup."""
    # Startup
    try:
        await init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        # Continue anyway for now - will show error in health check
    
    yield
    
    # Shutdown
    await close_db()
    print("✅ Database connections closed")


# FastAPI app with lifespan management
app = FastAPI(
    title="TravelPlanner API",
    description="A collaborative travel planning platform with database integration",
    version="1.1.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Response models (same as main_simple.py)
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    database: str

class CityResponse(BaseModel):
    id: str
    name: str
    country: str
    description: str

class TripResponse(BaseModel):
    id: str
    title: str
    description: str
    cities: List[str]

class CreateTripRequest(BaseModel):
    title: str
    description: str


# Health check endpoint with database connectivity test
@app.get("/health", response_model=HealthResponse)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint with database connectivity verification."""
    database_status = "connected"
    
    try:
        # Test database connectivity
        result = await db.execute(select(1))
        result.scalar()
    except Exception as e:
        database_status = f"disconnected: {str(e)[:100]}"
    
    return HealthResponse(
        status="healthy",
        service="travelplanner-api-db",
        version="1.1.0",
        database=database_status
    )


# API root
@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "message": "Welcome to TravelPlanner API (Database Version)",
        "version": "1.1.0",
        "docs": "/docs",
        "health": "/health",
        "database": "enabled"
    }


# Database-connected cities endpoint
@app.get("/api/v1/cities", response_model=List[CityResponse])
async def get_cities(db: AsyncSession = Depends(get_db)):
    """Get cities from database, with fallback to sample data."""
    
    try:
        # Try to get cities from database
        result = await db.execute(
            select(City)
            .order_by(City.name)
            .limit(10)
        )
        db_cities = result.scalars().all()
        
        if db_cities:
            return [
                CityResponse(
                    id=str(city.id),
                    name=city.name,
                    country=city.country,
                    description=city.description or f"Explore {city.name}"
                )
                for city in db_cities
            ]
        
    except Exception as e:
        print(f"Database query failed: {e}")
        # Fall back to sample data if database query fails
        pass
    
    # Sample data for initial setup (same as main_simple.py)
    sample_cities = [
        CityResponse(
            id="sample-paris",
            name="Paris",
            country="France", 
            description="The City of Light"
        ),
        CityResponse(
            id="sample-tokyo",
            name="Tokyo",
            country="Japan",
            description="Modern metropolis meets ancient tradition"
        ),
        CityResponse(
            id="sample-new-york",
            name="New York",
            country="USA",
            description="The city that never sleeps"
        )
    ]
    
    return sample_cities


# Database-connected trips endpoint
@app.get("/api/v1/trips", response_model=List[TripResponse])
async def get_trips(db: AsyncSession = Depends(get_db)):
    """Get trips from database, with fallback to sample data."""
    
    try:
        # Try to get trips from database
        result = await db.execute(
            select(Trip)
            .order_by(Trip.created_at.desc())
            .limit(10)
        )
        db_trips = result.scalars().all()
        
        if db_trips:
            return [
                TripResponse(
                    id=str(trip.id),
                    title=trip.name,
                    description=trip.description or "An amazing travel adventure",
                    cities=[]  # Simplified - no city relationships yet
                )
                for trip in db_trips
            ]
        
    except Exception as e:
        print(f"Database query failed: {e}")
        # Fall back to sample data if database query fails
        pass
    
    # Sample data for initial setup (same as main_simple.py)
    sample_trips = [
        TripResponse(
            id="sample-europe-tour",
            title="European Adventure",
            description="A 2-week tour of Europe's best cities",
            cities=["paris", "rome", "barcelona"]
        ),
        TripResponse(
            id="sample-asia-discovery",
            title="Asia Discovery", 
            description="Explore the wonders of Asia",
            cities=["tokyo", "seoul", "bangkok"]
        )
    ]
    
    return sample_trips


# Database-connected trip creation
@app.post("/api/v1/trips", response_model=TripResponse)
async def create_trip(trip_data: CreateTripRequest, db: AsyncSession = Depends(get_db)):
    """Create a new trip in database."""
    
    try:
        # Create new trip in database
        new_trip = Trip(
            name=trip_data.title,
            description=trip_data.description,
            # owner_id will be None for now (no auth yet)
        )
        
        db.add(new_trip)
        await db.commit()
        await db.refresh(new_trip)
        
        return TripResponse(
            id=str(new_trip.id),
            title=new_trip.name,
            description=new_trip.description or "",
            cities=[]
        )
        
    except Exception as e:
        print(f"Failed to create trip in database: {e}")
        await db.rollback()
        
        # Return error response
        raise HTTPException(
            status_code=500,
            detail="Failed to create trip. Please try again."
        )


# Seed database with sample data endpoint
@app.post("/api/v1/seed")
async def seed_database(db: AsyncSession = Depends(get_db)):
    """Seed database with sample cities and trips."""
    
    try:
        # Add sample cities
        sample_cities = [
            City(
                name="Paris",
                country="France",
                description="The City of Light",
                google_place_id="ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
            ),
            City(
                name="Tokyo", 
                country="Japan",
                description="Modern metropolis meets ancient tradition",
                google_place_id="ChIJ51cu8IcbXWARiRtXIothAS4"
            ),
            City(
                name="New York",
                country="United States",
                description="The city that never sleeps", 
                google_place_id="ChIJOwg_06VPwokRYv534QaPC8g"
            )
        ]
        
        for city in sample_cities:
            db.add(city)
        
        # Add sample trips  
        sample_trips = [
            Trip(name="European Adventure", description="A 2-week tour of Europe's best cities"),
            Trip(name="Asia Discovery", description="Explore the wonders of Asia")
        ]
        
        for trip in sample_trips:
            db.add(trip)
            
        await db.commit()
        
        return {"message": "Database seeded successfully with sample data"}
        
    except Exception as e:
        await db.rollback()
        print(f"Failed to seed database: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to seed database: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)