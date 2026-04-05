import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { emitToN8N } from '../utils/n8nEmit.js';

const router = Router();

// ─── Valid event types for frontend emission ─────
const ALLOWED_EVENTS = [
  'message.encrypted',
  'message.decrypted',
  'steganography.analyzed',
  'steganography.hidden',
  'user.profile.updated',
  'page.viewed',
];

/**
 * POST /api/events
 * Authenticated endpoint for frontend to emit events to n8n.
 * Only allows whitelisted event types (defense-in-depth).
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { eventType, metadata = {} } = req.body;

    if (!eventType) {
      return res.status(400).json({
        status: 'error',
        message: 'eventType is required.',
      });
    }

    if (!ALLOWED_EVENTS.includes(eventType)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid event type. Allowed: ${ALLOWED_EVENTS.join(', ')}`,
      });
    }

    // Sanitize metadata — strip anything sensitive
    const safeMetadata = { ...metadata };
    delete safeMetadata.password;
    delete safeMetadata.token;
    delete safeMetadata.secret;
    delete safeMetadata.otp;

    // Emit to n8n (non-blocking)
    emitToN8N(eventType, {
      userId: req.user.id,
      email: req.user.email,
      metadata: safeMetadata,
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    return res.json({
      status: 'success',
      message: 'Event processed successfully.',
    });
  } catch (error) {
    console.error('[EVENT ERROR]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process event.',
    });
  }
});

export default router;
