"""
Authentication API Routes

Handles user authentication, registration, and session management.
"""

from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    verify_token,
    get_google_oauth_url,
    exchange_code_for_token,
    get_google_user_info,
    decode_id_token,
)
from app.models.user import User
from app.schemas.auth import (
    TokenResponse,
    UserResponse,
    GoogleOAuthRequest,
    GoogleOAuthResponse,
)

router = APIRouter()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token."""
    token = credentials.credentials
    payload = verify_token(token)
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user information."""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
    )


@router.get("/google/url")
async def get_google_oauth_url_endpoint(request: Request):
    """Get Google OAuth authorization URL."""
    # Build redirect URI
    base_url = str(request.url_for("google_oauth_callback"))
    redirect_uri = base_url.replace("http://", "https://") if request.url.scheme == "https" else base_url
    
    # Generate OAuth URL
    oauth_url = get_google_oauth_url(redirect_uri)
    
    return {"url": oauth_url}


@router.post("/google", response_model=TokenResponse)
async def google_oauth_callback(
    oauth_request: GoogleOAuthRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle Google OAuth callback and authenticate user."""
    try:
        # Build redirect URI
        base_url = str(request.url_for("google_oauth_callback"))
        redirect_uri = base_url.replace("http://", "https://") if request.url.scheme == "https" else base_url
        
        # Exchange code for tokens
        token_response = await exchange_code_for_token(oauth_request.code, redirect_uri)
        
        # Get user info from Google
        if "access_token" in token_response:
            user_info = await get_google_user_info(token_response["access_token"])
        elif "id_token" in token_response:
            user_info = decode_id_token(token_response["id_token"])
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid token received from Google"
            )
        
        # Find or create user
        google_id = user_info.get("id")
        email = user_info.get("email")
        name = user_info.get("name")
        avatar_url = user_info.get("picture")
        
        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required user information from Google"
            )
        
        # Check if user exists
        stmt = select(User).where(User.google_id == google_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if user is None:
            # Create new user
            user = User(
                google_id=google_id,
                email=email,
                name=name,
                avatar_url=avatar_url,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        else:
            # Update existing user info
            user.email = email
            user.name = name
            user.avatar_url = avatar_url
            await db.commit()
        
        # Create JWT token
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                name=user.name,
                avatar_url=user.avatar_url,
            )
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authentication failed: {str(e)}"
        )


@router.post("/logout")
async def logout():
    """Logout current user."""
    # JWT tokens are stateless, so logout is handled client-side
    # by removing the token from storage
    return {"message": "Logout successful"}


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    current_user: User = Depends(get_current_user)
):
    """Refresh access token for current user."""
    access_token = create_access_token(
        data={"sub": str(current_user.id), "email": current_user.email}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            name=current_user.name,
            avatar_url=current_user.avatar_url,
        )
    )