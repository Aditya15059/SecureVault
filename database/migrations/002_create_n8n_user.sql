-- ═══════════════════════════════════════════════════════════
-- SecureVault — Least-Privilege n8n Database User
-- Principle of least privilege: INSERT + SELECT only.
-- No DELETE, UPDATE, DROP, or ALTER permissions.
-- ═══════════════════════════════════════════════════════════

-- Create the role
CREATE ROLE n8n_writer WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD';

-- Grant connect
GRANT CONNECT ON DATABASE securevault_db TO n8n_writer;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO n8n_writer;

-- Grant INSERT on all workflow tables (write events)
GRANT INSERT ON TABLE
  sv_events,
  sv_registrations,
  sv_encryption_log,
  sv_security_alerts,
  sv_otp_log
TO n8n_writer;

-- Grant SELECT for queries (weekly reports, daily stats)
GRANT SELECT ON TABLE
  sv_events,
  sv_registrations,
  sv_encryption_log,
  sv_security_alerts,
  sv_otp_log,
  sv_daily_stats
TO n8n_writer;

-- Grant UPDATE only on specific columns needed for workflows
GRANT UPDATE (last_login, login_count) ON sv_registrations TO n8n_writer;
GRANT UPDATE (resolved, resolved_at, resolved_by) ON sv_security_alerts TO n8n_writer;

-- Grant sequence usage (required for SERIAL columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO n8n_writer;

-- ═══════════════════════════════════════════════════════════
-- SECURITY NOTES:
-- 1. Change the password above before running
-- 2. Restrict RDS Security Group to n8n server IP only
-- 3. Enable SSL/TLS for all connections
-- 4. Enable RDS encryption at rest
-- 5. Enable automated backups (min 7-day retention)
-- 6. Audit this role quarterly
-- ═══════════════════════════════════════════════════════════
