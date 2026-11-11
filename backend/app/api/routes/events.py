"""Events: public listing and detail, plus admin management with flyer uploads."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.dependencies import require_role
from app.core.database import get_db
from app.models.event import Event
from app.schemas.event import EventAdminOut, EventCreate, EventOut, EventUpdate
from app.services.storage.service import storage_service

router = APIRouter()
admin_router = APIRouter()
admin_only = require_role("admin")


def _is_past_clause(now: datetime):
    """An event is past once it has ended (or started, when no end is set)."""
    return func.coalesce(Event.end_at, Event.start_at) < now


@router.get("", response_model=list[EventOut])
def list_events(
    response: Response,
    when: str = Query("all", pattern="^(all|upcoming|past)$"),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = "public, max-age=60, s-maxage=300"
    now = datetime.now(timezone.utc)
    q = select(Event).where(Event.is_published.is_(True))
    if when == "upcoming":
        # dated events that have not ended, plus undated ones (announced with a label only)
        q = q.where(or_(Event.start_at.is_(None), ~_is_past_clause(now))).order_by(Event.start_at.asc().nulls_last())
    elif when == "past":
        q = q.where(and_(Event.start_at.is_not(None), _is_past_clause(now))).order_by(Event.start_at.desc())
    else:
        q = q.order_by(Event.start_at.desc().nulls_first())
    return db.scalars(q.limit(limit)).all()


@router.get("/{slug}", response_model=EventOut)
def get_event(slug: str, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.slug == slug, Event.is_published.is_(True)))
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


def _get(db: Session, event_id: UUID) -> Event:
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


def _commit(db: Session):
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Another event already uses that web address (slug)")


@admin_router.get("", response_model=list[EventAdminOut])
def admin_list(_: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return db.scalars(select(Event).order_by(Event.start_at.desc().nulls_first())).all()


@admin_router.post("", response_model=EventAdminOut, status_code=status.HTTP_201_CREATED)
def admin_create(payload: EventCreate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    event = Event(**payload.model_dump())
    db.add(event)
    _commit(db)
    db.refresh(event)
    return event


@admin_router.patch("/{event_id}", response_model=EventAdminOut)
def admin_update(event_id: UUID, payload: EventUpdate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    event = _get(db, event_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        if key in {"slug", "title", "summary", "format", "timezone"} and value is None:
            raise HTTPException(status_code=422, detail=f"{key} cannot be empty")
        setattr(event, key, value)
    if event.start_at is None and not event.date_label:
        raise HTTPException(status_code=422, detail="Give a start date or a date label")
    if event.start_at and event.end_at and event.end_at < event.start_at:
        raise HTTPException(status_code=422, detail="The end must be after the start")
    event.updated_at = datetime.now(timezone.utc)
    _commit(db)
    db.refresh(event)
    return event


@admin_router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete(event_id: UUID, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    db.delete(_get(db, event_id))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@admin_router.post("/{event_id}/image", response_model=EventAdminOut)
async def admin_upload_image(
    event_id: UUID, file: UploadFile = File(...), _: dict = Depends(admin_only), db: Session = Depends(get_db)
):
    event = _get(db, event_id)
    stored = await storage_service.save_image(file, folder="events")
    event.image_url = stored["file_url"]
    event.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(event)
    return event


@admin_router.delete("/{event_id}/image", response_model=EventAdminOut)
def admin_remove_image(event_id: UUID, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    event = _get(db, event_id)
    event.image_url = None
    db.commit()
    db.refresh(event)
    return event
