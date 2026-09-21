-- Update users_role_check constraint to permit all GMAC member and organizational roles.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('student', 'professional', 'researcher', 'employer', 'institution', 'employee', 'admin'));
