import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
)

logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(
    title="GMACGROUP API",
    description="Backend API powering the GMACGROUP digital platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS + ["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    """Liveness/readiness probe."""
    return {"status": "healthy"}
