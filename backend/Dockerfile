# Production Dockerfile for Backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Configure poetry: don't create virtual environment
RUN poetry config virtualenvs.create false

# Copy dependency files
COPY pyproject.toml ./
COPY poetry.loc[k] ./

# Install dependencies (generate lock file if it doesn't exist)  
RUN poetry lock --no-update || true && poetry install --only=main --no-root

# Copy application code
COPY . .

# Copy and set up start script
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Create non-root user and set permissions
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app && \
    chmod +x /app/start.sh
USER appuser

# Expose port
EXPOSE 8000

# Health check - use wget instead of curl and wait longer for startup
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8000}/health || exit 1

# Start application using start script
CMD ["./start.sh"]