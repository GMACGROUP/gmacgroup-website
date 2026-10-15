"""Read and write helpers for catalogue items stored in the database."""

from __future__ import annotations

import re
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.catalogue import CatalogueItem

KINDS = {"programme", "opportunity", "publication"}


def slugify(text: str) -> str:
    clean = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    return re.sub(r"[\s-]+", "-", clean)[:60].strip("-") or "item"


def to_public(item: CatalogueItem, include_status: bool = False) -> dict:
    out = {**(item.data or {}), "id": item.id}
    if include_status:
        out["is_published"] = item.is_published
        out["updated_at"] = item.updated_at
    return out


def list_items(db: Session, kind: str, *, published_only: bool = True) -> list[CatalogueItem]:
    query = select(CatalogueItem).where(CatalogueItem.kind == kind)
    if published_only:
        query = query.where(CatalogueItem.is_published.is_(True))
    return list(db.scalars(query.order_by(CatalogueItem.sort_order, CatalogueItem.created_at.desc())).all())


def get_item(db: Session, kind: str, item_id: str, *, published_only: bool = True) -> CatalogueItem:
    item = db.get(CatalogueItem, item_id)
    if item is None or item.kind != kind or (published_only and not item.is_published):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{kind.capitalize()} not found")
    return item


def create_item(db: Session, kind: str, data: dict, *, is_published: bool = False) -> CatalogueItem:
    item = CatalogueItem(
        id=f"{kind}-{slugify(str(data.get('title', kind)))[:40]}-{uuid4().hex[:6]}",
        kind=kind,
        data=jsonable_encoder(data),
        is_published=is_published,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_item(db: Session, item: CatalogueItem, changes: dict, *, is_published: bool | None = None) -> CatalogueItem:
    if changes:
        item.data = {**(item.data or {}), **jsonable_encoder(changes)}
    if is_published is not None:
        item.is_published = is_published
    item.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: CatalogueItem) -> None:
    db.delete(item)
    db.commit()


def is_closed(item: CatalogueItem) -> bool:
    data = item.data or {}
    closing = data.get("deadline") if item.kind == "opportunity" else data.get("end_date")
    if not closing:
        return False
    return datetime.fromisoformat(str(closing).replace("Z", "+00:00")) < datetime.now(timezone.utc)
