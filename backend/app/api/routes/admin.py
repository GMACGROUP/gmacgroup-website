"""Protected operations endpoints for member and application management."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import require_role
from app.core.config import get_settings
from app.core.database import get_db
from app.models.contact import ContactRequest
from app.models.opportunity import Application, ApplicationEvent
from app.models.payment import Payment
from app.models.programme import ProgrammeEnrolment
from app.models.user import User
from app.schemas.admin import (
    AdminPage,
    AdminApplicationOut,
    AdminContactOut,
    AdminEmailTestRequest,
    AdminEnrolmentOut,
    AdminOverview,
    AdminPaymentOut,
    StatusUpdate,
)
from app.utils.pagination import paginate_query
from app.services.notifications import notification_service

router = APIRouter()
admin_only = require_role("admin")
APPLICATION_STATUSES = {"submitted", "under_review", "interview", "shortlisted", "accepted", "rejected", "withdrawn"}
ENROLMENT_STATUSES = {"pending", "confirmed", "completed", "cancelled", "withdrawn"}
PAYMENT_STATUSES = {"not_required", "pending", "successful", "failed"}


@router.get("/overview", response_model=AdminOverview)
def overview(_: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return AdminOverview(
        members=db.scalar(select(func.count()).select_from(User)) or 0,
        applications=db.scalar(select(func.count()).select_from(Application)) or 0,
        enrolments=db.scalar(select(func.count()).select_from(ProgrammeEnrolment)) or 0,
        contacts=db.scalar(select(func.count()).select_from(ContactRequest)) or 0,
        pending_payments=db.scalar(
            select(func.count()).select_from(Payment).where(Payment.status == "pending")
        ) or 0,
    )


@router.post("/email/test")
async def test_email_delivery(
    payload: AdminEmailTestRequest,
    _: dict = Depends(admin_only),
):
    """Send a provider test message and return safe delivery metadata."""
    settings = get_settings()
    recipient = str(payload.to or settings.OPERATIONS_EMAIL or "").strip()
    if not recipient:
        raise HTTPException(status_code=400, detail="No test recipient is configured")

    result = await notification_service.send_brevo_email_with_metadata(
        recipient,
        payload.subject,
        payload.message,
    )
    return result


@router.get("/members", response_model=AdminPage[dict])
def members(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    query = select(User).order_by(User.created_at.desc())
    page_data = paginate_query(db, query, page, page_size)
    page_data["items"] = [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization": user.organization,
            "phone": user.phone,
            "created_at": user.created_at,
        }
        for user in page_data["items"]
    ]
    return page_data


@router.get("/applications", response_model=AdminPage[AdminApplicationOut])
def applications(
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    query = select(Application).order_by(Application.created_at.desc())
    if status_filter:
        query = query.where(Application.status == status_filter)
    return paginate_query(db, query, page, page_size)


@router.patch("/applications/{application_id}", response_model=AdminApplicationOut)
async def update_application(
    application_id: UUID,
    payload: StatusUpdate,
    current_user: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    if payload.status not in APPLICATION_STATUSES:
        raise HTTPException(status_code=400, detail="Unsupported application status")
    if payload.payment_status and payload.payment_status not in PAYMENT_STATUSES:
        raise HTTPException(status_code=400, detail="Unsupported payment status")
    application.status = payload.status
    if payload.payment_status:
        application.payment_status = payload.payment_status
    application.updated_at = datetime.now(timezone.utc)
    db.add(ApplicationEvent(
        application_id=application.id,
        status=payload.status,
        note=payload.note,
        changed_by=current_user["id"],
    ))
    db.commit()
    db.refresh(application)
    if application.applicant_email:
        notification_service.fire_and_forget(
            notification_service.notify_status_changed(
                application.applicant_email,
                application.applicant_name or "Applicant",
                application.opportunity_title or "Opportunity",
                application.status,
            )
        )
    return application


@router.get("/enrolments", response_model=AdminPage[AdminEnrolmentOut])
def enrolments(
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    query = select(ProgrammeEnrolment).order_by(ProgrammeEnrolment.created_at.desc())
    if status_filter:
        query = query.where(ProgrammeEnrolment.status == status_filter)
    return paginate_query(db, query, page, page_size)


@router.patch("/enrolments/{enrolment_id}", response_model=AdminEnrolmentOut)
def update_enrolment(
    enrolment_id: UUID,
    payload: StatusUpdate,
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    enrolment = db.get(ProgrammeEnrolment, enrolment_id)
    if enrolment is None:
        raise HTTPException(status_code=404, detail="Enrolment not found")
    if payload.status not in ENROLMENT_STATUSES:
        raise HTTPException(status_code=400, detail="Unsupported enrolment status")
    if payload.payment_status and payload.payment_status not in PAYMENT_STATUSES:
        raise HTTPException(status_code=400, detail="Unsupported payment status")
    enrolment.status = payload.status
    if payload.payment_status:
        enrolment.payment_status = payload.payment_status
    enrolment.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(enrolment)
    return enrolment


@router.get("/contacts", response_model=AdminPage[AdminContactOut])
def contacts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    query = select(ContactRequest).order_by(ContactRequest.created_at.desc())
    return paginate_query(db, query, page, page_size)


@router.get("/payments", response_model=AdminPage[AdminPaymentOut])
def payments(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    query = select(Payment).order_by(Payment.created_at.desc())
    return paginate_query(db, query, page, page_size)


# ---------------------------------------------------------------------------
# Dynamic Catalog Management (Programmes & Opportunities)
# ---------------------------------------------------------------------------

from uuid import uuid4
import re
from app.data import PROGRAMMES, OPPORTUNITIES
from app.schemas.programme import ProgrammeCreate, ProgrammeOut, ProgrammeUpdate
from app.schemas.opportunity import OpportunityCreate, OpportunityOut, OpportunityUpdate


def _slugify(text: str) -> str:
    clean = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    return re.sub(r"[\s-]+", "-", clean)


@router.post("/programmes", response_model=ProgrammeOut, status_code=status.HTTP_201_CREATED)
async def create_programme(payload: ProgrammeCreate, _: dict = Depends(admin_only)):
    """Create a new cohort programme."""
    slug = f"programme-{_slugify(payload.title)[:30]}-{uuid4().hex[:6]}"
    category_val = payload.category.value if hasattr(payload.category, "value") else str(payload.category)
    
    new_item = {
        "id": slug,
        "title": payload.title,
        "category": category_val,
        "description": payload.description,
        "start_date": payload.start_date.isoformat() if payload.start_date else None,
        "end_date": payload.end_date.isoformat() if payload.end_date else None,
        "offers": [
            {
                "type": o.type.value if hasattr(o.type, "value") else str(o.type),
                "label": o.label,
                "amount": o.amount,
                "currency": o.currency,
            }
            for o in payload.offers
        ] if payload.offers else [
            {"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}
        ],
    }
    PROGRAMMES.insert(0, new_item)
    return new_item


@router.put("/programmes/{programme_id}", response_model=ProgrammeOut)
async def update_programme(programme_id: str, payload: ProgrammeUpdate, _: dict = Depends(admin_only)):
    """Update an existing cohort programme."""
    prog = next((item for item in PROGRAMMES if item["id"] == programme_id), None)
    if prog is None:
        raise HTTPException(status_code=404, detail="Programme not found")

    if payload.title is not None:
        prog["title"] = payload.title
    if payload.category is not None:
        prog["category"] = payload.category.value if hasattr(payload.category, "value") else str(payload.category)
    if payload.description is not None:
        prog["description"] = payload.description
    if payload.start_date is not None:
        prog["start_date"] = payload.start_date.isoformat()
    if payload.end_date is not None:
        prog["end_date"] = payload.end_date.isoformat()
    if payload.offers is not None:
        prog["offers"] = [
            {
                "type": o.type.value if hasattr(o.type, "value") else str(o.type),
                "label": o.label,
                "amount": o.amount,
                "currency": o.currency,
            }
            for o in payload.offers
        ]
    return prog


@router.delete("/programmes/{programme_id}", status_code=status.HTTP_200_OK)
async def delete_programme(programme_id: str, _: dict = Depends(admin_only)):
    """Remove a cohort programme from active catalogue."""
    index = next((i for i, item in enumerate(PROGRAMMES) if item["id"] == programme_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Programme not found")
    removed = PROGRAMMES.pop(index)
    return {"status": "deleted", "id": programme_id, "title": removed["title"]}


@router.post("/opportunities", response_model=OpportunityOut, status_code=status.HTTP_201_CREATED)
async def create_opportunity(payload: OpportunityCreate, _: dict = Depends(admin_only)):
    """Create a new job, internship, or fellowship opportunity."""
    slug = f"opportunity-{_slugify(payload.title)[:30]}-{uuid4().hex[:6]}"
    type_val = payload.type.value if hasattr(payload.type, "value") else str(payload.type)

    new_item = {
        "id": slug,
        "title": payload.title,
        "type": type_val,
        "organization": payload.organization or "GMAC GROUP",
        "location": payload.location or "Accra / Hybrid",
        "description": payload.description,
        "deadline": payload.deadline.isoformat() if payload.deadline else None,
        "offers": [
            {
                "type": o.type.value if hasattr(o.type, "value") else str(o.type),
                "label": o.label,
                "amount": o.amount,
                "currency": o.currency,
            }
            for o in payload.offers
        ] if payload.offers else [
            {"type": "free", "label": "Free Application", "amount": 0, "currency": "GHS"}
        ],
    }
    OPPORTUNITIES.insert(0, new_item)
    return new_item


@router.put("/opportunities/{opportunity_id}", response_model=OpportunityOut)
async def update_opportunity(opportunity_id: str, payload: OpportunityUpdate, _: dict = Depends(admin_only)):
    """Update an existing opportunity."""
    opp = next((item for item in OPPORTUNITIES if item["id"] == opportunity_id), None)
    if opp is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if payload.title is not None:
        opp["title"] = payload.title
    if payload.type is not None:
        opp["type"] = payload.type.value if hasattr(payload.type, "value") else str(payload.type)
    if payload.organization is not None:
        opp["organization"] = payload.organization
    if payload.location is not None:
        opp["location"] = payload.location
    if payload.description is not None:
        opp["description"] = payload.description
    if payload.deadline is not None:
        opp["deadline"] = payload.deadline.isoformat()
    if payload.offers is not None:
        opp["offers"] = [
            {
                "type": o.type.value if hasattr(o.type, "value") else str(o.type),
                "label": o.label,
                "amount": o.amount,
                "currency": o.currency,
            }
            for o in payload.offers
        ]
    return opp


@router.delete("/opportunities/{opportunity_id}", status_code=status.HTTP_200_OK)
async def delete_opportunity(opportunity_id: str, _: dict = Depends(admin_only)):
    """Remove an opportunity from active catalogue."""
    index = next((i for i, item in enumerate(OPPORTUNITIES) if item["id"] == opportunity_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    removed = OPPORTUNITIES.pop(index)
    return {"status": "deleted", "id": opportunity_id, "title": removed["title"]}
