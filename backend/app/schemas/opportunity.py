"""Pydantic schemas for internships, jobs, fellowships, and applications."""

from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class OpportunityType(str, Enum):
    INTERNSHIP = "internship"
    EMPLOYMENT = "employment"
    FELLOWSHIP = "fellowship"
    OTHER = "other"


class OfferType(str, Enum):
    FREE = "free"
    VIP = "vip"
    PREMIUM = "premium"


class OfferOut(BaseModel):
    type: OfferType
    label: str
    amount: float
    currency: str = "GHS"


class OpportunityOut(BaseModel):
    id: str
    title: str
    type: OpportunityType
    organization: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    offers: list[OfferOut] = []

    model_config = ConfigDict(from_attributes=True)


class ApplicationCreate(BaseModel):
    applicant_name: Optional[str] = None
    applicant_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    cover_note: Optional[str] = None
    resume_url: Optional[str] = None
    offer_type: OfferType = OfferType.FREE


class ApplicationStatus(str, Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class ApplicationOut(BaseModel):
    id: str
    opportunity_id: str
    opportunity_title: Optional[str] = None
    user_id: Optional[str] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    status: ApplicationStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
