-- Owner-only inserts for portfolio_entries
-- 1. Replace YOUR-AUTH-USER-UUID with the same value as VITE_PORTFOLIO_OWNER_ID (Auth → Users, or from the app after sign-in).
-- 2. Drop any previous permissive INSERT policy you added for testing.
-- 3. Run this in Supabase → SQL → New query.

-- List policy names if needed:
-- select policyname from pg_policies where tablename = 'portfolio_entries';

drop policy if exists "Allow anon insert portfolio entries" on public.portfolio_entries;
drop policy if exists "Allow public inserts" on public.portfolio_entries;

create policy "Owner can insert portfolio entries"
  on public.portfolio_entries
  for insert
  to authenticated
  with check (auth.uid() = 'YOUR-AUTH-USER-UUID'::uuid);

-- Public read (keep or adjust to your needs)
-- select policy should remain for anon if the site reads without login.

-- For owner-only DELETE from the app, see supabase/owner-delete-policy.sql
