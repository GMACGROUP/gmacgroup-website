"""Flutterwave checkout, verification, and webhook endpoints."""

from datetime import datetime, timezone
from uuid import uuid4

import httpx
from fastapi import APIRouter, Header, HTTPException, Request, status

from app.core.config import get_settings
from app.data import APPLICATIONS, ENROLMENTS, OPPORTUNITIES, PAYMENTS, PROGRAMMES, new_record
from app.schemas.payment import PaymentInitialize, PaymentInitializeOut, PaymentVerifyOut

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


def _complete_payment(payment: dict, transaction_status: str, transaction_id: str | None = None) -> dict:
    if transaction_status != "successful":
        payment["status"] = "failed"
        return payment
    if payment["status"] == "successful":
        return payment

    payment["status"] = "successful"
    payment["transaction_id"] = transaction_id
    payment["paid_at"] = datetime.now(timezone.utc)
    details = payment["details"]
    if payment["target_type"] == "programme":
        ENROLMENTS.append(new_record({
            "programme_id": payment["target_id"],
            "programme_title": payment["target_title"],
            "user_id": payment.get("user_id"),
            "full_name": payment.get("full_name") or details.get("full_name") or "Applicant",
            "email": payment["email"],
            "phone": details.get("phone"),
            "organization": details.get("organization"),
            "notes": details.get("notes"),
            "offer_type": payment["offer_type"],
            "status": "confirmed",
        }))
    else:
        APPLICATIONS.append(new_record({
            "opportunity_id": payment["target_id"],
            "opportunity_title": payment["target_title"],
            "user_id": payment.get("user_id"),
            "applicant_name": payment.get("full_name") or details.get("applicant_name") or "Applicant",
            "applicant_email": payment["email"],
            "phone": details.get("phone"),
            "linkedin_url": details.get("linkedin_url"),
            "cover_note": details.get("cover_note"),
            "offer_type": payment["offer_type"],
            "status": "submitted",
        }))
    return payment


@router.post("/initialize", response_model=PaymentInitializeOut)
async def initialize_payment(payload: PaymentInitialize, request: Request):
    target, offer = _find_target(payload)
    if offer["amount"] <= 0:
        return PaymentInitializeOut(status="free", amount=0, currency=offer["currency"])
    if not settings.FLW_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Flutterwave payments are not configured")

    reference = f"gmac_{uuid4().hex}"
    payment = new_record({
        "reference": reference,
        "target_type": payload.target_type,
        "target_id": payload.target_id,
        "target_title": target["title"],
        "offer_type": payload.offer_type,
        "amount": offer["amount"],
        "currency": offer["currency"],
        "email": str(payload.email),
        "full_name": payload.full_name,
        "details": payload.details,
        "status": "pending",
    })
    PAYMENTS.append(payment)

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
        payment["status"] = "failed"
        raise HTTPException(status_code=502, detail="Flutterwave could not initialize checkout")
    checkout_url = response.json().get("data", {}).get("link")
    if not checkout_url:
        payment["status"] = "failed"
        raise HTTPException(status_code=502, detail="Flutterwave returned no checkout URL")
    return PaymentInitializeOut(status="pending", reference=reference, checkout_url=checkout_url, amount=offer["amount"], currency=offer["currency"])


async def _verify(reference: str, transaction_id: str | None) -> PaymentVerifyOut:
    payment = next((item for item in PAYMENTS if item["reference"] == reference), None)
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
        and float(data.get("amount", 0)) >= float(payment["amount"])
        and data.get("currency") == payment["currency"]
    )
    _complete_payment(payment, "successful" if valid else "failed", transaction_id)
    return PaymentVerifyOut(status=payment["status"], reference=reference, target_type=payment["target_type"], target_id=payment["target_id"])


@router.get("/{reference}/verify", response_model=PaymentVerifyOut)
async def verify_payment(reference: str, transaction_id: str):
    return await _verify(reference, transaction_id)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def payment_webhook(request: Request, verif_hash: str | None = Header(default=None, alias="verif-hash")):
    if settings.FLW_WEBHOOK_SECRET_HASH and verif_hash != settings.FLW_WEBHOOK_SECRET_HASH:
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    body = await request.json()
    data = body.get("data", {})
    reference = data.get("tx_ref")
    if reference and data.get("id"):
        await _verify(reference, str(data["id"]))
    return {"received": True}