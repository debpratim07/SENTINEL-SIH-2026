create extension if not exists pgcrypto;
create extension if not exists citext;
create extension if not exists pg_trgm;

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create type public.app_role as enum (
  'site-supervisor',
  'discipline-engineer',
  'planner',
  'project-controls',
  'project-manager',
  'administrator'
);

create type public.membership_status as enum ('invited', 'active', 'suspended');
create type public.report_status as enum (
  'uploading', 'uploaded', 'queued', 'processing', 'extracted', 'needs-review', 'verified', 'failed'
);
create type public.ingestion_job_status as enum ('queued', 'processing', 'completed', 'failed', 'cancelled');
create type public.extracted_event_status as enum ('extracted', 'matched', 'needs-review', 'verified', 'rejected');
create type public.review_status as enum ('pending', 'in-review', 'accepted', 'rejected', 'clarification-requested');
create type public.decision_type as enum ('accept', 'reject', 'correct', 'request-clarification');
create type public.actual_status as enum ('verified', 'superseded', 'withdrawn');
create type public.exception_status as enum ('open', 'investigating', 'clarification-requested', 'resolved', 'reopened');
create type public.exception_severity as enum ('low', 'medium', 'high', 'critical');

create function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  slug citext not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  code citext not null,
  name text not null check (length(trim(name)) > 0),
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  timezone text not null default 'Asia/Kolkata',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table public.project_memberships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  status public.membership_status not null default 'active',
  disciplines text[] not null default '{}',
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, user_id)
);

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code citext not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (project_id, code)
);

create table public.disciplines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code citext not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (project_id, code)
);

create table public.schedule_imports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  source_filename text not null,
  storage_path text,
  checksum_sha256 text check (checksum_sha256 is null or checksum_sha256 ~ '^[a-fA-F0-9]{64}$'),
  status text not null default 'draft' check (status in ('draft', 'validating', 'published', 'rejected')),
  imported_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, version_number)
);

create table public.schedule_activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  schedule_import_id uuid not null references public.schedule_imports(id) on delete cascade,
  external_id citext not null,
  name text not null,
  description text,
  discipline_id uuid references public.disciplines(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  planned_start date,
  planned_finish date,
  planned_progress numeric(5,2) not null default 0 check (planned_progress between 0 and 100),
  status text not null default 'not-started' check (status in ('not-started', 'in-progress', 'complete', 'on-hold')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (schedule_import_id, external_id),
  check (planned_finish is null or planned_start is null or planned_finish >= planned_start)
);

create table public.schedule_relationships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  predecessor_id uuid not null references public.schedule_activities(id) on delete cascade,
  successor_id uuid not null references public.schedule_activities(id) on delete cascade,
  relationship_type text not null default 'FS' check (relationship_type in ('FS', 'SS', 'FF', 'SF')),
  lag_days integer not null default 0,
  created_at timestamptz not null default now(),
  unique (predecessor_id, successor_id, relationship_type),
  check (predecessor_id <> successor_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  report_number citext not null,
  title text not null,
  report_date date not null,
  status public.report_status not null default 'uploading',
  uploaded_by uuid references auth.users(id) on delete set null,
  processing_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, report_number)
);

create table public.report_files (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  storage_bucket text not null default 'project-documents',
  storage_path text not null unique,
  original_filename text not null,
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  checksum_sha256 text check (checksum_sha256 is null or checksum_sha256 ~ '^[a-fA-F0-9]{64}$'),
  version_number integer not null default 1 check (version_number > 0),
  uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (report_id, version_number)
);

create table public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  report_id uuid not null references public.reports(id) on delete cascade,
  status public.ingestion_job_status not null default 'queued',
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 3 check (max_attempts > 0),
  locked_by text,
  locked_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.evidence_references (
  id uuid primary key default gen_random_uuid(),
  report_file_id uuid not null references public.report_files(id) on delete cascade,
  page_number integer check (page_number is null or page_number > 0),
  quoted_text text,
  source_location jsonb not null default '{}',
  content_checksum text,
  created_at timestamptz not null default now()
);

create table public.extracted_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  report_id uuid not null references public.reports(id) on delete cascade,
  evidence_reference_id uuid references public.evidence_references(id) on delete set null,
  event_date date,
  summary text not null,
  discipline_id uuid references public.disciplines(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  quantity numeric,
  unit text,
  confidence numeric(5,4) not null check (confidence between 0 and 1),
  status public.extracted_event_status not null default 'extracted',
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.match_candidates (
  id uuid primary key default gen_random_uuid(),
  extracted_event_id uuid not null references public.extracted_events(id) on delete cascade,
  schedule_activity_id uuid not null references public.schedule_activities(id) on delete cascade,
  score numeric(5,4) not null check (score between 0 and 1),
  rank integer not null check (rank > 0),
  reasons jsonb not null default '[]',
  model_version text not null,
  created_at timestamptz not null default now(),
  unique (extracted_event_id, schedule_activity_id),
  unique (extracted_event_id, rank)
);

create table public.review_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  extracted_event_id uuid not null unique references public.extracted_events(id) on delete cascade,
  status public.review_status not null default 'pending',
  priority integer not null default 0,
  assigned_to uuid references auth.users(id) on delete set null,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.verification_decisions (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references public.review_items(id) on delete restrict,
  decided_by uuid not null references auth.users(id) on delete restrict,
  decision public.decision_type not null,
  selected_schedule_activity_id uuid references public.schedule_activities(id) on delete restrict,
  corrected_event jsonb,
  reason text,
  created_at timestamptz not null default now(),
  check (
    decision not in ('accept', 'correct')
    or selected_schedule_activity_id is not null
  )
);

create unique index verification_decisions_one_terminal_per_review
  on public.verification_decisions (review_item_id)
  where decision in ('accept', 'reject', 'correct');

create table public.actual_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  extracted_event_id uuid references public.extracted_events(id) on delete restrict,
  schedule_activity_id uuid not null references public.schedule_activities(id) on delete restrict,
  event_date date not null,
  summary text not null,
  quantity numeric,
  unit text,
  status public.actual_status not null default 'verified',
  verified_by uuid not null references auth.users(id) on delete restrict,
  verified_at timestamptz not null default now(),
  version_number integer not null default 1 check (version_number > 0),
  supersedes_actual_id uuid references public.actual_events(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (extracted_event_id, version_number)
);

create table public.progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  schedule_activity_id uuid not null references public.schedule_activities(id) on delete cascade,
  as_of_date date not null,
  actual_progress numeric(5,2) not null check (actual_progress between 0 and 100),
  source_actual_id uuid references public.actual_events(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (schedule_activity_id, as_of_date, source_actual_id)
);

create table public.exceptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actual_event_id uuid references public.actual_events(id) on delete set null,
  review_item_id uuid references public.review_items(id) on delete set null,
  exception_type text not null,
  severity public.exception_severity not null default 'medium',
  status public.exception_status not null default 'open',
  title text not null,
  description text not null,
  owner_id uuid references auth.users(id) on delete set null,
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'resolved') = (resolved_at is not null))
);

create table public.clarifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  review_item_id uuid references public.review_items(id) on delete cascade,
  exception_id uuid references public.exceptions(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete restrict,
  requested_from uuid references auth.users(id) on delete set null,
  question text not null,
  response text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  check (review_item_id is not null or exception_id is not null)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  project_id uuid references public.projects(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  previous_value jsonb,
  new_value jsonb,
  request_id uuid,
  ip_address inet,
  created_at timestamptz not null default now()
);

create table public.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  scope text not null,
  idempotency_key text not null,
  response_status integer,
  response_body jsonb,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now(),
  unique (actor_id, scope, idempotency_key)
);

create index project_memberships_user_idx on public.project_memberships (user_id) where status = 'active';
create index schedule_activities_project_idx on public.schedule_activities (project_id, external_id);
create index reports_project_date_idx on public.reports (project_id, report_date desc);
create index ingestion_jobs_queue_idx on public.ingestion_jobs (status, created_at) where status in ('queued', 'failed');
create index extracted_events_project_status_idx on public.extracted_events (project_id, status);
create index review_items_project_status_idx on public.review_items (project_id, status, priority desc);
create index actual_events_project_date_idx on public.actual_events (project_id, event_date desc) where status = 'verified';
create index exceptions_project_status_idx on public.exceptions (project_id, status, severity);
create index audit_events_project_time_idx on public.audit_events (project_id, created_at desc);
create index notifications_user_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;

create trigger organizations_set_updated_at before update on public.organizations
for each row execute function app_private.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function app_private.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function app_private.set_updated_at();
create trigger project_memberships_set_updated_at before update on public.project_memberships
for each row execute function app_private.set_updated_at();
create trigger schedule_activities_set_updated_at before update on public.schedule_activities
for each row execute function app_private.set_updated_at();
create trigger reports_set_updated_at before update on public.reports
for each row execute function app_private.set_updated_at();
create trigger ingestion_jobs_set_updated_at before update on public.ingestion_jobs
for each row execute function app_private.set_updated_at();
create trigger extracted_events_set_updated_at before update on public.extracted_events
for each row execute function app_private.set_updated_at();
create trigger review_items_set_updated_at before update on public.review_items
for each row execute function app_private.set_updated_at();
create trigger exceptions_set_updated_at before update on public.exceptions
for each row execute function app_private.set_updated_at();

create function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function app_private.handle_new_user();
