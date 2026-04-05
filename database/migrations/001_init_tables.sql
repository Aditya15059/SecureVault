-- ═══════════════════════════════════════════════════════════
-- SecureVault — AWS RDS PostgreSQL Schema
-- Run this on your RDS instance to create all required tables.
-- ═══════════════════════════════════════════════════════════

-- 1. Universal Event Log
CREATE TABLE IF NOT EXISTS sv_events (
  id            SERIAL PRIMARY KEY,
  execution_id  VARCHAR(36) UNIQUE,                -- n8n execution UUID for idempotency
  event_type    VARCHAR(50) NOT NULL,
  user_id       VARCHAR(50),
  email         VARCHAR(255),
  ip_address    VARCHAR(50),
  user_agent    TEXT,
  metadata      JSONB DEFAULT '{}',
  status        VARCHAR(20) DEFAULT 'success',     -- success | failed | pending
  source        VARCHAR(50) DEFAULT 'securevault-api',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sv_events_type      ON sv_events (event_type);
CREATE INDEX idx_sv_events_user      ON sv_events (user_id);
CREATE INDEX idx_sv_events_email     ON sv_events (email);
CREATE INDEX idx_sv_events_created   ON sv_events (created_at);
CREATE INDEX idx_sv_events_exec_id   ON sv_events (execution_id);

-- 2. User Registration Log
CREATE TABLE IF NOT EXISTS sv_registrations (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) NOT NULL,
  username      VARCHAR(100),
  plan          VARCHAR(20) DEFAULT 'free',
  source        VARCHAR(50) DEFAULT 'securevault-web',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login    TIMESTAMP WITH TIME ZONE,
  login_count   INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sv_reg_email ON sv_registrations (email);
CREATE INDEX idx_sv_reg_date  ON sv_registrations (registered_at);

-- 3. Encryption Activity Log
CREATE TABLE IF NOT EXISTS sv_encryption_log (
  id            SERIAL PRIMARY KEY,
  execution_id  VARCHAR(36),
  user_id       VARCHAR(50),
  action        VARCHAR(20) NOT NULL,          -- 'encrypt' | 'decrypt' | 'steganography'
  success       BOOLEAN DEFAULT TRUE,
  message_size  INT,
  algorithm     VARCHAR(50) DEFAULT 'AES-256',
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sv_enc_user    ON sv_encryption_log (user_id);
CREATE INDEX idx_sv_enc_action  ON sv_encryption_log (action);
CREATE INDEX idx_sv_enc_created ON sv_encryption_log (created_at);

-- 4. Security Alerts
CREATE TABLE IF NOT EXISTS sv_security_alerts (
  id            SERIAL PRIMARY KEY,
  execution_id  VARCHAR(36),
  user_id       VARCHAR(50),
  email         VARCHAR(255),
  alert_type    VARCHAR(50) NOT NULL,
  severity      VARCHAR(20) DEFAULT 'info',    -- info | warning | critical
  ip_address    VARCHAR(50),
  user_agent    TEXT,
  details       JSONB DEFAULT '{}',
  resolved      BOOLEAN DEFAULT FALSE,
  resolved_at   TIMESTAMP WITH TIME ZONE,
  resolved_by   VARCHAR(50),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sv_alerts_type     ON sv_security_alerts (alert_type);
CREATE INDEX idx_sv_alerts_severity ON sv_security_alerts (severity);
CREATE INDEX idx_sv_alerts_user     ON sv_security_alerts (user_id);
CREATE INDEX idx_sv_alerts_created  ON sv_security_alerts (created_at);
CREATE INDEX idx_sv_alerts_open     ON sv_security_alerts (resolved) WHERE resolved = FALSE;

-- 5. OTP Audit Trail (never stores plain OTP — only metadata)
CREATE TABLE IF NOT EXISTS sv_otp_log (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(50),
  email         VARCHAR(255),
  action        VARCHAR(20) NOT NULL,          -- 'requested' | 'verified' | 'expired' | 'failed'
  ip_address    VARCHAR(50),
  expires_at    TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sv_otp_user    ON sv_otp_log (user_id);
CREATE INDEX idx_sv_otp_created ON sv_otp_log (created_at);

-- 6. Analytics Aggregation View (for weekly reports)
CREATE OR REPLACE VIEW sv_daily_stats AS
SELECT
  DATE(created_at) AS report_date,
  COUNT(*) FILTER (WHERE event_type = 'user.registered')   AS new_registrations,
  COUNT(*) FILTER (WHERE event_type = 'login.success')     AS successful_logins,
  COUNT(*) FILTER (WHERE event_type = 'login.failed')      AS failed_logins,
  COUNT(*) FILTER (WHERE event_type = 'message.encrypted') AS encryptions,
  COUNT(*) FILTER (WHERE event_type = 'message.decrypted') AS decryptions,
  COUNT(*) FILTER (WHERE event_type LIKE 'security.%')     AS security_alerts
FROM sv_events
GROUP BY DATE(created_at)
ORDER BY report_date DESC;
