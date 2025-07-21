# Deployment Guide

This guide covers deploying TravelPlanner to production using Railway and other cloud platforms.

## 🚀 Railway Deployment (Recommended)

Railway provides managed PostgreSQL, Redis, and easy deployment for both backend and frontend services.

### Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Code must be in a GitHub repository
3. **Domain** (optional): For custom domain setup

### Initial Setup

#### 1. Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway create travelplanner-production
```

#### 2. Add Required Services

**Add PostgreSQL:**
```bash
railway add postgresql
```

**Add Redis:**
```bash
railway add redis
```

### Backend Deployment

#### 1. Create Backend Service

```bash
# Create backend service
railway service create backend

# Set working directory
railway service settings --service backend --source-directory backend
```

#### 2. Configure Environment Variables

Set these variables in Railway dashboard or via CLI:

```bash
# Core Application
railway env set ENVIRONMENT=production
railway env set DEBUG=false
railway env set SECRET_KEY=<generate-secure-secret>
railway env set APP_NAME="TravelPlanner"

# Database (automatically provided by Railway)
# DATABASE_URL=<automatically-set>
# REDIS_URL=<automatically-set>

# Google APIs
railway env set GOOGLE_CLIENT_ID=<your-client-id>
railway env set GOOGLE_CLIENT_SECRET=<your-client-secret>
railway env set GOOGLE_PLACES_API_KEY=<your-places-key>

# AWS (for file storage)
railway env set AWS_ACCESS_KEY_ID=<your-access-key>
railway env set AWS_SECRET_ACCESS_KEY=<your-secret-key>
railway env set AWS_S3_BUCKET=<your-bucket-name>
railway env set AWS_REGION=us-east-1

# CORS Configuration
railway env set ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Error Tracking
railway env set SENTRY_DSN=<your-sentry-dsn>
```

#### 3. Deploy Backend

```bash
railway up --service backend
```

### Frontend Deployment

#### 1. Create Frontend Service

```bash
# Create frontend service
railway service create frontend

# Set working directory
railway service settings --service frontend --source-directory frontend
```

#### 2. Configure Frontend Environment

```bash
# API Configuration
railway env set VITE_API_URL=https://your-backend-domain.railway.app
railway env set VITE_WS_URL=wss://your-backend-domain.railway.app

# Environment
railway env set NODE_ENV=production
```

#### 3. Deploy Frontend

```bash
railway up --service frontend
```

### Database Setup

#### 1. Run Initial Migration

```bash
# Connect to backend service
railway shell --service backend

# Run migrations
alembic upgrade head

# Exit shell
exit
```

#### 2. Create Database Indexes

```sql
-- Connect to PostgreSQL and run these manually if needed
CREATE INDEX CONCURRENTLY idx_users_google_id ON users(google_id);
CREATE INDEX CONCURRENTLY idx_trips_owner_status ON trips(owner_id, status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_city_votes_aggregation ON city_votes(trip_id, city_id, vote_type);
```

### Custom Domain Setup

#### 1. Configure Domain in Railway

1. Go to Railway dashboard
2. Select your service
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

#### 2. Update Environment Variables

```bash
# Update CORS origins
railway env set ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Update frontend API URL if needed
railway env set VITE_API_URL=https://api.yourdomain.com
```

## 🔧 CI/CD with GitHub Actions

The repository includes GitHub Actions workflows for automated deployment.

### Required Secrets

Add these secrets in GitHub repository settings:

```bash
# Railway tokens (different for staging/production)
RAILWAY_TOKEN_STAGING=<staging-token>
RAILWAY_TOKEN_PRODUCTION=<production-token>

# Application URLs
STAGING_URL=https://staging.yourdomain.com
PRODUCTION_URL=https://yourdomain.com

# Optional: Notification webhooks
SLACK_WEBHOOK_URL=<slack-webhook>
```

### Deployment Workflow

1. **Push to `main`**: Triggers staging deployment
2. **Staging tests pass**: Runs E2E tests
3. **Tests pass**: Deploys to production
4. **Production health check**: Verifies deployment

### Manual Deployment

Force a deployment:

```bash
# Deploy specific branch
railway up --service backend --branch feature-branch

# Deploy with environment
railway up --service backend --environment production
```

## 🐳 Docker Deployment

For self-hosted deployment using Docker.

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: travelplanner
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/travelplanner
      REDIS_URL: redis://redis:6379
      SECRET_KEY: ${SECRET_KEY}
      ENVIRONMENT: production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Deploy with Docker

```bash
# Set environment variables
export POSTGRES_PASSWORD=<secure-password>
export SECRET_KEY=<secure-secret>

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## ☁️ Alternative Cloud Platforms

### AWS Deployment

**Services:**
- **Compute**: ECS with Fargate or EC2
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Storage**: S3
- **CDN**: CloudFront
- **Load Balancer**: ALB

**Architecture:**
```
Internet → CloudFront → ALB → ECS Tasks (Backend/Frontend)
                              ↓
                         RDS + ElastiCache
```

### Google Cloud Platform

**Services:**
- **Compute**: Cloud Run or GKE
- **Database**: Cloud SQL PostgreSQL
- **Cache**: Memorystore Redis
- **Storage**: Cloud Storage
- **CDN**: Cloud CDN
- **Load Balancer**: Cloud Load Balancing

### DigitalOcean

**Services:**
- **Compute**: App Platform or Droplets
- **Database**: Managed PostgreSQL
- **Cache**: Managed Redis
- **Storage**: Spaces
- **CDN**: Spaces CDN

## 🔒 Security Configuration

### SSL/TLS Setup

**Railway**: Automatic HTTPS with custom domains

**Self-hosted**: Use Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Headers

Configure these headers in your reverse proxy:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Environment Security

- **Secrets Management**: Use Railway secrets or AWS Secrets Manager
- **Database**: Enable SSL connections
- **API Keys**: Rotate regularly
- **Access Control**: Use IAM roles and least privilege

## 📊 Monitoring & Observability

### Application Monitoring

**Error Tracking**: Sentry
```bash
railway env set SENTRY_DSN=https://your-sentry-dsn
```

**Performance Monitoring**: New Relic or Datadog
```bash
railway env set NEW_RELIC_LICENSE_KEY=<your-key>
```

### Infrastructure Monitoring

**Railway**: Built-in metrics and logging

**Self-hosted**: Prometheus + Grafana
```yaml
# Add to docker-compose.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  ports:
    - "3001:3000"
```

### Log Management

**Centralized Logging**: Configure log aggregation
```python
# In production settings
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': '/var/log/travelplanner.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}
```

## 🔄 Database Management

### Backup Strategy

**Railway**: Automatic backups included

**Self-hosted**: Set up regular backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/travelplanner_$DATE.sql
aws s3 cp /backups/travelplanner_$DATE.sql s3://your-backup-bucket/

# Keep only last 30 days
find /backups -name "*.sql" -mtime +30 -delete
```

### Migration Management

**Production migrations**:
```bash
# Always backup before migrations
railway run --service backend "pg_dump $DATABASE_URL > backup.sql"

# Run migration
railway run --service backend "alembic upgrade head"

# Verify migration
railway run --service backend "alembic current"
```

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Check build logs
railway logs --service backend

# Rebuild from scratch
railway redeploy --service backend
```

**Database Connection Issues:**
```bash
# Check database status
railway status

# View database logs
railway logs postgresql

# Test connection
railway shell --service backend
python -c "from app.core.database import engine; print('Connection OK')"
```

**Performance Issues:**
```bash
# Check resource usage
railway metrics --service backend

# Scale up if needed
railway service settings --cpu 2 --memory 4
```

### Recovery Procedures

**Rollback Deployment:**
```bash
# Deploy previous version
railway rollback --service backend
```

**Database Recovery:**
```bash
# Restore from backup
railway shell postgresql
psql $DATABASE_URL < backup.sql
```

## 📋 Production Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates ready
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Error tracking enabled
- [ ] Load testing completed
- [ ] Security scan passed

### Post-deployment

- [ ] Health checks passing
- [ ] Logs flowing correctly
- [ ] Monitoring alerts configured
- [ ] DNS records updated
- [ ] CDN configured
- [ ] Performance metrics baseline
- [ ] Team access configured
- [ ] Documentation updated

### Ongoing Maintenance

- [ ] Monitor application metrics
- [ ] Review error logs daily
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Test backup recovery
- [ ] Review security settings
- [ ] Scale based on usage
- [ ] Update documentation