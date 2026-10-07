"""Pydantic schemas for internships, jobs, fellowships, and applications."""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


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


class OpportunityCreate(BaseModel):
    title: str
    type: OpportunityType = OpportunityType.INTERNSHIP
    organization: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    offers: list[OfferOut] = []


class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[OpportunityType] = None
    organization: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    offers: Optional[list[OfferOut]] = None


class ApplicationCreate(BaseModel):
    applicant_name: Optional[str] = Field(default=None, max_length=120)
    applicant_email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=40)
    linkedin_url: Optional[str] = Field(default=None, max_length=300)
    cover_note: Optional[str] = Field(default=None, max_length=4000)
    resume_url: Optional[str] = Field(default=None, max_length=500)

    @field_validator("linkedin_url")
    @classmethod
    def https_link(cls, v):
        if v and not v.startswith("https://"):
            raise ValueError("Profile links must start with https://")
        return v or None

    @field_validator("resume_url")
    @classmethod
    def our_upload_or_https(cls, v):
        # Either a document uploaded through our form, or an https link the applicant chose.
        if v and not (v.startswith("/api/v1/uploads/files/") or v.startswith("https://")):
            raise ValueError("The CV link is not valid")
        return v or None
    offer_type: OfferType = OfferType.FREE


class ApplicationStatus(str, Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    INTERVIEW = "interview"
    APPROVED = "approved"
    ACCEPTED = "accepted"
    COMPLETED = "completed"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    WITHDRAWN = "withdrawn"


class ApplicationOut(BaseModel):
    id: UUID
    opportunity_id: str
    opportunity_title: Optional[str] = None
    user_id: Optional[UUID] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    status: ApplicationStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
