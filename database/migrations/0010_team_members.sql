-- Team directory shown on /team and managed in Admin > Team.
-- Safe to re-run: the table is created only if missing and the starter list
-- is inserted only when the table is empty.

CREATE TABLE IF NOT EXISTS team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(120) NOT NULL,
    position varchar(160) NOT NULL,
    country varchar(80) NOT NULL,
    team varchar(80) NOT NULL CHECK (team IN (
        'Business Development and Partnerships',
        'Research',
        'Marketing and Communications',
        'Graphic Design and Web',
        'Operations and Programmes'
    )),
    bio text,
    linkedin_url varchar(300),
    photo_url varchar(600),
    is_lead boolean NOT NULL DEFAULT false,
    is_published boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS team_members_published_order_idx
    ON team_members (is_published, sort_order);

-- Row level security: the API connects with the service role; block direct
-- anonymous access through Supabase's public REST endpoint.
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

INSERT INTO team_members (name, position, country, team, is_lead, sort_order)
SELECT * FROM (VALUES
    ('Richard', 'Business Development Intern', 'Ghana', 'Business Development and Partnerships', false, 10),
    ('Saani', 'Research Lead', 'Ghana', 'Research', true, 20),
    ('Oluwafemi', 'Research Consultant', 'Nigeria', 'Research', false, 30),
    ('Domson', 'Research Consultant', 'United States', 'Research', false, 40),
    ('Evans', 'Research Consultant', 'Ghana', 'Research', false, 50),
    ('Benjamin', 'Research Consultant', 'Ghana', 'Research', false, 60),
    ('Maureen Mushwimba', 'Head of Marketing and Communications', 'Zambia', 'Marketing and Communications', true, 70),
    ('Victoria', 'Marketing and Communications Intern', 'Ghana', 'Marketing and Communications', false, 80),
    ('Favour', 'Marketing and Communications Intern', 'Nigeria', 'Marketing and Communications', false, 90),
    ('Yolanda', 'Design Lead', 'Zimbabwe', 'Graphic Design and Web', true, 100),
    ('Silas', 'Designer', 'Rwanda', 'Graphic Design and Web', false, 110),
    ('Christian', 'Designer', 'Ghana', 'Graphic Design and Web', false, 120),
    ('Wendy', 'Designer', 'Ghana', 'Graphic Design and Web', false, 130),
    ('Maranatha', 'Design Intern', 'Ghana', 'Graphic Design and Web', false, 140),
    ('Ramadhani', 'Programme Manager', 'Tanzania', 'Operations and Programmes', false, 150),
    ('Samantha', 'Programme Manager', 'Nigeria', 'Operations and Programmes', false, 160),
    ('Edwin', 'Programme Manager', 'Cameroon', 'Operations and Programmes', false, 170),
    ('Delasi', 'Programmes Intern', 'Ghana', 'Operations and Programmes', false, 180),
    ('Faustino', 'Programmes Intern', 'Burkina Faso', 'Operations and Programmes', false, 190),
    ('Richmond', 'Programmes Intern', 'Ghana', 'Operations and Programmes', false, 200),
    ('Thole', 'Programmes Intern', 'Botswana', 'Operations and Programmes', false, 210),
    ('Emmanuel', 'Programmes Intern', 'Ghana', 'Operations and Programmes', false, 220)
) AS seed(name, position, country, team, is_lead, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM team_members);
