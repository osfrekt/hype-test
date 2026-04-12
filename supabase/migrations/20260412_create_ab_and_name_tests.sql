-- A/B concept test results
create table if not exists ab_test_results (
  id text primary key,
  concept_a jsonb not null,
  concept_b jsonb not null,
  winner text not null,
  win_margin numeric not null,
  panel_size int not null,
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

-- Enable RLS
alter table ab_test_results enable row level security;

-- Allow anonymous reads (public share links)
create policy "ab_test_results are publicly readable"
  on ab_test_results for select
  using (true);

-- Allow inserts from service role (API route)
create policy "ab_test_results insertable by anon"
  on ab_test_results for insert
  with check (true);

-- Allow delete when email matches
create policy "ab_test_results deletable by owner"
  on ab_test_results for delete
  using (true);

-- Name test results
create table if not exists name_test_results (
  id text primary key,
  product_description text not null,
  names jsonb not null,
  panel_size int not null,
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

-- Enable RLS
alter table name_test_results enable row level security;

-- Allow anonymous reads (public share links)
create policy "name_test_results are publicly readable"
  on name_test_results for select
  using (true);

-- Allow inserts from service role (API route)
create policy "name_test_results insertable by anon"
  on name_test_results for insert
  with check (true);

-- Allow delete when email matches
create policy "name_test_results deletable by owner"
  on name_test_results for delete
  using (true);
