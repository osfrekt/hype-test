create table if not exists platform_ad_results (
  id text primary key,
  input jsonb not null,
  platform_label text not null,
  attention integer not null,
  clarity integer not null,
  persuasion integer not null,
  brand_fit integer not null,
  platform_fit integer not null,
  click_likelihood jsonb not null,
  scroll_stop_power integer not null,
  purchase_intent integer,
  emotional_responses jsonb not null,
  top_strengths jsonb not null,
  top_weaknesses jsonb not null,
  platform_tips jsonb not null,
  verbatims jsonb not null,
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
create index if not exists idx_platform_ad_results_created_at on platform_ad_results (created_at desc);
alter table platform_ad_results enable row level security;
create policy "Public read access" on platform_ad_results for select using (true);
create policy "API insert access" on platform_ad_results for insert with check (true);
create policy "API delete access" on platform_ad_results for delete using (true);
