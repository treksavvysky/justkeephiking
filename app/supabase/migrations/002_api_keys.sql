-- API Keys for AI/GPT Integration
-- This migration adds support for API key authentication

-- Create API key table
CREATE TABLE api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for identification (e.g., "sk_live_")
  name TEXT NOT NULL, -- Friendly name (e.g., "ChatGPT Custom GPT")
  scope TEXT DEFAULT 'read' CHECK (scope IN ('read', 'write', 'admin')),
  rate_limit INTEGER DEFAULT 100, -- Requests per minute
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id)
);

-- Create API usage tracking table
CREATE TABLE api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_keys
CREATE POLICY "Admins can view all API keys" ON api_keys
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage API keys" ON api_keys
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for api_usage (admin read-only for analytics)
CREATE POLICY "Admins can view API usage" ON api_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_revoked ON api_keys(revoked) WHERE revoked = false;
CREATE INDEX idx_api_usage_requested_at ON api_usage(requested_at DESC);
CREATE INDEX idx_api_usage_api_key_id ON api_usage(api_key_id);
CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint);

-- Function to clean up old API usage logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_api_usage()
RETURNS void AS $$
BEGIN
  DELETE FROM api_usage
  WHERE requested_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-api-usage', '0 2 * * *', 'SELECT cleanup_old_api_usage()');

-- Add comment explaining key generation
COMMENT ON TABLE api_keys IS 'API keys for external integrations (custom GPTs, AI assistants). Keys are generated with format: sk_live_[32_random_chars]. Only hashed keys are stored.';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the full API key. Original key is never stored.';
COMMENT ON COLUMN api_keys.key_prefix IS 'First 12 characters of the key for identification (e.g., sk_live_abc1). Used in UI to show which key was used.';
COMMENT ON COLUMN api_keys.scope IS 'Permission scope: read (default, for GPTs), write (for posting updates), admin (full access)';
COMMENT ON COLUMN api_keys.rate_limit IS 'Requests allowed per minute. Default 100 for GPT access.';
