"""Schemas for public events."""

import re
from datetime import datetime
from typing import Literal
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

Format = Literal["online", "in_person", "hybrid"]
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def _clean(v):
    if isinstance(v, str):
        v = " ".join(v.split()) if "\n" not in v else v.strip()
        return v or None
    return v


class _EventFields(BaseModel):
    @field_validator("title", "summary", "series", "location", "date_label", "partners", check_fields=False, mode="before")
    @classmethod
    def tidy(cls, v):
        return _clean(v)

    @field_validator("body", check_fields=False, mode="before")
    @classmethod
    def tidy_body(cls, v):
        return v.strip() or None if isinstance(v, str) else v

    @field_validator("slug", check_fields=False)
    @classmethod
    def slug_ok(cls, v):
        if v is not None and not SLUG_RE.match(v):
            raise ValueError("slug must use lowercase letters, numbers and single hyphens")
        return v

    @field_validator("timezone", check_fields=False)
    @classmethod
    def tz_ok(cls, v):
        if v is None:
            return v
        try:
            ZoneInfo(v)
        except ZoneInfoNotFoundError as exc:
            raise ValueError("timezone must be a valid IANA name, for example Africa/Accra") from exc
        return v

    @field_validator("registration_url", "recording_url", check_fields=False, mode="before")
    @classmethod
    def https_only(cls, v):
        v = _clean(v)
        if v and not v.startswith("https://"):
            raise ValueError("links must start with https://")
        return v


class EventCreate(_EventFields):
    slug: str = Field(min_length=3, max_length=160)
    title: str = Field(min_length=3, max_length=200)
    summary: str = Field(min_length=10, max_length=600)
    body: str | None = Field(default=None, max_length=20000)
    series: str | None = Field(default=None, max_length=120)
    format: Format
    location: str | None = Field(default=None, max_length=200)
    start_at: datetime | None = None
    end_at: datetime | None = None
    timezone: str = "Africa/Accra"
    all_day: bool = False
    date_label: str | None = Field(default=None, max_length=80)
    partners: str | None = Field(default=None, max_length=300)
    registration_url: str | None = Field(default=None, max_length=500)
    recording_url: str | None = Field(default=None, max_length=500)
    is_featured: bool = False
    is_published: bool = True

    @model_validator(mode="after")
    def dates_ok(self):
        if self.start_at is None and not self.date_label:
            raise ValueError("give a start date and time, or a date label such as 'November 2026'")
        if self.start_at and self.end_at and self.end_at < self.start_at:
            raise ValueError("end_at must be after start_at")
        return self


class EventUpdate(_EventFields):
    slug: str | None = Field(default=None, min_length=3, max_length=160)
    title: str | None = Field(default=None, min_length=3, max_length=200)
    summary: str | None = Field(default=None, min_length=10, max_length=600)
    body: str | None = Field(default=None, max_length=20000)
    series: str | None = Field(default=None, max_length=120)
    format: Format | None = None
    location: str | None = Field(default=None, max_length=200)
    start_at: datetime | None = None
    end_at: datetime | None = None
    timezone: str | None = None
    all_day: bool | None = None
    date_label: str | None = Field(default=None, max_length=80)
    partners: str | None = Field(default=None, max_length=300)
    registration_url: str | None = Field(default=None, max_length=500)
    recording_url: str | None = Field(default=None, max_length=500)
    is_featured: bool | None = None
    is_published: bool | None = None


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    summary: str
    body: str | None = None
    series: str | None = None
    format: str
    location: str | None = None
    start_at: datetime | None = None
    end_at: datetime | None = None
    timezone: str
    all_day: bool
    date_label: str | None = None
    partners: str | None = None
    registration_url: str | None = None
    recording_url: str | None = None
    image_url: str | None = None
    is_featured: bool


class EventAdminOut(EventOut):
    is_published: bool
