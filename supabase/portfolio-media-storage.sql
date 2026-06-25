-- Supabase Storage for portfolio entry images
-- Replace YOUR-AUTH-USER-UUID with your Auth user id (same as insert/delete/update policies).
-- Run in Supabase → SQL. You can also create the bucket in Dashboard → Storage.

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

create policy "Public read portfolio media"
  on storage.objects
  for select
  using (bucket_id = 'portfolio-media');

create policy "Owner upload portfolio media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and auth.uid() = 'YOUR-AUTH-USER-UUID'::uuid
  );

create policy "Owner update portfolio media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and auth.uid() = 'YOUR-AUTH-USER-UUID'::uuid
  );

create policy "Owner delete portfolio media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and auth.uid() = 'YOUR-AUTH-USER-UUID'::uuid
  );
