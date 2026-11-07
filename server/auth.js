import crypto from 'node:crypto';
import { db, ah } from './db.js';
import { can } from './permissions.js';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const SESSION_COOKIE = 'te_session';

// Secure cookies over HTTPS in production (VERCEL is set on every Vercel deployment)
const isProduction = () => process.env.NODE_ENV?.trim() === 'production' || !!process.env.VERCEL;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  const check = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  if (check.length !== stored.length) return false;
  return crypto.timingSafeEqual(check, stored);
}

export async function createSession(adminId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await db.run('INSERT INTO sessions (token, admin_id, expires_at) VALUES (?, ?, ?)', token, adminId, expiresAt);
  return { token, expiresAt };
}

export async function destroySession(token) {
  if (!token) return;
  await db.run('DELETE FROM sessions WHERE token = ?', token);
}

export async function getAdminByToken(token) {
  if (!token) return null;
  const session = await db.get('SELECT * FROM sessions WHERE token = ?', token);
  if (!session) return null;
  if (session.expires_at < Date.now()) {
    await db.run('DELETE FROM sessions WHERE token = ?', token);
    return null;
  }
  const admin = await db.get('SELECT * FROM admins WHERE id = ?', session.admin_id);
  // A deactivated account loses access immediately, even with a valid session
  return admin && admin.active ? toPublicUser(admin) : null;
}

// The account fields the API returns: never the password hash or salt
export function toPublicUser(row) {
  let permissions = [];
  try {
    permissions = JSON.parse(row.permissions || '[]');
  } catch {
    permissions = [];
  }
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role || 'employee',
    department: row.department || '',
    permissions,
    active: !!row.active,
    created_at: row.created_at,
  };
}

export function parseCookies(header = '') {
  const out = {};
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

export function setSessionCookie(res, token) {
  const secure = isProduction();
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(res) {
  const secure = isProduction();
  const parts = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export const requireAuth = ah(async (req, res, next) => {
  const admin = await getAdminByToken(req.cookies?.[SESSION_COOKIE]);
  if (!admin) return res.status(401).json({ error: 'Not authenticated' });
  req.admin = admin;
  next();
});

// Signed in AND allowed to use this section ('team' is admin-only)
export const requirePermission = (section) => [
  requireAuth,
  (req, res, next) => {
    if (!can(req.admin, section)) {
      return res.status(403).json({ error: "You don't have access to this section. Ask an admin to grant it." });
    }
    next();
  },
];
