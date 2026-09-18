// Kept in sync with backend/app/schemas/*.py
// Last synced: 2026-09-18

// ---------------------------------------------------------------------------
// Shared / Auth (backend: schemas/user.py)
// ---------------------------------------------------------------------------

export type UserRole =
  | "student"
  | "professional"
  | "researcher"
  | "employer"
  | "institution"
  | "employee"
  | "admin";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
}

// ---------------------------------------------------------------------------
// Services (backend: schemas/service.py → ServiceOut)
// ---------------------------------------------------------------------------

export interface Service {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  category?: string; // e.g. "education" | "consulting" | "research"
}

// ---------------------------------------------------------------------------
// Programmes (backend: schemas/programme.py → ProgrammeOut)
// ---------------------------------------------------------------------------

export type ProgrammeCategory =
  | "student"
  | "professional_development"
  | "training"
  | "institutional";

export interface Programme {
  id: string;
  title: string;
  category: ProgrammeCategory;
  description?: string;
  start_date?: string | null; // ISO 8601 datetime string or null
  end_date?: string | null;   // ISO 8601 datetime string or null
}

export interface EnrolmentCreate {
  notes?: string;
}

export type EnrolmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Enrolment {
  id: string;
  programme_id: string;
  user_id: string;
  status: EnrolmentStatus | string; // backend currently returns a plain string
  created_at: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Opportunities (backend: schemas/opportunity.py → OpportunityOut)
// ---------------------------------------------------------------------------

export type OpportunityType =
  | "internship"
  | "employment"
  | "fellowship"
  | "other";

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organization?: string;
  location?: string;
  description?: string;
  deadline?: string | null; // ISO 8601 datetime string or null
}

export interface ApplicationCreate {
  cover_note?: string;
  resume_url?: string;
}

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "accepted";

export interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: ApplicationStatus;
  created_at: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Research (backend: schemas/research.py → ResearchProjectOut, PublicationOut, ExpertOut)
// ---------------------------------------------------------------------------

export interface ResearchProject {
  id: string;
  title: string;
  summary?: string;
  status?: string; // e.g. "ongoing" | "completed" | "planned"
  lead_researcher?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  published_at?: string | null; // ISO 8601 datetime string or null
  url?: string;
}

export interface Expert {
  id: string;
  full_name: string;
  expertise_areas: string[];
  bio?: string;
}
