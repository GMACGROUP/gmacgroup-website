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
APPLICATION_STATUSES = {
    "submitted", "under_review", "interview", "shortlisted", "approved",
    "accepted", "completed", "rejected", "cancelled", "withdrawn",
}
ENROLMENT_STATUSES = {"pending", "confirmed", "approved", "completed", "cancelled", "withdrawn"}
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

    provider = (settings.EMAIL_PROVIDER or "none").lower()
    if provider == "brevo":
        return await notification_service.send_brevo_email_with_metadata(recipient, payload.subject, payload.message)
    ok = await notification_service.send_email(recipient, payload.subject, payload.message)
    return {"success": ok, "provider": provider, "recipient": recipient}


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
async def update_enrolment(
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
    if enrolment.email:
        notification_service.fire_and_forget(
            notification_service.notify_enrolment_status_changed(
                enrolment.email,
                enrolment.full_name or "Member",
                enrolment.programme_title or "Programme",
                enrolment.status,
            )
        )
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
# Catalogue management (programmes, opportunities, publications), stored in the database
# ---------------------------------------------------------------------------

from pydantic import BaseModel

from app.schemas.opportunity import OpportunityCreate, OpportunityOut, OpportunityUpdate
from app.schemas.programme import ProgrammeCreate, ProgrammeOut, ProgrammeUpdate
from app.schemas.research import PublicationCreate, PublicationOut, PublicationUpdate
from app.services import catalogue

DEFAULT_FREE_OFFER = [{"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}]
KIND_BY_PATH = {"programmes": "programme", "opportunities": "opportunity", "publications": "publication"}


class PublishUpdate(BaseModel):
    is_published: bool


def _kind(collection: str) -> str:
    kind = KIND_BY_PATH.get(collection)
    if kind is None:
        raise HTTPException(status_code=404, detail="Unknown catalogue")
    return kind


@router.get("/catalogue/{collection}")
def list_catalogue(collection: str, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    """All items in a catalogue, drafts included, with their publish state."""
    kind = _kind(collection)
    return [catalogue.to_public(i, include_status=True) for i in catalogue.list_items(db, kind, published_only=False)]


@router.patch("/catalogue/{collection}/{item_id}")
def publish_catalogue_item(
    collection: str, item_id: str, payload: PublishUpdate, _: dict = Depends(admin_only), db: Session = Depends(get_db)
):
    """Publish or unpublish a catalogue item."""
    item = catalogue.get_item(db, _kind(collection), item_id, published_only=False)
    return catalogue.to_public(catalogue.update_item(db, item, {}, is_published=payload.is_published), include_status=True)


@router.delete("/catalogue/{collection}/{item_id}")
def delete_catalogue_item(collection: str, item_id: str, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    item = catalogue.get_item(db, _kind(collection), item_id, published_only=False)
    title = (item.data or {}).get("title")
    catalogue.delete_item(db, item)
    return {"status": "deleted", "id": item_id, "title": title}


@router.post("/programmes", response_model=ProgrammeOut, status_code=status.HTTP_201_CREATED)
def create_programme(payload: ProgrammeCreate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    """Create a programme. New items start as drafts until published."""
    data = payload.model_dump(mode="json")
    data["offers"] = data.get("offers") or DEFAULT_FREE_OFFER
    return catalogue.to_public(catalogue.create_item(db, "programme", data))


@router.put("/programmes/{programme_id}", response_model=ProgrammeOut)
def update_programme(programme_id: str, payload: ProgrammeUpdate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    item = catalogue.get_item(db, "programme", programme_id, published_only=False)
    return catalogue.to_public(catalogue.update_item(db, item, payload.model_dump(mode="json", exclude_unset=True)))


@router.delete("/programmes/{programme_id}", status_code=status.HTTP_200_OK)
def delete_programme(programme_id: str, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return delete_catalogue_item("programmes", programme_id, _, db)


@router.post("/opportunities", response_model=OpportunityOut, status_code=status.HTTP_201_CREATED)
def create_opportunity(payload: OpportunityCreate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    """Create an opportunity. New items start as drafts until published."""
    return catalogue.to_public(catalogue.create_item(db, "opportunity", payload.model_dump(mode="json")))


@router.put("/opportunities/{opportunity_id}", response_model=OpportunityOut)
def update_opportunity(opportunity_id: str, payload: OpportunityUpdate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    item = catalogue.get_item(db, "opportunity", opportunity_id, published_only=False)
    return catalogue.to_public(catalogue.update_item(db, item, payload.model_dump(mode="json", exclude_unset=True)))


@router.delete("/opportunities/{opportunity_id}", status_code=status.HTTP_200_OK)
def delete_opportunity(opportunity_id: str, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return delete_catalogue_item("opportunities", opportunity_id, _, db)


@router.post("/publications", response_model=PublicationOut, status_code=status.HTTP_201_CREATED)
def create_publication(payload: PublicationCreate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return catalogue.to_public(catalogue.create_item(db, "publication", payload.model_dump(mode="json")))


@router.put("/publications/{publication_id}", response_model=PublicationOut)
def update_publication(publication_id: str, payload: PublicationUpdate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    item = catalogue.get_item(db, "publication", publication_id, published_only=False)
    return catalogue.to_public(catalogue.update_item(db, item, payload.model_dump(mode="json", exclude_unset=True)))
