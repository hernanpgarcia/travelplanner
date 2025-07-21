-- Initialize database for development
-- This file is run when the PostgreSQL container starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search extension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create development database if it doesn't exist
-- (This is handled by POSTGRES_DB environment variable)

-- Grant privileges to postgres user
GRANT ALL PRIVILEGES ON DATABASE travelplanner TO postgres;