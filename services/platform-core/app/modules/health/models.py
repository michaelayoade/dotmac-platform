from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ServiceStatus(str, Enum):
    """
    Enum for service status values.
    """

    ok = "ok"
    warning = "warning"
    error = "error"
    unknown = "unknown"


class HealthCheck(BaseModel):
    """
    Health check response model.
    """

    status: ServiceStatus
    version: str
    timestamp: str


class ComponentStatus(BaseModel):
    """
    Status of an individual component.
    """

    name: str
    status: ServiceStatus
    details: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ReadinessCheck(BaseModel):
    """
    Readiness check response model.
    """

    status: ServiceStatus
    version: str
    timestamp: str
    components: List[ComponentStatus]


class HealthResponse(BaseModel):
    """
    Generic health response model.
    """

    status: ServiceStatus
    version: str
    timestamp: str
    components: Optional[List[ComponentStatus]] = None
