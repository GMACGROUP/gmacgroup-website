import logging
import re
import time
import traceback

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.core.config import get_settings
from app.core.database import engine
from app.api.routes import (
    auth,
    users,
    services,
    programmes,
    opportunities,
    research,
    contact,
    ai,
    payments,
    admin,
    uploads,
    team,
    events,
)

from app.services.notifications import notification_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(
    title="GMACGROUP API",
    description="Backend API powering the Gmac Group website.",
    version="0.2.0",
    # The interactive API docs list every endpoint; keep them off in production.
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

DEV_ORIGINS = ["http://127.0.0.1:3000", "http://localhost:3000"]
TRUSTED_ORIGINS = set(settings.ALLOWED_ORIGINS + ([] if settings.is_production else DEV_ORIGINS))
DEV_ORIGIN_RE = None if settings.is_production else re.compile(r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$")
UNSAFE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
# Endpoints that outside services call without a browser Origin (payment webhooks).
ORIGIN_EXEMPT_PREFIXES = ("/api/v1/payments/webhook",)

_last_alert: dict[str, float] = {}


@app.middleware("http")
async def protect_and_report(request: Request, call_next):
    # Cross-site request forgery guard: a request that relies on the session cookie
    # (no Authorization header) must come from one of our own sites.
    if (
        request.method in UNSAFE_METHODS
        and settings.SESSION_COOKIE_NAME in request.cookies
        and "authorization" not in request.headers
        and not request.url.path.startswith(ORIGIN_EXEMPT_PREFIXES)
    ):
        origin = request.headers.get("origin")
        trusted = origin in TRUSTED_ORIGINS or bool(DEV_ORIGIN_RE and origin and DEV_ORIGIN_RE.match(origin))
        if origin is not None and not trusted:
            return JSONResponse({"detail": "Request blocked: unknown origin"}, status_code=403)

    try:
        response = await call_next(request)
    except Exception as exc:  # unhandled error: log it, alert once an hour per error type, return a clean 500
        key = f"{type(exc).__name__}:{request.url.path}"
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        now = time.monotonic()
        if now - _last_alert.get(key, -3600) >= 3600:
            _last_alert[key] = now
            notification_service.fire_and_forget(
                notification_service.notify_error_alert(
                    f"{type(exc).__name__} on {request.method} {request.url.path}",
                    "The API hit an unexpected error. Details for whoever maintains the site:\n\n"
                    + "".join(traceback.format_exception(exc))[-4000:]
                    + "\n\nYou will get at most one email per hour for this error.",
                )
            )
        response = JSONResponse({"detail": "Something went wrong on our side. Please try again shortly."}, status_code=500)

    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    if settings.is_production:
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(TRUSTED_ORIGINS),
    allow_origin_regex=DEV_ORIGIN_RE.pattern if DEV_ORIGIN_RE else None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Accept", "Authorization", "Content-Type"],
)

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=f"{API_PREFIX}/auth", tags=["Auth"])
app.include_router(users.router, prefix=f"{API_PREFIX}/users", tags=["Users"])
app.include_router(services.router, prefix=f"{API_PREFIX}/services", tags=["Services"])
app.include_router(programmes.router, prefix=f"{API_PREFIX}/programmes", tags=["Programmes"])
app.include_router(opportunities.router, prefix=f"{API_PREFIX}/opportunities", tags=["Opportunities"])
app.include_router(research.router, prefix=f"{API_PREFIX}/research", tags=["Research"])
app.include_router(contact.router, prefix=f"{API_PREFIX}/contact", tags=["Contact"])
app.include_router(ai.router, prefix=f"{API_PREFIX}/ai", tags=["AI"])
app.include_router(payments.router, prefix=f"{API_PREFIX}/payments", tags=["Payments"])
app.include_router(admin.router, prefix=f"{API_PREFIX}/admin", tags=["Admin Operations"])
app.include_router(team.router, prefix=f"{API_PREFIX}/team", tags=["Team"])
app.include_router(team.admin_router, prefix=f"{API_PREFIX}/admin/team", tags=["Admin Operations"])
app.include_router(events.router, prefix=f"{API_PREFIX}/events", tags=["Events"])
app.include_router(events.admin_router, prefix=f"{API_PREFIX}/admin/events", tags=["Admin Operations"])
app.include_router(uploads.router, prefix=f"{API_PREFIX}/uploads", tags=["Document Uploads"])


@app.get("/")
async def root():
    """Basic health/info endpoint."""
    return {
        "name": "GMACGROUP API",
        "status": "ok",
        "version": "0.1.0",
    }


@app.get("/health")
async def health_check():
    """Liveness probe that does not require a database connection."""
    return {"status": "healthy"}


@app.get("/ready")
def readiness_check(response: Response):
    """Readiness probe that confirms the API can reach its database."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        logger.exception("Readiness check failed")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {"status": "not_ready"}
    return {"status": "ready"}
