create table if not exists validation_runs (
  id text primary key,
  product_name text not null,
  predicted_intent numeric not null,
  actual_units integer,
  actual_revenue numeric,
  actual_conversion numeric,
  notes text,
  created_at timestamptz not null default now()
);
alter table validation_runs enable row level security;
create policy "Public read access" on validation_runs for select using (true);
create policy "API insert access" on validation_runs for insert with check (true);
