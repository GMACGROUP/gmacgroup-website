"""
Contact & communication routes: contact forms, newsletter subscriptions.
"""

import uuid
from datetime import datetime, timezone

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
from app.models.newsletter import NewsletterSubscriber
from app.services.notifications import notification_service
from app.core.ratelimit import rate_limit
from app.schemas.contact import TOPICS

router = APIRouter()


@router.post("/", response_model=ContactRequestOut, status_code=status.HTTP_201_CREATED)
async def submit_contact_request(
    payload: ContactRequestCreate,
    db: Session = Depends(get_db),
    _: None = Depends(rate_limit("contact", limit=5, window_seconds=600)),
):
    """Store a contact request and return its tracking record."""
    if payload.website:
        # Honeypot filled in: almost certainly a bot. Pretend success, store nothing.
        return ContactRequestOut(
            id=uuid.uuid4(), name=payload.name, email=payload.email, subject=payload.subject,
            status="received", created_at=datetime.now(timezone.utc),
        )
    request = ContactRequest(
        organization=payload.organization,
        topic=payload.topic,
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
            f"[{TOPICS.get(payload.topic, 'Enquiry')}] {request.subject}",
            request.message,
            organization=payload.organization,
        )
    )
    return request


@router.post("/newsletter", response_model=NewsletterResponse)
async def subscribe_newsletter(
    payload: NewsletterSubscribe,
    db: Session = Depends(get_db),
    _: None = Depends(rate_limit("newsletter", limit=5, window_seconds=600)),
):
    """Subscribe an email to the GMAC Insights newsletter."""
    email_lower = payload.email.lower().strip()
    if payload.website:
        return {"status": "subscribed", "message": "Thank you for subscribing to Gmac Insights.", "email": email_lower}
    subscriber = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email_lower).first()
    if subscriber is None:
        db.add(NewsletterSubscriber(email=email_lower))
        db.commit()
        notification_service.fire_and_forget(
            notification_service.notify_newsletter_subscription(email_lower)
        )

    return {
        "status": "subscribed",
        "message": "Thank you for subscribing to Gmac Insights.",
        "email": email_lower,
    }
