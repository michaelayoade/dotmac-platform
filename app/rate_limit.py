"""
Simple in-memory rate limiter for sensitive endpoints.

Uses a sliding window counter per IP address. For production with
multiple workers, switch to Redis-backed rate limiting.
"""

from __future__ import annotations

import os
import threading
import time
from collections import OrderedDict, deque

from fastapi import HTTPException, Request


class RateLimiter:
    """Per-IP sliding window rate limiter."""

    def __init__(self, max_requests: int, window_seconds: int, max_ips: int = 10_000):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.max_ips = max_ips
        self._requests: OrderedDict[str, deque[float]] = OrderedDict()
        self._lock = threading.Lock()
        self._trusted_proxies = {ip.strip() for ip in os.getenv("TRUSTED_PROXY_IPS", "").split(",") if ip.strip()}

    def _client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded and request.client and request.client.host in self._trusted_proxies:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def check(self, request: Request) -> None:
        """Raise 429 if rate limit exceeded."""
        ip = self._client_ip(request)
        now = time.time()
        cutoff = now - self.window_seconds

        with self._lock:
            timestamps = self._requests.get(ip)
            if not timestamps:
                timestamps = deque()
                self._requests[ip] = timestamps
            else:
                # Keep LRU order fresh for eviction.
                self._requests.move_to_end(ip)

            # Remove expired entries.
            while timestamps and timestamps[0] <= cutoff:
                timestamps.popleft()

            if len(timestamps) >= self.max_requests:
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later.",
                )
            timestamps.append(now)

            # Evict least-recently-used IPs if we exceed capacity.
            while len(self._requests) > self.max_ips:
                self._requests.popitem(last=False)


# Pre-configured limiters for different endpoint types
login_limiter = RateLimiter(max_requests=10, window_seconds=60)
password_reset_limiter = RateLimiter(max_requests=5, window_seconds=300)
mfa_verify_limiter = RateLimiter(max_requests=5, window_seconds=300)
refresh_limiter = RateLimiter(max_requests=10, window_seconds=60)
password_change_limiter = RateLimiter(max_requests=10, window_seconds=60)
