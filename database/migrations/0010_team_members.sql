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
    ('Richard Klutse', 'Head of Programs & Business Development', 'Ghana', 'Business Development and Partnerships', true, 10),
    ('Atigsimah Richard Akamboe', 'Business Development Intern', 'Ghana', 'Business Development and Partnerships', false, 20),
    ('Ismail Saani', 'Research Consultant, Interim Team Lead', 'Ghana', 'Research', true, 30),
    ('Benjamin Asiedu', 'Research Consultant', 'Ghana', 'Research', false, 40),
    ('Evans Essene Dzidzienyo', 'Research Consultant', 'Ghana', 'Research', false, 50),
    ('Oluwatosin Temitope Ogungbade', 'Research Consultant', 'Nigeria', 'Research', false, 60),
    ('Atta Gyasi Domson', 'Research Consultant', 'United States', 'Research', false, 70),
    ('Maureen Mushwimba', 'Digital Marketing & Communications Strategist', 'Zambia', 'Marketing and Communications', false, 80),
    ('Jude Van-Tagoe', 'Digital Marketing & Communications Strategist', 'Ghana', 'Marketing and Communications', false, 90),
    ('Victoria Dzifa Atisoe', 'Digital Marketing & Communications Intern', 'Ghana', 'Marketing and Communications', false, 100),
    ('Favour Ohiemi', 'Digital Marketing & Communications Intern', 'Nigeria', 'Marketing and Communications', false, 110),
    ('Yolanda Chibaya', 'Graphic & Web Designer', 'Zimbabwe', 'Graphic Design and Web', false, 120),
    ('Silas Bivamwijuru', 'Graphic & Web Designer', 'Rwanda', 'Graphic Design and Web', false, 130),
    ('Christian Agyapong', 'Graphic & Web Designer', 'Ghana', 'Graphic Design and Web', false, 140),
    ('Maranatha Okeley Odai', 'Graphic & Web Designer', 'Ghana', 'Graphic Design and Web', false, 150),
    ('Wendy Gerrar Otu', 'Graphic & Web Design Intern', 'Ghana', 'Graphic Design and Web', false, 160),
    ('Ramadhani Athumani Mbiaji', 'Operations & Program Manager', 'Tanzania', 'Operations and Programmes', false, 170),
    ('Apollo Samantha Dorcas', 'Operations & Program Manager', 'Nigeria', 'Operations and Programmes', false, 180),
    ('Edwin Camichael Ngyfo Teno', 'Operations & Program Manager', 'Cameroon', 'Operations and Programmes', false, 190),
    ('Delasi Kumapley', 'Operations & Program Intern', 'Ghana', 'Operations and Programmes', false, 200),
    ('Faustino Albert', 'Operations & Program Intern', 'Burkina Faso', 'Operations and Programmes', false, 210),
    ('Addai Kojo Richmond', 'Operations & Program Intern', 'Ghana', 'Operations and Programmes', false, 220),
    ('Mphoyame Thole', 'Operations & Program Intern', 'Botswana', 'Operations and Programmes', false, 230),
    ('Emmanuel Nyamekye', 'Operations & Program Intern', 'Ghana', 'Operations and Programmes', false, 240)
) AS seed(name, position, country, team, is_lead, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM team_members);
