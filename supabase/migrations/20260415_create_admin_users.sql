create table if not exists admin_users (
  email text primary key,
  role text not null default 'admin',
  added_by text not null,
  created_at timestamptz not null default now()
);

-- Seed master account
insert into admin_users (email, role, added_by) values ('osf@rekt.com', 'master', 'system')
on conflict (email) do nothing;

alter table admin_users enable row level security;

-- No public access at all - only service role can read/write
create policy "Service role only" on admin_users for all using (false);
