"""ORM model for public events (convenings, series sessions, workshops)."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    slug: Mapped[str] = mapped_column(String(160), unique=True)
    title: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(String(600))
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    series: Mapped[str | None] = mapped_column(String(120), nullable=True)
    format: Mapped[str] = mapped_column(String(20))  # online | in_person | hybrid
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    start_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    timezone: Mapped[str] = mapped_column(String(64), default="Africa/Accra", server_default=text("'Africa/Accra'"))
    all_day: Mapped[bool] = mapped_column(Boolean, default=False, server_default=text("false"))
    date_label: Mapped[str | None] = mapped_column(String(80), nullable=True)
    partners: Mapped[str | None] = mapped_column(String(300), nullable=True)
    registration_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    recording_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(600), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, server_default=text("false"))
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
