-- Referral program tables and columns
CREATE TABLE IF NOT EXISTS referrals (
  id serial PRIMARY KEY,
  referrer_email text NOT NULL,
  referred_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  bonus_runs_awarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(referred_email)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "API access" ON referrals FOR ALL USING (true) WITH CHECK (true);

-- Add referral columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bonus_runs integer NOT NULL DEFAULT 0;

-- RPC to increment bonus runs
CREATE OR REPLACE FUNCTION increment_bonus_runs(user_email text, bonus integer)
RETURNS void AS $$
BEGIN
  UPDATE users SET bonus_runs = bonus_runs + bonus WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;
