import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['operator', 'admin'],
    default: 'operator',
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },

  // ─── Auth Tracking ───────────────────────────
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  locked: {
    type: Boolean,
    default: false,
  },

  // ─── Password Reset (OTP) ────────────────────
  resetOtp: {
    type: String, // bcrypt-hashed OTP — NEVER store plain text
  },
  resetOtpExpires: {
    type: Date,
  },
  resetOtpAttempts: {
    type: Number,
    default: 0,
  },
  resetToken: {
    type: String, // Hashed token for Step 3 (set new password)
  },
  resetTokenExpires: {
    type: Date,
  },

  // ─── Metadata ────────────────────────────────
  lastIp: {
    type: String,
  },
  lastUserAgent: {
    type: String,
  },
}, {
  timestamps: true,
});

// ─── Indexes ─────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ lockUntil: 1 }, { expireAfterSeconds: 0 });

// ─── Pre-save: Hash password ─────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Methods ─────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function () {
  if (this.locked) return true;
  if (this.lockUntil && this.lockUntil > Date.now()) return true;
  return false;
};

userSchema.methods.incrementLoginAttempts = async function () {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1, locked: false },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts (15 min lockout)
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = {
      lockUntil: new Date(Date.now() + 15 * 60 * 1000),
      locked: true,
    };
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set: {
      loginAttempts: 0,
      locked: false,
      lastLogin: new Date(),
    },
    $inc: { loginCount: 1 },
    $unset: { lockUntil: 1 },
  });
};

// Strip sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetOtp;
  delete obj.resetToken;
  delete obj.resetOtpExpires;
  delete obj.resetTokenExpires;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
