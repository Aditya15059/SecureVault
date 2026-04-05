# SecureVault × n8n — Workflow Setup Guide

## 📋 Overview

This directory contains **8 production-ready n8n workflow JSON files** for the SecureVault automation system. Each workflow is importable directly into n8n.

| # | Workflow | File | Trigger |
|---|----------|------|---------|
| 1 | Registration Trigger | `WF1_registration_trigger.json` | Webhook POST |
| 2 | Welcome Email Drip | `WF2_welcome_email_drip.json` | Webhook POST |
| 3 | Google Sheets CRM | `WF3_google_sheets_crm.json` | Webhook POST |
| 4 | AWS RDS Sync | `WF4_aws_rds_sync.json` | Webhook POST |
| 5 | Password Reset OTP | `WF5_password_reset_otp.json` | Webhook POST |
| 6 | Security Alerts | `WF6_security_alerts.json` | Webhook POST |
| 7 | AI Support Chatbot | `WF7_ai_support_chatbot.json` | Webhook POST |
| 8 | Error Monitor + Weekly | `WF8_error_monitor_weekly.json` | Error Trigger + Cron |

---

## 🚀 Setup Instructions

### Step 1: Deploy n8n

Deploy n8n on one of these platforms:
- **Railway** (recommended): `railway.app` — one-click deploy
- **Render**: `render.com` — free tier available
- **Self-hosted**: Docker on any VPS (EC2, DigitalOcean)

```bash
# Docker self-hosted
docker run -d --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your_password \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

### Step 2: Set n8n Environment Variables

In your n8n instance settings, add these environment variables:

```
SV_API_KEY=your-shared-api-key
ADMIN_EMAIL=admin@securevault.io
ADMIN_TELEGRAM_CHAT_ID=your_chat_id
```

### Step 3: Configure Credentials in n8n

Go to **n8n → Settings → Credentials** and create:

| Credential Type | Name | Notes |
|----------------|------|-------|
| PostgreSQL | `AWS RDS SecureVault` | Your RDS connection details |
| Google Sheets (OAuth2) | `Google Sheets SecureVault` | Needs Sheets API enabled |
| Gmail (OAuth2) | `Gmail SecureVault` | Needs Gmail API enabled |
| Telegram | `SecureVault Bot` | Bot token from @BotFather |
| OpenAI API | `OpenAI SecureVault` | For WF7 chatbot (optional) |

### Step 4: Set Up AWS RDS

Run the migration scripts on your PostgreSQL instance:

```bash
# Connect to RDS
psql -h your-db.rds.amazonaws.com -U admin -d securevault_db

# Run migrations
\i database/migrations/001_init_tables.sql
\i database/migrations/002_create_n8n_user.sql
```

### Step 5: Create Google Sheets

Create a Google Sheet called **"SecureVault CRM"** with these tabs:

**Tab 1: Users CRM**
```
Timestamp | EventType | UserId | Email | Name | IPAddress | UserAgent | Extra
```

**Tab 2: Encryption Activity**
```
Timestamp | UserId | Action | MessageLength | Success | Extra
```

**Tab 3: Security Alerts**
```
Timestamp | UserId | Email | AlertType | IPAddress | ActionTaken
```

**Tab 4: OTP Requests**
```
Timestamp | Email | UserId | Status | ExecutionId
```

**Tab 5: Workflow Errors**
```
Timestamp | WorkflowName | ErrorMessage | FailedNode | ExecutionId | Severity
```

### Step 6: Import Workflows

1. Open n8n → **Workflows** → **Import from File**
2. Import each JSON file in order (WF3 first, then WF1, etc.)
3. Open each workflow → update credential selections
4. Update Google Sheets document IDs (select your sheet in each node)
5. Activate all workflows

### Step 7: Configure Backend

```bash
cd server
cp .env.example .env
# Edit .env with your actual values
npm install
npm start
```

### Step 8: Set Frontend Env (Optional — for chatbot)

Create `/.env.local`:
```
VITE_N8N_CHAT_WEBHOOK=https://your-n8n.com/webhook/securevault/chat
VITE_API_URL=https://your-backend.com/api
```

---

## 🔒 Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     SECUREVAULT                          │
│                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐   │
│  │ Frontend  │───▶│ Backend  │───▶│ n8n Webhooks     │   │
│  │ (React)   │    │ (Express)│    │ (x-api-key auth) │   │
│  │ GH Pages  │    │ Railway  │    │ Railway/VPS      │   │
│  └──────────┘    └──────────┘    └────────┬─────────┘   │
│                       │                    │             │
│                       │           ┌────────┼────────┐   │
│                       │           │        │        │   │
│                  ┌────▼────┐ ┌────▼───┐ ┌──▼──┐ ┌──▼─┐ │
│                  │ MongoDB │ │AWS RDS │ │Gmail│ │Tg  │ │
│                  │ (users) │ │(logs)  │ │     │ │Bot │ │
│                  └─────────┘ └────────┘ └─────┘ └────┘ │
└──────────────────────────────────────────────────────────┘
```

### Security Rules Enforced

1. **API Key validation** on every webhook (x-api-key header)
2. **Passwords NEVER sent to n8n** — bcrypt hashing in Express only
3. **OTP hashed with bcrypt** before storage — plain OTP only in email
4. **Parameterized SQL queries** — no string interpolation in RDS
5. **Idempotent inserts** — `ON CONFLICT DO NOTHING` prevents duplicates
6. **Execution IDs** — UUID tracking for every workflow run
7. **Rate limiting** — Express-level (20 auth/15min, 5 OTP/5min)
8. **Least-privilege DB user** — n8n_writer has INSERT/SELECT only
9. **Input sanitization** — all Code nodes validate + truncate inputs
10. **Prompt injection blocking** — chatbot rejects suspicious patterns

---

## 📊 Implementation Order

Follow this sequence — each step depends on the previous:

```
1. ✅ Deploy n8n instance
2. ✅ Set up AWS RDS + run CREATE TABLE scripts
3. ✅ Create Google Sheets with correct columns
4. ✅ Import WF8 (error monitor) — all others reference it
5. ✅ Import WF3 (Sheets CRM) — logging foundation
6. ✅ Import WF4 (RDS sync) — database foundation
7. ✅ Import WF1 (registration) — test with new signup
8. ✅ Import WF2 (email drip) — verify day 1/3/7 emails
9. ✅ Import WF5 (OTP) — test forgot password flow
10. ✅ Import WF6 (alerts) — test with 3+ wrong logins
11. ✅ Import WF7 (chatbot) — test AI responses
12. ✅ Configure backend .env + deploy
```

---

## 🧪 Testing

### Quick Test — Registration Flow
```bash
curl -X POST https://your-n8n.com/webhook/securevault/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "userId": "test-001",
    "plan": "free",
    "source": "curl-test"
  }'
```

### Quick Test — Security Alert
```bash
curl -X POST https://your-n8n.com/webhook/securevault/security-alert \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "eventType": "security.login.failed.3x",
    "email": "test@example.com",
    "userId": "test-001",
    "ip": "1.2.3.4",
    "severity": "warning"
  }'
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook returns 401 | Check `x-api-key` header matches `SV_API_KEY` env var in n8n |
| Gmail node fails | Verify OAuth2 credentials + refresh token in n8n |
| RDS connection error | Check security group allows n8n server IP, SSL enabled |
| Sheets not updating | Verify sheet ID + tab name in each Google Sheets node |
| Chatbot not responding | Check OpenAI API key + credits in n8n credentials |
| Duplicate inserts | Normal — `ON CONFLICT DO NOTHING` silently prevents them |
| Weekly report empty | Ensure RDS has data; check cron timezone in n8n settings |
