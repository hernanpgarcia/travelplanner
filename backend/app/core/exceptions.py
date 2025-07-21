"""
Custom Exception Classes

Application-specific exceptions with error codes and messages.
Provides structured error handling across the application.
"""


class TravelPlannerError(Exception):
    """Base application exception."""
    
    def __init__(self, message: str, error_code: str = None):
        self.message = message
        self.error_code = error_code or "GENERIC_ERROR"
        super().__init__(message)


class ValidationError(TravelPlannerError):
    """Input validation errors."""
    
    def __init__(self, message: str, field: str = None):
        self.field = field
        super().__init__(message, "VALIDATION_ERROR")


class AuthenticationError(TravelPlannerError):
    """Authentication errors."""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, "AUTH_ERROR")


class AuthorizationError(TravelPlannerError):
    """Permission and access errors."""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(message, "PERMISSION_DENIED")


class NotFoundError(TravelPlannerError):
    """Resource not found errors."""
    
    def __init__(self, resource: str, identifier: str = None):
        message = f"{resource} not found"
        if identifier:
            message += f": {identifier}"
        super().__init__(message, "NOT_FOUND")


class ConflictError(TravelPlannerError):
    """Resource conflict errors."""
    
    def __init__(self, message: str):
        super().__init__(message, "CONFLICT")


class ExternalServiceError(TravelPlannerError):
    """External API integration errors."""
    
    def __init__(self, service: str, message: str = None):
        error_message = f"{service} service error"
        if message:
            error_message += f": {message}"
        super().__init__(error_message, "EXTERNAL_SERVICE_ERROR")


class RateLimitError(TravelPlannerError):
    """Rate limiting errors."""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, "RATE_LIMIT_EXCEEDED")


class DatabaseError(TravelPlannerError):
    """Database operation errors."""
    
    def __init__(self, message: str):
        super().__init__(message, "DATABASE_ERROR")


# Business Logic Exceptions

class TripNameConflictError(ConflictError):
    """Trip name already exists for user."""
    
    def __init__(self, trip_name: str):
        super().__init__(f"Trip name '{trip_name}' already exists")


class TripMembershipError(TravelPlannerError):
    """Trip membership related errors."""
    
    def __init__(self, message: str):
        super().__init__(message, "MEMBERSHIP_ERROR")


class VotingError(TravelPlannerError):
    """Voting system errors."""
    
    def __init__(self, message: str):
        super().__init__(message, "VOTING_ERROR")


class InviteError(TravelPlannerError):
    """Invitation system errors."""
    
    def __init__(self, message: str):
        super().__init__(message, "INVITE_ERROR")


class CityError(TravelPlannerError):
    """City-related errors."""
    
    def __init__(self, message: str):
        super().__init__(message, "CITY_ERROR")