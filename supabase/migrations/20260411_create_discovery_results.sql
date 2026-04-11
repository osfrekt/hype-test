create table if not exists discovery_results (
  id text primary key,
  input jsonb not null,
  concepts jsonb not null,
  panel_size integer not null,
  methodology jsonb not null,
  status text not null default 'complete',
  created_at timestamptz not null default now()
);

create index if not exists idx_discovery_results_created_at
  on discovery_results (created_at desc);

alter table discovery_results enable row level security;

create policy "Public read access"
  on discovery_results for select using (true);

create policy "API insert access"
  on discovery_results for insert with check (true);
