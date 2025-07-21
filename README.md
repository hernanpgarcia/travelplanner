# TravelPlanner

A collaborative travel planning platform that makes it effortless to decide where to go together, one city at a time.

## 🎯 Project Overview

TravelPlanner eliminates the endless group chats and decision paralysis that happens when people try to choose travel destinations and create city-by-city itineraries collaboratively.

### Key Features
- **City-first Planning**: Focus on city-level planning vs. country-level
- **Democratic Voting**: True collaboration with clear ownership
- **Flexible Groups**: Works for solo or group planning
- **Fast Decisions**: Simple tools for quick consensus

## 🏗️ Architecture

This is a monorepo containing:
- **Backend**: FastAPI with PostgreSQL and Redis
- **Frontend**: React with TypeScript and Tailwind CSS
- **Shared**: Common types and utilities
- **Infrastructure**: Docker, Railway deployment, CI/CD

```
travelplanner/
├── backend/          # FastAPI application
├── frontend/         # React application  
├── shared/           # Shared TypeScript types
├── docs/             # Documentation
├── .github/          # CI/CD workflows
└── docker-compose.yml # Local development
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for shared types)
- Git

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd travelplanner
```

2. Start the development environment:
```bash
docker-compose up
```

3. Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- pgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8081

## 📋 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/travelplanner
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# Google APIs
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PLACES_API_KEY=your-places-api-key

# AWS (for file storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket
AWS_REGION=us-east-1

# Application
ENVIRONMENT=development
DEBUG=true
```

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

## 📦 Deployment

### Staging
Automatically deployed on push to `main` branch via GitHub Actions.

### Production
Deployed on release tags via GitHub Actions to Railway.

## 🛠️ Development Guidelines

### Code Quality
- Backend: Black, isort, flake8, mypy
- Frontend: ESLint, Prettier, TypeScript strict mode
- Pre-commit hooks enforce standards

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
docs: update API documentation
```

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) (when running locally)
- [Architecture Decision Records](./docs/adr/)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Check existing issues and Linear tickets
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and add tests
4. Run quality checks: `npm run lint && npm run test`
5. Commit with Linear ticket reference
6. Create pull request

## 📄 License

Private - All rights reserved

## 📞 Support

For questions or issues:
- Check existing GitHub issues
- Review Linear project tickets
- Contact the development team

---

Built with ❤️ for seamless travel planning