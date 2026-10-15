"""Team directory: a public listing plus admin management with photo uploads."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import require_role
from app.core.database import get_db
from app.models.team import TeamMember
from app.schemas.team import TeamMemberAdminOut, TeamMemberCreate, TeamMemberOut, TeamMemberUpdate, TeamReorder
from app.services.storage.service import storage_service

router = APIRouter()
admin_router = APIRouter()
admin_only = require_role("admin")


def _get_or_404(db: Session, member_id: UUID) -> TeamMember:
    member = db.get(TeamMember, member_id)
    if member is None:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member


@router.get("", response_model=list[TeamMemberOut])
def list_team(response: Response, db: Session = Depends(get_db)):
    """Published team members in display order."""
    response.headers["Cache-Control"] = "public, max-age=60, s-maxage=300"
    rows = db.scalars(
        select(TeamMember)
        .where(TeamMember.is_published.is_(True))
        .order_by(TeamMember.sort_order, TeamMember.name)
    ).all()
    return rows


@admin_router.get("", response_model=list[TeamMemberAdminOut])
def admin_list_team(_: dict = Depends(admin_only), db: Session = Depends(get_db)):
    return db.scalars(select(TeamMember).order_by(TeamMember.sort_order, TeamMember.name)).all()


@admin_router.post("", response_model=TeamMemberAdminOut, status_code=status.HTTP_201_CREATED)
def admin_create_member(payload: TeamMemberCreate, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    member = TeamMember(**payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@admin_router.patch("/{member_id}", response_model=TeamMemberAdminOut)
def admin_update_member(
    member_id: UUID, payload: TeamMemberUpdate, _: dict = Depends(admin_only), db: Session = Depends(get_db)
):
    member = _get_or_404(db, member_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        if key in {"name", "position", "country", "team"} and value is None:
            raise HTTPException(status_code=422, detail=f"{key} cannot be empty")
        setattr(member, key, value)
    member.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(member)
    return member


@admin_router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_member(member_id: UUID, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    member = _get_or_404(db, member_id)
    db.delete(member)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@admin_router.post("/{member_id}/photo", response_model=TeamMemberAdminOut)
async def admin_upload_photo(
    member_id: UUID,
    file: UploadFile = File(...),
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    member = _get_or_404(db, member_id)
    stored = await storage_service.save_image(file, folder="team")
    member.photo_url = stored["file_url"]
    member.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(member)
    return member


@admin_router.delete("/{member_id}/photo", response_model=TeamMemberAdminOut)
def admin_remove_photo(member_id: UUID, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    member = _get_or_404(db, member_id)
    member.photo_url = None
    member.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(member)
    return member


@admin_router.post("/reorder", response_model=list[TeamMemberAdminOut])
def admin_reorder(payload: TeamReorder, _: dict = Depends(admin_only), db: Session = Depends(get_db)):
    """Set display order from a full list of ids, first to last."""
    members = {m.id: m for m in db.scalars(select(TeamMember).where(TeamMember.id.in_(payload.ids))).all()}
    if len(members) != len(set(payload.ids)):
        raise HTTPException(status_code=422, detail="Unknown team member id in reorder list")
    for position, member_id in enumerate(payload.ids, start=1):
        members[member_id].sort_order = position * 10
    db.commit()
    return db.scalars(select(TeamMember).order_by(TeamMember.sort_order, TeamMember.name)).all()
