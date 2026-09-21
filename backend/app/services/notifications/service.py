import asyncio
from email.message import EmailMessage
import logging
import smtplib

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def _send_smtp_sync(
    host: str,
    port: int,
    user: str,
    password: str,
    use_tls: bool,
    from_addr: str,
    to_addr: str,
    subject: str,
    body: str,
):
    """Synchronous SMTP worker executed in thread pool."""
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg.set_content(body)

    clean_user = user.strip() if user else ""
    clean_password = password.replace(" ", "").strip() if password else ""

    with smtplib.SMTP(host, port, timeout=15) as server:
        if use_tls:
            server.starttls()
        if clean_user and clean_password:
            server.login(clean_user, clean_password)
        server.send_message(msg)



class NotificationService:
    def _print_dev_fallback(self, header: str, to: str, subject: str, body: str):
        dev_box = (
            "\n" + "=" * 70 + "\n"
            + f"📨 [{header}]\n"
            + f"To:      {to}\n"
            + f"Subject: {subject}\n"
            + f"----------------------------------------------------------------------\n"
            + f"{body}\n"
            + "=" * 70
        )
        logger.warning(dev_box)
        print(dev_box, flush=True)

    async def send_email(self, to: str, subject: str, body: str):
        settings = get_settings()
        provider = (settings.EMAIL_PROVIDER or "none").lower()

        # Option A: SMTP Provider (Gmail / Outlook / standard SMTP without custom domain)
        if provider == "smtp":
            if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
                self._print_dev_fallback("SMTP UNCONFIGURED (MISSING SMTP_USER/SMTP_PASSWORD)", to, subject, body)
                return True
            try:
                from_addr = settings.EMAIL_FROM or settings.SMTP_USER
                await asyncio.to_thread(
                    _send_smtp_sync,
                    settings.SMTP_HOST,
                    settings.SMTP_PORT,
                    settings.SMTP_USER,
                    settings.SMTP_PASSWORD,
                    settings.SMTP_TLS,
                    from_addr,
                    to,
                    subject,
                    body,
                )
                logger.info("Email successfully delivered via SMTP to %s", to)
                return True
            except Exception as exc:
                logger.exception("SMTP delivery failed for %s: %s", to, str(exc))
                self._print_dev_fallback(f"SMTP ERROR: {exc}", to, subject, body)
                return False

        # Option B: Resend Provider (Requires verified domain for external recipients)
        elif provider == "resend" and settings.RESEND_API_KEY:
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
                logger.info("Email successfully sent via Resend to %s", to)
                return True
            except httpx.HTTPStatusError as exc:
                error_msg = exc.response.text
                logger.error("Resend API error for %s (HTTP %s): %s", to, exc.response.status_code, error_msg)
                self._print_dev_fallback(f"RESEND REJECTED (HTTP {exc.response.status_code}): {error_msg}", to, subject, body)
                return False
            except httpx.HTTPError as exc:
                logger.exception("Email delivery network error for %s: %s", to, str(exc))
                self._print_dev_fallback(f"NETWORK ERROR: {exc}", to, subject, body)
                return False

        # Option C: Dev Mode Console Fallback
        self._print_dev_fallback("DEV EMAIL - NO PROVIDER CONFIGURED", to, subject, body)
        return True



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

    async def notify_password_reset(self, email: str, name: str, reset_token: str):
        settings = get_settings()
        reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={reset_token}"
        await self.send_email(
            email,
            "Reset your GMACGROUP password",
            f"Hello {name},\n\nWe received a request to reset your password for your GMACGROUP account.\n\nClick the link below to set a new password (link expires in 15 minutes):\n{reset_link}\n\nIf you did not request this password reset, you can safely ignore this email.",
        )


notification_service = NotificationService()
