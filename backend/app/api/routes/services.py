"""Routes for the public service catalog."""

from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.service import ServiceOut
from app.data import SERVICES

router = APIRouter()


@router.get("/", response_model=List[ServiceOut])
async def list_services():
    """List all published services."""
    return SERVICES


@router.get("/{service_slug}", response_model=ServiceOut)
async def get_service(service_slug: str):
    """Get a single service by slug."""
    service = next((item for item in SERVICES if item["slug"] == service_slug), None)
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return service
