"""Protected operations endpoints for member and application management."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import require_role
from app.core.database import get_db
from app.models.contact import ContactRequest
from app.models.opportunity import Application, ApplicationEvent
from app.models.payment import Payment
from app.models.programme import ProgrammeEnrolment
from app.models.user import User
from app.schemas.admin import (
    AdminApplicationOut,
    AdminContactOut,
    AdminEnrolmentOut,
    AdminOverview,
    AdminPaymentOut,
    StatusUpdate,
)

router = APIRouter()
admin_only = require_role("admin")
APPLICATION_STATUSES = {"submitted", "under_review", "interview", "shortlisted", "accepted", "rejected", "withdrawn"}
ENROLMENT_STATUSES = {"pending", "confirmed", "completed", "cancelled", "withdrawn"}
PAYMENT_STATUSES = {"not_required", "pending", "successful", "failed"}


@router.get("/overview", response_model=AdminOverview)
async def overview(_: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return AdminOverview(
        members=db.scalar(select(func.count()).select_from(User)) or 0,
        applications=db.scalar(select(func.count()).select_from(Application)) or 0,
        enrolments=db.scalar(select(func.count()).select_from(ProgrammeEnrolment)) or 0,
        contacts=db.scalar(select(func.count()).select_from(ContactRequest)) or 0,
        pending_payments=db.scalar(
            select(func.count()).select_from(Payment).where(Payment.status == "pending")
        ) or 0,
    )


@router.get("/members", response_model=list[dict])
async def members(_: dict = Depends(admin_only), db: Session = Depends(get_db)):
    users = db.scalars(select(User).order_by(User.created_at.desc())).all()
    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization": user.organization,
            "phone": user.phone,
            "created_at": user.created_at,
        }
        for user in users
    ]


@router.get("/applications", response_model=list[AdminApplicationOut])
async def applications(
    status_filter: str | None = Query(default=None, alias="status"),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    query = select(Application).order_by(Application.created_at.desc())
    if status_filter:
        query = query.where(Application.status == status_filter)
    return db.scalars(query).all()


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
    return application


@router.get("/enrolments", response_model=list[AdminEnrolmentOut])
async def enrolments(
    status_filter: str | None = Query(default=None, alias="status"),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    query = select(ProgrammeEnrolment).order_by(ProgrammeEnrolment.created_at.desc())
    if status_filter:
        query = query.where(ProgrammeEnrolment.status == status_filter)
    return db.scalars(query).all()


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
    return enrolment


@router.get("/contacts", response_model=list[AdminContactOut])
async def contacts(_: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return db.scalars(select(ContactRequest).order_by(ContactRequest.created_at.desc())).all()


@router.get("/payments", response_model=list[AdminPaymentOut])
async def payments(_: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return db.scalars(select(Payment).order_by(Payment.created_at.desc())).all()
