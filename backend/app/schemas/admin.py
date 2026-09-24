"""Schemas for protected GMAC operations workflows."""

from datetime import datetime
from decimal import Decimal
from typing import Generic, TypeVar
from uuid import UUID

from pydantic import EmailStr, Field
from pydantic import BaseModel, ConfigDict


ItemT = TypeVar("ItemT")


class AdminPage(BaseModel, Generic[ItemT]):
    total: int
    page: int
    page_size: int
    items: list[ItemT]


class StatusUpdate(BaseModel):
    status: str
    payment_status: str | None = None
    note: str | None = None


class AdminApplicationOut(BaseModel):
    id: UUID
    opportunity_id: str
    opportunity_title: str | None = None
    user_id: UUID | None = None
    applicant_name: str | None = None
    applicant_email: str | None = None
    phone: str | None = None
    linkedin_url: str | None = None
    cover_note: str | None = None
    resume_url: str | None = None
    offer_type: str
    payment_status: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminEnrolmentOut(BaseModel):
    id: UUID
    programme_id: str
    programme_title: str | None = None
    user_id: UUID | None = None
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    organization: str | None = None
    notes: str | None = None
    offer_type: str
    payment_status: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminPaymentOut(BaseModel):
    id: UUID
    target_type: str
    target_title: str
    offer_type: str
    amount: Decimal
    currency: str
    provider_reference: str
    provider_transaction_id: str | None = None
    email: str
    full_name: str | None = None
    status: str
    created_at: datetime
    paid_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class AdminContactOut(BaseModel):
    id: UUID
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminOverview(BaseModel):
    members: int
    applications: int
    enrolments: int
    contacts: int
    pending_payments: int


class AdminEmailTestRequest(BaseModel):
    to: EmailStr | None = None
    subject: str = Field(default="GMAC GROUP email delivery test", min_length=1, max_length=160)
    message: str = Field(
        default="This is a live email delivery test from the GMAC GROUP backend.",
        min_length=1,
        max_length=5000,
    )
