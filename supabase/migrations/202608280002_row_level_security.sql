grant usage on schema app_private to authenticated;

create function app_private.is_project_member(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.project_memberships membership
    where membership.project_id = target_project_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
  );
$$;

create function app_private.has_project_role(target_project_id uuid, allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.project_memberships membership
    where membership.project_id = target_project_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
      and membership.role = any(allowed_roles)
  );
$$;

grant execute on function app_private.is_project_member(uuid) to authenticated;
grant execute on function app_private.has_project_role(uuid, public.app_role[]) to authenticated;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_memberships enable row level security;
alter table public.areas enable row level security;
alter table public.disciplines enable row level security;
alter table public.schedule_imports enable row level security;
alter table public.schedule_activities enable row level security;
alter table public.schedule_relationships enable row level security;
alter table public.reports enable row level security;
alter table public.report_files enable row level security;
alter table public.ingestion_jobs enable row level security;
alter table public.evidence_references enable row level security;
alter table public.extracted_events enable row level security;
alter table public.match_candidates enable row level security;
alter table public.review_items enable row level security;
alter table public.verification_decisions enable row level security;
alter table public.actual_events enable row level security;
alter table public.progress_snapshots enable row level security;
alter table public.exceptions enable row level security;
alter table public.clarifications enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;
alter table public.idempotency_keys enable row level security;

create policy profiles_select_self on public.profiles
for select to authenticated using (id = auth.uid());

create policy profiles_update_self on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy memberships_select_own_or_admin on public.project_memberships
for select to authenticated using (
  user_id = auth.uid()
  or app_private.has_project_role(project_id, array['administrator']::public.app_role[])
);

create policy projects_select_member on public.projects
for select to authenticated using (app_private.is_project_member(id));

create policy organizations_select_member on public.organizations
for select to authenticated using (
  exists (
    select 1
    from public.projects project
    where project.organization_id = organizations.id
      and app_private.is_project_member(project.id)
  )
);

create policy areas_select_member on public.areas
for select to authenticated using (app_private.is_project_member(project_id));

create policy disciplines_select_member on public.disciplines
for select to authenticated using (app_private.is_project_member(project_id));

create policy schedule_imports_select_member on public.schedule_imports
for select to authenticated using (app_private.is_project_member(project_id));

create policy schedule_activities_select_member on public.schedule_activities
for select to authenticated using (app_private.is_project_member(project_id));

create policy schedule_relationships_select_member on public.schedule_relationships
for select to authenticated using (app_private.is_project_member(project_id));

create policy reports_select_member on public.reports
for select to authenticated using (app_private.is_project_member(project_id));

create policy report_files_select_member on public.report_files
for select to authenticated using (
  exists (
    select 1 from public.reports report
    where report.id = report_files.report_id
      and app_private.is_project_member(report.project_id)
  )
);

create policy ingestion_jobs_select_authorized on public.ingestion_jobs
for select to authenticated using (
  app_private.has_project_role(
    project_id,
    array['planner', 'project-controls', 'administrator']::public.app_role[]
  )
);

create policy evidence_references_select_member on public.evidence_references
for select to authenticated using (
  exists (
    select 1
    from public.report_files report_file
    join public.reports report on report.id = report_file.report_id
    where report_file.id = evidence_references.report_file_id
      and app_private.is_project_member(report.project_id)
  )
);

create policy extracted_events_select_member on public.extracted_events
for select to authenticated using (app_private.is_project_member(project_id));

create policy match_candidates_select_reviewers on public.match_candidates
for select to authenticated using (
  exists (
    select 1 from public.extracted_events event
    where event.id = match_candidates.extracted_event_id
      and app_private.has_project_role(
        event.project_id,
        array['planner', 'project-controls']::public.app_role[]
      )
  )
);

create policy review_items_select_reviewers on public.review_items
for select to authenticated using (
  app_private.has_project_role(
    project_id,
    array['planner', 'project-controls']::public.app_role[]
  )
);

create policy verification_decisions_select_authorized on public.verification_decisions
for select to authenticated using (
  exists (
    select 1 from public.review_items review
    where review.id = verification_decisions.review_item_id
      and app_private.has_project_role(
        review.project_id,
        array['planner', 'project-controls', 'administrator']::public.app_role[]
      )
  )
);

create policy actual_events_select_member on public.actual_events
for select to authenticated using (app_private.is_project_member(project_id));

create policy progress_snapshots_select_member on public.progress_snapshots
for select to authenticated using (app_private.is_project_member(project_id));

create policy exceptions_select_member on public.exceptions
for select to authenticated using (app_private.is_project_member(project_id));

create policy clarifications_select_participant on public.clarifications
for select to authenticated using (
  app_private.is_project_member(project_id)
  and (
    requested_by = auth.uid()
    or requested_from = auth.uid()
    or app_private.has_project_role(
      project_id,
      array['planner', 'project-controls', 'administrator']::public.app_role[]
    )
  )
);

create policy notifications_select_own on public.notifications
for select to authenticated using (user_id = auth.uid());

create policy notifications_mark_own_read on public.notifications
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy audit_events_select_authorized on public.audit_events
for select to authenticated using (
  project_id is not null
  and app_private.has_project_role(
    project_id,
    array['planner', 'project-controls', 'administrator']::public.app_role[]
  )
);

grant select on all tables in schema public to authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;
grant update (read_at) on public.notifications to authenticated;

alter default privileges in schema public grant select on tables to authenticated;
