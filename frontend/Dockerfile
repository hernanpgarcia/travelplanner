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

# Copy custom server file
COPY server.js ./server.js

# Expose port
EXPOSE 3000

# Start command - use custom Express server for better Railway compatibility
CMD ["node", "server.js"]