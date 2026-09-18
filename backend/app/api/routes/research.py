"""
Research routes: research projects, publications, working paper requests, and expert network.
"""

from typing import List
from fastapi import APIRouter, status
from app.schemas.research import (
    ResearchProjectOut,
    PublicationOut,
    ExpertOut,
    PublicationRequestCreate,
    PublicationRequestOut,
    ExpertApplicationCreate,
    ExpertApplicationOut,
)
from app.data import (
    EXPERTS,
    PUBLICATIONS,
    RESEARCH_PROJECTS,
    PUBLICATION_REQUESTS,
    EXPERT_APPLICATIONS,
    new_record,
)

router = APIRouter()


@router.get("/projects", response_model=List[ResearchProjectOut])
async def list_research_projects():
    return RESEARCH_PROJECTS


@router.get("/publications", response_model=List[PublicationOut])
async def list_publications():
    return PUBLICATIONS


@router.get("/experts", response_model=List[ExpertOut])
async def list_experts():
    return EXPERTS


@router.post("/request-publication", response_model=PublicationRequestOut, status_code=status.HTTP_201_CREATED)
async def request_publication(payload: PublicationRequestCreate):
    """Store publication/working paper dispatch request."""
    record = new_record({
        "publication_id": payload.publication_id,
        "publication_title": payload.publication_title,
        "full_name": payload.full_name,
        "email": payload.email,
        "organization": payload.organization,
        "purpose": payload.purpose,
        "status": "dispatched",
    })
    PUBLICATION_REQUESTS.append(record)
    return record


@router.post("/experts/apply", response_model=ExpertApplicationOut, status_code=status.HTTP_201_CREATED)
async def apply_as_expert(payload: ExpertApplicationCreate):
    """Submit application to join the GMAC Research & Faculty Network."""
    record = new_record({
        "full_name": payload.full_name,
        "email": payload.email,
        "highest_degree": payload.highest_degree,
        "institution": payload.institution,
        "expertise_areas": payload.expertise_areas,
        "orcid_or_link": payload.orcid_or_link,
        "statement": payload.statement,
        "status": "received",
    })
    EXPERT_APPLICATIONS.append(record)
    return record
