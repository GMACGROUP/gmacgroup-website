"use client";

import { useRef, useState } from "react";

interface DocumentUploadDropzoneProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc"];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * CV upload. Files go to private storage and are only visible to Gmac's
 * reviewers, so the applicant sees a confirmation rather than a preview link.
 * Applicants can paste an https link instead (for example a portfolio).
 */
export function DocumentUploadDropzone({
  label = "CV or résumé",
  required = false,
  value = "",
  onChange,
  folder = "resumes",
}: DocumentUploadDropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(
    value && value.startsWith("/api/v1/uploads/") ? decodeURIComponent(value.split("?")[0].split("/").pop() || "") : null,
  );
  const [mode, setMode] = useState<"file" | "url">(value && value.startsWith("https://") ? "url" : "file");
  const [link, setLink] = useState(value.startsWith("https://") ? value : "");

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_SIZE_BYTES) return setError("That file is larger than 10 MB. Please upload a smaller copy.");
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) return setError("Please upload a PDF or Word document (.pdf, .docx, .doc).");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch(`${API_BASE}/uploads/document`, { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.detail || "Upload failed. Please try again.");
      setFileName(data.filename || file.name);
      onChange(data.file_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function clear() {
    setFileName(null);
    onChange("");
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="field-label">
          {label} {required ? "*" : <span className="font-normal text-ink-400">(optional)</span>}
        </span>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "file" ? "url" : "file");
            setError(null);
          }}
          className="text-sm text-accent underline-offset-4 hover:underline"
        >
          {mode === "file" ? "Paste a link instead" : "Upload a file instead"}
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          inputMode="url"
          placeholder="https://"
          className="field"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            onChange(e.target.value.startsWith("https://") ? e.target.value : "");
          }}
          aria-describedby="cv-help"
        />
      ) : fileName ? (
        <div className="mt-1 flex items-center justify-between gap-4 border border-ink/20 bg-white px-4 py-3">
          <p className="min-w-0 truncate text-sm text-ink">
            <span className="mr-2 text-success" aria-hidden="true">✓</span>
            {fileName}
          </p>
          <button type="button" onClick={clear} className="shrink-0 text-sm text-ink-500 hover:text-danger">
            Remove
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`mt-1 flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-7 text-center transition-colors ${
            dragging ? "border-accent bg-accent/5" : "border-ink/25 bg-white hover:border-ink/50"
          }`}
        >
          <input
            ref={input}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            aria-describedby="cv-help"
          />
          <span className="text-sm font-medium text-ink">{uploading ? "Uploading..." : "Choose a file or drop it here"}</span>
          <span className="mt-1 text-[13px] text-ink-400">PDF or Word, up to 10 MB</span>
        </label>
      )}

      <p id="cv-help" className="mt-1.5 text-[13px] text-ink-400">
        {mode === "url"
          ? "A link to your CV or portfolio. It must start with https://"
          : "Stored privately. Only the people reviewing your application can open it."}
      </p>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
