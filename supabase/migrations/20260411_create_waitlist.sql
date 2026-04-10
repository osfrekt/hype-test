create table if not exists waitlist_emails (
  id serial primary key,
  email text not null unique,
  created_at timestamptz default now()
);

-- RLS
alter table waitlist_emails enable row level security;

-- Only allow inserts from the API route
create policy "API insert access"
  on waitlist_emails for insert
  with check (true);
