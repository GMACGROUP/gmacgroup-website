"""Notification dispatch: contact form emails, announcements, in-app messages.
TODO: integrate a real email/notification provider (e.g. Resend, SES, Postmark).
"""


class NotificationService:
    async def send_email(self, to: str, subject: str, body: str):
        raise NotImplementedError

    async def notify_contact_request(self, contact_request_id: str):
        raise NotImplementedError
