create table if not exists email_followups (
  id serial primary key,
  email text not null,
  product_name text not null,
  intent_score numeric not null,
  send_at timestamptz not null,
  sent boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_email_followups_pending on email_followups (sent, send_at) where sent = false;
alter table email_followups enable row level security;
create policy "API full access" on email_followups for all using (true) with check (true);
