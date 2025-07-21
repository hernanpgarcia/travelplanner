"""
TravelPlanner FastAPI Application - Simplified Version

Minimal working FastAPI app for reliable deployment.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Simple FastAPI app
app = FastAPI(
    title="TravelPlanner API",
    description="A collaborative travel planning platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple response models
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

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

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for deployment verification."""
    return HealthResponse(
        status="healthy",
        service="travelplanner-api",
        version="1.0.0"
    )

# API root
@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "message": "Welcome to TravelPlanner API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Simple cities endpoint
@app.get("/api/v1/cities", response_model=List[CityResponse])
async def get_cities():
    """Get popular cities for travel planning."""
    # Mock data - replace with database later
    mock_cities = [
        CityResponse(
            id="paris",
            name="Paris",
            country="France", 
            description="The City of Light"
        ),
        CityResponse(
            id="tokyo",
            name="Tokyo",
            country="Japan",
            description="Modern metropolis meets ancient tradition"
        ),
        CityResponse(
            id="new-york",
            name="New York",
            country="USA",
            description="The city that never sleeps"
        )
    ]
    return mock_cities

# Simple trips endpoint
@app.get("/api/v1/trips", response_model=List[TripResponse])
async def get_trips():
    """Get sample trips."""
    # Mock data - replace with database later
    mock_trips = [
        TripResponse(
            id="europe-tour",
            title="European Adventure",
            description="A 2-week tour of Europe's best cities",
            cities=["paris", "rome", "barcelona"]
        ),
        TripResponse(
            id="asia-discovery",
            title="Asia Discovery", 
            description="Explore the wonders of Asia",
            cities=["tokyo", "seoul", "bangkok"]
        )
    ]
    return mock_trips

# Simple trip creation
@app.post("/api/v1/trips", response_model=TripResponse)
async def create_trip(trip: TripResponse):
    """Create a new trip."""
    # Mock creation - replace with database later
    return trip

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)