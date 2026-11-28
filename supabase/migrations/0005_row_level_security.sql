-- The app connects as the database owner, which bypasses row security.
-- The public API roles get no policies, so they can see and change nothing.
do $migration$
declare
  table_name text;
begin
  for table_name in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;

  execute 'revoke all on all tables in schema public from public';
  execute 'alter default privileges in schema public revoke all on tables from public';

  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on all tables in schema public from anon';
    execute 'alter default privileges in schema public revoke all on tables from anon';
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on all tables in schema public from authenticated';
    execute 'alter default privileges in schema public revoke all on tables from authenticated';
  end if;
end
$migration$;
