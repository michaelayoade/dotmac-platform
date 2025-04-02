import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from shared_core.errors.exceptions import BasePlatformException

# Import the initialized settings object
from app.core.config import settings
from app.db.redis import close_redis_pool, initialize_redis_pool

# Import routers for different modules
from app.modules.audit.router import router as audit_router
from app.modules.config.router import router as config_router
from app.modules.feature_flags.router import router as feature_flags_router
from app.modules.health.router import router as health_router
from app.modules.logging.router import router as logging_router
from app.modules.notifications.router import router as notifications_router
from app.modules.webhooks.router import router as webhooks_router

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL.upper(),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Setup OpenAPI tags metadata
tags_metadata = [
    {
        "name": "Health",
        "description": ("Health check endpoints for monitoring application status and " "readiness."),
    },
    {
        "name": "Config",
        "description": ("Configuration management endpoints for storing and retrieving " "application settings."),
    },
    {
        "name": "Audit",
        "description": ("Audit logging endpoints for tracking sensitive actions for " "compliance and security."),
    },
    {
        "name": "Feature Flags",
        "description": (
            "Feature flag endpoints for toggling features on/off globally " "or for specific users/groups."
        ),
    },
    {
        "name": "Logging",
        "description": ("Structured logging endpoints for storing and retrieving " "application logs."),
    },
    {
        "name": "Webhooks",
        "description": ("Webhook endpoints for registering webhook endpoints and " "triggering webhooks for events."),
    },
    {
        "name": "Notifications",
        "description": ("Notification endpoints for creating and managing user " "notifications."),
    },
]


def create_app() -> FastAPI:
    logger.info(f"Creating FastAPI app for environment: {settings.ENV}")

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        """Manage startup and shutdown events."""
        logger.info("App startup: Initializing resources...")
        await initialize_redis_pool()  # Initialize Redis pool on startup
        # Add other startup logic here (e.g., database checks/migrations)
        yield
        logger.info("App shutdown: Closing resources...")
        await close_redis_pool()  # Close Redis pool on shutdown
        # Add other shutdown logic here

    app = FastAPI(
        title=settings.API.NAME,
        version=settings.API.VERSION,
        description=settings.API.DESCRIPTION,
        docs_url=settings.API.DOCS_URL,
        redoc_url=settings.API.REDOC_URL,
        lifespan=lifespan,
        openapi_tags=tags_metadata,
    )

    # Add CORS middleware if needed
    if settings.API.ALLOWED_HOSTS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.API.ALLOWED_HOSTS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],  # Consider restricting headers in production
        )
    else:
        logger.warning("CORS disabled for non-development environment.")

    # Setup Prometheus instrumentation
    Instrumentator().instrument(app).expose(app)

    # Include routers
    app.include_router(health_router, prefix="/api/health", tags=["Health"])

    app.include_router(
        audit_router,
        prefix=f"{settings.API.API_V1_STR}/audit",
        tags=["Audit Logs"],
    )
    app.include_router(
        config_router,
        prefix=f"{settings.API.API_V1_STR}/config",
        tags=["Configuration"],
    )
    app.include_router(
        feature_flags_router,
        prefix=f"{settings.API.API_V1_STR}/feature-flags",
        tags=["Feature Flags"],
    )
    app.include_router(
        logging_router,
        prefix=f"{settings.API.API_V1_STR}/logs",
        tags=["Logging"],
    )
    app.include_router(
        notifications_router,
        prefix=f"{settings.API.API_V1_STR}/notifications",
        tags=["Notifications"],
    )
    app.include_router(
        webhooks_router,
        prefix=f"{settings.API.API_V1_STR}/webhooks",
        tags=["Webhooks"],
    )

    @app.get("/", tags=["Root"])
    async def read_root():
        """
        Root endpoint providing a simple welcome message.

        Returns:
            dict: A welcome message
        """
        return {
            "message": "Welcome to the Dotmac Platform Core API",
            "version": settings.API.VERSION,
            "docs_url": settings.API.DOCS_URL,
            "openapi_url": "/openapi.json",
        }

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
        )

    # Generic Exception Handler for shared exceptions
    @app.exception_handler(BasePlatformException)
    async def platform_exception_handler(request: Request, exc: BasePlatformException):
        logger.error(
            f"Platform error handled: {exc.__class__.__name__} - "
            f"Status: {exc.status_code}, Detail: {exc.detail} "
            f"Request: {request.method} {request.url}"
            # exc_info=exc # Uncomment for full traceback in logs
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=jsonable_encoder({"detail": exc.detail}),
        )

    return app


# Create the app instance for modules that import it directly
app = create_app()

if __name__ == "__main__":
    import uvicorn

    # Load .env file for direct execution
    # Note: This might conflict if already loaded globally
    load_dotenv()
    logger.info("Starting Uvicorn server directly...")
    uvicorn.run(
        "app.main:create_app",
        host=settings.SERVER.HOST,
        port=settings.SERVER.PORT,
        reload=settings.SERVER.RELOAD,
        workers=settings.SERVER.WORKERS,
    )
