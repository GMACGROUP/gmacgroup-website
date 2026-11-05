-- Keep programme enrolment statuses aligned with the API lifecycle.
ALTER TABLE programme_enrolments DROP CONSTRAINT IF EXISTS programme_enrolments_status_check;

ALTER TABLE programme_enrolments ADD CONSTRAINT programme_enrolments_status_check
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));