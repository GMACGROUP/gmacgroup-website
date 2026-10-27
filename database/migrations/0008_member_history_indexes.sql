-- Indexes for member history lookups and paginated admin queues.

-- Authenticated history endpoints query by either user id or normalized email
-- and then order matching rows by newest first.
CREATE INDEX IF NOT EXISTS applications_user_id_created_at_idx
    ON applications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS applications_applicant_email_created_at_idx
    ON applications(applicant_email, created_at DESC);
CREATE INDEX IF NOT EXISTS programme_enrolments_user_id_created_at_idx
    ON programme_enrolments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS programme_enrolments_email_created_at_idx
    ON programme_enrolments(email, created_at DESC);

-- Admin filters by status and paginates newest records first.
CREATE INDEX IF NOT EXISTS applications_status_created_at_idx
    ON applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS programme_enrolments_status_created_at_idx
    ON programme_enrolments(status, created_at DESC);

-- Admin queues ordered by creation time.
CREATE INDEX IF NOT EXISTS users_created_at_idx
    ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_requests_created_at_idx
    ON contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS payments_created_at_idx
    ON payments(created_at DESC);
