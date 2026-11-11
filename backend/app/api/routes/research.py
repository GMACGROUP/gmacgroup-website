"""Research routes: published reports, briefs and working papers."""

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.research import PublicationOut
from app.services import catalogue

router = APIRouter()


@router.get("/publications", response_model=List[PublicationOut])
def list_publications(db: Session = Depends(get_db)):
    """Published research outputs, newest first."""
    items = [catalogue.to_public(i) for i in catalogue.list_items(db, "publication")]
    return sorted(items, key=lambda p: p.get("published_at") or "", reverse=True)
