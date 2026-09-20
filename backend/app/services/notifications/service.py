"""Email notification dispatch with an optional Resend provider."""

import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class NotificationService:
    async def send_email(self, to: str, subject: str, body: str):
        settings = get_settings()
        if settings.EMAIL_PROVIDER.lower() != "resend" or not settings.RESEND_API_KEY:
            logger.info("Email skipped because no email provider is configured: %s", subject)
            return False

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": settings.EMAIL_FROM,
                        "to": [to],
                        "subject": subject,
                        "text": body,
                    },
                )
            response.raise_for_status()
            return True
        except httpx.HTTPError:
            logger.exception("Email delivery failed for %s", to)
            return False

    async def notify_contact_request(self, name: str, email: str, subject: str, message: str):
        settings = get_settings()
        if settings.OPERATIONS_EMAIL:
            await self.send_email(
                settings.OPERATIONS_EMAIL,
                f"New contact request: {subject}",
                f"From: {name} <{email}>\n\n{message}",
            )

    async def notify_member_registered(self, email: str, name: str):
        settings = get_settings()
        await self.send_email(
            email,
            "Welcome to GMACGROUP",
            f"Hello {name},\n\nYour GMACGROUP member account is ready.\n\nSign in: {settings.FRONTEND_URL.rstrip('/')}/login",
        )

    async def notify_application_submitted(self, email: str, name: str, title: str):
        await self.send_email(
            email,
            f"Application received: {title}",
            f"Hello {name},\n\nYour application for {title} has been received. You can track its status from your member dashboard.",
        )

    async def notify_enrolment_submitted(self, email: str, name: str, title: str):
        await self.send_email(
            email,
            f"Enrolment received: {title}",
            f"Hello {name},\n\nYour enrolment for {title} has been received. You can track it from your member dashboard.",
        )

    async def notify_status_changed(self, email: str, name: str, title: str, status: str):
        await self.send_email(
            email,
            f"Application update: {title}",
            f"Hello {name},\n\nYour application status for {title} is now: {status.replace('_', ' ')}.",
        )


notification_service = NotificationService()
