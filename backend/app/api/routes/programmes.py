"""
Programme routes: student programmes, professional development,
training programmes, institutional programmes, and enrolment.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.api.dependencies import get_current_user, get_optional_user
from app.schemas.programme import ProgrammeOut, EnrolmentCreate, EnrolmentOut
from app.data import ENROLMENTS, PROGRAMMES, new_record

router = APIRouter()


@router.get("/", response_model=List[ProgrammeOut])
async def list_programmes(category: str | None = Query(default=None)):
    """List available programmes, optionally filtered by category."""
    return [item for item in PROGRAMMES if category is None or item["category"] == category]


@router.get("/my-enrolments", response_model=List[EnrolmentOut])
async def list_my_enrolments(current_user: dict = Depends(get_current_user)):
    """List all cohort enrolments for the authenticated user."""
    user_id = current_user.get("id")
    user_email = current_user.get("email", "").lower()
    return [
        e for e in ENROLMENTS
        if e.get("user_id") == user_id or (e.get("email") and e.get("email").lower() == user_email)
    ]


@router.get("/{programme_id}", response_model=ProgrammeOut)
async def get_programme(programme_id: str):
    """Get a single programme by id."""
    programme = next((item for item in PROGRAMMES if item["id"] == programme_id), None)
    if programme is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Programme not found")
    return programme


@router.post("/{programme_id}/enrol", response_model=EnrolmentOut)
async def enrol_in_programme(
    programme_id: str,
    payload: EnrolmentCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Create an enrolment for an authenticated member or guest applicant."""
    programme = next((item for item in PROGRAMMES if item["id"] == programme_id), None)
    if programme is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Programme not found")
    offer = next((item for item in programme.get("offers", []) if item["type"] == payload.offer_type.value), None)
    if offer is None or offer["amount"] > 0:
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Complete payment before selecting this offer")

    user_id = current_user.get("id") if current_user else None
    email = current_user.get("email") if current_user else (payload.email or "guest@example.com")
    name = current_user.get("full_name") if current_user else (payload.full_name or "Applicant")

    enrolment = new_record({
        "programme_id": programme_id,
        "programme_title": programme["title"],
        "user_id": user_id,
        "full_name": name,
        "email": email,
        "phone": payload.phone,
        "organization": payload.organization,
        "notes": payload.notes,
        "offer_type": payload.offer_type.value,
        "status": "confirmed",
    })
    ENROLMENTS.append(enrolment)
    return enrolment
