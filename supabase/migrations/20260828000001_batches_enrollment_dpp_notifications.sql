-- Institute join-by-code + admin approval, batch assignment, DPPs (question-set
-- and file kinds), and a lightweight notifications feed.
--
-- Question-kind DPPs deliberately reuse the existing tests/test_attempts/
-- answers machinery (a new 'dpp' test_type) instead of a parallel
-- submission/grading system, so students take a DPP through the exact same
-- CBT flow (/test/[attemptId]/instructions -> ... -> /result) already built
-- for mock tests.

-- ---------------------------------------------------------------------------
-- institutes: join code students type in to request enrollment
-- ---------------------------------------------------------------------------
alter table public.institutes add column if not exists join_code text;

update public.institutes
set join_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
where join_code is null;

alter table public.institutes alter column join_code set not null;
alter table public.institutes
  alter column join_code set default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

create unique index if not exists institutes_join_code_key on public.institutes (join_code);

-- ---------------------------------------------------------------------------
-- batches
-- ---------------------------------------------------------------------------
create table public.institute_batches (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  name text not null,
  subject_id uuid references public.subjects(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index institute_batches_institute_idx on public.institute_batches (institute_id);

-- ---------------------------------------------------------------------------
-- enrollments: a student's request to join an institute, and the admin's
-- decision + batch assignment. At most one pending-or-active row per student.
-- ---------------------------------------------------------------------------
create table public.institute_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institute_id uuid not null references public.institutes(id) on delete cascade,
  batch_id uuid references public.institute_batches(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'active', 'rejected', 'removed')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index institute_enrollments_institute_idx on public.institute_enrollments (institute_id);
create index institute_enrollments_batch_idx on public.institute_enrollments (batch_id);
create unique index institute_enrollments_one_live_per_user
  on public.institute_enrollments (user_id)
  where status in ('pending', 'active');

-- ---------------------------------------------------------------------------
-- tests: tag institute-created tests with the batch they were announced to,
-- and add the 'dpp' test_type used by question-set DPPs.
-- ---------------------------------------------------------------------------
alter table public.tests add column if not exists batch_id uuid references public.institute_batches(id) on delete set null;
alter type public.test_type add value if not exists 'dpp';

-- ---------------------------------------------------------------------------
-- dpps: metadata row over either a pre-built test (kind='questions') or an
-- uploaded file in the 'dpp-files' storage bucket (kind='file').
-- ---------------------------------------------------------------------------
create table public.dpps (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  batch_id uuid not null references public.institute_batches(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  kind text not null check (kind in ('questions', 'file')),
  test_id uuid references public.tests(id) on delete set null,
  file_path text,
  due_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dpp_kind_payload check (
    (kind = 'questions' and test_id is not null and file_path is null) or
    (kind = 'file' and file_path is not null and test_id is null)
  )
);

create index dpps_batch_idx on public.dpps (batch_id);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('enrollment_approved', 'enrollment_rejected', 'dpp_posted', 'test_announced')),
  title text not null,
  body text,
  link text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function public.join_institute_by_code(_code text)
returns table (institute_id uuid, institute_name text, status text)
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_inst record;
  v_existing record;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  perform public.enforce_rate_limit('join_institute', 5, 3600);

  select id, name into v_inst from public.institutes
    where join_code = upper(trim(_code)) and is_active;
  if v_inst.id is null then
    raise exception 'Invalid institute code.' using errcode = 'P0001';
  end if;

  select ie.id into v_existing from public.institute_enrollments ie
    where ie.user_id = v_uid and ie.status in ('pending', 'active') limit 1;
  if v_existing.id is not null then
    raise exception 'You already have an active or pending enrollment.' using errcode = 'P0001';
  end if;

  insert into public.institute_enrollments (user_id, institute_id, status)
  values (v_uid, v_inst.id, 'pending');

  return query select v_inst.id, v_inst.name, 'pending'::text;
end;
$$;

revoke all on function public.join_institute_by_code(text) from public, anon;
grant execute on function public.join_institute_by_code(text) to authenticated;

create or replace function public.my_institute_enrollment()
returns table (
  enrollment_id uuid, institute_id uuid, institute_name text,
  batch_id uuid, batch_name text, status text, requested_at timestamptz
)
language sql
stable
security definer
set search_path to 'public'
as $$
  select ie.id, ie.institute_id, i.name, ie.batch_id, b.name, ie.status, ie.requested_at
  from public.institute_enrollments ie
  join public.institutes i on i.id = ie.institute_id
  left join public.institute_batches b on b.id = ie.batch_id
  where ie.user_id = auth.uid()
  order by ie.created_at desc
  limit 1
$$;

revoke all on function public.my_institute_enrollment() from public, anon;
grant execute on function public.my_institute_enrollment() to authenticated;

create or replace function public.institute_review_enrollment(_enrollment_id uuid, _approve boolean, _batch_id uuid default null)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_enr record;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_enr from public.institute_enrollments where id = _enrollment_id;
  if v_enr.id is null then raise exception 'Enrollment not found'; end if;

  if not public.has_institute_role(v_uid, v_enr.institute_id, 'institute_admin') then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  if _approve then
    if _batch_id is not null and not exists (
      select 1 from public.institute_batches where id = _batch_id and institute_id = v_enr.institute_id
    ) then
      raise exception 'Batch does not belong to this institute';
    end if;

    update public.institute_enrollments
    set status = 'active', batch_id = _batch_id, reviewed_at = now(), reviewed_by = v_uid, updated_at = now()
    where id = _enrollment_id;

    insert into public.notifications (user_id, type, title, body, link)
    values (v_enr.user_id, 'enrollment_approved', 'You''re in!',
      'Your enrollment request was approved.', '/dashboard/student/profile');
  else
    update public.institute_enrollments
    set status = 'rejected', reviewed_at = now(), reviewed_by = v_uid, updated_at = now()
    where id = _enrollment_id;

    insert into public.notifications (user_id, type, title, body, link)
    values (v_enr.user_id, 'enrollment_rejected', 'Enrollment request declined',
      'Your enrollment request was not approved. You can try another code.', '/dashboard/student/profile');
  end if;
end;
$$;

revoke all on function public.institute_review_enrollment(uuid, boolean, uuid) from public, anon;
grant execute on function public.institute_review_enrollment(uuid, boolean, uuid) to authenticated;

create or replace function public.institute_create_dpp_questions(
  _batch_id uuid, _title text, _description text, _question_ids uuid[], _due_date date default null
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_batch record;
  v_test_id uuid;
  v_dpp_id uuid;
  v_qid uuid;
  v_i int := 0;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if array_length(_question_ids, 1) is null or array_length(_question_ids, 1) = 0 then
    raise exception 'At least one question is required';
  end if;

  select * into v_batch from public.institute_batches where id = _batch_id;
  if v_batch.id is null then raise exception 'Batch not found'; end if;

  if not (
    public.has_institute_role(v_uid, v_batch.institute_id, 'institute_admin')
    or public.has_institute_role(v_uid, v_batch.institute_id, 'faculty')
    or public.has_institute_role(v_uid, v_batch.institute_id, 'subject_coordinator')
  ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  insert into public.tests (title, test_type, mode, question_count, institute_id, batch_id, created_by)
  values (_title, 'dpp', 'practice', array_length(_question_ids, 1), v_batch.institute_id, _batch_id, v_uid)
  returning id into v_test_id;

  foreach v_qid in array _question_ids loop
    v_i := v_i + 1;
    insert into public.test_questions (test_id, question_id, sort_order) values (v_test_id, v_qid, v_i);
  end loop;

  insert into public.dpps (institute_id, batch_id, title, description, kind, test_id, due_date, created_by)
  values (v_batch.institute_id, _batch_id, _title, _description, 'questions', v_test_id, _due_date, v_uid)
  returning id into v_dpp_id;

  insert into public.notifications (user_id, type, title, body, link)
  select ie.user_id, 'dpp_posted', 'New DPP: ' || _title,
    'A new daily practice problem set was posted to your batch.', '/dashboard/student/dpp'
  from public.institute_enrollments ie
  where ie.batch_id = _batch_id and ie.status = 'active';

  return v_dpp_id;
end;
$$;

revoke all on function public.institute_create_dpp_questions(uuid, text, text, uuid[], date) from public, anon;
grant execute on function public.institute_create_dpp_questions(uuid, text, text, uuid[], date) to authenticated;

create or replace function public.institute_create_dpp_file(
  _batch_id uuid, _title text, _description text, _file_path text, _due_date date default null
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_batch record;
  v_dpp_id uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_batch from public.institute_batches where id = _batch_id;
  if v_batch.id is null then raise exception 'Batch not found'; end if;

  if not (
    public.has_institute_role(v_uid, v_batch.institute_id, 'institute_admin')
    or public.has_institute_role(v_uid, v_batch.institute_id, 'faculty')
    or public.has_institute_role(v_uid, v_batch.institute_id, 'subject_coordinator')
  ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  insert into public.dpps (institute_id, batch_id, title, description, kind, file_path, due_date, created_by)
  values (v_batch.institute_id, _batch_id, _title, _description, 'file', _file_path, _due_date, v_uid)
  returning id into v_dpp_id;

  insert into public.notifications (user_id, type, title, body, link)
  select ie.user_id, 'dpp_posted', 'New DPP: ' || _title,
    'A new daily practice problem set was posted to your batch.', '/dashboard/student/dpp'
  from public.institute_enrollments ie
  where ie.batch_id = _batch_id and ie.status = 'active';

  return v_dpp_id;
end;
$$;

revoke all on function public.institute_create_dpp_file(uuid, text, text, text, date) from public, anon;
grant execute on function public.institute_create_dpp_file(uuid, text, text, text, date) to authenticated;

create or replace function public.institute_announce_test(_test_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_test record;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_test from public.tests where id = _test_id;
  if v_test.id is null then raise exception 'Test not found'; end if;
  if v_test.institute_id is null or v_test.batch_id is null then
    raise exception 'Test must belong to an institute batch to be announced';
  end if;

  if not (
    public.has_institute_role(v_uid, v_test.institute_id, 'institute_admin')
    or public.has_institute_role(v_uid, v_test.institute_id, 'faculty')
    or public.has_institute_role(v_uid, v_test.institute_id, 'subject_coordinator')
  ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  insert into public.notifications (user_id, type, title, body, link)
  select ie.user_id, 'test_announced', 'New test: ' || v_test.title,
    'A new test was announced for your batch.', '/dashboard/student/tests'
  from public.institute_enrollments ie
  where ie.batch_id = v_test.batch_id and ie.status = 'active';
end;
$$;

revoke all on function public.institute_announce_test(uuid) from public, anon;
grant execute on function public.institute_announce_test(uuid) to authenticated;

create or replace function public.mark_notifications_read(_ids uuid[] default null)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if _ids is null then
    update public.notifications set read_at = now() where user_id = v_uid and read_at is null;
  else
    update public.notifications set read_at = now() where user_id = v_uid and id = any(_ids);
  end if;
end;
$$;

revoke all on function public.mark_notifications_read(uuid[]) from public, anon;
grant execute on function public.mark_notifications_read(uuid[]) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.institute_batches enable row level security;
alter table public.institute_enrollments enable row level security;
alter table public.dpps enable row level security;
alter table public.notifications enable row level security;

grant select, insert, update, delete on public.institute_batches to authenticated;
grant select on public.institute_enrollments to authenticated;
grant select on public.dpps to authenticated;
grant select on public.notifications to authenticated;

create policy "Institute staff read batches"
  on public.institute_batches for select to authenticated
  using (
    public.has_institute_role(auth.uid(), institute_id, 'institute_admin')
    or public.has_institute_role(auth.uid(), institute_id, 'faculty')
    or public.has_institute_role(auth.uid(), institute_id, 'subject_coordinator')
  );

create policy "Enrolled students read their institute's batches"
  on public.institute_batches for select to authenticated
  using (exists (
    select 1 from public.institute_enrollments ie
    where ie.institute_id = institute_batches.institute_id and ie.user_id = auth.uid() and ie.status = 'active'
  ));

create policy "Institute admins insert batches"
  on public.institute_batches for insert to authenticated
  with check (public.has_institute_role(auth.uid(), institute_id, 'institute_admin'));

create policy "Institute admins update batches"
  on public.institute_batches for update to authenticated
  using (public.has_institute_role(auth.uid(), institute_id, 'institute_admin'))
  with check (public.has_institute_role(auth.uid(), institute_id, 'institute_admin'));

create policy "Institute admins delete batches"
  on public.institute_batches for delete to authenticated
  using (public.has_institute_role(auth.uid(), institute_id, 'institute_admin'));

create policy "Students read own enrollment"
  on public.institute_enrollments for select to authenticated
  using (user_id = auth.uid());

create policy "Institute admins read own institute enrollments"
  on public.institute_enrollments for select to authenticated
  using (public.has_institute_role(auth.uid(), institute_id, 'institute_admin'));

create policy "Batch students read their dpps"
  on public.dpps for select to authenticated
  using (exists (
    select 1 from public.institute_enrollments ie
    where ie.batch_id = dpps.batch_id and ie.user_id = auth.uid() and ie.status = 'active'
  ));

create policy "Institute staff read own institute dpps"
  on public.dpps for select to authenticated
  using (
    public.has_institute_role(auth.uid(), institute_id, 'institute_admin')
    or public.has_institute_role(auth.uid(), institute_id, 'faculty')
    or public.has_institute_role(auth.uid(), institute_id, 'subject_coordinator')
  );

create policy "Users read own notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

-- writes to institute_enrollments / dpps / notifications all go through the
-- SECURITY DEFINER RPCs above, never direct client inserts/updates.

-- ---------------------------------------------------------------------------
-- storage: private bucket for DPP file uploads, path convention
-- {institute_id}/{batch_id}/{filename}
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('dpp-files', 'dpp-files', false)
on conflict (id) do nothing;

create policy "Institute staff upload dpp files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'dpp-files'
    and (
      public.has_institute_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'institute_admin')
      or public.has_institute_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'faculty')
      or public.has_institute_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'subject_coordinator')
    )
  );

create policy "Institute staff read own institute dpp files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'dpp-files'
    and (
      public.has_institute_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'institute_admin')
      or public.has_institute_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'faculty')
      or public.has_institute_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'subject_coordinator')
    )
  );

create policy "Batch students read their dpp files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'dpp-files'
    and exists (
      select 1 from public.institute_enrollments ie
      where ie.status = 'active'
        and ie.institute_id = ((storage.foldername(name))[1])::uuid
        and ie.batch_id::text = (storage.foldername(name))[2]
    )
  );
