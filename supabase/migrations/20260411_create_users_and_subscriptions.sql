-- Users table (keyed by email, no passwords)
create table if not exists users (
  email text primary key,
  name text,
  company text,
  role text,
  company_size text,
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  research_count_this_month integer not null default 0,
  discovery_count_this_month integer not null default 0,
  month_reset_at timestamptz not null default date_trunc('month', now()) + interval '1 month',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users enable row level security;
create policy "Public read own" on users for select using (true);
create policy "API insert" on users for insert with check (true);
create policy "API update" on users for update using (true);

-- Index for Stripe lookups
create index if not exists idx_users_stripe_customer on users (stripe_customer_id);
