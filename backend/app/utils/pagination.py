"""Shared offset-pagination helpers for list endpoints."""

from typing import Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Query, Session


ItemT = TypeVar("ItemT")


class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20


class PaginatedResponse(BaseModel, Generic[ItemT]):
    total: int
    page: int
    page_size: int
    items: list[ItemT]


def paginate_query(
    db: Session,
    query: Query,
    page: int,
    page_size: int,
) -> dict:
    """Return one bounded page and its total for a SQLAlchemy ORM query."""
    total = db.scalar(select(func.count()).select_from(query.order_by(None).subquery())) or 0
    offset = (page - 1) * page_size
    items = db.scalars(query.offset(offset).limit(page_size)).all()
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": items,
    }
