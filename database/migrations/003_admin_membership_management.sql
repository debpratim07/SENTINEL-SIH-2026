-- Controlled project membership administration. Browser clients retain read-only table grants;
-- all changes pass through authenticated, project-scoped SECURITY DEFINER functions.
begin;

alter table public.sentinel_audit_events
  drop constraint sentinel_audit_events_action_check,
  add constraint sentinel_audit_events_action_check
    check (action in ('event_captured','actual_verified','membership_changed'));

create function public.sentinel_list_project_members(p_project uuid)
returns table(user_id uuid,email text,role text,active boolean)
language plpgsql security definer stable set search_path = '' as $$
declare v_actor uuid := auth.uid();
begin
  if v_actor is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if not exists (
    select 1 from public.sentinel_memberships m
    where m.project_id=p_project and m.user_id=v_actor and m.active and m.role='administrator'
  ) then raise exception 'project_administrator_required' using errcode='42501'; end if;
  return query
    select m.user_id,u.email::text,m.role,m.active
    from public.sentinel_memberships m
    join auth.users u on u.id=m.user_id
    where m.project_id=p_project
    order by m.active desc,lower(u.email),m.user_id;
end;
$$;

create function public.sentinel_assign_project_member(p_project uuid,p_email text,p_role text)
returns table(user_id uuid,email text,role text,active boolean)
language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid := auth.uid(); v_target uuid; v_email text;
  v_previous_role text; v_previous_active boolean; v_operation text;
begin
  if v_actor is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_role is null or p_role not in ('site-supervisor','discipline-engineer','planner','project-controls','project-manager','administrator') then
    raise exception 'unsupported_project_role' using errcode='22023';
  end if;
  -- Serializes all membership changes for one project, including last-admin checks.
  perform 1 from public.sentinel_projects p where p.id=p_project for update;
  if not found then raise exception 'project_not_found' using errcode='P0002'; end if;
  if not exists (
    select 1 from public.sentinel_memberships m
    where m.project_id=p_project and m.user_id=v_actor and m.active and m.role='administrator'
  ) then raise exception 'project_administrator_required' using errcode='42501'; end if;
  select u.id,u.email::text into v_target,v_email
    from auth.users u where u.email=lower(btrim(p_email)) and u.email is not null;
  if v_target is null then raise exception 'sentinel_account_not_found' using errcode='P0002'; end if;

  select m.role,m.active into v_previous_role,v_previous_active
    from public.sentinel_memberships m where m.project_id=p_project and m.user_id=v_target for update;
  if found then
    if v_previous_active and v_previous_role='administrator' and p_role<>'administrator' and not exists (
      select 1 from public.sentinel_memberships m
      where m.project_id=p_project and m.active and m.role='administrator' and m.user_id<>v_target
    ) then raise exception 'last_active_administrator' using errcode='23514'; end if;
    if v_previous_active and v_previous_role=p_role then
      return query select v_target,v_email,v_previous_role,v_previous_active;
      return;
    end if;
    update public.sentinel_memberships m set role=p_role,active=true
      where m.project_id=p_project and m.user_id=v_target;
    v_operation := case when not v_previous_active and v_previous_role<>p_role then 'reactivated_and_role_changed'
                        when not v_previous_active then 'reactivated' else 'role_changed' end;
  else
    insert into public.sentinel_memberships(project_id,user_id,role,active)
      values(p_project,v_target,p_role,true);
    v_operation := 'assigned';
  end if;
  insert into public.sentinel_audit_events(project_id,actor_id,action,record_id,detail)
    values(p_project,v_actor,'membership_changed',v_target,jsonb_build_object(
      'target_user_id',v_target,'previous_role',v_previous_role,'new_role',p_role,
      'previous_active',v_previous_active,'new_active',true,'operation',v_operation));
  return query select v_target,v_email,p_role,true;
end;
$$;

create function public.sentinel_update_project_member(p_project uuid,p_target_user uuid,p_role text,p_active boolean)
returns table(user_id uuid,email text,role text,active boolean)
language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid := auth.uid(); v_email text; v_previous_role text; v_previous_active boolean; v_operation text;
begin
  if v_actor is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_role is null or p_role not in ('site-supervisor','discipline-engineer','planner','project-controls','project-manager','administrator') or p_active is null then
    raise exception 'unsupported_project_role_or_state' using errcode='22023';
  end if;
  perform 1 from public.sentinel_projects p where p.id=p_project for update;
  if not found then raise exception 'project_not_found' using errcode='P0002'; end if;
  if not exists (
    select 1 from public.sentinel_memberships m
    where m.project_id=p_project and m.user_id=v_actor and m.active and m.role='administrator'
  ) then raise exception 'project_administrator_required' using errcode='42501'; end if;
  select m.role,m.active,u.email::text into v_previous_role,v_previous_active,v_email
    from public.sentinel_memberships m join auth.users u on u.id=m.user_id
    where m.project_id=p_project and m.user_id=p_target_user for update of m;
  if not found then raise exception 'project_membership_not_found' using errcode='P0002'; end if;
  if v_previous_active and v_previous_role='administrator' and (not p_active or p_role<>'administrator') and not exists (
    select 1 from public.sentinel_memberships m
    where m.project_id=p_project and m.active and m.role='administrator' and m.user_id<>p_target_user
  ) then raise exception 'last_active_administrator' using errcode='23514'; end if;
  if v_previous_active=p_active and v_previous_role=p_role then
    return query select p_target_user,v_email,v_previous_role,v_previous_active;
    return;
  end if;
  update public.sentinel_memberships m set role=p_role,active=p_active
    where m.project_id=p_project and m.user_id=p_target_user;
  v_operation := case when v_previous_active and not p_active then 'deactivated'
                      when not v_previous_active and p_active and v_previous_role<>p_role then 'reactivated_and_role_changed'
                      when not v_previous_active and p_active then 'reactivated'
                      else 'role_changed' end;
  insert into public.sentinel_audit_events(project_id,actor_id,action,record_id,detail)
    values(p_project,v_actor,'membership_changed',p_target_user,jsonb_build_object(
      'target_user_id',p_target_user,'previous_role',v_previous_role,'new_role',p_role,
      'previous_active',v_previous_active,'new_active',p_active,'operation',v_operation));
  return query select p_target_user,v_email,p_role,p_active;
end;
$$;

revoke all on function public.sentinel_list_project_members(uuid) from public,anon,authenticated;
revoke all on function public.sentinel_assign_project_member(uuid,text,text) from public,anon,authenticated;
revoke all on function public.sentinel_update_project_member(uuid,uuid,text,boolean) from public,anon,authenticated;
grant execute on function public.sentinel_list_project_members(uuid) to authenticated;
grant execute on function public.sentinel_assign_project_member(uuid,text,text) to authenticated;
grant execute on function public.sentinel_update_project_member(uuid,uuid,text,boolean) to authenticated;

insert into public.sentinel_schema_versions(version) values ('003_admin_membership_management');
commit;
