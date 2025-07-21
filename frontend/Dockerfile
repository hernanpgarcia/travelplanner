# Simple single-stage build for Railway
FROM node:18-alpine

WORKDIR /app

# Copy package files and install ALL dependencies (including dev for build)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install http-server for static hosting (more reliable than serve)
RUN npm install -g http-server

# Expose port
EXPOSE 3000

# Start command - http-server has better Railway compatibility
CMD ["sh", "-c", "http-server dist -p ${PORT:-3000} --cors -c-1"]