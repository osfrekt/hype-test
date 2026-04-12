create table if not exists logo_test_results (
  id text primary key,
  input jsonb not null,
  results jsonb not null,
  winner text,
  panel_size integer not null,
  methodology jsonb not null,
  email text,
  user_name text,
  user_company text,
  user_role text,
  user_company_size text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  status text not null default 'complete',
  created_at timestamptz not null default now()
);
create index if not exists idx_logo_test_results_created_at on logo_test_results (created_at desc);
alter table logo_test_results enable row level security;
create policy "Public read access" on logo_test_results for select using (true);
create policy "API insert access" on logo_test_results for insert with check (true);
create policy "API delete access" on logo_test_results for delete using (true);
