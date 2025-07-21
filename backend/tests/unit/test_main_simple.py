"""
Unit tests for main_simple.py - Simplified FastAPI application.

Tests the core endpoints of the simplified FastAPI app currently deployed to Render.
"""

import pytest
from fastapi.testclient import TestClient
from app.main_simple import app

# Create test client
client = TestClient(app)


class TestHealthEndpoints:
    """Test health check and root endpoints."""

    def test_health_check(self):
        """Test health check endpoint returns correct status."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "travelplanner-api"
        assert data["version"] == "1.0.0"

    def test_root_endpoint(self):
        """Test root endpoint returns welcome message and links."""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Welcome to TravelPlanner API"
        assert data["version"] == "1.0.0"
        assert data["docs"] == "/docs"
        assert data["health"] == "/health"


class TestCitiesEndpoint:
    """Test cities API endpoint."""

    def test_get_cities(self):
        """Test cities endpoint returns mock cities data."""
        response = client.get("/api/v1/cities")
        
        assert response.status_code == 200
        cities = response.json()
        assert len(cities) == 3
        
        # Check first city (Paris)
        paris = cities[0]
        assert paris["id"] == "paris"
        assert paris["name"] == "Paris"
        assert paris["country"] == "France"
        assert paris["description"] == "The City of Light"
        
        # Check all cities have required fields
        for city in cities:
            assert "id" in city
            assert "name" in city
            assert "country" in city
            assert "description" in city

    def test_cities_response_structure(self):
        """Test cities response follows CityResponse model."""
        response = client.get("/api/v1/cities")
        
        assert response.status_code == 200
        cities = response.json()
        
        expected_cities = ["paris", "tokyo", "new-york"]
        actual_city_ids = [city["id"] for city in cities]
        
        assert actual_city_ids == expected_cities


class TestTripsEndpoints:
    """Test trips API endpoints."""

    def test_get_trips(self):
        """Test trips endpoint returns mock trips data."""
        response = client.get("/api/v1/trips")
        
        assert response.status_code == 200
        trips = response.json()
        assert len(trips) == 2
        
        # Check first trip (European Adventure)
        europe_trip = trips[0]
        assert europe_trip["id"] == "europe-tour"
        assert europe_trip["title"] == "European Adventure"
        assert europe_trip["description"] == "A 2-week tour of Europe's best cities"
        assert europe_trip["cities"] == ["paris", "rome", "barcelona"]
        
        # Check all trips have required fields
        for trip in trips:
            assert "id" in trip
            assert "title" in trip
            assert "description" in trip
            assert "cities" in trip
            assert isinstance(trip["cities"], list)

    def test_create_trip(self):
        """Test trip creation endpoint."""
        trip_data = {
            "id": "test-trip",
            "title": "Test Trip",
            "description": "A test trip for unit testing",
            "cities": ["paris", "tokyo"]
        }
        
        response = client.post("/api/v1/trips", json=trip_data)
        
        assert response.status_code == 200
        created_trip = response.json()
        
        # Mock endpoint just returns the same data
        assert created_trip["id"] == trip_data["id"]
        assert created_trip["title"] == trip_data["title"]
        assert created_trip["description"] == trip_data["description"]
        assert created_trip["cities"] == trip_data["cities"]

    def test_create_trip_invalid_data(self):
        """Test trip creation with invalid data."""
        invalid_trip_data = {
            "title": "Missing Required Fields"
            # Missing id, description, and cities
        }
        
        response = client.post("/api/v1/trips", json=invalid_trip_data)
        
        # Should return validation error
        assert response.status_code == 422


class TestAPIDocumentation:
    """Test API documentation endpoints."""

    def test_openapi_docs_accessible(self):
        """Test that OpenAPI documentation is accessible."""
        response = client.get("/docs")
        
        # FastAPI serves HTML for /docs endpoint
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")

    def test_openapi_json_accessible(self):
        """Test that OpenAPI JSON schema is accessible."""
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        schema = response.json()
        assert schema["info"]["title"] == "TravelPlanner API"
        assert schema["info"]["version"] == "1.0.0"
        assert schema["info"]["description"] == "A collaborative travel planning platform"


class TestCORSConfiguration:
    """Test CORS middleware configuration."""

    def test_cors_headers_present(self):
        """Test that CORS headers are present in cross-origin requests."""
        response = client.get("/health", headers={
            "Origin": "http://localhost:3000"
        })
        
        assert response.status_code == 200
        # CORS headers should be present for cross-origin requests
        assert "access-control-allow-origin" in response.headers

    def test_preflight_request(self):
        """Test CORS preflight request handling."""
        response = client.options("/api/v1/cities", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET"
        })
        
        # Should handle preflight request
        assert response.status_code == 200