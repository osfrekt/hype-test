-- Pricing test results
create table if not exists pricing_test_results (
  id text primary key,
  input jsonb not null,
  price_points jsonb not null,
  optimal_price numeric not null,
  optimal_intent integer not null,
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

create index if not exists idx_pricing_test_results_created_at
  on pricing_test_results (created_at desc);

create index if not exists idx_pricing_test_results_email
  on pricing_test_results (email);

alter table pricing_test_results enable row level security;

create policy "Public read access"
  on pricing_test_results for select using (true);

create policy "API insert access"
  on pricing_test_results for insert with check (true);

-- Audience test results
create table if not exists audience_test_results (
  id text primary key,
  input jsonb not null,
  segments jsonb not null,
  best_segment text not null,
  panel_size_per_segment integer not null,
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

create index if not exists idx_audience_test_results_created_at
  on audience_test_results (created_at desc);

create index if not exists idx_audience_test_results_email
  on audience_test_results (email);

alter table audience_test_results enable row level security;

create policy "Public read access"
  on audience_test_results for select using (true);

create policy "API insert access"
  on audience_test_results for insert with check (true);
