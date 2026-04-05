import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { generateJWT } from '../middleware/auth.js';
import { emitToN8N, emitToWebhook, emitSecurityAlert } from '../utils/n8nEmit.js';

const router = Router();

// ─── Rate Limiters ───────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { status: 'error', message: 'Too many auth attempts. Try again later.' },
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { status: 'error', message: 'Too many OTP requests. Wait 5 minutes.' },
});

// ─── Helpers ─────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 255);
}

function getClientInfo(req) {
  return {
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
    userAgent: sanitizeInput(req.headers['user-agent'] || 'unknown'),
  };
}

// ═══════════════════════════════════════════════════
// POST /api/auth/register
// ═══════════════════════════════════════════════════
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const client = getClientInfo(req);

    // ── Validation ──
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, email, and password are required.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters.',
      });
    }

    // ── Check existing user ──
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists.',
      });
    }

    // ── Create user (password hashed in pre-save hook) ──
    const user = await User.create({
      username: sanitizeInput(username),
      email: email.toLowerCase().trim(),
      password, // Hashed by bcrypt in model pre-save — NEVER sent to n8n
    });

    const token = generateJWT(user);

    // ── Fire n8n events (non-blocking) ──
    emitToN8N('user.registered', {
      userId: user._id.toString(),
      email: user.email,
      name: user.username,
      plan: user.plan,
      source: 'securevault-web',
      ...client,
    });

    emitToWebhook('N8N_REGISTER_WEBHOOK', 'user.registered', {
      userId: user._id.toString(),
      email: user.email,
      name: user.username,
      createdAt: user.createdAt,
      plan: user.plan,
      source: 'securevault-web',
    });

    return res.status(201).json({
      status: 'success',
      message: 'Registration successful.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('[REGISTER ERROR]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again.',
    });
  }
});

// ═══════════════════════════════════════════════════
// POST /api/auth/login
// ═══════════════════════════════════════════════════
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = getClientInfo(req);

    // ── Validation ──
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format.',
      });
    }

    // ── Find user ──
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal whether email exists
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials.',
      });
    }

    // ── Check lockout ──
    if (user.isLocked()) {
      const remainingMs = user.lockUntil ? user.lockUntil - Date.now() : 0;
      const remainingMin = Math.ceil(remainingMs / 60000);

      emitSecurityAlert('account.locked', {
        userId: user._id.toString(),
        email: user.email,
        ...client,
      });

      return res.status(423).json({
        status: 'error',
        message: `Account locked. Try again in ${remainingMin} minutes, or reset your password.`,
        lockUntil: user.lockUntil,
      });
    }

    // ── Verify password ──
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incrementLoginAttempts();
      const updatedUser = await User.findById(user._id);
      const attemptsLeft = Math.max(0, 5 - updatedUser.loginAttempts);

      // ── Emit failure events ──
      emitToN8N('login.failed', {
        userId: user._id.toString(),
        email: user.email,
        attempts: updatedUser.loginAttempts,
        ...client,
      });

      if (updatedUser.loginAttempts >= 5) {
        emitSecurityAlert('login.failed.5x', {
          userId: user._id.toString(),
          email: user.email,
          ...client,
        });

        return res.status(423).json({
          status: 'error',
          message: 'Account locked for 15 minutes due to too many failed attempts.',
          lockUntil: updatedUser.lockUntil,
        });
      }

      if (updatedUser.loginAttempts >= 3) {
        emitSecurityAlert('login.failed.3x', {
          userId: user._id.toString(),
          email: user.email,
          attempts: updatedUser.loginAttempts,
          ...client,
        });

        return res.status(401).json({
          status: 'error',
          message: `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
          attemptsLeft,
        });
      }

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials.',
      });
    }

    // ── Success ──
    await user.resetLoginAttempts();

    // Update metadata
    user.lastIp = client.ip;
    user.lastUserAgent = client.userAgent;
    await user.save();

    const token = generateJWT(user);

    emitToN8N('login.success', {
      userId: user._id.toString(),
      email: user.email,
      loginCount: user.loginCount + 1,
      ...client,
    });

    return res.json({
      status: 'success',
      message: 'Login successful.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.',
    });
  }
});

// ═══════════════════════════════════════════════════
// POST /api/auth/forgot-password
// ═══════════════════════════════════════════════════
router.post('/forgot-password', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Always respond the same to prevent enumeration
    const genericResponse = {
      status: 'success',
      message: 'If this email exists, a reset code will be sent.',
    };

    if (!email || !isValidEmail(email)) {
      return res.json(genericResponse);
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // ── Generate 6-digit OTP ──
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpHash = await bcrypt.hash(otp, 10);

      user.resetOtp = otpHash;
      user.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
      user.resetOtpAttempts = 0;
      await user.save();

      // ── Delegate email sending to n8n ──
      emitToWebhook('N8N_OTP_WEBHOOK', 'otp.requested', {
        email: user.email,
        userId: user._id.toString(),
        name: user.username,
        otp, // Plain OTP sent to n8n for email — NEVER stored in plain text in DB
        expiresIn: '5 minutes',
      });

      emitToN8N('otp.requested', {
        email: user.email,
        userId: user._id.toString(),
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      });
    }

    return res.json(genericResponse);
  } catch (error) {
    console.error('[FORGOT-PASSWORD ERROR]', error.message);
    return res.json({
      status: 'success',
      message: 'If this email exists, a reset code will be sent.',
    });
  }
});

// ═══════════════════════════════════════════════════
// POST /api/auth/verify-otp
// ═══════════════════════════════════════════════════
router.post('/verify-otp', otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and OTP code are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset code.',
      });
    }

    // ── Check expiry ──
    if (user.resetOtpExpires < Date.now()) {
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;
      user.resetOtpAttempts = 0;
      await user.save();

      return res.status(400).json({
        status: 'error',
        message: 'Reset code has expired. Please request a new one.',
      });
    }

    // ── Check max attempts (3) ──
    if (user.resetOtpAttempts >= 3) {
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;
      user.resetOtpAttempts = 0;
      await user.save();

      emitSecurityAlert('otp.max.attempts', {
        userId: user._id.toString(),
        email: user.email,
      });

      return res.status(429).json({
        status: 'error',
        message: 'Too many attempts. Request a new code.',
      });
    }

    // ── Verify OTP against hash ──
    const isValid = await bcrypt.compare(otp.toString(), user.resetOtp);

    if (!isValid) {
      user.resetOtpAttempts += 1;
      await user.save();

      const attemptsLeft = 3 - user.resetOtpAttempts;
      return res.status(400).json({
        status: 'error',
        message: `Invalid code. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
      });
    }

    // ── OTP valid — issue reset token ──
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    user.resetToken = resetTokenHash;
    user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.resetOtpAttempts = 0;
    await user.save();

    return res.json({
      status: 'success',
      message: 'OTP verified successfully.',
      data: { resetToken },
    });
  } catch (error) {
    console.error('[VERIFY-OTP ERROR]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Verification failed. Please try again.',
    });
  }
});

// ═══════════════════════════════════════════════════
// POST /api/auth/reset-password
// ═══════════════════════════════════════════════════
router.post('/reset-password', otpLimiter, async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, reset token, and new password are required.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.resetToken || !user.resetTokenExpires) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset session.',
      });
    }

    if (user.resetTokenExpires < Date.now()) {
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();

      return res.status(400).json({
        status: 'error',
        message: 'Reset session expired. Start over.',
      });
    }

    // ── Verify reset token ──
    const isTokenValid = await bcrypt.compare(resetToken, user.resetToken);
    if (!isTokenValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid reset token.',
      });
    }

    // ── Update password (hashed in pre-save) ──
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.loginAttempts = 0;
    user.locked = false;
    user.lockUntil = undefined;
    await user.save();

    // ── Notify via n8n ──
    emitToN8N('password.changed', {
      userId: user._id.toString(),
      email: user.email,
    });

    emitSecurityAlert('password.changed', {
      userId: user._id.toString(),
      email: user.email,
    });

    return res.json({
      status: 'success',
      message: 'Password updated successfully. Please log in.',
    });
  } catch (error) {
    console.error('[RESET-PASSWORD ERROR]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Password reset failed. Please try again.',
    });
  }
});

export default router;
