"""
Authentication API Tests

Tests for Google OAuth integration and authentication endpoints.
"""

import pytest
from httpx import AsyncClient
from unittest.mock import patch, MagicMock

from app.main_simple import app


@pytest.mark.asyncio
async def test_google_auth_url_endpoint():
    """Test getting Google OAuth URL."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Mock environment variable
        with patch.dict('os.environ', {'GOOGLE_CLIENT_ID': 'test-client-id'}):
            response = await client.get("/api/v1/auth/google/url")
            
            assert response.status_code == 200
            data = response.json()
            assert "url" in data
            assert "accounts.google.com" in data["url"]
            assert "test-client-id" in data["url"]


@pytest.mark.asyncio
async def test_google_auth_url_missing_config():
    """Test Google OAuth URL endpoint when client ID is missing."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Clear environment variable
        with patch.dict('os.environ', {}, clear=True):
            response = await client.get("/api/v1/auth/google/url")
            
            assert response.status_code == 500
            assert "Google Client ID not configured" in response.json()["detail"]


@pytest.mark.asyncio
async def test_google_callback_missing_code():
    """Test Google callback with missing authorization code."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/google",
            json={"code": "", "state": "test-state"}
        )
        
        assert response.status_code == 400
        assert "Authorization code required" in response.json()["detail"]


@pytest.mark.asyncio
async def test_google_callback_missing_credentials():
    """Test Google callback when OAuth credentials are not configured."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        with patch.dict('os.environ', {}, clear=True):
            response = await client.post(
                "/api/v1/auth/google",
                json={"code": "test-code", "state": "test-state"}
            )
            
            assert response.status_code == 500
            assert "Google OAuth not configured" in response.json()["detail"]


@pytest.mark.asyncio
async def test_google_callback_success():
    """Test successful Google OAuth callback flow."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Mock environment variables
        with patch.dict('os.environ', {
            'GOOGLE_CLIENT_ID': 'test-client-id',
            'GOOGLE_CLIENT_SECRET': 'test-client-secret'
        }):
            # Mock urllib responses
            mock_token_response = {
                "access_token": "test-access-token",
                "token_type": "Bearer",
                "expires_in": 3600
            }
            
            mock_user_response = {
                "id": "123456",
                "email": "test@example.com",
                "name": "Test User",
                "picture": "https://example.com/avatar.jpg"
            }
            
            # Mock the urllib requests
            with patch('urllib.request.urlopen') as mock_urlopen:
                # Configure the mock to return different responses
                mock_responses = [
                    MagicMock(read=lambda: json.dumps(mock_token_response).encode()),
                    MagicMock(read=lambda: json.dumps(mock_user_response).encode())
                ]
                mock_urlopen.return_value.__enter__.side_effect = mock_responses
                
                response = await client.post(
                    "/api/v1/auth/google",
                    json={"code": "test-auth-code", "state": "test-state"}
                )
                
                assert response.status_code == 200
                data = response.json()
                
                # Verify response structure
                assert "access_token" in data
                assert data["token_type"] == "bearer"
                assert "user" in data
                
                # Verify user data
                user = data["user"]
                assert user["id"] == "123456"
                assert user["email"] == "test@example.com"
                assert user["name"] == "Test User"
                assert user["avatar_url"] == "https://example.com/avatar.jpg"


@pytest.mark.asyncio
async def test_get_current_user():
    """Test getting current user information."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/auth/me")
        
        assert response.status_code == 200
        data = response.json()
        
        # Since this is mock data for now
        assert "id" in data
        assert "email" in data
        assert "name" in data
        assert data["email"] == "user@example.com"


@pytest.mark.asyncio
async def test_logout():
    """Test logout endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/logout")
        
        assert response.status_code == 200
        assert response.json()["message"] == "Successfully logged out"


@pytest.mark.asyncio
async def test_backend_oauth_callback_redirect():
    """Test backend OAuth callback redirect to frontend."""
    async with AsyncClient(app=app, base_url="http://test", follow_redirects=False) as client:
        # Test with missing code
        response = await client.get("/api/v1/auth/callback")
        assert response.status_code == 307
        assert "error=no_code" in response.headers["location"]
        
        # Test with code but missing config
        with patch.dict('os.environ', {}, clear=True):
            response = await client.get("/api/v1/auth/callback?code=test-code")
            assert response.status_code == 307
            assert "error=config" in response.headers["location"]


if __name__ == "__main__":
    # For running tests directly
    import asyncio
    import json
    
    # Run a simple test
    async def run_test():
        async with AsyncClient(app=app, base_url="http://test") as client:
            print("Testing Google Auth URL endpoint...")
            with patch.dict('os.environ', {'GOOGLE_CLIENT_ID': 'test-client-id'}):
                response = await client.get("/api/v1/auth/google/url")
                print(f"Status: {response.status_code}")
                print(f"Response: {response.json()}")
    
    asyncio.run(run_test())