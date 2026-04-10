-- Research results table
-- Stores the full ResearchResult payload as JSONB with the shareable ID as primary key.
-- RLS is enabled with a public read policy so anyone with the link can view results.

create table if not exists research_results (
  id text primary key,
  input jsonb not null,
  panel_size integer not null,
  purchase_intent jsonb not null,
  wtp_range jsonb not null,
  feature_importance jsonb not null,
  top_concerns jsonb not null,
  top_positives jsonb not null,
  verbatims jsonb not null,
  methodology jsonb not null,
  status text not null default 'complete',
  created_at timestamptz not null default now()
);

-- Index for listing results by creation date
create index if not exists idx_research_results_created_at
  on research_results (created_at desc);

-- Enable RLS
alter table research_results enable row level security;

-- Anyone can read results (shareable links)
create policy "Public read access"
  on research_results for select
  using (true);

-- Only the service role or anon key can insert (from the API route)
create policy "API insert access"
  on research_results for insert
  with check (true);
