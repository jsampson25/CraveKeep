insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recipe-imports', 'recipe-imports', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "capture_assets_select_own" on storage.objects for select to authenticated
using (bucket_id = 'recipe-imports' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "capture_assets_insert_own" on storage.objects for insert to authenticated
with check (bucket_id = 'recipe-imports' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "capture_assets_delete_own" on storage.objects for delete to authenticated
using (bucket_id = 'recipe-imports' and (storage.foldername(name))[1] = (select auth.uid())::text);
