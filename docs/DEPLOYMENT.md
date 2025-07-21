# TravelPlanner Deployment Guide

This guide covers deploying TravelPlanner to production using Render platform, including our migration journey from Railway and lessons learned.

## 🌟 Current Status: Successfully Deployed on Render

**Live URLs:**
- **Frontend**: https://travelplanner-frontend-[hash].onrender.com
- **Backend**: https://travelplanner-backend-[hash].onrender.com

**Deployment Strategy**: Phased approach with simplified version first, then progressive feature activation.

---

## 📖 Deployment Journey: Railway → Render

### Why We Migrated from Railway

**Original Plan**: Deploy full-featured application on Railway
**Reality**: Multiple deployment failures over several hours

**Railway Issues Encountered:**
- Docker build failures and PORT variable expansion issues
- Tailwind CSS compilation errors in build process
- ES module conflicts and dependency resolution problems
- Platform compatibility issues with our tech stack
- Pydantic-core Rust compilation errors

**Decision Point**: After extensive troubleshooting, we chose to migrate to Render for better compatibility and reliability.

### Render Solution Strategy

**Key Insight**: Start simple, add complexity gradually

**Approach**:
1. **Simplified First**: Deploy basic version with mock data (Phase 1)
2. **Database Integration**: Add PostgreSQL service (Phase 2) 
3. **Full Features**: Enable authentication and advanced features (Phase 3)

**Result**: ✅ Stable deployment achieved with clear path to full functionality

---

## 🚀 Phase 1: Simplified Render Deployment (✅ Complete)

### Current Architecture

**Frontend**: React + Vite static site
**Backend**: FastAPI with simplified endpoints (`main_simple.py`)
**Data**: Mock data (no database yet)
**Deployment**: Auto-deploy on GitHub push to main

### Render Configuration

**File**: `render.yaml`
```yaml
services:
  # Frontend - React Static Site
  - type: web
    name: travelplanner-frontend
    env: static
    buildCommand: cd frontend && npm ci && npm run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

  # Backend - FastAPI Service  
  - type: web
    name: travelplanner-backend
    env: python
    plan: starter
    buildCommand: cd backend && pip install --upgrade pip && pip install -r requirements.txt
    startCommand: cd backend && gunicorn app.main_simple:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
    envVars:
      - key: PYTHONPATH
        value: /opt/render/project/src/backend
      - key: ENVIRONMENT
        value: production
      - key: PYTHON_VERSION
        value: 3.11.8
```

### Environment Variables (Phase 1)

**Currently Active:**
```bash
ENVIRONMENT=production
PYTHON_VERSION=3.11.8
PYTHONPATH=/opt/render/project/src/backend
SECRET_KEY=<configured>
CORS_ORIGINS=https://travelplanner-frontend-[hash].onrender.com
```

**Ready for Future Phases:**
```bash
# Phase 2: Database
DATABASE_URL=<to-be-configured>

# Phase 3: Authentication  
GOOGLE_CLIENT_ID=<to-be-configured>
GOOGLE_CLIENT_SECRET=<to-be-configured>
JWT_SECRET_KEY=<to-be-configured>
```

### Current Endpoints

**Health Check**:
- `GET /health` - Application health status

**Mock Data Endpoints**:
- `GET /api/v1/cities` - Returns 3 sample cities (Paris, Tokyo, NYC)
- `GET /api/v1/trips` - Returns 2 sample trips
- `POST /api/v1/trips` - Creates trip (mock response)

---

## 🔄 Phase 2: Database Integration (Planned)

### Goal
Add PostgreSQL database service while maintaining deployment stability.

### Implementation Strategy

**Approach**: Gradual migration
1. Add PostgreSQL service to Render project
2. Update `main_simple.py` to connect to database
3. Replace mock endpoints one by one
4. Maintain backwards compatibility

### Database Service Setup

**1. Add PostgreSQL to Render**
```yaml
# Add to render.yaml
  - type: pserv
    name: travelplanner-database
    env: postgresql
    plan: starter
    ipAllowList: []
```

**2. Update Environment Variables**
```bash
DATABASE_URL=postgresql://user:pass@host:port/db  # Auto-provided by Render
```

**3. Update Application Code**
```python
# Modify main_simple.py to include database connection
from sqlalchemy import create_engine
from app.models.city import City
from app.models.trip import Trip

# Replace mock endpoints with database queries
```

### Migration Process

**Week 1: Database Setup**
- [ ] Add PostgreSQL service in Render dashboard
- [ ] Configure DATABASE_URL environment variable
- [ ] Test database connectivity

**Week 2: Data Migration**
- [ ] Update main_simple.py with database models
- [ ] Replace cities endpoint with database query
- [ ] Replace trips endpoint with database persistence
- [ ] Add basic trip CRUD operations

**Week 3: Validation**
- [ ] Verify data persistence across deployments
- [ ] Performance testing with database
- [ ] Rollback plan testing

**Success Criteria**:
- [ ] All endpoints use database instead of mock data
- [ ] Data persists across application restarts
- [ ] Performance remains acceptable (<2 second response times)
- [ ] No breaking changes to API contracts

---

## 🔐 Phase 3: Full Feature Activation (Planned)

### Goal
Switch from simplified to full-featured application with authentication.

### Implementation Strategy

**Key Change**: Switch from `main_simple.py` to `main.py`
```yaml
# Update render.yaml startCommand
startCommand: cd backend && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

### Authentication Setup

**1. Google OAuth Configuration**
- Create OAuth 2.0 Client ID in Google Cloud Console
- Set authorized redirect URIs for Render domain
- Configure consent screen

**2. Environment Variables**
```bash
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
JWT_SECRET_KEY=<generate-secure-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30
```

**3. Frontend Integration**
- Connect React auth components to backend
- Enable Google sign-in functionality
- Update protected routes

### Full Feature Set

**Authentication**:
- Google OAuth login/logout
- JWT token management
- Protected API endpoints

**Advanced Middleware**:
- Rate limiting with slowapi
- Structured logging with correlation IDs
- Advanced error handling

**API Documentation**:
- Full OpenAPI docs at `/docs`
- Request/response validation

**Monitoring**:
- Health checks for database and Redis
- Performance metrics
- Error tracking

---

## 🛠️ Development & Deployment Workflow

### Local Development

**Start Development Environment**:
```bash
# Full development stack with database
docker-compose up

# Access points:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000  
# - API Docs: http://localhost:8000/docs
# - pgAdmin: http://localhost:5050
```

**Simplified Backend Only** (matches production):
```bash
cd backend
uvicorn app.main_simple:app --reload --port 8000
```

### Deployment Process

**Current**: Auto-deploy on push to `main` branch
1. Push changes to GitHub main branch
2. Render automatically triggers build
3. Frontend builds and deploys as static site
4. Backend builds and deploys as Python service
5. Health checks verify deployment

**Manual Deployment** (if needed):
```bash
# Trigger manual deployment via Render dashboard
# or push empty commit to trigger build
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Environment Management

**Development**: Use `docker-compose.yml` with local services
**Production**: Use `render.yaml` with Render-managed services

---

## 📊 Monitoring & Maintenance

### Health Monitoring

**Current Health Checks**:
- `GET /health` - Basic application health
- Automatic Render service monitoring
- Build and deployment status

**Future Monitoring** (Phase 2+):
- `GET /health/db` - Database connectivity
- `GET /health/redis` - Redis connectivity  
- Application performance metrics
- Error rate tracking

### Performance Optimization

**Current Optimizations**:
- Gunicorn with UvicornWorker (4 workers)
- Static site deployment for frontend
- Minimal dependencies in simplified version

**Future Optimizations** (Phase 2+):
- Database connection pooling
- Redis caching
- CDN for static assets
- Response compression

### Security

**Current Security**:
- HTTPS by default on Render
- CORS configuration
- Environment variable protection

**Future Security** (Phase 3):
- JWT token authentication
- Rate limiting
- Security headers
- Input validation

---

## 🚨 Troubleshooting

### Common Issues & Solutions

**Build Failures**:
```bash
# Check build logs in Render dashboard
# Common fixes:
# 1. Verify requirements.txt is up to date
# 2. Check Python version compatibility
# 3. Ensure frontend dependencies resolve
```

**Deployment Issues**:
```bash
# Verify render.yaml configuration
# Check environment variables are set
# Confirm build and start commands
```

**Performance Issues**:
```bash
# Monitor resource usage in Render dashboard
# Check for memory/CPU limits
# Consider upgrading service plan
```

### Recovery Procedures

**Rollback Strategy**:
1. Render provides automatic rollback via dashboard
2. Can revert to previous deployment
3. Database rollback (when implemented) via backup restore

**Emergency Contacts**:
- Monitor Render service status
- Check GitHub Actions for build issues
- Review application logs in Render dashboard

---

## 🎯 Migration Lessons Learned

### Key Insights

1. **Start Simple**: Deploying a minimal version first prevents "deployment hell"
2. **Platform Matters**: Some platforms work better with specific tech stacks
3. **Incremental Approach**: Add complexity gradually rather than all at once
4. **Backup Plans**: Always have a rollback strategy
5. **Documentation**: Record the journey for future reference

### Best Practices

**Deployment Strategy**:
- ✅ Deploy simplified version first
- ✅ Test each phase thoroughly  
- ✅ Maintain backwards compatibility
- ✅ Document environment setup

**Platform Selection**:
- ✅ Evaluate platform compatibility early
- ✅ Consider managed services vs. custom Docker
- ✅ Test build process before full deployment
- ✅ Have migration plan ready

**Risk Mitigation**:
- ✅ Keep working version as backup
- ✅ Use feature flags for gradual rollout
- ✅ Monitor deployment metrics
- ✅ Prepare rollback procedures

---

## 📋 Deployment Checklist

### Phase 1 - Current (✅ Complete)
- [X] Render project configured
- [X] Frontend building and deploying
- [X] Backend building and deploying  
- [X] Health checks passing
- [X] Auto-deployment working
- [X] CORS configured
- [X] Environment variables set

### Phase 2 - Database Integration
- [ ] PostgreSQL service added to Render
- [ ] Database migrations working
- [ ] Data persistence verified
- [ ] Performance acceptable
- [ ] Rollback plan tested

### Phase 3 - Full Feature Activation
- [ ] Google OAuth configured
- [ ] Authentication flow working
- [ ] Protected routes functional
- [ ] Advanced features enabled
- [ ] Security audit complete

---

**Last Updated**: July 21, 2025  
**Current Status**: Phase 1 Complete ✅  
**Next Milestone**: Phase 2 Database Integration

---

*Built with lessons learned from the Railway → Render migration journey. Success comes from starting simple and building incrementally.*