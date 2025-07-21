"""
Application Configuration

Centralized configuration management using Pydantic settings.
Environment-specific configurations with validation.
"""

import os
from functools import lru_cache
from typing import List

from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Database Configuration
    database_url: str
    database_pool_size: int = 20
    database_max_overflow: int = 30
    
    # Redis Configuration
    redis_url: str
    
    # Security Configuration
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    
    # Google APIs
    google_client_id: str = ""
    google_client_secret: str = ""
    google_places_api_key: str = ""
    
    # AWS Configuration
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_s3_bucket: str = ""
    aws_region: str = "us-east-1"
    
    # Application Configuration
    app_name: str = "TravelPlanner"
    debug: bool = False
    environment: str = "production"
    log_level: str = "info"
    
    # CORS Configuration
    allowed_origins: List[str] = ["https://travelplanner.com"]
    
    # Rate Limiting
    default_rate_limit: str = "100/minute"
    
    # External Services
    sentry_dsn: str = ""
    sendgrid_api_key: str = ""
    from_email: str = "noreply@travelplanner.com"
    
    # Feature Flags
    enable_docs: bool = True
    enable_websockets: bool = True
    enable_metrics: bool = True
    
    @validator("allowed_origins", pre=True)
    def assemble_cors_origins(cls, v):
        """Parse comma-separated CORS origins."""
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @validator("debug", pre=True)
    def parse_debug(cls, v):
        """Parse debug flag from string."""
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes", "on")
        return v
    
    @validator("environment")
    def validate_environment(cls, v):
        """Validate environment value."""
        valid_envs = ["development", "staging", "production", "test"]
        if v not in valid_envs:
            raise ValueError(f"Environment must be one of: {valid_envs}")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False


class DevelopmentConfig(Settings):
    """Development environment configuration."""
    debug: bool = True
    log_level: str = "debug"
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    enable_docs: bool = True
    environment: str = "development"


class TestConfig(Settings):
    """Test environment configuration."""
    debug: bool = True
    environment: str = "test"
    database_url: str = "postgresql://postgres:password@localhost:5432/travelplanner_test"
    redis_url: str = "redis://localhost:6379/1"


class ProductionConfig(Settings):
    """Production environment configuration."""
    debug: bool = False
    log_level: str = "warning"
    enable_docs: bool = False
    environment: str = "production"
    database_pool_size: int = 50
    database_max_overflow: int = 100


@lru_cache()
def get_settings() -> Settings:
    """Get application settings based on environment."""
    environment = os.getenv("ENVIRONMENT", "production").lower()
    
    if environment == "development":
        return DevelopmentConfig()
    elif environment == "test":
        return TestConfig()
    elif environment == "staging":
        return Settings(environment="staging")
    else:
        return ProductionConfig()


# Global settings instance
settings = get_settings()