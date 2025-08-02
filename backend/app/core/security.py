"""
Security utilities for authentication and authorization.

Handles JWT token creation, validation, password hashing, and OAuth utilities.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Dictionary containing claims to encode in the token
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string to verify
        
    Returns:
        Decoded token payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def get_google_oauth_url(redirect_uri: str, state: Optional[str] = None) -> str:
    """
    Generate Google OAuth authorization URL.
    
    Args:
        redirect_uri: URL to redirect to after OAuth
        state: Optional state parameter for CSRF protection
        
    Returns:
        Google OAuth authorization URL
    """
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": redirect_uri,
        "scope": "openid email profile",
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent",
    }
    
    if state:
        params["state"] = state
    
    base_url = "https://accounts.google.com/o/oauth2/auth"
    return f"{base_url}?{urlencode(params)}"


async def exchange_code_for_token(code: str, redirect_uri: str) -> Dict[str, Any]:
    """
    Exchange OAuth authorization code for access token.
    
    Args:
        code: Authorization code from OAuth callback
        redirect_uri: Redirect URI used in initial OAuth request
        
    Returns:
        Token response containing access_token, id_token, etc.
        
    Raises:
        HTTPException: If token exchange fails
    """
    token_data = {
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://oauth2.googleapis.com/token",
            data=token_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange code for token"
        )
    
    return response.json()


async def get_google_user_info(access_token: str) -> Dict[str, Any]:
    """
    Get user information from Google using access token.
    
    Args:
        access_token: Google OAuth access token
        
    Returns:
        User information from Google API
        
    Raises:
        HTTPException: If user info request fails
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get user information from Google"
        )
    
    return response.json()


def decode_id_token(id_token: str) -> Dict[str, Any]:
    """
    Decode Google ID token without verification (for development).
    
    Args:
        id_token: Google ID token
        
    Returns:
        Decoded token payload
        
    Note:
        In production, this should verify the token signature
    """
    try:
        # Split the token and decode the payload
        header, payload, signature = id_token.split(".")
        
        # Add padding if needed for base64 decoding
        payload += "=" * (4 - len(payload) % 4)
        
        # Decode base64
        import base64
        decoded_payload = base64.urlsafe_b64decode(payload)
        
        return json.loads(decoded_payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to decode ID token: {str(e)}"
        )