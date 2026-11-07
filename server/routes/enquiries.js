import { Router } from 'express';
import { db, ah } from '../db.js';
import { requirePermission } from '../auth.js';

export const enquiriesRouter = Router();

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];

// Public: contact form submits here (no auth)
enquiriesRouter.post('/', ah(async (req, res) => {
  const { name, company, email, phone, country, business_type, products, quantity, timeline, message } =
    req.body || {};

  if (!name?.trim() || !company?.trim() || !email?.trim() || !country?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, company, email, country and message are required.' });
  }

  const productsStr = Array.isArray(products) ? products.join(', ') : String(products || '');

  await db.run(
    `INSERT INTO enquiries (name, company, email, phone, country, business_type, products, quantity, timeline, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    name.trim(),
    company.trim(),
    email.trim(),
    phone?.trim() || '',
    country.trim(),
    business_type || '',
    productsStr,
    quantity || '',
    timeline || '',
    message.trim()
  );

  res.status(201).json({ ok: true });
}));

// Admin: list + filter
enquiriesRouter.get('/', requirePermission('enquiries'), ah(async (req, res) => {
  const { status, search } = req.query;
  let sql = 'SELECT * FROM enquiries WHERE 1 = 1';
  const params = [];
  if (status && STATUSES.includes(status)) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    sql += ' AND (name LIKE ? OR company LIKE ? OR email LIKE ? OR country LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }
  sql += ' ORDER BY created_at DESC';
  res.json({ enquiries: await db.all(sql, ...params) });
}));

enquiriesRouter.get('/:id', requirePermission('enquiries'), ah(async (req, res) => {
  const row = await db.get('SELECT * FROM enquiries WHERE id = ?', req.params.id);
  if (!row) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ enquiry: row });
}));

enquiriesRouter.patch('/:id', requirePermission('enquiries'), ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM enquiries WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Enquiry not found.' });

  const { status, note } = req.body || {};
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` });
  }

  await db.run(
    'UPDATE enquiries SET status = COALESCE(?, status), note = COALESCE(?, note) WHERE id = ?',
    status ?? null,
    note ?? null,
    req.params.id
  );

  res.json({ enquiry: await db.get('SELECT * FROM enquiries WHERE id = ?', req.params.id) });
}));

enquiriesRouter.delete('/:id', requirePermission('enquiries'), ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM enquiries WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Enquiry not found.' });
  await db.run('DELETE FROM enquiries WHERE id = ?', req.params.id);
  res.json({ ok: true });
}));
