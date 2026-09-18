"""
Contact & communication routes: contact forms, newsletter subscriptions.
"""

from fastapi import APIRouter, status
from app.schemas.contact import (
    ContactRequestCreate,
    ContactRequestOut,
    NewsletterSubscribe,
    NewsletterResponse,
)
from app.data import CONTACT_REQUESTS, NEWSLETTER_SUBSCRIBERS, new_record

router = APIRouter()


@router.post("/", response_model=ContactRequestOut, status_code=status.HTTP_201_CREATED)
async def submit_contact_request(payload: ContactRequestCreate):
    """Store a contact request and return its tracking record."""
    request = new_record({
        "status": "received",
        "name": payload.name,
        "email": payload.email,
        "subject": payload.subject,
        "message": payload.message,
    })
    CONTACT_REQUESTS.append(request)
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
