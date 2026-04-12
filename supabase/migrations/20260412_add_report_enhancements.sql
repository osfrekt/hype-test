-- Add new report enhancement columns to research_results
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS purchase_frequency jsonb;
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS channel_preference jsonb;
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS nps_score numeric;
ALTER TABLE research_results ADD COLUMN IF NOT EXISTS top_words jsonb;
