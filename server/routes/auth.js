import { Router } from 'express';
import { db, ah } from '../db.js';
import {
  verifyPassword,
  hashPassword,
  createSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  toPublicUser,
  getAdminByToken,
  SESSION_COOKIE,
} from '../auth.js';

export const authRouter = Router();

authRouter.post('/login', ah(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const admin = await db.get('SELECT * FROM admins WHERE email = ?', String(email).trim().toLowerCase());
  if (!admin || !verifyPassword(password, admin.password_hash, admin.password_salt)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  if (!admin.active) {
    return res.status(403).json({ error: 'This account has been deactivated. Contact an admin.' });
  }

  const { token } = await createSession(admin.id);
  setSessionCookie(res, token);
  res.json({ admin: toPublicUser(admin) });
}));

authRouter.post('/logout', ah(async (req, res) => {
  await destroySession(req.cookies?.[SESSION_COOKIE]);
  clearSessionCookie(res);
  res.json({ ok: true });
}));

// "Who is signed in?" Being signed out is a normal answer here, not an error: the admin panel
// asks on every load, and a 401 would show up as a failed request in hosting logs.
authRouter.get('/me', ah(async (req, res) => {
  res.json({ admin: await getAdminByToken(req.cookies?.[SESSION_COOKIE]) });
}));

authRouter.post('/change-password', requireAuth, ah(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }
  const admin = await db.get('SELECT * FROM admins WHERE id = ?', req.admin.id);
  if (!verifyPassword(currentPassword, admin.password_hash, admin.password_salt)) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }
  const { hash, salt } = hashPassword(newPassword);
  await db.run('UPDATE admins SET password_hash = ?, password_salt = ? WHERE id = ?', hash, salt, admin.id);
  res.json({ ok: true });
}));

authRouter.put('/profile', requireAuth, ah(async (req, res) => {
  const { name } = req.body || {};
  await db.run('UPDATE admins SET name = ? WHERE id = ?', String(name || '').trim(), req.admin.id);
  res.json({ admin: toPublicUser(await db.get('SELECT * FROM admins WHERE id = ?', req.admin.id)) });
}));
