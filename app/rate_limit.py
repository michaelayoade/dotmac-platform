"""Redis-backed sliding-window rate limiter with in-memory fallback."""

from __future__ import annotations

import logging
import os
import threading
import time
from collections import OrderedDict, deque
from typing import Any

import redis
from fastapi import HTTPException, Request

logger = logging.getLogger(__name__)

_REDIS_RETRY_SECONDS = 5
_RATE_LIMIT_KEY_PREFIX = "rate_limit"

_REDIS_CHECK_SCRIPT = """
local key = KEYS[1]
local now_ms = tonumber(ARGV[1])
local window_ms = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
local ttl_seconds = tonumber(ARGV[5])
local cutoff = now_ms - window_ms

redis.call("ZREMRANGEBYSCORE", key, "-inf", cutoff)
local current = redis.call("ZCARD", key)
if current >= limit then
  local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
  local reset_ms = now_ms + window_ms
  if oldest[2] ~= nil then
    reset_ms = tonumber(oldest[2]) + window_ms
  end
  redis.call("EXPIRE", key, ttl_seconds)
  return {0, current, reset_ms}
end

redis.call("ZADD", key, now_ms, member)
current = current + 1
local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
local reset_ms = now_ms + window_ms
if oldest[2] ~= nil then
  reset_ms = tonumber(oldest[2]) + window_ms
end
redis.call("EXPIRE", key, ttl_seconds)
return {1, current, reset_ms}
"""

_REDIS_INSPECT_SCRIPT = """
local key = KEYS[1]
local now_ms = tonumber(ARGV[1])
local window_ms = tonumber(ARGV[2])
local ttl_seconds = tonumber(ARGV[3])
local cutoff = now_ms - window_ms

redis.call("ZREMRANGEBYSCORE", key, "-inf", cutoff)
local current = redis.call("ZCARD", key)
if current == 0 then
  redis.call("DEL", key)
  return {0, now_ms + window_ms}
end

local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
local reset_ms = now_ms + window_ms
if oldest[2] ~= nil then
  reset_ms = tonumber(oldest[2]) + window_ms
end
redis.call("EXPIRE", key, ttl_seconds)
return {current, reset_ms}
"""


class RateLimiter:
    """Per-IP sliding window rate limiter."""

    def __init__(
        self,
        max_requests: int,
        window_seconds: int,
        max_ips: int = 10_000,
        name: str | None = None,
    ):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.window_milliseconds = window_seconds * 1000
        self.max_ips = max_ips
        self.name = name or f"limiter-{id(self)}"
        self._requests: OrderedDict[str, deque[float]] = OrderedDict()
        self._lock = threading.Lock()
        self._trusted_proxies = {ip.strip() for ip in os.getenv("TRUSTED_PROXY_IPS", "").split(",") if ip.strip()}
        # Log warning if TRUSTED_PROXY_IPS is empty/unset
        if not self._trusted_proxies:
            logger.warning(
                "TRUSTED_PROXY_IPS environment variable is empty or not set. "
                "X‑Forwarded‑For headers will be ignored, which may cause all "
                "rate‑limit tracking to collapse to the proxy IP."
            )
        self._redis_url: str | None = None
        self._redis_client: redis.Redis | None = None
        self._redis_check: Any | None = None
        self._redis_inspect: Any | None = None
        self._redis_retry_after = 0.0

    def _client_ip(self, request: Request) -> str:
        if request.client is None:
            return "unknown"
        
        immediate_ip = request.client.host
        
        # Check if immediate IP is a trusted proxy
        if immediate_ip in self._trusted_proxies:
            # Only then trust X-Forwarded-For
            forwarded = request.headers.get("x-forwarded-for")
            if forwarded:
                # Take the first IP in the chain (client's original IP)
                return forwarded.split(",")[0].strip()
        
        return immediate_ip

    def _redis_key(self, ip: str) -> str:
        return f"{_RATE_LIMIT_KEY_PREFIX}:{self.name}:{ip}"

    def _now_ms(self) -> int:
        return int(time.time() * 1000)

    def _parse_redis_int(self, value: Any) -> int:
        if isinstance(value, bytes):
            return int(value.decode("utf-8"))
        return int(value)

    def _get_redis_client(self) -> redis.Redis | None:
        redis_url = os.getenv("REDIS_URL")
        if not redis_url:
            self._redis_url = None
            self._redis_client = None
            self._redis_check = None
            self._redis_inspect = None
            return None
        if self._redis_url and self._redis_url != redis_url:
            self._redis_client = None
            self._redis_check = None
            self._redis_inspect = None
        self._redis_url = redis_url
        now = time.time()
        if self._redis_client is not None:
            return self._redis_client
        if now < self._redis_retry_after:
            return None
        try:
            client = redis.Redis.from_url(redis_url)
            client.ping()
            self._redis_client = client
            self._redis_check = client.register_script(_REDIS_CHECK_SCRIPT)
            self._redis_inspect = client.register_script(_REDIS_INSPECT_SCRIPT)
            return client
        except redis.RedisError:
            self._redis_retry_after = now + _REDIS_RETRY_SECONDS
            self._redis_client = None
            self._redis_check = None
            self._redis_inspect = None
            return None

    def _redis_check_limit(self, ip: str) -> tuple[bool, int, int] | None:
        client = self._get_redis_client()
        script = self._redis_check
        if not client or script is None:
            return None
        now_ms = self._now_ms()
        key = self._redis_key(ip)
        member = f"{now_ms}-{time.time_ns()}"
        try:
            result = script(
                keys=[key],
                args=[
                    now_ms,
                    self.window_milliseconds,
                    self.max_requests,
                    member,
                    self.window_seconds,
                ],
            )
            allowed = self._parse_redis_int(result[0]) == 1
            count = self._parse_redis_int(result[1])
            reset_ms = self._parse_redis_int(result[2])
            return allowed, count, reset_ms
        except redis.RedisError:
            self._redis_retry_after = time.time() + _REDIS_RETRY_SECONDS
            self._redis_client = None
            self._redis_check = None
            self._redis_inspect = None
            return None

    def _redis_inspect_limit(self, ip: str) -> tuple[int, int] | None:
        client = self._get_redis_client()
        script = self._redis_inspect
        if not client or script is None:
            return None
        now_ms = self._now_ms()
        key = self._redis_key(ip)
        try:
            result = script(
                keys=[key],
                args=[
                    now_ms,
                    self.window_milliseconds,
                    self.window_seconds,
                ],
            )
            count = self._parse_redis_int(result[0])
            reset_ms = self._parse_redis_int(result[1])
            return count, reset_ms
        except redis.RedisError:
            self._redis_retry_after = time.time() + _REDIS_RETRY_SECONDS
            self._redis_client = None
            self._redis_check = None
            self._redis_inspect = None
            return None

    def _check_in_memory(self, ip: str) -> None:
        now = time.time()
        cutoff = now - self.window_seconds
        with self._lock:
            timestamps = self._requests.get(ip)
            if not timestamps:
                timestamps = deque()
                self._requests[ip] = timestamps
            else:
                self._requests.move_to_end(ip)

            while timestamps and timestamps[0] <= cutoff:
                timestamps.popleft()

            if len(timestamps) >= self.max_requests:
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later.",
                )
            timestamps.append(now)

            while len(self._requests) > self.max_ips:
                self._requests.popitem(last=False)

    def _inspect_in_memory(self, ip: str) -> tuple[int, int]:
        now = time.time()
        cutoff = now - self.window_seconds
        with self._lock:
            timestamps = self._requests.get(ip)
            if not timestamps:
                window_start = now - (now % self.window_seconds)
                return 0, int(window_start + self.window_seconds)

            while timestamps and timestamps[0] <= cutoff:
                timestamps.popleft()

            if not timestamps:
                window_start = now - (now % self.window_seconds)
                return 0, int(window_start + self.window_seconds)

            oldest = min(timestamps)
            return len(timestamps), int(oldest + self.window_seconds)

    def check(self, request: Request) -> None:
        """Raise 429 if rate limit exceeded."""
        ip = self._client_ip(request)
        redis_result = self._redis_check_limit(ip)
        if redis_result:
            allowed, _, _ = redis_result
            if not allowed:
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later.",
                )
            return
        self._check_in_memory(ip)

    def get_remaining(self, request: Request) -> int:
        """Get remaining requests for the client in the current window."""
        ip = self._client_ip(request)
        redis_result = self._redis_inspect_limit(ip)
        if redis_result:
            count, _ = redis_result
            return max(0, self.max_requests - count)
        count, _ = self._inspect_in_memory(ip)
        return max(0, self.max_requests - count)

    def get_reset_time(self, request: Request) -> int:
        """Get the Unix timestamp when the current window resets."""
        ip = self._client_ip(request)
        redis_result = self._redis_inspect_limit(ip)
        if redis_result:
            _, reset_ms = redis_result
            return int(reset_ms / 1000)
        _, reset_time = self._inspect_in_memory(ip)
        return reset_time

    def reset(self) -> None:
        """Clear local fallback state and Redis keys for this limiter."""
        with self._lock:
            self._requests.clear()
        client = self._get_redis_client()
        if not client:
            return
        try:
            keys = list(client.scan_iter(match=f"{_RATE_LIMIT_KEY_PREFIX}:{self.name}:*"))
            if keys:
                client.delete(*keys)
        except redis.RedisError:
            self._redis_retry_after = time.time() + _REDIS_RETRY_SECONDS
            self._redis_client = None
            self._redis_check = None
            self._redis_inspect = None


# Pre-configured limiters for different endpoint types
login_limiter = RateLimiter(max_requests=10, window_seconds=60, name="login")
password_reset_limiter = RateLimiter(max_requests=5, window_seconds=300, name="password-reset")
mfa_verify_limiter = RateLimiter(max_requests=5, window_seconds=300, name="mfa-verify")
refresh_limiter = RateLimiter(max_requests=10, window_seconds=60, name="refresh")
password_change_limiter = RateLimiter(max_requests=10, window_seconds=60, name="password-change")
signup_limiter = RateLimiter(max_requests=5, window_seconds=300, name="signup")
signup_verify_limiter = RateLimiter(max_requests=10, window_seconds=300, name="signup-verify")
signup_resend_limiter = RateLimiter(max_requests=5, window_seconds=300, name="signup-resend")
github_webhook_limiter = RateLimiter(max_requests=60, window_seconds=60, name="github-webhook")
