import crypto from 'crypto';

export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...sanitized } = user;
  return sanitized;
}

export function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}
