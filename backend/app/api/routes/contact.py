"""
Contact & communication routes: contact forms, newsletter subscriptions.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.contact import ContactRequest
from app.schemas.contact import (
    ContactRequestCreate,
    ContactRequestOut,
    NewsletterSubscribe,
    NewsletterResponse,
)
from app.data import NEWSLETTER_SUBSCRIBERS

router = APIRouter()


@router.post("/", response_model=ContactRequestOut, status_code=status.HTTP_201_CREATED)
async def submit_contact_request(
    payload: ContactRequestCreate,
    db: Session = Depends(get_db),
):
    """Store a contact request and return its tracking record."""
    request = ContactRequest(
        name=payload.name,
        email=str(payload.email),
        subject=payload.subject,
        message=payload.message,
        status="received",
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


@router.post("/newsletter", response_model=NewsletterResponse)
async def subscribe_newsletter(payload: NewsletterSubscribe):
    """Subscribe an email to the GMAC Insights newsletter."""
    email_lower = payload.email.lower().strip()
    if email_lower not in NEWSLETTER_SUBSCRIBERS:
        NEWSLETTER_SUBSCRIBERS.append(email_lower)

    return {
        "status": "subscribed",
        "message": "Thank you for subscribing to GMAC Insights. You will receive our next quarterly policy and human capital briefing.",
        "email": email_lower,
    }
