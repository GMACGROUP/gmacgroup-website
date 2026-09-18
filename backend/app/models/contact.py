"""ORM model for contact/enquiry requests. TODO: finalize schema."""

from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class ContactRequest(Base):
    __tablename__ = "contact_requests"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    subject: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="received")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
