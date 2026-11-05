-- Durable member profiles, applications, enrolments, and operations metadata.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS organization TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE applications
    DROP CONSTRAINT IF EXISTS applications_opportunity_id_fkey;

ALTER TABLE applications
    ALTER COLUMN opportunity_id TYPE TEXT USING opportunity_id::text,
    ADD COLUMN IF NOT EXISTS opportunity_title TEXT,
    ADD COLUMN IF NOT EXISTS applicant_name TEXT,
    ADD COLUMN IF NOT EXISTS applicant_email TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
    ADD COLUMN IF NOT EXISTS cover_note TEXT,
    ADD COLUMN IF NOT EXISTS resume_url TEXT,
    ADD COLUMN IF NOT EXISTS offer_type TEXT NOT NULL DEFAULT 'free',
    ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'not_required',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE programme_enrolments
    DROP CONSTRAINT IF EXISTS programme_enrolments_programme_id_fkey;

ALTER TABLE programme_enrolments
    ALTER COLUMN programme_id TYPE TEXT USING programme_id::text,
    ADD COLUMN IF NOT EXISTS programme_title TEXT,
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS organization TEXT,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS offer_type TEXT NOT NULL DEFAULT 'free',
    ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'not_required',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE payments
    DROP CONSTRAINT IF EXISTS payments_programme_id_fkey,
    DROP CONSTRAINT IF EXISTS payments_opportunity_id_fkey;

ALTER TABLE payments
    ALTER COLUMN programme_id TYPE TEXT USING programme_id::text,
    ALTER COLUMN opportunity_id TYPE TEXT USING opportunity_id::text,
    ADD COLUMN IF NOT EXISTS target_type TEXT,
    ADD COLUMN IF NOT EXISTS target_title TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
CREATE INDEX IF NOT EXISTS applications_created_at_idx ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS programme_enrolments_status_idx ON programme_enrolments(status);
CREATE INDEX IF NOT EXISTS programme_enrolments_created_at_idx ON programme_enrolments(created_at DESC);

CREATE TABLE IF NOT EXISTS application_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS application_events_application_id_idx
    ON application_events(application_id, created_at DESC);