-- 0013: database-backed catalogue for programmes, opportunities and publications.
-- Replaces the in-memory lists in backend/app/data.py so admin edits persist.
-- Existing placeholder items are seeded as unpublished drafts: review each one in
-- the admin console and publish only what is real.

CREATE TABLE IF NOT EXISTS catalogue_items (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('programme', 'opportunity', 'publication')),
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS catalogue_items_kind_idx ON catalogue_items (kind, is_published, sort_order);

ALTER TABLE catalogue_items ENABLE ROW LEVEL SECURITY;

INSERT INTO catalogue_items (id, kind, data, is_published, sort_order) VALUES
  ('programme-career-readiness', 'programme', '{"title": "Career Readiness Lab", "category": "student", "description": "A practical cohort-based programme for building career direction, critical thinking, professional confidence, and employability skills.", "start_date": "2026-10-15T00:00:00Z", "end_date": "2026-12-15T00:00:00Z", "offers": [{"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}, {"type": "vip", "label": "VIP", "amount": 250, "currency": "GHS"}, {"type": "premium", "label": "Premium", "amount": 500, "currency": "GHS"}]}'::jsonb, false, 0),
  ('programme-research-skills', 'programme', '{"title": "Applied Research & Analytical Methods", "category": "training", "description": "Intensive training in study design, quantitative & econometric analysis, qualitative synthesis, and evidence-to-policy communication.", "start_date": "2026-11-01T00:00:00Z", "end_date": "2027-01-30T00:00:00Z", "offers": [{"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}, {"type": "vip", "label": "VIP", "amount": 350, "currency": "GHS"}, {"type": "premium", "label": "Premium", "amount": 650, "currency": "GHS"}]}'::jsonb, false, 1),
  ('programme-exec-leadership', 'programme', '{"title": "Executive Talent & Strategic HR Lab", "category": "professional_development", "description": "Advanced human-capital architecture for leaders scaling teams, optimizing workforce productivity, and driving institutional excellence.", "start_date": "2026-10-20T00:00:00Z", "end_date": "2026-11-20T00:00:00Z", "offers": [{"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}, {"type": "vip", "label": "VIP", "amount": 750, "currency": "GHS"}, {"type": "premium", "label": "Premium", "amount": 1200, "currency": "GHS"}]}'::jsonb, false, 2),
  ('programme-institutional-capacity', 'programme', '{"title": "Higher Education Capacity & Employability Framework", "category": "institutional", "description": "Diagnostic and reform advisory for university faculties and academic leadership seeking to align curriculum with labor market realities.", "start_date": "2026-12-01T00:00:00Z", "end_date": "2027-03-01T00:00:00Z", "offers": [{"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}, {"type": "vip", "label": "VIP", "amount": 1500, "currency": "GHS"}, {"type": "premium", "label": "Premium", "amount": 2500, "currency": "GHS"}]}'::jsonb, false, 3),
  ('opportunity-research-fellowship', 'opportunity', '{"title": "Research & Policy Impact Fellowship", "type": "fellowship", "organization": "Gmac Group", "location": "Hybrid", "description": "Join an elite cohort conducting baseline workforce transition studies and institutional capacity diagnostics across West Africa.", "deadline": "2026-10-31T00:00:00Z", "offers": [{"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}, {"type": "vip", "label": "VIP", "amount": 300, "currency": "GHS"}, {"type": "premium", "label": "Premium", "amount": 600, "currency": "GHS"}]}'::jsonb, false, 0),
  ('opportunity-strategy-associate', 'opportunity', '{"title": "Human Capital Strategy Associate", "type": "employment", "organization": "Gmac Group", "location": "Global Remote", "description": "Partner with cross-functional advisory teams supporting enterprise talent acquisition, workforce planning, and executive development.", "deadline": "2026-11-15T00:00:00Z", "offers": []}'::jsonb, false, 1),
  ('opportunity-research-internship', 'opportunity', '{"title": "Graduate Analytics & Econometrics Internship", "type": "internship", "organization": "Gmac Group", "location": "Hybrid", "description": "High-velocity internship for emerging quantitative analysts and social science graduates assisting on flagship policy evaluation projects.", "deadline": "2026-10-25T00:00:00Z", "offers": [{"type": "free", "label": "Free", "amount": 0, "currency": "GHS"}, {"type": "vip", "label": "VIP Mentorship", "amount": 400, "currency": "GHS"}, {"type": "premium", "label": "Premium Mentorship + Certificate", "amount": 750, "currency": "GHS"}]}'::jsonb, false, 2)
ON CONFLICT (id) DO NOTHING;
