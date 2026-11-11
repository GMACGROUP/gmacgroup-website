"""Schemas for Flutterwave checkout and payment verification."""

from typing import Any, Literal
from pydantic import BaseModel, EmailStr, Field, field_validator


class PaymentInitialize(BaseModel):
    target_type: Literal["programme", "opportunity"]
    target_id: str
    offer_type: Literal["free", "vip", "premium"]
    email: EmailStr
    full_name: str | None = Field(default=None, max_length=160)
    details: dict[str, Any] = {}

    @field_validator("details")
    @classmethod
    def small_details(cls, v):
        import json

        if len(json.dumps(v, default=str)) > 8000:
            raise ValueError("Too much detail submitted")
        return v


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