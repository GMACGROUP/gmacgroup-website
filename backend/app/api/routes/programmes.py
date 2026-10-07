"""
Programme routes: student programmes, professional development,
training programmes, institutional programmes, and enrolment.
"""

from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user, get_optional_user
from app.core.database import get_db
from app.models.programme import ProgrammeEnrolment
from app.models.user import User
from app.services.notifications import notification_service
from app.schemas.programme import ProgrammeOut, EnrolmentCreate, EnrolmentOut
from app.services import catalogue

router = APIRouter()


@router.get("/", response_model=List[ProgrammeOut])
def list_programmes(category: str | None = Query(default=None), db: Session = Depends(get_db)):
    """List published programmes, optionally filtered by category."""
    items = [catalogue.to_public(i) for i in catalogue.list_items(db, "programme")]
    return [item for item in items if category is None or item.get("category") == category]


@router.get("/my-enrolments", response_model=List[EnrolmentOut])
def list_my_enrolments(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all cohort enrolments for the authenticated user."""
    user_id = current_user.get("id")
    user_email = current_user.get("email", "").lower()
    return db.scalars(
        select(ProgrammeEnrolment)
        .where(or_(ProgrammeEnrolment.user_id == user_id, ProgrammeEnrolment.email == user_email))
        .order_by(ProgrammeEnrolment.created_at.desc())
    ).all()


@router.get("/{programme_id}", response_model=ProgrammeOut)
def get_programme(programme_id: str, db: Session = Depends(get_db)):
    """Get a single published programme by id."""
    return catalogue.to_public(catalogue.get_item(db, "programme", programme_id))


@router.post("/{programme_id}/enrol", response_model=EnrolmentOut)
async def enrol_in_programme(
    programme_id: str,
    payload: EnrolmentCreate,
    background_tasks: BackgroundTasks,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Create an enrolment for an authenticated member or guest applicant."""
    item = catalogue.get_item(db, "programme", programme_id)
    programme = catalogue.to_public(item)
    if catalogue.is_closed(item):
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="This programme is closed")
    offer = next((item for item in programme.get("offers", []) if item["type"] == payload.offer_type.value), None)
    if offer is None or offer["amount"] > 0:
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Complete payment before selecting this offer")

    user_id = current_user.get("id") if current_user else None
    email = current_user.get("email") if current_user else payload.email
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An email address is required to enrol in a programme.",
        )
    email = str(email).lower().strip()
    name = current_user.get("full_name") if current_user else (payload.full_name or "Applicant")
    if user_id is None:
        matched_user = db.scalar(select(User).where(User.email == email))
        user_id = matched_user.id if matched_user else None

    existing_enrolment = db.scalar(
        select(ProgrammeEnrolment).where(
            ProgrammeEnrolment.programme_id == programme_id,
            func.lower(ProgrammeEnrolment.email) == email,
        )
    )
    if existing_enrolment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already enrolled in this programme.",
        )

    enrolment = ProgrammeEnrolment(
        programme_id=programme_id,
        programme_title=programme["title"],
        user_id=user_id,
        full_name=name,
        email=email,
        phone=payload.phone,
        organization=payload.organization,
        notes=payload.notes,
        offer_type=payload.offer_type.value,
        status="confirmed",
    )
    db.add(enrolment)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already enrolled in this programme.",
        ) from exc
    db.refresh(enrolment)
    background_tasks.add_task(
        notification_service.notify_enrolment_submitted,
        enrolment.email or email,
        enrolment.full_name or name,
        enrolment.programme_title or "Programme",
        "\n".join(
            detail
            for detail in (
                f"Phone: {enrolment.phone}" if enrolment.phone else "",
                f"Organization: {enrolment.organization}" if enrolment.organization else "",
                f"Notes: {enrolment.notes}" if enrolment.notes else "",
                f"Offer: {enrolment.offer_type}" if enrolment.offer_type else "",
            )
            if detail
        ),
    )
    return enrolment
