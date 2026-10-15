-- Events shown on /events and managed in Admin > Events.
-- Times are stored in UTC; `timezone` is the zone the event is advertised in.

CREATE TABLE IF NOT EXISTS events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug varchar(160) NOT NULL UNIQUE,
    title varchar(200) NOT NULL,
    summary varchar(600) NOT NULL,
    body text,
    series varchar(120),
    format varchar(20) NOT NULL CHECK (format IN ('online', 'in_person', 'hybrid')),
    location varchar(200),
    start_at timestamptz,
    end_at timestamptz,
    timezone varchar(64) NOT NULL DEFAULT 'Africa/Accra',
    all_day boolean NOT NULL DEFAULT false,
    date_label varchar(80),
    partners varchar(300),
    registration_url varchar(500),
    recording_url varchar(500),
    image_url varchar(600),
    is_featured boolean NOT NULL DEFAULT false,
    is_published boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (start_at IS NOT NULL OR date_label IS NOT NULL),
    CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);

CREATE INDEX IF NOT EXISTS events_published_start_idx ON events (is_published, start_at);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Starter records. Past events come from Gmac flyers; upcoming events from the
-- Q4 2026 portfolio. Unconfirmed items are saved as drafts (is_published = false).
INSERT INTO events (slug, title, summary, body, series, format, location, start_at, end_at, timezone, all_day, date_label, image_url, is_featured, is_published)
VALUES
  ('leadership-2050-summit-2024', 'Leadership 2050 Summit 2024',
   'Four evenings of conversation on leadership and the future of Africa, with sixteen speakers from policy, diplomacy, research and enterprise.',
   'The 2024 edition ran online over four days, from 5:00 to 8:00 pm UTC each day, bringing together sixteen speakers and more than two hundred participants.',
   'Leadership 2050', 'online', 'Online (Zoom)', '2024-09-11 17:00+00', '2024-09-14 20:00+00', 'UTC', false, NULL,
   '/images/events/leadership-2050-summit-2024.jpg', false, true),
  ('research-methods-training-and-certification-workshop-2025', 'Research Methods Training and Certification Workshop',
   'Mastering research, from ideas to publication: three days on proposals, research design, data collection, ethics, analysis and publication.',
   'Key areas: developing and writing effective research proposals; research design, data collection and ethical standards; data analysis, reporting and publication strategies.',
   'Research and Analysis Series', 'online', 'Online (Zoom)', '2025-11-27 00:00+00', '2025-11-29 23:59+00', 'Africa/Accra', true, NULL,
   '/images/events/research-methods-workshop-2025.jpg', false, true),
  ('leadership-2050-summit-2026', 'Leadership 2050 Summit 2026',
   'Our flagship convening on leadership, policy and the future of Africa returns as a four day hybrid summit.',
   NULL, 'Leadership 2050', 'hybrid', NULL, '2026-10-21 00:00+00', '2026-10-24 23:59+00', 'Africa/Accra', true, NULL,
   NULL, true, true),
  ('young-professionals-network-2026', 'Young Professionals Network: 2026 cohort',
   'A three month mentorship programme for young professionals, with weekly Saturday sessions.',
   NULL, 'Young Professionals Network', 'online', NULL, '2026-11-16 00:00+00', NULL, 'Africa/Accra', true, NULL,
   NULL, false, false),
  ('research-methods-workshop-2026', 'Research Methods and Certification Workshop 2026',
   'A three day certified workshop on research methods for researchers, analysts and institutional teams.',
   NULL, 'Research and Analysis Series', 'online', NULL, NULL, NULL, 'Africa/Accra', true, 'November 2026',
   NULL, false, false),
  ('research-methods-training-programme-2027', 'Research Methods Training Programme',
   'A one to two month training programme in applied research methods, launching in January 2027.',
   NULL, 'Research and Analysis Series', 'online', NULL, NULL, NULL, 'Africa/Accra', true, 'January 2027',
   NULL, false, false)
ON CONFLICT (slug) DO NOTHING;
