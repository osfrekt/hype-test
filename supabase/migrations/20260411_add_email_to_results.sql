-- Email column already added via CLI, this migration is for reference
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE discovery_results ADD COLUMN IF NOT EXISTS email text;
