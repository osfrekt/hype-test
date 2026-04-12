create table if not exists competitive_results (
  id text primary key,
  yours jsonb not null,
  competitor jsonb not null,
  radar_data jsonb not null,
  winner text not null check (winner in ('yours', 'competitor', 'tie')),
  panel_size integer not null,
  methodology jsonb not null,
  email text,
  user_name text,
  user_company text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  status text not null default 'complete',
  created_at timestamptz not null default now()
);

-- Index for listing user's competitive tests
create index if not exists idx_competitive_results_email on competitive_results (email);
