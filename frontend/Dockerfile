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

# Install serve for static hosting
RUN npm install -g serve@14.2.1

# Expose port
EXPOSE 3000

# Start command
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]