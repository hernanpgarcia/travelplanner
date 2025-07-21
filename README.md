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
**🔄 Phase 2**: Database integration (planned)  
**🔄 Phase 3**: Authentication system activation (planned)

---

## 🏗️ Architecture

This is a monorepo containing:
- **Backend**: FastAPI with PostgreSQL and Redis (planned)
- **Frontend**: React with TypeScript and Tailwind CSS
- **Deployment**: Render platform with auto-deploy
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

# Future: Authentication (Phase 3)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PLACES_API_KEY=your-places-api-key
```

### Production (Render)

**Currently Active**:
- `ENVIRONMENT=production`
- `PYTHON_VERSION=3.11.8` 
- `PYTHONPATH=/opt/render/project/src/backend`
- `SECRET_KEY=<configured>`
- `CORS_ORIGINS=<frontend-domain>`

**Phase 2 (Database)**:
- `DATABASE_URL=<auto-configured-by-render>`

**Phase 3 (Authentication)**:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET_KEY`

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

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Complete Render deployment process
- **[Development Guide](./docs/DEVELOPMENT.md)** - Local development setup
- **[API Documentation](http://localhost:8000/docs)** - When running locally
- **[Architecture Decision Records](./docs/adr/)** - Design decisions

### Key Documentation Updates

- ✅ **DEPLOYMENT.md**: Completely updated with Render process and Railway migration story
- ✅ **README.md**: Current status and simplified quick start
- 🔄 **DEVELOPMENT.md**: Local development workflow (to be updated)

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

### Phase 1 - Foundation ✅ (Current)
- [X] Render deployment infrastructure
- [X] React frontend with Vite
- [X] FastAPI backend (simplified)
- [X] CI/CD with GitHub Actions
- [X] Development environment

### Phase 2 - Database Integration 🔄
- [ ] PostgreSQL service on Render
- [ ] Database models and migrations
- [ ] Replace mock data with persistence
- [ ] Data management features

### Phase 3 - Authentication 🔄
- [ ] Google OAuth integration
- [ ] User profile management
- [ ] Protected routes and permissions
- [ ] Session management

### Phase 4 - Collaborative Features 🔄
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