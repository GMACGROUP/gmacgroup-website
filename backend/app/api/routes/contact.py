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
from app.models.newsletter import NewsletterSubscriber
from app.services.notifications import notification_service

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
    notification_service.fire_and_forget(
        notification_service.notify_contact_request(
            request.name,
            request.email,
            request.subject,
            request.message,
        )
    )
    return request


@router.post("/newsletter", response_model=NewsletterResponse)
async def subscribe_newsletter(payload: NewsletterSubscribe, db: Session = Depends(get_db)):
    """Subscribe an email to the GMAC Insights newsletter."""
    email_lower = payload.email.lower().strip()
    subscriber = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email_lower).first()
    if subscriber is None:
        db.add(NewsletterSubscriber(email=email_lower))
        db.commit()
        notification_service.fire_and_forget(
            notification_service.notify_newsletter_subscription(email_lower)
        )

    return {
        "status": "subscribed",
        "message": "Thank you for subscribing to GMAC Insights. You will receive our next quarterly policy and human capital briefing.",
        "email": email_lower,
    }
