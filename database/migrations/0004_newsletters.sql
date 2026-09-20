CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'subscribed'
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
    ON newsletter_subscribers(status);