"""Pydantic schemas for contact form submissions and newsletter subscriptions."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

TOPICS = {
    "institution": "Commissioning research or advisory",
    "workforce": "Workforce and graduate intake",
    "investment": "Investment facilitation",
    "sponsorship": "Sponsorship and event partnership",
    "programmes": "Programmes and training",
    "events": "Events",
    "careers": "Careers and fellowships",
    "media": "Media and speaking",
    "other": "Something else",
}


def _one_line(v):
    return " ".join(v.split()) if isinstance(v, str) else v


class ContactRequestCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    organization: str | None = Field(default=None, max_length=160)
    topic: str = "other"
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10, max_length=5000)
    consent: bool = True
    # Honeypot: real visitors never see or fill this field
    website: str | None = Field(default=None, max_length=200)

    @field_validator("name", "organization", "subject", mode="before")
    @classmethod
    def strip_lines(cls, v):
        v = _one_line(v)
        return v or None if v == "" else v

    @field_validator("message", mode="before")
    @classmethod
    def strip_message(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("topic")
    @classmethod
    def topic_known(cls, v):
        return v if v in TOPICS else "other"

    @field_validator("consent")
    @classmethod
    def must_consent(cls, v):
        if not v:
            raise ValueError("Please agree to the privacy notice so we can reply to you")
        return v


class ContactRequestOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    subject: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NewsletterSubscribe(BaseModel):
    email: EmailStr
    website: str | None = Field(default=None, max_length=200)


class NewsletterResponse(BaseModel):
    status: str
    message: str
    email: str
