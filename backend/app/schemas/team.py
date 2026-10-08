"""Schemas for the team directory."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

TEAMS = (
    "Business Development and Partnerships",
    "Research",
    "Marketing and Communications",
    "Graphic Design and Web",
    "Operations and Programmes",
)


def _clean(value: str | None) -> str | None:
    if value is None:
        return None
    value = " ".join(value.split())
    return value or None


class _TeamFields(BaseModel):
    @field_validator("name", "position", "country", "team", "bio", check_fields=False, mode="before")
    @classmethod
    def strip_text(cls, v):
        return _clean(v) if isinstance(v, str) else v

    @field_validator("team", check_fields=False)
    @classmethod
    def team_known(cls, v):
        if v is not None and v not in TEAMS:
            raise ValueError(f"team must be one of: {', '.join(TEAMS)}")
        return v

    @field_validator("linkedin_url", check_fields=False, mode="before")
    @classmethod
    def linkedin_only(cls, v):
        v = _clean(v) if isinstance(v, str) else v
        if v and not (v.startswith("https://www.linkedin.com/") or v.startswith("https://linkedin.com/")):
            raise ValueError("linkedin_url must be a https://linkedin.com/ address")
        return v


class TeamMemberCreate(_TeamFields):
    name: str = Field(min_length=1, max_length=120)
    position: str = Field(min_length=1, max_length=160)
    country: str = Field(min_length=2, max_length=80)
    team: str
    bio: str | None = Field(default=None, max_length=1200)
    linkedin_url: str | None = Field(default=None, max_length=300)
    is_lead: bool = False
    is_published: bool = True
    sort_order: int = Field(default=0, ge=0, le=10000)


class TeamMemberUpdate(_TeamFields):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    position: str | None = Field(default=None, min_length=1, max_length=160)
    country: str | None = Field(default=None, min_length=2, max_length=80)
    team: str | None = None
    bio: str | None = Field(default=None, max_length=1200)
    linkedin_url: str | None = Field(default=None, max_length=300)
    is_lead: bool | None = None
    is_published: bool | None = None
    sort_order: int | None = Field(default=None, ge=0, le=10000)


class TeamMemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    position: str
    country: str
    team: str
    bio: str | None = None
    linkedin_url: str | None = None
    photo_url: str | None = None
    is_lead: bool
    sort_order: int


class TeamMemberAdminOut(TeamMemberOut):
    is_published: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None


class TeamReorder(BaseModel):
    ids: list[UUID] = Field(min_length=1, max_length=500)
