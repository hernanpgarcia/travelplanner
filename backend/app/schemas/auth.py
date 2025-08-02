"""
Authentication Schemas

Pydantic models for authentication requests and responses.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr


class GoogleOAuthRequest(BaseModel):
    """Request model for Google OAuth callback."""
    code: str
    state: Optional[str] = None


class GoogleOAuthResponse(BaseModel):
    """Response model for Google OAuth URL."""
    url: str


class UserResponse(BaseModel):
    """User information response model."""
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT token response model."""
    access_token: str
    token_type: str
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Request model for token refresh."""
    refresh_token: str


class LoginRequest(BaseModel):
    """Login request model."""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Registration request model."""
    email: EmailStr
    password: str
    name: str
    
    
class ChangePasswordRequest(BaseModel):
    """Change password request model."""
    current_password: str
    new_password: str