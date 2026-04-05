import { v4 as uuidv4 } from 'uuid';

/**
 * Universal n8n Event Emitter
 *
 * Fire-and-forget webhook calls to n8n.
 * Never blocks the main request/response cycle.
 * Includes execution ID for idempotency and traceability.
 *
 * @param {string} eventType  - Event identifier (e.g. 'user.registered', 'login.failed.3x')
 * @param {Object} payload    - Event data (userId, email, etc.)
 * @param {Object} [options]  - Optional config overrides
 * @param {string} [options.webhookUrl] - Override default webhook URL
 * @param {number} [options.timeout]    - Request timeout in ms (default: 5000)
 */
export async function emitToN8N(eventType, payload, options = {}) {
  const webhookUrl = options.webhookUrl || process.env.N8N_EVENT_WEBHOOK;

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[n8n] No webhook URL configured for event: ${eventType}`);
    }
    return null;
  }

  const executionId = uuidv4();
  const eventPayload = {
    executionId,
    eventType,
    timestamp: new Date().toISOString(),
    source: 'securevault-api',
    version: '1.0',
    ...payload,
  };

  const timeout = options.timeout || 5000;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Execution-Id': executionId,
        'X-Event-Type': eventType,
        ...(process.env.N8N_API_KEY && {
          'x-api-key': process.env.N8N_API_KEY,
        }),
      },
      body: JSON.stringify(eventPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `[n8n] Webhook failed for ${eventType}: HTTP ${response.status}`
      );
    }

    return { executionId, status: response.status };
  } catch (error) {
    // Fire-and-forget — log but never throw
    if (error.name === 'AbortError') {
      console.error(`[n8n] Webhook timeout for ${eventType} (${timeout}ms)`);
    } else {
      console.error(`[n8n] Webhook error for ${eventType}:`, error.message);
    }
    return { executionId, status: 'error', error: error.message };
  }
}

/**
 * Emit to a specific n8n webhook (e.g. OTP, registration).
 * Convenience wrapper with explicit URL.
 */
export function emitToWebhook(webhookEnvKey, eventType, payload) {
  const url = process.env[webhookEnvKey];
  return emitToN8N(eventType, payload, { webhookUrl: url });
}

/**
 * Emit a security alert event.
 * Always fires to both the event webhook AND the dedicated alerts webhook.
 */
export async function emitSecurityAlert(alertType, payload) {
  const results = await Promise.allSettled([
    emitToN8N(`security.${alertType}`, {
      ...payload,
      severity: getSeverity(alertType),
    }),
    emitToWebhook('N8N_ALERTS_WEBHOOK', `security.${alertType}`, {
      ...payload,
      severity: getSeverity(alertType),
    }),
  ]);
  return results;
}

function getSeverity(alertType) {
  const severityMap = {
    'login.failed.3x': 'warning',
    'login.failed.5x': 'critical',
    'account.locked': 'critical',
    'password.changed': 'info',
    'suspicious.ip': 'warning',
    'otp.max.attempts': 'warning',
  };
  return severityMap[alertType] || 'info';
}
