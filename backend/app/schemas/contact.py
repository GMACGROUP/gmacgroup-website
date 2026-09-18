"""Pydantic schemas for contact form submissions and newsletter subscriptions."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class ContactRequestCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactRequestOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    subject: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterResponse(BaseModel):
    status: str
    message: str
    email: str
