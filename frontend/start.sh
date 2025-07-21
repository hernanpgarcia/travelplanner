#!/bin/sh

# Start script for TravelPlanner frontend
set -e

echo "Starting TravelPlanner frontend..."
echo "PORT: ${PORT:-3000}"
echo "NODE_ENV: ${NODE_ENV:-production}"

# Ensure dist directory exists
if [ ! -d "/app/dist" ]; then
    echo "Error: /app/dist directory not found!"
    exit 1
fi

# List contents to verify files exist
echo "Contents of /app:"
ls -la /app

echo "Contents of /app/dist:"
ls -la /app/dist

# Start the static file server
echo "Starting serve on port ${PORT:-3000}..."
exec serve -s /app/dist -l ${PORT:-3000}