"""Small in-process rate limiter for public form endpoints.

Good enough for a single API instance. If the API is ever scaled to several
instances, move this to a shared store (for example Redis or a database table).
"""

import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import HTTPException, Request, status

_hits: dict[str, deque] = defaultdict(deque)
_lock = Lock()


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    return forwarded.split(",")[0].strip() or (request.client.host if request.client else "unknown")


def rate_limit(bucket: str, limit: int, window_seconds: int):
    """FastAPI dependency: allow `limit` requests per `window_seconds` per IP."""

    def _check(request: Request):
        key = f"{bucket}:{client_ip(request)}"
        now = time.monotonic()
        with _lock:
            q = _hits[key]
            while q and now - q[0] > window_seconds:
                q.popleft()
            if len(q) >= limit:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many submissions. Please wait a few minutes and try again.",
                )
            q.append(now)

    return _check
