-- 0015: mark the team leads for Marketing and Communications, Graphic Design and Web,
-- and Operations and Programmes. Safe to run more than once.
UPDATE team_members SET is_lead = true
WHERE name IN ('Maureen Mushwimba', 'Yolanda Chibaya', 'Ramadhani Athumani Mbiaji');
