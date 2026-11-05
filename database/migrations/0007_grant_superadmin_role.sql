-- Grant admin operations access to the designated existing account.
UPDATE users
SET role = 'admin'
WHERE LOWER(email) = LOWER('superadmin@gmacgroup.org');
