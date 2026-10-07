"""ORM model for the public team directory, managed from the admin panel."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, Integer, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(120))
    position: Mapped[str] = mapped_column(String(160))
    country: Mapped[str] = mapped_column(String(80))
    team: Mapped[str] = mapped_column(String(80))
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String(600), nullable=True)
    is_lead: Mapped[bool] = mapped_column(Boolean, default=False, server_default=text("false"))
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, server_default=text("true"))
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default=text("0"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
