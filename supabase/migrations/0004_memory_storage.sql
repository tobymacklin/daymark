-- Private photo bucket. Skipped on the local database, which has no storage schema.
-- A person can read and write only the folder named with their profile id.
do $migration$
begin
  if not exists (
    select 1 from information_schema.schemata where schema_name = 'storage'
  ) then
    return;
  end if;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'memories',
    'memories',
    false,
    4000000,
    array['image/jpeg', 'image/png', 'image/webp']
  )
  on conflict (id) do update
    set public = excluded.public,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

  -- Not exposed through the Data API. Returns only the signed-in profile id.
  create schema if not exists private;
  revoke all on schema private from public;
  grant usage on schema private to authenticated;

  create or replace function private.profile_folder()
  returns text
  language sql
  stable
  security definer
  set search_path = public
  as $fn$
    select id::text from public.profiles where auth_user_id = (select auth.uid())
  $fn$;

  revoke all on function private.profile_folder() from public;
  grant execute on function private.profile_folder() to authenticated;

  execute 'drop policy if exists memories_insert_own on storage.objects';
  execute 'drop policy if exists memories_select_own on storage.objects';
  execute 'drop policy if exists memories_update_own on storage.objects';
  execute 'drop policy if exists memories_delete_own on storage.objects';
  execute 'drop policy if exists memories_own on storage.objects';
  execute $policy$
    create policy memories_own
    on storage.objects
    for all
    to authenticated
    using (
      bucket_id = 'memories'
      and (storage.foldername(name))[1] = (select private.profile_folder())
    )
    with check (
      bucket_id = 'memories'
      and (storage.foldername(name))[1] = (select private.profile_folder())
    )
  $policy$;
end
$migration$;
