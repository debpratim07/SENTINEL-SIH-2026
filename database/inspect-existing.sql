-- Read-only inventory before designing SENTINEL migrations.
-- Returns schema metadata and aggregate counts, never report/user contents.
select jsonb_build_object(
  'application_tables', coalesce((
    select jsonb_agg(jsonb_build_object(
      'schema', n.nspname,
      'table', c.relname,
      'row_level_security', c.relrowsecurity,
      'columns', (
        select jsonb_agg(jsonb_build_object(
          'name', a.attname,
          'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
          'required', a.attnotnull
        ) order by a.attnum)
        from pg_catalog.pg_attribute a
        where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
      )
    ) order by n.nspname, c.relname)
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p')
      and n.nspname in ('public', 'sentinel')
  ), '[]'::jsonb),
  'application_policies', coalesce((
    select jsonb_agg(jsonb_build_object(
      'schema', schemaname, 'table', tablename,
      'name', policyname, 'operation', cmd, 'roles', roles
    ) order by schemaname, tablename, policyname)
    from pg_catalog.pg_policies
    where schemaname in ('public', 'sentinel')
  ), '[]'::jsonb),
  'auth_user_count', (select count(*) from auth.users),
  'storage_bucket_count', (select count(*) from storage.buckets),
  'public_storage_bucket_count', (select count(*) from storage.buckets where public)
) as inventory;
