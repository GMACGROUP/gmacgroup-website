-- Prevent one member from submitting the same opportunity or programme more than once.
-- Apply this migration only after checking for existing duplicate rows.

CREATE UNIQUE INDEX IF NOT EXISTS applications_one_per_opportunity_email_idx
    ON applications(opportunity_id, lower(applicant_email))
    WHERE applicant_email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS applications_one_per_opportunity_user_idx
    ON applications(opportunity_id, user_id)
    WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS programme_enrolments_one_per_programme_email_idx
    ON programme_enrolments(programme_id, lower(email))
    WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS programme_enrolments_one_per_programme_user_idx
    ON programme_enrolments(programme_id, user_id)
    WHERE user_id IS NOT NULL;