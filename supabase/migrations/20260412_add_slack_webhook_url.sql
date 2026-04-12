-- Add slack_webhook_url column to users table for Slack integration
ALTER TABLE users ADD COLUMN IF NOT EXISTS slack_webhook_url text;
