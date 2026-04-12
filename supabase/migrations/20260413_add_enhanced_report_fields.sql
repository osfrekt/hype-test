ALTER TABLE research_results ADD COLUMN IF NOT EXISTS usage_occasions jsonb;
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS purchase_barriers jsonb;
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS improvements jsonb;
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS price_sensitivity jsonb;
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS persona_deep_dives jsonb;
