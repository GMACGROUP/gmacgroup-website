-- 0014: turn on row level security for every table in the public schema.
--
-- The FastAPI backend connects as the database owner (or the Supabase service
-- role), which bypasses RLS, so the website keeps working unchanged. What this
-- blocks is direct access through Supabase's auto-generated REST API with the
-- public anon key: with RLS on and no policies, those requests see no rows.
-- Without this, anyone holding the anon key could read users, applications,
-- payments and contact messages directly.

DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;

-- Check afterwards (should return no rows):
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity;
