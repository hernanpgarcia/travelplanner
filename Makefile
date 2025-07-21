# TravelPlanner Development Makefile

.PHONY: help setup start stop clean test lint build deploy

# Colors for output
BLUE := \033[36m
YELLOW := \033[33m
GREEN := \033[32m
RED := \033[31m
RESET := \033[0m

# Default target
help: ## Show this help message
	@echo "$(BLUE)TravelPlanner Development Commands$(RESET)"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}'

# Development Environment
setup: ## Set up development environment
	@echo "$(BLUE)Setting up development environment...$(RESET)"
	@cp .env.example .env 2>/dev/null || echo ".env already exists"
	@echo "$(YELLOW)Please edit .env with your configuration$(RESET)"
	@echo "$(GREEN)Setup complete! Run 'make start' to begin development$(RESET)"

start: ## Start development environment
	@echo "$(BLUE)Starting development environment...$(RESET)"
	@docker-compose up -d
	@echo "$(GREEN)Services started!$(RESET)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(RESET)"
	@echo "$(YELLOW)Backend:  http://localhost:8000$(RESET)"
	@echo "$(YELLOW)API Docs: http://localhost:8000/docs$(RESET)"

stop: ## Stop development environment
	@echo "$(BLUE)Stopping development environment...$(RESET)"
	@docker-compose down
	@echo "$(GREEN)Services stopped!$(RESET)"

restart: stop start ## Restart development environment

logs: ## View logs for all services
	@docker-compose logs -f

logs-backend: ## View backend logs
	@docker-compose logs -f backend

logs-frontend: ## View frontend logs
	@docker-compose logs -f frontend

# Database Management
db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(RESET)"
	@docker-compose exec backend alembic upgrade head
	@echo "$(GREEN)Migrations complete!$(RESET)"

db-reset: ## Reset database (WARNING: destroys data)
	@echo "$(RED)This will destroy all data. Are you sure? [y/N]$(RESET)" && read ans && [ $${ans:-N} = y ]
	@docker-compose down -v
	@docker-compose up -d postgres redis
	@sleep 5
	@make db-migrate
	@echo "$(GREEN)Database reset complete!$(RESET)"

db-shell: ## Open database shell
	@docker-compose exec postgres psql -U postgres -d travelplanner

# Code Quality
lint: ## Run linting for all code
	@echo "$(BLUE)Running linting...$(RESET)"
	@make lint-backend
	@make lint-frontend

lint-backend: ## Run backend linting
	@echo "$(BLUE)Linting backend...$(RESET)"
	@cd backend && poetry run black --check .
	@cd backend && poetry run isort --check-only .
	@cd backend && poetry run flake8 .
	@cd backend && poetry run mypy app/

lint-frontend: ## Run frontend linting
	@echo "$(BLUE)Linting frontend...$(RESET)"
	@cd frontend && npm run lint
	@cd frontend && npm run type-check

format: ## Format all code
	@echo "$(BLUE)Formatting code...$(RESET)"
	@make format-backend
	@make format-frontend

format-backend: ## Format backend code
	@echo "$(BLUE)Formatting backend...$(RESET)"
	@cd backend && poetry run black .
	@cd backend && poetry run isort .

format-frontend: ## Format frontend code
	@echo "$(BLUE)Formatting frontend...$(RESET)"
	@cd frontend && npm run lint:fix

# Testing
test: ## Run all tests
	@echo "$(BLUE)Running all tests...$(RESET)"
	@make test-backend
	@make test-frontend

test-backend: ## Run backend tests
	@echo "$(BLUE)Running backend tests...$(RESET)"
	@docker-compose exec backend poetry run pytest

test-frontend: ## Run frontend tests
	@echo "$(BLUE)Running frontend tests...$(RESET)"
	@docker-compose exec frontend npm run test

test-e2e: ## Run end-to-end tests
	@echo "$(BLUE)Running E2E tests...$(RESET)"
	@cd frontend && npm run test:e2e

test-coverage: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(RESET)"
	@docker-compose exec backend poetry run pytest --cov=app --cov-report=html
	@docker-compose exec frontend npm run test:coverage

# Building
build: ## Build production images
	@echo "$(BLUE)Building production images...$(RESET)"
	@docker build -t travelplanner-backend:latest ./backend
	@docker build -t travelplanner-frontend:latest ./frontend
	@echo "$(GREEN)Build complete!$(RESET)"

build-backend: ## Build backend production image
	@echo "$(BLUE)Building backend image...$(RESET)"
	@docker build -t travelplanner-backend:latest ./backend

build-frontend: ## Build frontend production image
	@echo "$(BLUE)Building frontend image...$(RESET)"
	@docker build -t travelplanner-frontend:latest ./frontend

# Dependencies
install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	@cd backend && poetry install
	@cd frontend && npm install
	@echo "$(GREEN)Dependencies installed!$(RESET)"

install-backend: ## Install backend dependencies
	@cd backend && poetry install

install-frontend: ## Install frontend dependencies
	@cd frontend && npm install

update: ## Update all dependencies
	@echo "$(BLUE)Updating dependencies...$(RESET)"
	@cd backend && poetry update
	@cd frontend && npm update
	@echo "$(GREEN)Dependencies updated!$(RESET)"

# Utility Commands
clean: ## Clean up build artifacts and caches
	@echo "$(BLUE)Cleaning up...$(RESET)"
	@docker-compose down -v --remove-orphans
	@docker system prune -f
	@cd backend && find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@cd backend && find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@cd frontend && rm -rf node_modules/.cache 2>/dev/null || true
	@cd frontend && rm -rf dist 2>/dev/null || true
	@echo "$(GREEN)Cleanup complete!$(RESET)"

shell-backend: ## Open shell in backend container
	@docker-compose exec backend bash

shell-frontend: ## Open shell in frontend container
	@docker-compose exec frontend sh

shell-db: ## Open database shell
	@make db-shell

# Git hooks
hooks-install: ## Install pre-commit hooks
	@echo "$(BLUE)Installing pre-commit hooks...$(RESET)"
	@pip install pre-commit
	@pre-commit install
	@echo "$(GREEN)Pre-commit hooks installed!$(RESET)"

hooks-run: ## Run pre-commit hooks on all files
	@pre-commit run --all-files

# Documentation
docs: ## Generate and serve documentation
	@echo "$(BLUE)Serving documentation...$(RESET)"
	@echo "$(YELLOW)API Documentation: http://localhost:8000/docs$(RESET)"
	@echo "$(YELLOW)Development Guide: ./docs/DEVELOPMENT.md$(RESET)"

# Production deployment (Railway)
deploy-staging: ## Deploy to staging environment
	@echo "$(BLUE)Deploying to staging...$(RESET)"
	@railway up --service backend --environment staging
	@railway up --service frontend --environment staging
	@echo "$(GREEN)Staging deployment complete!$(RESET)"

deploy-prod: ## Deploy to production environment
	@echo "$(RED)Deploying to PRODUCTION. Are you sure? [y/N]$(RESET)" && read ans && [ $${ans:-N} = y ]
	@echo "$(BLUE)Deploying to production...$(RESET)"
	@railway up --service backend --environment production
	@railway up --service frontend --environment production
	@echo "$(GREEN)Production deployment complete!$(RESET)"

# Health checks
health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(RESET)"
	@curl -f http://localhost:8000/health 2>/dev/null && echo "$(GREEN)✓ Backend healthy$(RESET)" || echo "$(RED)✗ Backend unhealthy$(RESET)"
	@curl -f http://localhost:3000 2>/dev/null && echo "$(GREEN)✓ Frontend healthy$(RESET)" || echo "$(RED)✗ Frontend unhealthy$(RESET)"

# Development workflow
dev: start ## Start development environment and follow logs
	@sleep 5
	@make logs

# Quick development commands
quick-start: setup start db-migrate ## Complete setup and start (new projects)

quick-test: ## Run quick tests for CI
	@make lint
	@make test-backend
	@make test-frontend