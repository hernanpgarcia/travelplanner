"""
TravelPlanner FastAPI Application

Main application entry point with middleware, exception handlers,
and route registration.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.v1 import auth, trips, cities, voting
from app.core.config import get_settings
from app.core.database import engine, init_db
from app.core.exceptions import TravelPlannerError
from app.core.middleware import LoggingMiddleware, MetricsMiddleware

# Configure structured logging
logger = structlog.get_logger()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Settings
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan events."""
    # Startup
    logger.info("Starting TravelPlanner API", version="1.0.0")
    
    # Initialize database
    await init_db()
    
    logger.info("TravelPlanner API started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down TravelPlanner API")
    await engine.dispose()
    logger.info("TravelPlanner API shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="TravelPlanner API",
    description="Collaborative travel planning platform API",
    version="1.0.0",
    contact={
        "name": "TravelPlanner Team",
        "email": "engineering@travelplanner.com",
    },
    license_info={
        "name": "Private",
    },
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan,
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Add custom middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(MetricsMiddleware)


# Exception handlers
@app.exception_handler(TravelPlannerError)
async def travel_planner_exception_handler(
    request: Request, exc: TravelPlannerError
) -> JSONResponse:
    """Handle custom application exceptions."""
    logger.error(
        "Application error",
        error=exc.message,
        error_code=exc.error_code,
        path=request.url.path,
        method=request.method,
    )
    
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": {
                "message": exc.message,
                "code": exc.error_code,
                "type": type(exc).__name__,
            },
        },
    )


@app.exception_handler(500)
async def internal_server_error_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Handle internal server errors."""
    logger.error(
        "Internal server error",
        error=str(exc),
        path=request.url.path,
        method=request.method,
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": "Internal server error",
                "code": "INTERNAL_ERROR",
                "type": "InternalServerError",
            },
        },
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "travelplanner-api",
        "version": "1.0.0",
        "environment": settings.environment,
    }


# Include API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(trips.router, prefix="/api/v1/trips", tags=["Trips"])
app.include_router(cities.router, prefix="/api/v1/cities", tags=["Cities"])
app.include_router(voting.router, prefix="/api/v1/voting", tags=["Voting"])


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "TravelPlanner API",
        "version": "1.0.0",
        "docs": "/docs" if settings.debug else "Documentation disabled in production",
        "health": "/health",
    }