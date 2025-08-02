# TravelPlanner

A collaborative travel planning platform that makes it effortless to decide where to go together, one city at a time.

## 🌟 Live Demo

**Current Deployment**: Phase 1 - Simplified Version  
- **Frontend**: https://travelplanner-frontend-[hash].onrender.com
- **Backend**: https://travelplanner-backend-[hash].onrender.com

*Successfully deployed on Render after migrating from Railway. Currently showing mock data with database integration coming in Phase 2.*

---

## 🎯 Project Overview

TravelPlanner eliminates the endless group chats and decision paralysis that happens when people try to choose travel destinations and create city-by-city itineraries collaboratively.

### Key Features

- **City-first Planning**: Focus on city-level planning vs. country-level
- **Democratic Voting**: True collaboration with clear ownership
- **Flexible Groups**: Works for solo or group planning
- **Fast Decisions**: Simple tools for quick consensus

### Current Status

**✅ Phase 1**: Basic deployment with mock data  
**✅ Phase 2**: Database integration with PostgreSQL  
**✅ Phase 3**: Google OAuth authentication system working

---

## 🏗️ Architecture

This is a monorepo containing:
- **Backend**: FastAPI with PostgreSQL database and Google OAuth
- **Frontend**: React with TypeScript, Tailwind CSS, and auth integration
- **Deployment**: Render platform with auto-deploy from GitHub
- **Infrastructure**: Docker for local dev, GitHub Actions CI/CD

### Current Deployment Architecture

```
GitHub (main branch)
    ↓
Render Auto-Deploy
    ├── Frontend: React + Vite (Static Site)
    └── Backend: FastAPI + Gunicorn (Python Service)
```

### Planned Full Architecture

```
User → Render Frontend → Render Backend → PostgreSQL
                                      └→ Redis
```

### Project Structure

```
travelplanner/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── main.py           # Full-featured app (Phase 3)
│   │   ├── main_simple.py    # Simplified app (current)
│   │   ├── models/           # Database models
│   │   ├── api/v1/          # API endpoints
│   │   └── core/            # Configuration, middleware
│   └── requirements.txt
├── frontend/         # React application  
│   ├── src/
│   │   ├── features/        # Feature-based components
│   │   ├── shared/          # Shared components
│   │   └── app/             # App configuration
│   └── package.json
├── docs/             # Documentation
│   ├── DEPLOYMENT.md        # Updated Render deployment guide
│   └── DEVELOPMENT.md       # Local development guide
├── render.yaml       # Render deployment configuration
└── docker-compose.yml # Local development
```

---

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Git

### Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/hernanpgarcia/travelplanner.git
cd travelplanner
```

2. **Start the development environment:**
```bash
docker-compose up
```

3. **Access the applications:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- pgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8081

### Alternative: Simplified Backend Only

To match the current production setup:

```bash
cd backend
uvicorn app.main_simple:app --reload --port 8000
```

---

## 📋 Environment Variables

### Development (.env)

Copy `.env.example` to `.env` and configure:

```bash
# Database (for local development)
DATABASE_URL=postgresql://postgres:password@localhost:5432/travelplanner
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# Application
ENVIRONMENT=development
DEBUG=true

# Authentication (REQUIRED for auth to work)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Production (Render)

**⚠️ IMPORTANT**: Since `.env` files are not committed, you MUST configure these in Render:

1. Go to your Render service → Environment
2. Add these environment variables:

```bash
# Required for Authentication
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
SECRET_KEY=generate-a-secure-random-key

# Application Settings
ENVIRONMENT=production
DEBUG=false
PYTHON_VERSION=3.11.8
PYTHONPATH=/opt/render/project/src/backend
ALLOWED_ORIGINS=https://your-frontend-url

# Database (if using Phase 2+)
DATABASE_URL=<auto-configured-by-render>
```

**See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for detailed instructions on configuring production environment.**

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
poetry install
poetry run pytest
```

### Frontend Tests
```bash
cd frontend
npm install
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

---

## 📦 Deployment

### Current Status: Auto-Deploy on Render ✅

**Process**:
1. Push to `main` branch
2. Render automatically builds and deploys
3. Frontend: Static site from Vite build
4. Backend: Python service with Gunicorn

**Configuration**: See `render.yaml` for current setup

### Deployment History

**July 2025**: Successfully migrated from Railway to Render
- **Issue**: Railway deployment failures (Docker, dependencies, platform compatibility)
- **Solution**: Render platform with simplified approach
- **Result**: Stable deployment with phased feature activation plan

**Lessons Learned**:
- Start with simplified version first
- Platform compatibility matters
- Incremental approach prevents deployment hell
- Document the journey for future reference

### Future Deployments

**Phase 2**: Add PostgreSQL database service  
**Phase 3**: Enable full authentication system

---

## 🛠️ Development Guidelines

### Code Quality

- **Backend**: Black, isort, flake8, mypy
- **Frontend**: ESLint, Prettier, TypeScript strict mode
- **Pre-commit hooks**: Enforce standards automatically

### Git Workflow

- Feature branches from `main`
- Pull requests required
- Linear ticket reference required
- Automated testing on all PRs

### Commit Messages

Follow conventional commits:
```
feat: add voting system for cities
fix: resolve authentication token expiry
docs: update deployment documentation
```

---

## 📚 Documentation

**Streamlined documentation structure:**

- **[README.md](./README.md)** - Main project overview and quick start (this file)
- **[CLAUDE.md](./CLAUDE.md)** - Claude Code configuration and MCP setup
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Complete deployment guide with Render
- **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Local development setup
- **[docs/API.md](./docs/API.md)** - API endpoints and documentation
- **[Live API Docs](http://localhost:8000/docs)** - Interactive API docs (when running locally)

**All other documentation has been consolidated or removed for clarity.**

---

## 🤝 Contributing

1. Check existing issues and Linear tickets
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and add tests
4. Run quality checks: `npm run lint && npm run test`
5. Commit with Linear ticket reference
6. Create pull request

### Development Phases

**Current**: Working on foundational Epic 1 tickets  
**Next**: Database integration (Phase 2)  
**Future**: Authentication system (Phase 3), collaborative features

---

## 🎯 Roadmap

### Phase 1 - Foundation ✅ Complete
- [X] Render deployment infrastructure
- [X] React frontend with Vite
- [X] FastAPI backend (simplified)
- [X] CI/CD with GitHub Actions
- [X] Development environment

### Phase 2 - Database Integration ✅ Complete
- [X] PostgreSQL service on Render
- [X] Database models and migrations
- [X] Replace mock data with persistence
- [X] Data management features

### Phase 3 - Authentication ✅ Complete
- [X] Google OAuth integration
- [X] User profile management
- [X] Protected routes and permissions
- [X] Session management

### Phase 4 - Collaborative Features 🔄 Next
- [ ] Trip creation and management
- [ ] City discovery and search
- [ ] Voting system for destinations
- [ ] Real-time collaboration

---

## 📄 License

Private - All rights reserved

## 📞 Support

For questions or issues:
- Check existing GitHub issues
- Review Linear project tickets
- Contact the development team

---

**Current Status**: Phase 1 Complete - Stable Render Deployment ✅  
**Last Updated**: July 21, 2025  
**Next Milestone**: Database Integration (Phase 2)

---

*Built with lessons learned from the Railway → Render migration. Success through starting simple and building incrementally.*