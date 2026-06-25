-- Owner-only updates for portfolio_entries
-- Replace YOUR-AUTH-USER-UUID with the same value as VITE_PORTFOLIO_OWNER_ID.
-- Run in Supabase → SQL after your owner INSERT policy exists.

create policy "Owner can update portfolio entries"
  on public.portfolio_entries
  for update
  to authenticated
  using (auth.uid() = 'YOUR-AUTH-USER-UUID'::uuid)
  with check (auth.uid() = 'YOUR-AUTH-USER-UUID'::uuid);
