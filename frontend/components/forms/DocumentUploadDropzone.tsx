"use client";

import React, { useState, useRef } from "react";
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  XMarkIcon,
  FileTextIcon,
  EyeIcon,
  DocumentIcon,
} from "@/components/common/Icons";

interface DocumentUploadDropzoneProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc"];

export function DocumentUploadDropzone({
  label = "Curriculum Vitae / Resume",
  required = false,
  value = "",
  onChange,
  folder = "resumes",
}: DocumentUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    sizeFormatted: string;
    url: string;
    isInternal: boolean;
  } | null>(() => {
    if (value) {
      return {
        name: value.split("/").pop() || "Document",
        sizeFormatted: "Uploaded",
        url: value,
        isInternal: value.startsWith("/api/v1/uploads/"),
      };
    }
    return null;
  });

  const [mode, setMode] = useState<"file" | "url">("file");
  const [manualUrl, setManualUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const getFullFileUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Relative API route
    const base = API_BASE.replace(/\/api\/v1$/, "");
    return `${base}${url}`;
  };

  const handleFile = async (file: File) => {
    setError(null);

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      setError("File is too large. Maximum file size allowed is 10MB.");
      return;
    }

    // Validate format
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError("Unsupported format. Please upload a PDF (.pdf) or Word document (.docx, .doc).");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch(`${API_BASE}/uploads/document`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      const relativeUrl = data.file_url;

      setUploadedFile({
        name: data.filename || file.name,
        sizeFormatted: data.size_formatted || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: relativeUrl,
        isInternal: true,
      });

      onChange(relativeUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (url: string) => {
    setManualUrl(url);
    onChange(url);
    if (url.trim()) {
      setUploadedFile({
        name: url.length > 40 ? url.substring(0, 37) + "..." : url,
        sizeFormatted: "External Link",
        url: url.trim(),
        isInternal: false,
      });
    } else {
      setUploadedFile(null);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setManualUrl("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          {label} {required && <span className="text-brand-red">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              mode === "file"
                ? "bg-white text-brand-navy shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Direct Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              mode === "url"
                ? "bg-white text-brand-navy shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Cloud Link
          </button>
        </div>
      </div>

      {mode === "file" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {!uploadedFile && !uploading && (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 ${
                isDragging
                  ? "border-brand-navy bg-blue-50/70 scale-[1.01]"
                  : "border-slate-300 bg-slate-50/80 hover:border-brand-navy/60 hover:bg-white"
              }`}
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-navy shadow-xs border border-slate-200 group-hover:scale-105 transition-transform">
                <CloudArrowUpIcon className="h-6 w-6 text-brand-navy" />
              </div>
              <p className="mt-2.5 text-xs font-bold text-slate-800">
                <span className="text-brand-navy group-hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                PDF, DOCX, or DOC (Maximum file size: 10MB)
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-brand-red border border-red-200">
                  PDF
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-navy border border-blue-200">
                  DOCX
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Secure Storage
                </span>
              </div>
            </div>
          )}

          {uploading && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 text-center space-y-3">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-navy border-t-transparent" />
              <p className="text-xs font-bold text-slate-900">Uploading and securing document...</p>
              <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-brand-navy" />
              </div>
            </div>
          )}

          {uploadedFile && !uploading && (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5 shadow-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <DocumentIcon className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-slate-900">{uploadedFile.name}</p>
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{uploadedFile.sizeFormatted} • Ready</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={getFullFileUrl(uploadedFile.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-brand-navy hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  <EyeIcon className="h-3.5 w-3.5 text-brand-navy" />
                  <span>Preview</span>
                </a>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-red-600 transition-colors"
                  aria-label="Remove document"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => handleManualUrlSubmit(e.target.value)}
            placeholder="https://drive.google.com/... or https://dropbox.com/..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
          />
          <p className="text-[11px] text-slate-500">
            Please ensure link sharing permissions are set to &quot;Anyone with the link can view&quot;.
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-brand-red text-center">
          {error}
        </p>
      )}
    </div>
  );
}
