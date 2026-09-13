-- Project administrators can operate the capture/review workflow.
-- This does not grant database ownership or membership-management privileges.
begin;
create or replace function public.sentinel_require_role(p_project uuid, p_roles text[]) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := auth.uid(); v_role text;
begin
  if v_actor is null then raise exception 'authentication_required' using errcode='42501'; end if;
  select m.role into v_role from public.sentinel_memberships m
    where m.project_id=p_project and m.user_id=v_actor and m.active for share;
  if v_role is null or not (coalesce(v_role = any(p_roles),false) or v_role='administrator') then
    raise exception 'project_permission_denied' using errcode='42501';
  end if;
  return v_actor;
end;
$$;
revoke all on function public.sentinel_require_role(uuid,text[]) from public,anon,authenticated;
insert into public.sentinel_schema_versions(version) values ('002_administrator_workflow');
commit;
