"""
Opportunity routes: internships, jobs, fellowships, and applications.
"""

from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.api.dependencies import get_current_user, get_optional_user
from app.schemas.opportunity import (
    OpportunityOut,
    ApplicationCreate,
    ApplicationOut,
)
from app.data import APPLICATIONS, OPPORTUNITIES, new_record

router = APIRouter()


@router.get("/", response_model=List[OpportunityOut])
async def list_opportunities(type: str | None = Query(default=None)):
    """List opportunities, optionally filtered by type."""
    return [item for item in OPPORTUNITIES if type is None or item["type"] == type]


@router.get("/my-applications", response_model=List[ApplicationOut])
async def list_my_applications(current_user: dict = Depends(get_current_user)):
    """List all submitted applications for the authenticated user."""
    user_id = current_user.get("id")
    user_email = current_user.get("email", "").lower()
    return [
        a for a in APPLICATIONS
        if a.get("user_id") == user_id or (a.get("applicant_email") and a.get("applicant_email").lower() == user_email)
    ]


@router.get("/{opportunity_id}", response_model=OpportunityOut)
async def get_opportunity(opportunity_id: str):
    """Get a single opportunity by id."""
    opportunity = next((item for item in OPPORTUNITIES if item["id"] == opportunity_id), None)
    if opportunity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found")
    return opportunity


@router.post("/{opportunity_id}/apply", response_model=ApplicationOut)
async def apply_to_opportunity(
    opportunity_id: str,
    payload: ApplicationCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Submit an application for an authenticated user or guest applicant."""
    opportunity = next((item for item in OPPORTUNITIES if item["id"] == opportunity_id), None)
    if opportunity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found")
    if opportunity.get("deadline") and datetime.fromisoformat(opportunity["deadline"].replace("Z", "+00:00")) < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="This opportunity is closed")
    offers = opportunity.get("offers", [])
    offer = next((item for item in offers if item["type"] == payload.offer_type.value), None)
    if offers and (offer is None or offer["amount"] > 0):
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Complete payment before selecting this offer")

    user_id = current_user.get("id") if current_user else None
    email = current_user.get("email") if current_user else (payload.applicant_email or "applicant@example.com")
    name = current_user.get("full_name") if current_user else (payload.applicant_name or "Applicant")

    application = new_record({
        "opportunity_id": opportunity_id,
        "opportunity_title": opportunity["title"],
        "user_id": user_id,
        "applicant_name": name,
        "applicant_email": email,
        "phone": payload.phone,
        "linkedin_url": payload.linkedin_url,
        "cover_note": payload.cover_note,
        "offer_type": payload.offer_type.value,
        "status": "submitted",
    })
    APPLICATIONS.append(application)
    return application
