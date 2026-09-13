-- SYNTHETIC competition fixture. Contains no users, reports or actual dates.
begin;
insert into public.sentinel_projects(id,name,timezone)
values('26122000-0000-4000-8000-000000000001','SENTINEL Competition Demo (Synthetic)','Asia/Kolkata')
on conflict (id) do nothing;
insert into public.sentinel_schedule_versions(id,project_id,label)
values('26122000-0000-4000-8000-000000000002','26122000-0000-4000-8000-000000000001','Synthetic v1 — August 2026')
on conflict (id) do nothing;
insert into public.sentinel_activities(id,project_id,schedule_version_id,external_id,level,name,discipline,area,planned_start,planned_finish)
values('26122000-0000-4000-8000-000000000010','26122000-0000-4000-8000-000000000001','26122000-0000-4000-8000-000000000002','SYN-L5-MECH','L5','Mechanical installation','Mechanical','Utility Block','2026-08-20','2026-08-31')
on conflict (id) do nothing;
insert into public.sentinel_activities(id,project_id,schedule_version_id,parent_id,external_id,level,name,discipline,area,equipment_ref,planned_start,planned_finish)
values
('26122000-0000-4000-8000-000000000011','26122000-0000-4000-8000-000000000001','26122000-0000-4000-8000-000000000002','26122000-0000-4000-8000-000000000010','SYN-L6-P204','L6','Pump P-204 alignment','Rotating Equipment','Utility Block','P-204','2026-08-24','2026-08-29'),
('26122000-0000-4000-8000-000000000012','26122000-0000-4000-8000-000000000001','26122000-0000-4000-8000-000000000002','26122000-0000-4000-8000-000000000010','SYN-L6-P205','L6','Pump P-205 alignment','Rotating Equipment','Utility Block','P-205','2026-08-25','2026-08-30'),
('26122000-0000-4000-8000-000000000013','26122000-0000-4000-8000-000000000001','26122000-0000-4000-8000-000000000002','26122000-0000-4000-8000-000000000010','SYN-L6-P206','L6','Pump P-206 alignment','Rotating Equipment','Utility Block','P-206','2026-08-26','2026-08-31')
on conflict (id) do nothing;
update public.sentinel_projects set active_schedule_id='26122000-0000-4000-8000-000000000002'
where id='26122000-0000-4000-8000-000000000001' and active_schedule_id is null;
commit;
