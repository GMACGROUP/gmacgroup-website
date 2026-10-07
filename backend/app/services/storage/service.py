"""Document & file storage service supporting Local and Supabase/S3 providers."""

import logging
import os
import re
from pathlib import Path
from uuid import uuid4

import httpx
from fastapi import HTTPException, UploadFile, status

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# Allowed MIME types and extensions for resumes & application documents
ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/msword": ".doc",
}

# Magic bytes signature validation
MAGIC_BYTES = {
    b"%PDF": "application/pdf",
    b"PK\x03\x04": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    b"\xd0\xcf\x11\xe0": "application/msword",
}
ALLOWED_STORAGE_FOLDERS = {"resumes"}

# Public website images (team portraits, event photos)
IMAGE_SIGNATURES = {
    "image/jpeg": (".jpg", lambda b: b[:3] == b"\xff\xd8\xff"),
    "image/png": (".png", lambda b: b[:8] == b"\x89PNG\r\n\x1a\n"),
    "image/webp": (".webp", lambda b: b[:4] == b"RIFF" and b[8:12] == b"WEBP"),
}
ALLOWED_MEDIA_FOLDERS = {"team", "events", "insights"}


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal and illegal characters."""
    base = os.path.basename(filename)
    # Remove any character that isn't alphanumeric, dot, hyphen, or underscore
    clean = re.sub(r"[^a-zA-Z0-9._-]", "_", base)
    return clean[:100] if len(clean) > 100 else clean


def format_file_size(size_bytes: int) -> str:
    """Convert bytes into human readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"


class StorageService:
    def __init__(self):
        self.settings = get_settings()

    def _get_upload_base_dir(self) -> Path:
        """Ensure upload base directory exists."""
        base_dir = Path(self.settings.UPLOAD_DIR)
        if not base_dir.is_absolute():
            # Place in project root or current working dir
            base_dir = Path(os.getcwd()) / self.settings.UPLOAD_DIR
        base_dir.mkdir(parents=True, exist_ok=True)
        return base_dir

    @staticmethod
    def _validate_folder(folder: str) -> str:
        clean_folder = folder.strip().lower()
        if clean_folder not in ALLOWED_STORAGE_FOLDERS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported upload folder.",
            )
        return clean_folder

    async def validate_file(self, file: UploadFile) -> tuple[bytes, str, int]:
        """Read and validate file content type, size, and header signature."""
        max_bytes = self.settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

        content = await file.read()
        size = len(content)

        if size == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        if size > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds the maximum allowed size of {self.settings.MAX_UPLOAD_SIZE_MB}MB.",
            )

        # Content type check
        content_type = file.content_type or ""
        ext = os.path.splitext(file.filename or "")[1].lower()

        # Check extension against allowed list
        matched_type = None
        for mime, allowed_ext in ALLOWED_CONTENT_TYPES.items():
            if ext == allowed_ext or content_type.lower() == mime:
                matched_type = mime
                break

        if not matched_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx, .doc).",
            )

        # Validate magic bytes header
        header_valid = False
        for magic, mime in MAGIC_BYTES.items():
            if content.startswith(magic):
                header_valid = True
                matched_type = mime
                break

        if not header_valid and matched_type == "application/pdf":
            # PDF header check
            if not content.startswith(b"%PDF"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid PDF file structure.",
                )

        return content, matched_type, size

    async def save_document(self, file: UploadFile, folder: str = "resumes") -> dict:
        """Store uploaded file and return unified metadata."""
        folder = self._validate_folder(folder)
        content, content_type, size = await self.validate_file(file)

        raw_filename = file.filename or "document.pdf"
        safe_filename = sanitize_filename(raw_filename)
        file_id = str(uuid4())

        provider = self.settings.STORAGE_PROVIDER.lower()

        if provider == "supabase" and self.settings.SUPABASE_URL and self.settings.SUPABASE_SERVICE_ROLE_KEY:
            return await self._save_to_supabase(content, content_type, size, folder, file_id, safe_filename, raw_filename)
        else:
            return await self._save_to_local(content, content_type, size, folder, file_id, safe_filename, raw_filename)

    async def _save_to_local(
        self,
        content: bytes,
        content_type: str,
        size: int,
        folder: str,
        file_id: str,
        safe_filename: str,
        original_filename: str,
    ) -> dict:
        """Store file locally on filesystem."""
        base_dir = self._get_upload_base_dir()
        target_dir = base_dir / folder / file_id
        target_dir.mkdir(parents=True, exist_ok=True)

        target_file = target_dir / safe_filename
        target_file.write_bytes(content)

        # URL path served by the uploads router
        file_url = f"/api/v1/uploads/files/{file_id}/{safe_filename}"

        return {
            "file_id": file_id,
            "filename": safe_filename,
            "original_filename": original_filename,
            "content_type": content_type,
            "size_bytes": size,
            "size_formatted": format_file_size(size),
            "file_url": file_url,
            "storage_provider": "local",
        }

    async def _save_to_supabase(
        self,
        content: bytes,
        content_type: str,
        size: int,
        folder: str,
        file_id: str,
        safe_filename: str,
        original_filename: str,
    ) -> dict:
        """Store file in Supabase Storage bucket."""
        bucket = self.settings.STORAGE_BUCKET
        storage_path = f"{folder}/{file_id}/{safe_filename}"
        supabase_url = self.settings.SUPABASE_URL.rstrip("/")

        headers = {
            "Authorization": f"Bearer {self.settings.SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": content_type,
        }

        url = f"{supabase_url}/storage/v1/object/{bucket}/{storage_path}"

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                res = await client.post(url, content=content, headers=headers)
                if res.status_code >= 400:
                    logger.warning("Supabase upload failed, falling back to local: %s", res.text)
                    return await self._save_to_local(content, content_type, size, folder, file_id, safe_filename, original_filename)

            # Public or signed URL
            file_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{storage_path}"

            return {
                "file_id": file_id,
                "filename": safe_filename,
                "original_filename": original_filename,
                "content_type": content_type,
                "size_bytes": size,
                "size_formatted": format_file_size(size),
                "file_url": file_url,
                "storage_provider": "supabase",
            }
        except Exception:
            logger.exception("Error uploading to Supabase Storage, using local fallback.")
            return await self._save_to_local(content, content_type, size, folder, file_id, safe_filename, original_filename)

    async def save_image(self, file: UploadFile, folder: str) -> dict:
        """Validate and store a public website image. Returns {"file_url": ...}.

        The type is decided from the file's own bytes, not its name or the
        browser supplied header, so a renamed script cannot pass as a photo.
        """
        folder = folder.strip().lower()
        if folder not in ALLOWED_MEDIA_FOLDERS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported image folder.")

        max_bytes = self.settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
        content = await file.read(max_bytes + 1)
        if not content:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded image is empty.")
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Image exceeds the maximum size of {self.settings.MAX_IMAGE_SIZE_MB}MB.",
            )

        content_type, ext = None, None
        for mime, (extension, check) in IMAGE_SIGNATURES.items():
            if check(content):
                content_type, ext = mime, extension
                break
        if content_type is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please upload a JPG, PNG or WebP image.",
            )

        file_id = str(uuid4())
        filename = f"{file_id}{ext}"
        provider = self.settings.STORAGE_PROVIDER.lower()

        if provider == "supabase" and self.settings.SUPABASE_URL and self.settings.SUPABASE_SERVICE_ROLE_KEY:
            supabase_url = self.settings.SUPABASE_URL.rstrip("/")
            path = f"{folder}/{filename}"
            try:
                async with httpx.AsyncClient(timeout=20) as client:
                    res = await client.post(
                        f"{supabase_url}/storage/v1/object/{self.settings.MEDIA_BUCKET}/{path}",
                        content=content,
                        headers={
                            "Authorization": f"Bearer {self.settings.SUPABASE_SERVICE_ROLE_KEY}",
                            "Content-Type": content_type,
                            "Cache-Control": "public, max-age=31536000, immutable",
                        },
                    )
                if res.status_code >= 400:
                    logger.error("Supabase image upload failed: %s", res.text)
                    raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Image storage is unavailable.")
            except httpx.HTTPError:
                logger.exception("Supabase image upload error")
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Image storage is unavailable.")
            return {
                "file_url": f"{supabase_url}/storage/v1/object/public/{self.settings.MEDIA_BUCKET}/{path}",
                "content_type": content_type,
                "size_bytes": len(content),
            }

        target_dir = self._get_upload_base_dir() / "media" / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        (target_dir / filename).write_bytes(content)
        return {
            "file_url": f"{self.settings.PUBLIC_API_URL.rstrip('/')}/api/v1/uploads/media/{folder}/{filename}",
            "content_type": content_type,
            "size_bytes": len(content),
        }

    def get_local_media_path(self, folder: str, filename: str) -> Path | None:
        if folder not in ALLOWED_MEDIA_FOLDERS:
            return None
        if not re.fullmatch(r"[0-9a-f-]{36}\.(jpg|png|webp)", filename):
            return None
        path = self._get_upload_base_dir() / "media" / folder / filename
        return path if path.is_file() else None

    def get_local_file_path(self, file_id: str, filename: str, folder: str = "resumes") -> Path | None:
        """Retrieve local file path if it exists."""
        try:
            folder = self._validate_folder(folder)
        except HTTPException:
            return None
        base_dir = self._get_upload_base_dir()
        file_path = base_dir / folder / file_id / sanitize_filename(filename)
        if file_path.exists() and file_path.is_file():
            return file_path
        return None


storage_service = StorageService()
