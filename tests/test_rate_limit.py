"""Tests for rate limiter."""

import time
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.rate_limit import RateLimiter


def _mock_request(ip: str = "127.0.0.1") -> MagicMock:
    request = MagicMock()
    request.client.host = ip
    request.headers = {}
    return request


class TestRateLimiter:
    def test_allows_requests_under_limit(self):
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        request = _mock_request()
        for _ in range(5):
            limiter.check(request)  # Should not raise

    def test_blocks_requests_over_limit(self):
        limiter = RateLimiter(max_requests=3, window_seconds=60)
        request = _mock_request()
        for _ in range(3):
            limiter.check(request)
        with pytest.raises(HTTPException) as exc_info:
            limiter.check(request)
        assert exc_info.value.status_code == 429

    def test_separate_limits_per_ip(self):
        limiter = RateLimiter(max_requests=2, window_seconds=60)
        req1 = _mock_request("10.0.0.1")
        req2 = _mock_request("10.0.0.2")
        for _ in range(2):
            limiter.check(req1)
            limiter.check(req2)
        # Both IPs at limit but should be independent
        with pytest.raises(HTTPException):
            limiter.check(req1)
        with pytest.raises(HTTPException):
            limiter.check(req2)

    def test_window_expiry_resets_counter(self):
        limiter = RateLimiter(max_requests=2, window_seconds=1)
        request = _mock_request()
        limiter.check(request)
        limiter.check(request)
        with pytest.raises(HTTPException):
            limiter.check(request)
        time.sleep(1.1)
        limiter.check(request)  # Should not raise after window expires

    def test_uses_forwarded_for_header(self, monkeypatch):
        monkeypatch.setenv("TRUSTED_PROXY_IPS", "10.0.0.1,10.0.0.2")
        limiter = RateLimiter(max_requests=1, window_seconds=60)
        request = _mock_request("10.0.0.1")
        request.headers = {"x-forwarded-for": "192.168.1.100, 10.0.0.1"}
        limiter.check(request)
        # Same forwarded IP should be blocked
        with pytest.raises(HTTPException):
            limiter.check(request)
        # Different client IP but same forwarded-for should also be blocked
        request2 = _mock_request("10.0.0.2")
        request2.headers = {"x-forwarded-for": "192.168.1.100"}
        with pytest.raises(HTTPException):
            limiter.check(request2)
