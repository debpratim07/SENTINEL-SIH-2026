-- Phase 10 report ingestion and extraction provenance.
-- Additive: existing manual reports/events retain their accepted behavior.
begin;

alter table public.sentinel_reports
  add column source_kind text not null default 'manual' check (source_kind in ('manual','upload')),
  add column filename text check (filename is null or length(btrim(filename)) between 1 and 240),
  add column media_type text check (media_type is null or length(btrim(media_type)) between 1 and 120),
  add column source_size integer check (source_size is null or source_size between 0 and 4194304),
  add column source_sha256 text check (source_sha256 is null or source_sha256 ~ '^[0-9a-f]{64}$'),
  add column processing_status text not null default 'processed' check (processing_status in ('uploaded','processing','processed','failed')),
  add column processing_error text check (processing_error is null or length(processing_error) <= 2000),
  add column extraction_method text not null default 'manual' check (extraction_method in ('manual','deterministic','ai')),
  add column extraction_metadata jsonb not null default '{}'::jsonb;

alter table public.sentinel_events
  add column origin text not null default 'manual' check (origin in ('manual','extraction')),
  add column source_location text check (source_location is null or length(source_location) <= 500),
  add column extraction_method text not null default 'manual' check (extraction_method in ('manual','deterministic','ai')),
  add column suggested_activity_id uuid,
  add column suggestion_reason text check (suggestion_reason is null or length(suggestion_reason) <= 2000),
  add column confidence numeric check (confidence is null or confidence between 0 and 1),
  add constraint sentinel_event_suggested_activity_fk foreign key (project_id,suggested_activity_id)
    references public.sentinel_activities(project_id,id);

alter table public.sentinel_audit_events
  drop constraint sentinel_audit_events_action_check,
  add constraint sentinel_audit_events_action_check
    check (action in ('event_captured','actual_verified','membership_changed','report_ingested'));

create index sentinel_reports_project_time on public.sentinel_reports(project_id,created_at desc);

create function public.sentinel_ingest_report(
  p_project uuid,
  p_request_key uuid,
  p_report_date date,
  p_filename text,
  p_media_type text,
  p_source_size integer,
  p_source_sha256 text,
  p_text text,
  p_candidates jsonb,
  p_extraction_method text,
  p_ai_status text,
  p_warnings jsonb
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid;
  v_payload jsonb;
  v_report public.sentinel_reports%rowtype;
  v_item jsonb;
  v_index integer := 0;
  v_type text;
  v_date date;
  v_quote text;
  v_location text;
  v_activity uuid;
  v_reason text;
  v_confidence numeric;
  v_schedule uuid;
begin
  v_actor := public.sentinel_require_role(p_project,array['site-supervisor','discipline-engineer','planner','project-controls']);
  if p_request_key is null or p_report_date is null
     or p_filename is null or length(btrim(p_filename)) not between 1 and 240
     or p_filename ~ '[\\/]' or p_media_type is null or length(btrim(p_media_type)) not between 1 and 120
     or p_source_size is null or p_source_size not between 1 and 4194304
     or p_source_sha256 is null or p_source_sha256 !~ '^[0-9a-f]{64}$'
     or p_text is null or length(btrim(p_text)) not between 1 and 50000
     or p_candidates is null or jsonb_typeof(p_candidates) <> 'array'
     or jsonb_array_length(p_candidates) > 50
     or p_extraction_method not in ('deterministic','ai')
     or p_ai_status not in ('used','unavailable','failed')
     or p_warnings is null or jsonb_typeof(p_warnings) <> 'array' then
    raise exception 'invalid_report_ingestion' using errcode='22023';
  end if;

  v_payload := jsonb_build_object(
    'report_date',p_report_date,'filename',p_filename,'media_type',p_media_type,
    'source_size',p_source_size,'source_sha256',p_source_sha256,
    'extraction_method',p_extraction_method,'candidate_count',jsonb_array_length(p_candidates)
  );
  insert into public.sentinel_reports(
    project_id,submitted_by,capture_key,report_date,raw_text,capture_payload,
    source_kind,filename,media_type,source_size,source_sha256,processing_status,
    extraction_method,extraction_metadata
  ) values (
    p_project,v_actor,p_request_key,p_report_date,p_text,v_payload,
    'upload',btrim(p_filename),p_media_type,p_source_size,p_source_sha256,'processed',
    p_extraction_method,jsonb_build_object('ai_status',p_ai_status,'warnings',p_warnings)
  ) on conflict (project_id,submitted_by,capture_key) do nothing returning * into v_report;

  if v_report.id is null then
    select * into strict v_report from public.sentinel_reports
      where project_id=p_project and submitted_by=v_actor and capture_key=p_request_key;
    if v_report.capture_payload is distinct from v_payload then
      raise exception 'idempotency_key_reused_with_different_input' using errcode='22023';
    end if;
    return v_report.id;
  end if;

  select active_schedule_id into v_schedule from public.sentinel_projects where id=p_project;
  for v_item in select value from jsonb_array_elements(p_candidates) loop
    v_index := v_index + 1;
    v_type := v_item->>'event_type';
    v_quote := v_item->>'source_quote';
    v_location := nullif(v_item->>'source_location','');
    v_reason := nullif(v_item->>'suggestion_reason','');
    v_activity := nullif(v_item->>'suggested_activity_id','')::uuid;
    v_confidence := nullif(v_item->>'confidence','')::numeric;
    v_date := nullif(v_item->>'actual_date','')::date;
    if v_type not in ('start','finish','progress_observation')
       or v_quote is null or length(btrim(v_quote)) not between 1 and 50000
       or strpos(p_text,v_quote)=0
       or (v_date is not null and v_date > p_report_date)
       or (v_location is not null and length(v_location)>500)
       or (v_reason is not null and length(v_reason)>2000)
       or (v_confidence is not null and (v_confidence<0 or v_confidence>1)) then
      raise exception 'invalid_extraction_candidate' using errcode='22023';
    end if;
    if v_activity is not null and not exists (
      select 1 from public.sentinel_activities a
      where a.id=v_activity and a.project_id=p_project and a.schedule_version_id=v_schedule and a.level='L6'
    ) then raise exception 'suggested_activity_not_available' using errcode='P0002'; end if;
    insert into public.sentinel_events(
      project_id,report_id,event_index,event_type,actual_date,source_quote,origin,
      source_location,extraction_method,suggested_activity_id,suggestion_reason,confidence
    ) values (
      p_project,v_report.id,v_index,v_type,v_date,v_quote,'extraction',
      v_location,p_extraction_method,v_activity,v_reason,v_confidence
    );
  end loop;

  insert into public.sentinel_audit_events(project_id,actor_id,action,record_id,detail)
    values(p_project,v_actor,'report_ingested',v_report.id,jsonb_build_object(
      'filename',btrim(p_filename),'media_type',p_media_type,'source_sha256',p_source_sha256,
      'candidate_count',v_index,'extraction_method',p_extraction_method,'ai_status',p_ai_status));
  return v_report.id;
end;
$$;

revoke all on function public.sentinel_ingest_report(uuid,uuid,date,text,text,integer,text,text,jsonb,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.sentinel_ingest_report(uuid,uuid,date,text,text,integer,text,text,jsonb,text,text,jsonb) to authenticated;

insert into public.sentinel_schema_versions(version) values ('004_phase10_ingestion');
commit;
