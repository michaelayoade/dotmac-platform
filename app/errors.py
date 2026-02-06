from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, RedirectResponse


def _error_payload(code: str, message: str, details):
    return {"code": code, "message": message, "details": details}


def register_error_handlers(app) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        # Preserve redirect responses (e.g. 302 from require_web_auth)
        if 300 <= exc.status_code < 400 and exc.headers:
            location = exc.headers.get("Location")
            if location:
                return RedirectResponse(url=location, status_code=exc.status_code)

        detail = exc.detail
        code = f"http_{exc.status_code}"
        message = "Request failed"
        details = None
        if isinstance(detail, dict):
            code = detail.get("code", code)
            message = detail.get("message", message)
            details = detail.get("details")
        elif isinstance(detail, str):
            message = detail
        else:
            details = detail
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(code, message, details),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content=_error_payload(
                "validation_error", "Validation error", exc.errors()
            ),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content=_error_payload(
                "internal_error", "Internal server error", None
            ),
        )
