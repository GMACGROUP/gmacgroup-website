import asyncio
from email.message import EmailMessage
import email.utils
import logging
import smtplib
from typing import Optional

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def _send_smtp_plain(
    host: str,
    port: int,
    user: str,
    password: str,
    use_tls: bool,
    to_addr: str,
    subject: str,
    body: str,
) -> None:
    """
    Send PLAIN-TEXT-ONLY email via SMTP.

    WHY PLAIN TEXT:
    HTML emails from Gmail personal accounts look identical to marketing
    campaigns. Gmail routes them to Spam or Promotions tab. Plain text
    looks like a normal human-written message and lands in Primary inbox.
    """
    clean_user = user.strip() if user else ""
    clean_password = password.replace(" ", "").strip() if password else ""
    clean_to = to_addr.strip()
    sender_domain = "gmail.com" if "gmail.com" in clean_user else "gmacgroup.org"

    from_formatted = email.utils.formataddr(("GMAC GROUP", clean_user)) if clean_user else clean_user

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_formatted
    msg["To"] = clean_to
    msg["Date"] = email.utils.formatdate(localtime=True)
    msg["Message-ID"] = email.utils.make_msgid(domain=sender_domain)
    # NO Reply-To, NO List-Unsubscribe, NO X-Mailer, NO Auto-Submitted
    # All of these add "bulk sender" signals that push email to Spam.

    msg.set_content(body)

    with smtplib.SMTP(host, port, timeout=15) as server:
        server.ehlo()
        if use_tls:
            server.starttls()
            server.ehlo()
        if clean_user and clean_password:
            server.login(clean_user, clean_password)
        server.send_message(msg)


class NotificationService:

    def _print_dev_fallback(self, header: str, to: str, subject: str, body: str):
        dev_box = (
            "\n" + "=" * 70 + "\n"
            + f"EMAIL [{header}]\n"
            + f"To:      {to}\n"
            + f"Subject: {subject}\n"
            + "-" * 70 + "\n"
            + f"{body}\n"
            + "=" * 70
        )
        logger.warning(dev_box)
        print(dev_box, flush=True)

    async def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None,
    ) -> bool:
        settings = get_settings()
        provider = (settings.EMAIL_PROVIDER or "none").lower()

        if provider == "smtp":
            if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
                logger.error(
                    "SMTP delivery skipped: SMTP_USER or SMTP_PASSWORD is not configured"
                )
                self._print_dev_fallback(
                    "SMTP UNCONFIGURED - add SMTP_USER and SMTP_PASSWORD to .env",
                    to, subject, body,
                )
                return True
            try:
                await asyncio.to_thread(
                    _send_smtp_plain,
                    settings.SMTP_HOST,
                    settings.SMTP_PORT,
                    settings.SMTP_USER,
                    settings.SMTP_PASSWORD,
                    settings.SMTP_TLS,
                    to,
                    subject,
                    body,
                )
                logger.info(
                    "SMTP delivery succeeded: provider=smtp host=%s port=%s recipient=%s",
                    settings.SMTP_HOST,
                    settings.SMTP_PORT,
                    to,
                )
                return True
            except Exception as exc:
                logger.exception(
                    "SMTP delivery failed: provider=smtp host=%s port=%s recipient=%s error=%s",
                    settings.SMTP_HOST,
                    settings.SMTP_PORT,
                    to,
                    exc,
                )
                self._print_dev_fallback(f"SMTP ERROR: {exc}", to, subject, body)
                return False

        elif provider == "resend" and settings.RESEND_API_KEY:
            try:
                payload: dict = {
                    "from": settings.EMAIL_FROM,
                    "to": [to],
                    "subject": subject,
                    "text": body,
                }
                if html_body:
                    payload["html"] = html_body

                async with httpx.AsyncClient(timeout=15) as client:
                    response = await client.post(
                        "https://api.resend.com/emails",
                        headers={
                            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json=payload,
                    )
                response.raise_for_status()
                logger.info("Email dispatched via Resend to %s", to)
                return True
            except httpx.HTTPStatusError as exc:
                err = exc.response.text
                logger.error("Resend API error for %s (HTTP %s): %s", to, exc.response.status_code, err)
                self._print_dev_fallback(f"RESEND REJECTED (HTTP {exc.response.status_code}): {err}", to, subject, body)
                return False
            except httpx.HTTPError as exc:
                logger.exception("Resend network error for %s: %s", to, exc)
                self._print_dev_fallback(f"NETWORK ERROR: {exc}", to, subject, body)
                return False

        self._print_dev_fallback("DEV - NO EMAIL PROVIDER CONFIGURED", to, subject, body)
        return True

    async def notify_contact_request(self, name: str, email: str, subject: str, message: str):
        settings = get_settings()
        if settings.OPERATIONS_EMAIL:
            await self.send_email(
                settings.OPERATIONS_EMAIL,
                f"New contact message: {subject}",
                f"From: {name} <{email}>\n\n{message}",
            )

    async def notify_operations(self, subject: str, body: str):
        """Send an incoming business event to the operations inbox."""
        settings = get_settings()
        if settings.OPERATIONS_EMAIL:
            await self.send_email(settings.OPERATIONS_EMAIL, subject, body)

    async def notify_member_registration(self, email: str, name: str, role: str):
        await self.notify_operations(
            "New GMAC GROUP member registration",
            f"Name: {name}\nEmail: {email}\nRole: {role}",
        )

    async def notify_member_registered(self, email: str, name: str, role: str = "student"):
        """Welcome email on account creation."""
        settings = get_settings()
        role_label = {
            "student": "Student / Emerging Leader",
            "professional": "Working Professional",
            "researcher": "Academic / Researcher",
            "employer": "Employer / Talent Partner",
            "institution": "Institutional Partner",
            "employee": "Team Member",
            "admin": "Administrator",
        }.get(role.lower(), role.capitalize())

        frontend_url = settings.FRONTEND_URL.rstrip("/")
        portal_url = f"{frontend_url}/login"
        programmes_url = f"{frontend_url}/programmes"
        opportunities_url = f"{frontend_url}/opportunities"
        research_url = f"{frontend_url}/research"
        support_email = settings.OPERATIONS_EMAIL or "info@gmac-group.com"
        first_name = name.split()[0] if name else "there"

        subject = f"Hi {first_name}, you are in - GMAC GROUP"

        plain_text = (
            f"Hi {first_name},\n\n"
            f"Your GMAC GROUP account is ready.\n\n"
            f"Account details:\n"
            f"  Name:   {name}\n"
            f"  Email:  {email}\n"
            f"  Track:  {role_label}\n\n"
            f"Sign in here: {portal_url}\n\n"
            f"Things to explore:\n"
            f"  Programmes:          {programmes_url}\n"
            f"  Fellowships & Roles: {opportunities_url}\n"
            f"  Research:            {research_url}\n\n"
            f"Questions? Just reply to this email or write to {support_email}.\n\n"
            f"Best,\n"
            f"The GMAC GROUP Team\n"
            f"Accra, Ghana"
        )

        await self.send_email(email, subject, plain_text)

    async def notify_application_submitted(
        self,
        email: str,
        name: str,
        title: str,
        details: str = "",
    ):
        settings = get_settings()
        first_name = name.split()[0] if name else name
        subject = f"Got your application, {first_name}"
        plain_text = (
            f"Hi {first_name},\n\n"
            f"We received your application for '{title}' - you are all set.\n\n"
            f"Track the status from your member dashboard:\n"
            f"{settings.FRONTEND_URL.rstrip('/')}/dashboard\n\n"
            f"Best,\n"
            f"The GMAC GROUP Team"
        )
        await self.send_email(email, subject, plain_text)
        await self.notify_operations(
            f"New application: {title}",
            f"Applicant: {name}\nEmail: {email}\nOpportunity: {title}\n{details}".rstrip(),
        )

    async def notify_enrolment_submitted(
        self,
        email: str,
        name: str,
        title: str,
        details: str = "",
    ):
        settings = get_settings()
        first_name = name.split()[0] if name else name
        subject = f"Enrolment received for {title}"
        plain_text = (
            f"Hi {first_name},\n\n"
            f"Your enrolment for '{title}' has been recorded.\n\n"
            f"Check your cohort schedule in your portal dashboard:\n"
            f"{settings.FRONTEND_URL.rstrip('/')}/dashboard\n\n"
            f"Best,\n"
            f"The GMAC GROUP Team"
        )
        await self.send_email(email, subject, plain_text)
        await self.notify_operations(
            f"New programme enrolment: {title}",
            f"Applicant: {name}\nEmail: {email}\nProgramme: {title}\n{details}".rstrip(),
        )

    async def notify_newsletter_subscription(self, email: str):
        await self.notify_operations(
            "New newsletter subscription",
            f"Subscriber email: {email}",
        )

        await self.send_email(
            email,
            "You are subscribed to GMAC Insights",
            (
                "Hello,\n\n"
                "Thank you for subscribing to GMAC Insights. You will receive our "
                "periodic briefings on workforce trends, research, and fellowship cohorts.\n\n"
                "Best,\n"
                "The GMAC GROUP Team\n"
                "Accra, Ghana"
            ),
        )

    async def notify_status_changed(self, email: str, name: str, title: str, status: str):
        first_name = name.split()[0] if name else name
        status_label = status.replace("_", " ").title()
        subject = f"Update on your application for {title}"
        plain_text = (
            f"Hi {first_name},\n\n"
            f"The status of your application for '{title}' has been updated to: {status_label}.\n\n"
            f"Best,\n"
            f"The GMAC GROUP Team"
        )
        await self.send_email(email, subject, plain_text)

    async def notify_password_reset(self, email: str, name: str, reset_token: str):
        """Password reset email - plain text for Gmail SMTP inbox delivery."""
        settings = get_settings()
        reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={reset_token}"
        first_name = name.split()[0] if name else "there"

        subject = "Here is your GMAC GROUP password reset link"

        plain_text = (
            f"Hi {first_name},\n\n"
            f"We got a request to reset the password on your GMAC GROUP account ({email}).\n\n"
            f"Click the link below to choose a new password. It expires in 15 minutes:\n\n"
            f"{reset_link}\n\n"
            f"If you did not ask for this, just ignore this email. Your account is safe.\n\n"
            f"Best,\n"
            f"The GMAC GROUP Team\n"
            f"Accra, Ghana"
        )

        await self.send_email(email, subject, plain_text)


notification_service = NotificationService()
