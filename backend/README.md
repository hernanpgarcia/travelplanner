# TravelPlanner Backend

FastAPI backend service for collaborative travel planning.

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# From project root
docker-compose up backend postgres redis
```

### Local Development

```bash
# Install dependencies
poetry install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
poetry run alembic upgrade head

# Start development server
poetry run uvicorn app.main:app --reload --port 8000
```

## 📋 API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## 🧪 Testing

```bash
# Run all tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app --cov-report=html

# Run specific test file
poetry run pytest tests/unit/test_trip_service.py

# Run integration tests
poetry run pytest tests/integration/
```

## 🔧 Code Quality

```bash
# Format code
poetry run black .
poetry run isort .

# Lint code
poetry run flake8 .

# Type checking
poetry run mypy app/
```

## 📊 Database

### Migrations

```bash
# Create new migration
poetry run alembic revision --autogenerate -m "Add new table"

# Apply migrations
poetry run alembic upgrade head

# View migration history
poetry run alembic history

# Rollback migration
poetry run alembic downgrade -1
```

### Database Schema

See [Database Documentation](../docs/DATABASE.md) for complete schema details.

## 🔐 Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# Security  
SECRET_KEY=your-secret-key
ALGORITHM=HS256

# Google APIs
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PLACES_API_KEY=your-places-api-key

# Application
ENVIRONMENT=development
DEBUG=true
```

## 🏗️ Architecture

```
app/
├── core/              # Core utilities and configuration
├── models/            # SQLAlchemy database models
├── schemas/           # Pydantic request/response schemas  
├── services/          # Business logic layer
├── repositories/      # Data access layer
├── api/              # API route definitions
├── external/         # External service integrations
└── utils/            # Shared utilities
```

### Key Patterns

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Dependency Injection**: Loose coupling
- **Clean Architecture**: Domain-driven design

## 📚 Additional Resources

- [Development Guide](../docs/DEVELOPMENT.md)
- [API Documentation](../docs/API.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)