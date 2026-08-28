insert into public.organizations (id, name, slug)
values ('10000000-0000-4000-8000-000000000001', 'SENTINEL Demo Organization', 'sentinel-demo')
on conflict (id) do update set name = excluded.name;

insert into public.projects (id, organization_id, code, name, status, timezone)
values (
  '20000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  'INFRA-EXP',
  'Infrastructure Expansion',
  'active',
  'Asia/Kolkata'
)
on conflict (id) do update set name = excluded.name;

insert into public.areas (id, project_id, code, name)
values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'AREA-A', 'Area A'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'AREA-B', 'Area B'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'UTILITY', 'Utility Block')
on conflict (id) do update set name = excluded.name;

insert into public.disciplines (id, project_id, code, name)
values
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'PIP', 'Piping'),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'ROT', 'Rotating Equipment'),
  ('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'CIV', 'Civil'),
  ('40000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', 'ELE', 'Electrical')
on conflict (id) do update set name = excluded.name;

insert into public.schedule_imports (
  id, project_id, version_number, source_filename, status, published_at
)
values (
  '50000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  1,
  'sentinel_demo_schedule.xlsx',
  'published',
  now()
)
on conflict (id) do nothing;

insert into public.schedule_activities (
  id, project_id, schedule_import_id, external_id, name, discipline_id, area_id,
  planned_start, planned_finish, planned_progress, status
)
values
  (
    '60000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000001',
    'ERECT-LINE-24-XX', 'ERECT LINE 24-XX',
    '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002',
    '2026-08-20', '2026-08-30', 65, 'in-progress'
  ),
  (
    '60000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000001',
    'EQUIPMENT-ALIGNMENT-P204', 'EQUIPMENT ALIGNMENT — P-204',
    '40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000003',
    '2026-08-24', '2026-08-29', 40, 'in-progress'
  ),
  (
    '60000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000001',
    'FOUNDATION-BLOCK-C14', 'FOUNDATION BLOCK C-14',
    '40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001',
    '2026-08-18', '2026-08-27', 100, 'complete'
  ),
  (
    '60000000-0000-4000-8000-000000000004',
    '20000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000001',
    'CABLE-TRAY-UTILITY', 'CABLE TRAY INSTALLATION — UTILITY BLOCK',
    '40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000003',
    '2026-08-26', '2026-09-04', 20, 'in-progress'
  )
on conflict (id) do update
set name = excluded.name,
    planned_progress = excluded.planned_progress,
    status = excluded.status;

do $$
declare
  demo_user_id uuid;
begin
  select id into demo_user_id from auth.users where email = 'arjun.mehta@sentinel.demo' limit 1;

  if demo_user_id is not null then
    insert into public.project_memberships (project_id, user_id, role, status, disciplines)
    values (
      '20000000-0000-4000-8000-000000000001',
      demo_user_id,
      'planner',
      'active',
      array['Piping', 'Rotating Equipment', 'Civil', 'Electrical']
    )
    on conflict (project_id, user_id) do update
    set role = excluded.role,
        status = excluded.status,
        disciplines = excluded.disciplines;
  end if;
end;
$$;
