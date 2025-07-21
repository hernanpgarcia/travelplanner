"""
City Discovery API Routes

Handles city search, management, and Google Places integration.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/search")
async def search_cities(q: str):
    """Search for cities using Google Places API."""
    # TODO: Implement city search
    return {"message": f"City search endpoint - TODO: {q}"}


@router.post("/")
async def add_city_to_trip():
    """Add a city to trip consideration list."""
    # TODO: Implement city addition
    return {"message": "Add city endpoint - TODO"}


@router.delete("/{city_id}")
async def remove_city_from_trip(city_id: str):
    """Remove a city from trip consideration."""
    # TODO: Implement city removal
    return {"message": f"Remove city endpoint - TODO: {city_id}"}