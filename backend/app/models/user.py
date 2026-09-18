"""ORM model for users/profiles. TODO: finalize columns and relationships."""

from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String, nullable=True)
    role: Mapped[str] = mapped_column(String, default="student")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # TODO: add relationships to enrolments, applications, research projects, etc.
