-- Paid programme and opportunity offers with Flutterwave transaction tracking.

ALTER TABLE programmes
    ADD COLUMN IF NOT EXISTS offers JSONB NOT NULL DEFAULT '[{"type":"free","label":"Free","amount":0,"currency":"GHS"}]'::jsonb;

ALTER TABLE opportunities
    ADD COLUMN IF NOT EXISTS offers JSONB NOT NULL DEFAULT '[{"type":"free","label":"Free","amount":0,"currency":"GHS"}]'::jsonb;

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    programme_id UUID REFERENCES programmes(id),
    opportunity_id UUID REFERENCES opportunities(id),
    offer_type TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    provider TEXT NOT NULL DEFAULT 'flutterwave',
    provider_reference TEXT UNIQUE NOT NULL,
    provider_transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);