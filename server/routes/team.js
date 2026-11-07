import { Router } from 'express';
import { db, ah } from '../db.js';
import { requirePermission, hashPassword, toPublicUser } from '../auth.js';
import { ROLES, cleanPermissions } from '../permissions.js';

// Team management: admins create and manage admin and employee accounts
export const teamRouter = Router();
teamRouter.use(requirePermission('team'));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const activeAdminCount = async () =>
  (await db.get("SELECT COUNT(*) AS n FROM admins WHERE role = 'admin' AND active = 1")).n;

async function listTeam() {
  return (await db.all('SELECT * FROM admins ORDER BY role ASC, created_at ASC')).map(toPublicUser);
}

// Validates the role/department/permissions fields shared by create and update
function readAccess(body) {
  const role = ROLES.includes(body.role) ? body.role : 'employee';
  return {
    role,
    department: String(body.department || '').trim().slice(0, 60),
    // Admins have access to everything, so a stored list would only be misleading
    permissions: role === 'admin' ? [] : cleanPermissions(body.permissions),
  };
}

teamRouter.get('/', ah(async (req, res) => {
  res.json({ team: await listTeam() });
}));

teamRouter.post('/', ah(async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const { role, department, permissions } = readAccess(body);

  if (!name) return res.status(400).json({ error: 'Name is required.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (role === 'employee' && !permissions.length) {
    return res.status(400).json({ error: 'Give the employee access to at least one department.' });
  }
  if (await db.get('SELECT 1 FROM admins WHERE email = ?', email)) {
    return res.status(409).json({ error: 'Someone on the team already uses this email.' });
  }

  const { hash, salt } = hashPassword(password);
  await db.run(
    `INSERT INTO admins (email, name, password_hash, password_salt, role, department, permissions, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    email, name, hash, salt, role, department, JSON.stringify(permissions)
  );
  res.status(201).json({ team: await listTeam() });
}));

teamRouter.put('/:id', ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM admins WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Team member not found.' });

  const body = req.body || {};
  const name = String(body.name ?? existing.name).trim();
  // Fields left out of the request keep their current values
  const current = toPublicUser(existing);
  const { role, department, permissions } = readAccess({
    role: body.role ?? current.role,
    department: body.department ?? current.department,
    permissions: body.permissions ?? current.permissions,
  });
  const active = body.active === undefined ? !!existing.active : !!body.active;
  const isSelf = existing.id === req.admin.id;

  if (!name) return res.status(400).json({ error: 'Name is required.' });
  if (role === 'employee' && !permissions.length) {
    return res.status(400).json({ error: 'Give the employee access to at least one department.' });
  }
  // Guard rails: nobody can lock themselves out, and there must always be an active admin
  if (isSelf && (role !== 'admin' || !active)) {
    return res.status(400).json({ error: "You can't remove your own admin access or deactivate yourself." });
  }
  const wasActiveAdmin = existing.role === 'admin' && existing.active;
  if (wasActiveAdmin && (role !== 'admin' || !active) && (await activeAdminCount()) <= 1) {
    return res.status(400).json({ error: 'There must always be at least one active admin.' });
  }

  await db.run(
    'UPDATE admins SET name = ?, role = ?, department = ?, permissions = ?, active = ? WHERE id = ?',
    name, role, department, JSON.stringify(permissions), active ? 1 : 0, existing.id
  );
  // Deactivated: end their sessions straight away
  if (!active) await db.run('DELETE FROM sessions WHERE admin_id = ?', existing.id);
  res.json({ team: await listTeam() });
}));

teamRouter.post('/:id/reset-password', ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM admins WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Team member not found.' });
  const password = String(req.body?.password || '');
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const { hash, salt } = hashPassword(password);
  // Sign them out everywhere so the old password's sessions stop working
  await db.batch([
    ['UPDATE admins SET password_hash = ?, password_salt = ? WHERE id = ?', hash, salt, existing.id],
    ['DELETE FROM sessions WHERE admin_id = ? AND admin_id != ?', existing.id, req.admin.id],
  ]);
  res.json({ ok: true });
}));

teamRouter.delete('/:id', ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM admins WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Team member not found.' });
  if (existing.id === req.admin.id) return res.status(400).json({ error: "You can't delete your own account." });
  if (existing.role === 'admin' && existing.active && (await activeAdminCount()) <= 1) {
    return res.status(400).json({ error: 'There must always be at least one active admin.' });
  }
  // Sessions first: hosted connections don't guarantee PRAGMA foreign_keys (ON DELETE CASCADE)
  await db.batch([
    ['DELETE FROM sessions WHERE admin_id = ?', existing.id],
    ['DELETE FROM admins WHERE id = ?', existing.id],
  ]);
  res.json({ team: await listTeam() });
}));
