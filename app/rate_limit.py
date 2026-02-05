"""
Simple in-memory rate limiter for sensitive endpoints.

Uses a sliding window counter per IP address. For production with
multiple workers, switch to Redis-backed rate limiting.
"""
from __future__ import annotations

import time
import threading
from collections import defaultdict

from fastapi import HTTPException, Request


class RateLimiter:
    """Per-IP sliding window rate limiter."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._lock = threading.Lock()

    def _client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def check(self, request: Request) -> None:
        """Raise 429 if rate limit exceeded."""
        ip = self._client_ip(request)
        now = time.time()
        cutoff = now - self.window_seconds

        with self._lock:
            timestamps = self._requests[ip]
            # Remove expired entries
            self._requests[ip] = [t for t in timestamps if t > cutoff]
            if len(self._requests[ip]) >= self.max_requests:
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later.",
                )
            self._requests[ip].append(now)


# Pre-configured limiters for different endpoint types
login_limiter = RateLimiter(max_requests=10, window_seconds=60)
password_reset_limiter = RateLimiter(max_requests=5, window_seconds=300)
