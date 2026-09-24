"""Document upload and retrieval routes."""

import mimetypes
import os
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session

from app.api.dependencies import require_role
from app.core.database import get_db
from app.models.opportunity import Application
from app.services.storage.service import storage_service

router = APIRouter()
admin_only = require_role("admin")


@router.post("/document", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    folder: str = Form("resumes"),
):
    """Upload a candidate resume, CV, or proposal document (PDF/DOCX, max 10MB)."""
    return await storage_service.save_document(file, folder=folder)


@router.get("/files/{file_id}/{filename}")
async def get_uploaded_file(
    file_id: str,
    filename: str,
    folder: str = "resumes",
    _: dict = Depends(admin_only),
):
    """Retrieve and stream an uploaded file for browser inline viewing or download."""
    path = storage_service.get_local_file_path(file_id, filename, folder=folder)
    if not path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested document was not found or has been removed.",
        )

    mime_type, _ = mimetypes.guess_type(str(path))
    if not mime_type:
        mime_type = "application/pdf" if path.suffix.lower() == ".pdf" else "application/octet-stream"

    # Inline disposition allows PDFs to open directly in the browser's PDF viewer / iframe
    headers = {
        "Content-Disposition": f'attachment; filename="{path.name}"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
    }

    return FileResponse(
        path=str(path),
        media_type=mime_type,
        headers=headers,
    )


@router.get("/admin/applications/{application_id}/document")
def view_application_document(
    application_id: UUID,
    _: dict = Depends(admin_only),
    db: Session = Depends(get_db),
):
    """Admin-secured endpoint to retrieve application document link or stream."""
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if not application.resume_url:
        raise HTTPException(status_code=404, detail="No document was attached to this application")

    return {
        "application_id": str(application.id),
        "applicant_name": application.applicant_name,
        "opportunity_title": application.opportunity_title,
        "document_url": application.resume_url,
        "is_internal": application.resume_url.startswith("/api/v1/uploads/"),
    }
