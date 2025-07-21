# Multi-stage build for Frontend
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code from frontend directory
COPY frontend/ .

# Build application directly with Vite (skip type checking, disable sourcemaps for faster builds)
RUN NODE_ENV=production npx vite build --mode production --minify

# Production stage - use Node.js with serve for Railway compatibility  
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install serve globally for static file serving
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy start script from frontend directory
COPY frontend/start.sh ./start.sh
RUN chmod +x start.sh

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check - check if the port is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/ || exit 1

# Start static file server using start script
CMD ["./start.sh"]