"""
Database Configuration

SQLAlchemy async engine and session management.
Database initialization and connection handling.
"""

from typing import AsyncGenerator

import structlog
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.pool import NullPool

from app.core.config import get_settings

logger = structlog.get_logger()
settings = get_settings()

# Database URL with async driver
if settings.database_url.startswith("postgresql://"):
    database_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")
else:
    database_url = settings.database_url

# Create async engine
engine = create_async_engine(
    database_url,
    pool_size=settings.database_pool_size,
    max_overflow=settings.database_max_overflow,
    pool_pre_ping=True,
    pool_recycle=3600,  # Recycle connections every hour
    # Use NullPool for testing to avoid connection issues
    poolclass=NullPool if settings.environment == "test" else None,
    echo=settings.debug,  # Log SQL queries in debug mode
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Create base model class
metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)

Base = declarative_base(metadata=metadata)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get database session.
    
    Yields:
        AsyncSession: Database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error("Database session error", error=str(e))
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables."""
    try:
        # Import all models to ensure they're registered
        from app.models import user, trip, voting  # noqa: F401
        
        async with engine.begin() as conn:
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
            
        logger.info("Database initialized successfully")
        
    except Exception as e:
        logger.error("Failed to initialize database", error=str(e))
        raise


async def close_db() -> None:
    """Close database connections."""
    await engine.dispose()
    logger.info("Database connections closed")