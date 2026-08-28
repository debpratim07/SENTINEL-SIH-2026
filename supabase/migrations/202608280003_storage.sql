insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-documents',
  'project-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy project_documents_select_member
on storage.objects for select to authenticated
using (
  bucket_id = 'project-documents'
  and app_private.is_project_member(((storage.foldername(name))[1])::uuid)
);

-- Normal uploads use short-lived signed upload URLs created by the Node service.
-- This policy also permits authenticated direct uploads for roles that can submit reports.
create policy project_documents_insert_uploader
on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-documents'
  and app_private.has_project_role(
    ((storage.foldername(name))[1])::uuid,
    array['site-supervisor', 'discipline-engineer', 'planner', 'project-controls']::public.app_role[]
  )
);

create policy project_documents_delete_admin
on storage.objects for delete to authenticated
using (
  bucket_id = 'project-documents'
  and app_private.has_project_role(
    ((storage.foldername(name))[1])::uuid,
    array['administrator']::public.app_role[]
  )
);
