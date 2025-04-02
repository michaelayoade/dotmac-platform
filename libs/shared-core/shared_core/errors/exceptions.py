"""
Custom shared exception classes for Dotmac platform services.
"""

from typing import Optional


class BasePlatformException(Exception):
    """Base exception class for all custom exceptions in platform services."""

    status_code = 500
    detail = "An internal server error occurred."

    def __init__(self, detail: Optional[str] = None):
        self.detail = detail if detail is not None else self.detail
        super().__init__(self.detail)  # Call parent __init__


class NotFoundError(BasePlatformException):
    """Raised when a requested resource is not found."""

    status_code = 404
    detail = "Resource not found."


class BadRequestError(BasePlatformException):
    """Raised when the request data is invalid or malformed."""

    status_code = 400
    detail = "Bad request."


class UnauthorizedError(BasePlatformException):
    """Raised when an action is attempted without proper authentication."""

    status_code = 401
    detail = "Authentication required."


class ForbiddenError(BasePlatformException):
    """Raised when an authenticated user attempts an action they don't have
    permission for."""

    status_code = 403
    detail = "Operation forbidden."


class ConflictError(BasePlatformException):
    """Raised when an action conflicts with the current state of a resource
    (e.g., duplicate creation)."""

    status_code = 409
    detail = "Resource conflict."
