"""Pydantic schemas for programmes, training, workshops, and enrolment."""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr


class ProgrammeCategory(str, Enum):
    STUDENT = "student"
    PROFESSIONAL_DEVELOPMENT = "professional_development"
    TRAINING = "training"
    INSTITUTIONAL = "institutional"


class OfferType(str, Enum):
    FREE = "free"
    VIP = "vip"
    PREMIUM = "premium"


class OfferOut(BaseModel):
    type: OfferType
    label: str
    amount: float
    currency: str = "GHS"


class ProgrammeOut(BaseModel):
    id: str
    title: str
    category: ProgrammeCategory
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    offers: list[OfferOut] = []

    model_config = ConfigDict(from_attributes=True)


class EnrolmentCreate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    notes: Optional[str] = None
    offer_type: OfferType = OfferType.FREE


class EnrolmentOut(BaseModel):
    id: UUID
    programme_id: str
    programme_title: Optional[str] = None
    user_id: Optional[UUID] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
