# Development Guide

This guide will help you set up the TravelPlanner development environment and understand the development workflow.

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose**: For running the development environment
- **Node.js 18+**: For running shared utilities and frontend development
- **Git**: For version control

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd travelplanner
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development environment**:
   ```bash
   docker-compose up
   ```

4. **Access the applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - pgAdmin: http://localhost:5050 (admin@travelplanner.com / admin)
   - Redis Commander: http://localhost:8081

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    TravelPlanner Stack                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript + Tailwind)                  │
│  ↓ HTTP/WebSocket                                           │
│  Backend (FastAPI + Python)                                │
│  ↓ SQL/Redis                                                │
│  Database (PostgreSQL + Redis)                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- React Query for server state
- React Hook Form + Zod for forms

**Backend:**
- FastAPI with Python 3.11
- SQLAlchemy 2.0 (async)
- Alembic for migrations
- Pydantic for validation
- Redis for caching
- WebSockets for real-time features

**Database:**
- PostgreSQL 15 for primary data
- Redis 7 for caching and sessions

**Infrastructure:**
- Docker for development
- Railway for deployment
- GitHub Actions for CI/CD

## 📁 Project Structure

```
travelplanner/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── core/           # Core utilities (config, database, etc.)
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   ├── api/           # API routes
│   │   ├── external/      # External service integrations
│   │   └── utils/         # Shared utilities
│   ├── tests/             # Test suites
│   ├── migrations/        # Database migrations
│   └── pyproject.toml     # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── app/           # App setup and providers
│   │   ├── features/      # Feature-based organization
│   │   ├── shared/        # Shared components and utilities
│   │   ├── assets/        # Static assets
│   │   └── styles/        # Global styles
│   └── package.json       # Node.js dependencies
├── shared/                # Shared types and utilities
├── docs/                  # Documentation
├── .github/              # CI/CD workflows
└── docker-compose.yml    # Development environment
```

## 🛠️ Development Workflow

### Running Services Individually

If you prefer to run services individually instead of using Docker Compose:

**Backend:**
```bash
cd backend
poetry install
poetry shell
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Database:**
```bash
# Start PostgreSQL and Redis with Docker
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### Database Management

**Run migrations:**
```bash
# Using Docker Compose
docker-compose exec backend alembic upgrade head

# Or locally
cd backend
poetry run alembic upgrade head
```

**Create new migration:**
```bash
cd backend
poetry run alembic revision --autogenerate -m "Description"
```

**Reset database:**
```bash
docker-compose down -v  # Removes volumes
docker-compose up postgres redis  # Restart only DB services
```

### Code Quality

**Backend code quality checks:**
```bash
cd backend
poetry run black .          # Format code
poetry run isort .          # Sort imports
poetry run flake8 .         # Lint code
poetry run mypy app/        # Type checking
```

**Frontend code quality checks:**
```bash
cd frontend
npm run lint                # ESLint
npm run lint:fix           # Fix ESLint issues
npm run type-check         # TypeScript checking
```

### Testing

**Backend tests:**
```bash
cd backend
poetry run pytest                    # All tests
poetry run pytest tests/unit/       # Unit tests only
poetry run pytest --cov=app         # With coverage
```

**Frontend tests:**
```bash
cd frontend
npm run test                # Unit tests
npm run test:coverage      # With coverage
npm run test:ui           # Visual test runner
```

**End-to-end tests:**
```bash
cd frontend
npm run test:e2e          # Playwright E2E tests
```

## 🔧 Configuration

### Environment Variables

Key environment variables for development:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/travelplanner
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-development-secret-key
ALGORITHM=HS256

# Google APIs (required for full functionality)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PLACES_API_KEY=your-places-api-key

# Application
ENVIRONMENT=development
DEBUG=true
```

### Getting API Keys

1. **Google OAuth & Places API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google+ API" and "Places API"
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000` to authorized origins

2. **AWS S3** (optional for file storage):
   - Create AWS account
   - Create S3 bucket
   - Create IAM user with S3 access
   - Generate access keys

## 🐛 Debugging

### Backend Debugging

**Enable debug logging:**
```bash
export LOG_LEVEL=debug
```

**Database query logging:**
```bash
export DEBUG=true  # Enables SQLAlchemy query logging
```

**Debug in VS Code:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Backend Debug",
      "type": "python",
      "request": "launch",
      "program": "backend/app/main.py",
      "env": {
        "DATABASE_URL": "postgresql://postgres:password@localhost:5432/travelplanner",
        "ENVIRONMENT": "development"
      }
    }
  ]
}
```

### Frontend Debugging

**React Developer Tools:**
- Install browser extension
- Use Components and Profiler tabs

**Redux DevTools** (for Zustand):
```typescript
// Enable in store definition
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools((set) => ({
    // store definition
  }))
)
```

### Common Issues

**Database connection issues:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Reset database
docker-compose down -v && docker-compose up postgres
```

**Frontend build issues:**
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install

# Clear Vite cache
rm -rf frontend/dist frontend/.vite
```

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :3000  # Frontend
lsof -i :8000  # Backend
lsof -i :5432  # PostgreSQL

# Kill processes if needed
kill -9 <PID>
```

## 📊 Monitoring & Observability

### Development Monitoring

**Application logs:**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Database monitoring:**
- pgAdmin: http://localhost:5050
- Direct connection: `psql postgresql://postgres:password@localhost:5432/travelplanner`

**Redis monitoring:**
- Redis Commander: http://localhost:8081
- CLI: `docker-compose exec redis redis-cli`

### Performance Profiling

**Backend profiling:**
```python
# Add to endpoints for profiling
import cProfile
import pstats

def profile_endpoint():
    profiler = cProfile.Profile()
    profiler.enable()
    
    # Your code here
    
    profiler.disable()
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats()
```

**Frontend profiling:**
- Use React DevTools Profiler
- Browser Performance tab
- Lighthouse audits

## 🚀 Production Deployment

### Building for Production

**Backend:**
```bash
cd backend
docker build -t travelplanner-backend .
```

**Frontend:**
```bash
cd frontend
npm run build
docker build -t travelplanner-frontend .
```

### Railway Deployment

The application is configured for Railway deployment:

1. **Backend deployment**:
   - Uses `railway.json` configuration
   - Automatic health checks on `/health`
   - Environment variables via Railway dashboard

2. **Database migrations**:
   ```bash
   railway run "alembic upgrade head"
   ```

3. **Frontend deployment**:
   - Static build served by Nginx
   - Automatic HTTPS and CDN

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Railway Documentation](https://docs.railway.app/)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and add tests
3. Run quality checks: `npm run lint && npm run test`
4. Commit with Linear ticket reference
5. Create pull request with detailed description

Remember to include Linear ticket references in commit messages and PR titles (e.g., `TRAVEL-123: Add user authentication`).