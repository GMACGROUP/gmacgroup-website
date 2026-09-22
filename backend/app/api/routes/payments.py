"""Flutterwave checkout, verification, and webhook endpoints."""

from datetime import datetime, timezone
from uuid import uuid4

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import get_optional_user
from app.core.config import get_settings
from app.core.database import get_db
from app.data import OPPORTUNITIES, PROGRAMMES
from app.models.opportunity import Application
from app.models.payment import Payment
from app.models.programme import ProgrammeEnrolment
from app.schemas.payment import PaymentInitialize, PaymentInitializeOut, PaymentVerifyOut
from app.services.notifications import notification_service

router = APIRouter()
settings = get_settings()


def _find_target(payload: PaymentInitialize) -> tuple[dict, dict]:
    collection = PROGRAMMES if payload.target_type == "programme" else OPPORTUNITIES
    target = next((item for item in collection if item["id"] == payload.target_id), None)
    if target is None:
        raise HTTPException(status_code=404, detail="Programme or opportunity not found")
    closing_date = target.get("deadline") if payload.target_type == "opportunity" else target.get("end_date")
    if closing_date and datetime.fromisoformat(closing_date.replace("Z", "+00:00")) < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="This event or opportunity is closed")
    offer = next((item for item in target.get("offers", []) if item["type"] == payload.offer_type), None)
    if offer is None:
        raise HTTPException(status_code=400, detail="That offer is not available for this item")
    return target, offer


async def _complete_payment(
    db: Session,
    payment: Payment,
    transaction_status: str,
    transaction_id: str | None = None,
) -> Payment:
    if transaction_status != "successful":
        payment.status = "failed"
        db.commit()
        return payment
    if payment.status == "successful":
        return payment

    payment.status = "successful"
    payment.provider_transaction_id = transaction_id
    payment.paid_at = datetime.now(timezone.utc)
    details = payment.details or {}
    if payment.target_type == "programme":
        enrolment = ProgrammeEnrolment(
            programme_id=payment.programme_id or "",
            programme_title=payment.target_title,
            user_id=payment.user_id,
            full_name=payment.full_name or details.get("full_name") or "Applicant",
            email=payment.email,
            phone=details.get("phone"),
            organization=details.get("organization"),
            notes=details.get("notes"),
            offer_type=payment.offer_type,
            payment_status="successful",
            status="confirmed",
        )
        db.add(enrolment)
    else:
        application = Application(
            opportunity_id=payment.opportunity_id or "",
            opportunity_title=payment.target_title,
            user_id=payment.user_id,
            applicant_name=payment.full_name or details.get("applicant_name") or "Applicant",
            applicant_email=payment.email,
            phone=details.get("phone"),
            linkedin_url=details.get("linkedin_url"),
            cover_note=details.get("cover_note"),
            resume_url=details.get("resume_url"),
            offer_type=payment.offer_type,
            payment_status="successful",
            status="submitted",
        )
        db.add(application)
    db.commit()
    if payment.target_type == "programme":
        await notification_service.notify_enrolment_submitted(
            enrolment.email,
            enrolment.full_name or "Applicant",
            enrolment.programme_title or "Programme",
            "\n".join(
                detail
                for detail in (
                    f"Phone: {enrolment.phone}" if enrolment.phone else "",
                    f"Organization: {enrolment.organization}" if enrolment.organization else "",
                    f"Notes: {enrolment.notes}" if enrolment.notes else "",
                    f"Offer: {enrolment.offer_type}" if enrolment.offer_type else "",
                    f"Payment: {payment.amount} {payment.currency}",
                )
                if detail
            ),
        )
    else:
        await notification_service.notify_application_submitted(
            application.applicant_email,
            application.applicant_name or "Applicant",
            application.opportunity_title or "Opportunity",
            "\n".join(
                detail
                for detail in (
                    f"Phone: {application.phone}" if application.phone else "",
                    f"LinkedIn: {application.linkedin_url}" if application.linkedin_url else "",
                    f"Cover note: {application.cover_note}" if application.cover_note else "",
                    f"Resume: {application.resume_url}" if application.resume_url else "",
                    f"Offer: {application.offer_type}" if application.offer_type else "",
                    f"Payment: {payment.amount} {payment.currency}",
                )
                if detail
            ),
        )
    return payment


@router.post("/initialize", response_model=PaymentInitializeOut)
async def initialize_payment(
    payload: PaymentInitialize,
    request: Request,
    current_user: dict | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    target, offer = _find_target(payload)
    if offer["amount"] <= 0:
        return PaymentInitializeOut(status="free", amount=0, currency=offer["currency"])
    if not settings.FLW_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Flutterwave payments are not configured")

    reference = f"gmac_{uuid4().hex}"
    payment = Payment(
        user_id=current_user.get("id") if current_user else None,
        programme_id=payload.target_id if payload.target_type == "programme" else None,
        opportunity_id=payload.target_id if payload.target_type == "opportunity" else None,
        target_type=payload.target_type,
        target_title=target["title"],
        offer_type=payload.offer_type,
        amount=offer["amount"],
        currency=offer["currency"],
        email=str(payload.email),
        full_name=payload.full_name,
        details=payload.details,
        provider_reference=reference,
        status="pending",
    )
    db.add(payment)
    db.commit()

    headers = {"Authorization": f"Bearer {settings.FLW_SECRET_KEY}", "Content-Type": "application/json"}
    body = {
        "tx_ref": reference,
        "amount": offer["amount"],
        "currency": offer["currency"],
        "redirect_url": f"{settings.FRONTEND_URL.rstrip('/')}/payment/callback",
        "customer": {"email": str(payload.email), "name": payload.full_name or str(payload.email)},
        "customizations": {"title": "GMACGROUP", "description": f"{offer['label']} - {target['title']}"},
        "meta": {"target_type": payload.target_type, "target_id": payload.target_id, "offer_type": payload.offer_type},
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post("https://api.flutterwave.com/v3/payments", json=body, headers=headers)
    if response.status_code >= 400:
        payment.status = "failed"
        db.commit()
        raise HTTPException(status_code=502, detail="Flutterwave could not initialize checkout")
    checkout_url = response.json().get("data", {}).get("link")
    if not checkout_url:
        payment.status = "failed"
        db.commit()
        raise HTTPException(status_code=502, detail="Flutterwave returned no checkout URL")
    return PaymentInitializeOut(status="pending", reference=reference, checkout_url=checkout_url, amount=offer["amount"], currency=offer["currency"])


async def _verify(reference: str, transaction_id: str | None, db: Session) -> PaymentVerifyOut:
    payment = db.scalar(select(Payment).where(Payment.provider_reference == reference))
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment reference not found")
    if not settings.FLW_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Flutterwave payments are not configured")
    if not transaction_id:
        raise HTTPException(status_code=400, detail="Flutterwave transaction id is required")

    headers = {"Authorization": f"Bearer {settings.FLW_SECRET_KEY}"}
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(f"https://api.flutterwave.com/v3/transactions/{transaction_id}/verify", headers=headers)
    data = response.json().get("data", {})
    valid = (
        response.status_code < 400
        and data.get("status") == "successful"
        and data.get("tx_ref") == reference
        and float(data.get("amount", 0)) >= float(payment.amount)
        and data.get("currency") == payment.currency
    )
    await _complete_payment(db, payment, "successful" if valid else "failed", transaction_id)
    return PaymentVerifyOut(status=payment.status, reference=reference, target_type=payment.target_type, target_id=payment.programme_id or payment.opportunity_id or "")


@router.get("/{reference}/verify", response_model=PaymentVerifyOut)
async def verify_payment(reference: str, transaction_id: str, db: Session = Depends(get_db)):
    return await _verify(reference, transaction_id, db)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def payment_webhook(
    request: Request,
    verif_hash: str | None = Header(default=None, alias="verif-hash"),
    db: Session = Depends(get_db),
):
    if settings.FLW_WEBHOOK_SECRET_HASH and verif_hash != settings.FLW_WEBHOOK_SECRET_HASH:
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    body = await request.json()
    data = body.get("data", {})
    reference = data.get("tx_ref")
    if reference and data.get("id"):
        await _verify(reference, str(data["id"]), db)
    return {"received": True}