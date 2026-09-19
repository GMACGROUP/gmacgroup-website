"""ORM model for contact/enquiry requests. TODO: finalize schema."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, String, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class ContactRequest(Base):
    __tablename__ = "contact_requests"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    subject: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="received")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=text("now()"),
    )
