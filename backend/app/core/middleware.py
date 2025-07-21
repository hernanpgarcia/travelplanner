"""
Custom Middleware

Request logging, metrics collection, and performance monitoring.
"""

import time
import uuid
from typing import Callable

import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger()


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log all HTTP requests and responses with correlation IDs."""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate correlation ID for request tracking
        correlation_id = str(uuid.uuid4())
        
        # Add correlation ID to request state
        request.state.correlation_id = correlation_id
        
        # Start timing
        start_time = time.time()
        
        # Log request
        logger.info(
            "Request started",
            correlation_id=correlation_id,
            method=request.method,
            url=str(request.url),
            path=request.url.path,
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
        
        try:
            # Process request
            response = await call_next(request)
            
            # Calculate duration
            duration = time.time() - start_time
            
            # Log response
            logger.info(
                "Request completed",
                correlation_id=correlation_id,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=round(duration * 1000, 2),
            )
            
            # Add correlation ID to response headers
            response.headers["X-Correlation-ID"] = correlation_id
            
            return response
            
        except Exception as e:
            # Calculate duration for failed requests
            duration = time.time() - start_time
            
            # Log error
            logger.error(
                "Request failed",
                correlation_id=correlation_id,
                method=request.method,
                path=request.url.path,
                error=str(e),
                duration_ms=round(duration * 1000, 2),
            )
            
            raise


class MetricsMiddleware(BaseHTTPMiddleware):
    """Collect application metrics."""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Collect metrics (implement with your metrics system)
        self._record_metrics(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration=duration,
        )
        
        return response
    
    def _record_metrics(
        self, 
        method: str, 
        path: str, 
        status_code: int, 
        duration: float
    ) -> None:
        """Record metrics to monitoring system."""
        # TODO: Implement with Prometheus/StatsD/etc.
        # For now, just log metrics
        logger.debug(
            "Request metrics",
            method=method,
            path=path,
            status_code=status_code,
            duration_ms=round(duration * 1000, 2),
        )