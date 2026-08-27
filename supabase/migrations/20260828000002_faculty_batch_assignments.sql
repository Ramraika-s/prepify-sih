-- Lets an institute admin assign faculty to the batches they teach.
create table public.institute_batch_faculty (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.institute_batches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (batch_id, user_id)
);

create index institute_batch_faculty_batch_idx on public.institute_batch_faculty (batch_id);
create index institute_batch_faculty_user_idx on public.institute_batch_faculty (user_id);

alter table public.institute_batch_faculty enable row level security;
grant select on public.institute_batch_faculty to authenticated;

create policy "Institute staff read batch faculty assignments"
  on public.institute_batch_faculty for select to authenticated
  using (
    exists (
      select 1 from public.institute_batches b
      where b.id = institute_batch_faculty.batch_id
      and (
        public.has_institute_role(auth.uid(), b.institute_id, 'institute_admin')
        or public.has_institute_role(auth.uid(), b.institute_id, 'faculty')
      )
    )
  );

create or replace function public.institute_assign_batch_faculty(_batch_id uuid, _user_id uuid, _assign boolean)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_institute uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select institute_id into v_institute from public.institute_batches where id = _batch_id;
  if v_institute is null then raise exception 'Batch not found'; end if;
  if not public.has_institute_role(v_uid, v_institute, 'institute_admin') then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if not exists (select 1 from public.user_roles where user_id = _user_id and institute_id = v_institute and role = 'faculty') then
    raise exception 'That user is not faculty at this institute';
  end if;

  if _assign then
    insert into public.institute_batch_faculty (batch_id, user_id, assigned_by)
    values (_batch_id, _user_id, v_uid)
    on conflict (batch_id, user_id) do nothing;
  else
    delete from public.institute_batch_faculty where batch_id = _batch_id and user_id = _user_id;
  end if;
end;
$$;

revoke all on function public.institute_assign_batch_faculty(uuid, uuid, boolean) from public, anon;
grant execute on function public.institute_assign_batch_faculty(uuid, uuid, boolean) to authenticated;
