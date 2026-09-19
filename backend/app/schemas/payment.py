"""Schemas for Flutterwave checkout and payment verification."""

from typing import Any, Literal
from pydantic import BaseModel, EmailStr


class PaymentInitialize(BaseModel):
    target_type: Literal["programme", "opportunity"]
    target_id: str
    offer_type: Literal["free", "vip", "premium"]
    email: EmailStr
    full_name: str | None = None
    details: dict[str, Any] = {}


class PaymentInitializeOut(BaseModel):
    status: Literal["free", "pending"]
    reference: str | None = None
    checkout_url: str | None = None
    amount: float
    currency: str


class PaymentVerifyOut(BaseModel):
    status: Literal["successful", "failed", "pending"]
    reference: str
    target_type: str
    target_id: str