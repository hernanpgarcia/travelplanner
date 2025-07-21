#!/bin/sh

# Start script for TravelPlanner backend
set -e

echo "Starting TravelPlanner backend..."
echo "PORT: ${PORT:-8000}"
echo "ENVIRONMENT: ${ENVIRONMENT:-development}"

# Check if app module exists
if [ ! -f "/app/app/main.py" ]; then
    echo "Error: /app/app/main.py not found!"
    exit 1
fi

# Set Python path
export PYTHONPATH=/app:$PYTHONPATH

# Start the FastAPI application
echo "Starting uvicorn on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info