-- Add competitive_position column for competitive positioning data
alter table research_results
  add column if not exists competitive_position jsonb;
