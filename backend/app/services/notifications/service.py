import asyncio
from concurrent.futures import ThreadPoolExecutor
from email.message import EmailMessage
import email.utils
import logging
import smtplib
from typing import Optional

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
_thread_pool = ThreadPoolExecutor(max_workers=8)


def _send_smtp_plain(
    host: str,
    port: int,
    user: str,
    password: str,
    use_tls: bool,
    to_addr: str,
    subject: str,
    body: str,
    from_addr: str = "",
    from_name: str = "Gmac Group",
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
    # Send from the company address (EMAIL_FROM) when set; the SMTP account must be
    # allowed to send as it (true for Google Workspace or Zoho mailboxes on gmac-group.com).
    sender = (from_addr or clean_user).strip()
    sender_domain = sender.split("@")[-1] if "@" in sender else "gmac-group.com"

    from_formatted = email.utils.formataddr((from_name or "Gmac Group", sender)) if sender else sender

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

    def fire_and_forget(self, coro):
        _thread_pool.submit(asyncio.run, coro)

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

    async def send_brevo_email_with_metadata(
        self,
        to: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None,
        reply_to: Optional[str] = None,
    ) -> dict:
        """Send through Brevo and return safe delivery metadata for diagnostics."""
        settings = get_settings()
        if not settings.BREVO_API_KEY:
            return {
                "success": False,
                "provider": "brevo",
                "error": "BREVO_API_KEY is not configured",
            }

        sender_email = settings.EMAIL_FROM
        sender_name = settings.EMAIL_FROM_NAME
        if "<" in sender_email and ">" in sender_email:
            sender_name, sender_email = sender_email.split("<", 1)
            sender_name = sender_name.strip().strip('"\'')
            sender_email = sender_email.split(">", 1)[0].strip()
        elif not sender_email or "@" not in sender_email:
            sender_email = settings.OPERATIONS_EMAIL or "info@gmac-group.com"

        payload = {
            "sender": {"name": sender_name or "Gmac Group", "email": sender_email},
            "to": [{"email": to}],
            "subject": subject,
            "textContent": body,
        }
        if html_body:
            payload["htmlContent"] = html_body
        if reply_to:
            payload["replyTo"] = {"email": reply_to}

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    "https://api.brevo.com/v3/smtp/email",
                    headers={
                        "api-key": settings.BREVO_API_KEY,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    json=payload,
                )
            response.raise_for_status()
            provider_data = response.json()
            message_id = provider_data.get("messageId")
            logger.info("Brevo email accepted: message_id=%s recipient=%s", message_id, to)
            return {
                "success": True,
                "provider": "brevo",
                "message_id": message_id,
                "recipient": to,
                "status_code": response.status_code,
            }
        except httpx.HTTPStatusError as exc:
            logger.error(
                "Brevo API error for %s (HTTP %s): %s",
                to,
                exc.response.status_code,
                exc.response.text,
            )
            return {
                "success": False,
                "provider": "brevo",
                "recipient": to,
                "status_code": exc.response.status_code,
                "error": "Brevo rejected the email request",
            }
        except httpx.HTTPError as exc:
            logger.exception("Brevo network error for %s: %s", to, exc)
            return {
                "success": False,
                "provider": "brevo",
                "recipient": to,
                "error": "Unable to reach Brevo",
            }

    async def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None,
        reply_to: Optional[str] = None,
    ) -> bool:
        settings = get_settings()
        if not settings.EMAIL_NOTIFICATIONS_ENABLED:
            logger.info("Email delivery skipped: EMAIL_NOTIFICATIONS_ENABLED is false")
            return True

        provider = (settings.EMAIL_PROVIDER or "none").lower()

        if provider == "brevo" and settings.BREVO_API_KEY:
            result = await self.send_brevo_email_with_metadata(
                to, subject, body, html_body, reply_to
            )
            if not result["success"]:
                self._print_dev_fallback(f"BREVO ERROR: {result.get('error')}", to, subject, body)
            return result["success"]

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
                    settings.EMAIL_FROM if "@" in (settings.EMAIL_FROM or "") else "",
                    settings.EMAIL_FROM_NAME,
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
                    "from": email.utils.formataddr((settings.EMAIL_FROM_NAME or "Gmac Group", settings.EMAIL_FROM))
                    if "<" not in settings.EMAIL_FROM
                    else settings.EMAIL_FROM,
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

    async def notify_error_alert(self, subject: str, body: str) -> bool:
        """Email the technical contact about an API failure."""
        settings = get_settings()
        to = settings.ALERT_EMAIL or settings.OPERATIONS_EMAIL
        if not to:
            return False
        return await self.send_email(to, f"[Website alert] {subject}", body)

    async def notify_contact_request(
        self, name: str, email: str, subject: str, message: str, organization: str | None = None
    ):
        settings = get_settings()
        deliveries = []
        if settings.OPERATIONS_EMAIL:
            deliveries.append(
                self.send_email(
                    settings.OPERATIONS_EMAIL,
                    f"[Website enquiry] {subject}",
                    f"New enquiry from the website\n\n"
                    f"From: {name} <{email}>\n"
                    f"Organisation: {organization or 'Not given'}\n"
                    f"Subject: {subject}\n\n"
                    f"Message:\n{message}",
                    reply_to=email,
                )
            )

        # The acknowledgement deliberately does not repeat the visitor's message,
        # so the form cannot be used to send arbitrary text to arbitrary addresses.
        deliveries.append(
            self.send_email(
                email,
                "We have received your message",
                f"Hello {name},\n\n"
                "Thank you for contacting Gmac Group. We have received your message "
                "and the right member of our team will reply to you.\n\n"
                "Gmac Group\n"
                "info@gmac-group.com",
            )
        )
        await asyncio.gather(*deliveries)

    async def notify_operations(self, subject: str, body: str):
        """Send an incoming business event to the operations inbox."""
        settings = get_settings()
        if settings.OPERATIONS_EMAIL:
            await self.send_email(settings.OPERATIONS_EMAIL, subject, body)

    async def notify_member_registration(self, email: str, name: str, role: str):
        await self.notify_operations(
            "New Gmac Group member registration",
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

        subject = f"Hi {first_name}, you are in - Gmac Group"

        plain_text = (
            f"Hi {first_name},\n\n"
            f"Your Gmac Group account is ready.\n\n"
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
            f"The Gmac Group Team\n"
            f"gmac-group.com"
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
            f"The Gmac Group Team"
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
            f"The Gmac Group Team"
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
                "Gmac Group"
            ),
        )

    async def notify_status_changed(self, email: str, name: str, title: str, status: str):
        settings = get_settings()
        first_name = name.split()[0] if name else name
        status_label = status.replace("_", " ").title()
        subject = f"Update on your application for {title}"
        plain_text = (
            f"Hi {first_name},\n\n"
            f"The status of your application for '{title}' has been updated to: {status_label}.\n\n"
            f"Best,\n"
            f"The Gmac Group Team"
        )
        deliveries = [self.send_email(email, subject, plain_text)]
        if settings.OPERATIONS_EMAIL and settings.OPERATIONS_EMAIL.lower() != email.lower():
            deliveries.append(
                self.send_email(
                    settings.OPERATIONS_EMAIL,
                    f"[Gmac Group] Application status updated: {title}",
                    f"APPLICATION STATUS UPDATE\n\n"
                    f"Applicant: {name} <{email}>\n"
                    f"Opportunity: {title}\n"
                    f"New status: {status_label}",
                )
            )
        await asyncio.gather(*deliveries)

    async def notify_enrolment_status_changed(
        self,
        email: str,
        name: str,
        title: str,
        status: str,
    ):
        settings = get_settings()
        first_name = name.split()[0] if name else name
        status_label = status.replace("_", " ").title()
        await self.send_email(
            email,
            f"Update on your programme enrolment for {title}",
            f"Hi {first_name},\n\n"
            f"The status of your enrolment for '{title}' has been updated to: {status_label}.\n\n"
            "Best,\nThe Gmac Group Team",
        )
        if settings.OPERATIONS_EMAIL and settings.OPERATIONS_EMAIL.lower() != email.lower():
            await self.send_email(
                settings.OPERATIONS_EMAIL,
                f"[Gmac Group] Programme enrolment status updated: {title}",
                f"PROGRAMME ENROLMENT STATUS UPDATE\n\n"
                f"Member: {name} <{email}>\n"
                f"Programme: {title}\n"
                f"New status: {status_label}",
            )

    async def notify_password_reset(self, email: str, name: str, reset_token: str):
        """Password reset email - plain text for Gmail SMTP inbox delivery."""
        settings = get_settings()
        reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={reset_token}"
        first_name = name.split()[0] if name else "there"

        subject = "Here is your Gmac Group password reset link"

        plain_text = (
            f"Hi {first_name},\n\n"
            f"We got a request to reset the password on your Gmac Group account ({email}).\n\n"
            f"Click the link below to choose a new password. It expires in 15 minutes:\n\n"
            f"{reset_link}\n\n"
            f"If you did not ask for this, just ignore this email. Your account is safe.\n\n"
            f"Best,\n"
            f"The Gmac Group Team\n"
            f"gmac-group.com"
        )

        await self.send_email(email, subject, plain_text)


notification_service = NotificationService()
