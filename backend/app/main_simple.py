"""
TravelPlanner FastAPI Application - Simplified Version

Minimal working FastAPI app for reliable deployment.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List
import os
import json
import urllib.request
import urllib.parse
import urllib.error

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

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

# Auth models
class GoogleAuthUrlResponse(BaseModel):
    url: str

class GoogleOAuthRequest(BaseModel):
    code: str
    state: str = None

class User(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: str = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

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

# Auth endpoints - Mock implementation for testing
@app.get("/api/v1/auth/google/url", response_model=GoogleAuthUrlResponse)
async def get_google_auth_url():
    """Get Google OAuth authorization URL."""
    # Use real Google OAuth configuration
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="Google Client ID not configured")
    
    # Use frontend callback handler - configurable for different environments
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    redirect_uri = f"{frontend_url}/auth/callback"
    scope = "openid email profile"
    state = "mock-state"
    
    url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&response_type=code&state={state}"
    
    return GoogleAuthUrlResponse(url=url)

@app.post("/api/v1/auth/google", response_model=TokenResponse)
async def handle_google_callback(request: GoogleOAuthRequest):
    """Handle Google OAuth callback."""
    print(f"🔵 Received auth callback with code: {request.code[:20]}...")
    
    if not request.code:
        raise HTTPException(status_code=400, detail="Authorization code required")
    
    # Get Google credentials from environment
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    
    print(f"🔵 Using client_id: {client_id[:20]}...")
    
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    # Exchange authorization code for access token
    token_url = "https://oauth2.googleapis.com/token"
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    token_data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": request.code,
        "grant_type": "authorization_code",
        "redirect_uri": f"{frontend_url}/auth/callback",
    }
    
    try:
        print("🔵 Exchanging code for access token...")
        
        # Get access token from Google
        token_data_encoded = urllib.parse.urlencode(token_data).encode('utf-8')
        token_request = urllib.request.Request(token_url, data=token_data_encoded, method='POST')
        token_request.add_header('Content-Type', 'application/x-www-form-urlencoded')
        
        with urllib.request.urlopen(token_request) as response:
            token_json = json.loads(response.read().decode('utf-8'))
        
        print(f"🔵 Token response keys: {list(token_json.keys())}")
        
        access_token = token_json.get("access_token")
        if not access_token:
            print(f"🔴 No access token in response: {token_json}")
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        print("🔵 Getting user info from Google...")
        
        # Get user info from Google
        user_info_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
        user_request = urllib.request.Request(user_info_url)
        
        with urllib.request.urlopen(user_request) as response:
            user_json = json.loads(response.read().decode('utf-8'))
        
        print(f"🔵 User info: {user_json.get('email')}")
        
        # Create user object
        user = User(
            id=user_json.get("id"),
            email=user_json.get("email"),
            name=user_json.get("name"),
            avatar_url=user_json.get("picture")
        )
        
        print(f"🟢 Auth successful for user: {user.email}")
        
        # For now, we'll use the Google access token as our app token
        # In production, you'd generate your own JWT here
        response = TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user
        )
        
        return response
        
    except urllib.error.HTTPError as e:
        error_details = e.read().decode('utf-8') if e.fp else str(e)
        raise HTTPException(status_code=400, detail=f"Google OAuth error: {error_details}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

@app.get("/api/v1/auth/me", response_model=User)
async def get_current_user():
    """Get current user information."""
    # For now, return mock data since we're not storing user sessions
    # In production, you'd validate the JWT token here
    return User(
        id="mock-user-123",
        email="user@example.com",
        name="Test User", 
        avatar_url="https://via.placeholder.com/150"
    )

@app.post("/api/v1/auth/logout")
async def logout():
    """Logout user."""
    return {"message": "Successfully logged out"}

# Backend OAuth callback handler that redirects
@app.get("/api/v1/auth/callback")
async def handle_oauth_callback(code: str, state: str = None):
    """Handle OAuth callback on backend and redirect to frontend."""
    if not code:
        return RedirectResponse(url="http://localhost:3000/?error=no_code")
    
    try:
        # Get Google credentials
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        
        if not client_id or not client_secret:
            return RedirectResponse(url="http://localhost:3000/?error=config")
        
        # Exchange code for token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:8000/api/v1/auth/callback",
        }
        
        print(f"🔵 Backend callback processing code: {code[:20]}...")
        
        # Get access token from Google
        token_data_encoded = urllib.parse.urlencode(token_data).encode('utf-8')
        token_request = urllib.request.Request(token_url, data=token_data_encoded, method='POST')
        token_request.add_header('Content-Type', 'application/x-www-form-urlencoded')
        
        with urllib.request.urlopen(token_request) as response:
            token_json = json.loads(response.read().decode('utf-8'))
        
        access_token = token_json.get("access_token")
        if not access_token:
            return RedirectResponse(url="http://localhost:3000/?error=no_token")
        
        # Get user info
        user_info_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
        user_request = urllib.request.Request(user_info_url)
        
        with urllib.request.urlopen(user_request) as response:
            user_json = json.loads(response.read().decode('utf-8'))
        
        print(f"🟢 Auth successful for: {user_json.get('email')}")
        
        # Create a simple session token
        session_data = {
            "token": access_token,
            "user": {
                "id": user_json.get("id"),
                "email": user_json.get("email"),
                "name": user_json.get("name"),
                "avatar_url": user_json.get("picture")
            }
        }
        
        # Encode session data for URL
        session_encoded = urllib.parse.quote(json.dumps(session_data))
        
        # Redirect to frontend with session data
        return RedirectResponse(
            url=f"http://localhost:3000/auth-success?session={session_encoded}",
            status_code=302
        )
        
    except Exception as e:
        print(f"🔴 Backend callback error: {str(e)}")
        return RedirectResponse(url=f"http://localhost:3000/?error={str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)