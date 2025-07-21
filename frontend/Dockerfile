# Multi-stage build for Frontend
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files  
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Type check separately (optional, can comment out for faster builds)
RUN npm run type-check || true

# Build application with Vite only
RUN npx vite build

# Production stage - use Node.js for Railway compatibility
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies and serve
RUN npm install --only=production

# Copy built files
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/ || exit 1

# Start preview server
CMD npm run preview -- --host 0.0.0.0 --port ${PORT:-3000}