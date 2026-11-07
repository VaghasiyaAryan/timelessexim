import { Router } from 'express';
import { db, ah, slugify, uniqueSlug } from '../db.js';
import { requirePermission, getAdminByToken, SESSION_COOKIE } from '../auth.js';
import { can } from '../permissions.js';

export const productsRouter = Router();

function parseProduct(row) {
  if (!row) return row;
  let specs = [];
  try {
    specs = JSON.parse(row.specs || '[]');
  } catch {
    specs = [];
  }
  return { ...row, specs, featured: !!row.featured };
}

async function listProducts({ search, category, status } = {}) {
  let sql = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE 1 = 1`;
  const params = [];
  if (search) {
    sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    sql += ' AND c.slug = ?';
    params.push(category);
  }
  if (status) {
    sql += ' AND p.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY p.sort_order ASC, p.created_at DESC';
  return (await db.all(sql, ...params)).map(parseProduct);
}

// Drafts and the full list are for team members with Products access
const isAdminRequest = async (req) => can(await getAdminByToken(req.cookies?.[SESSION_COOKIE]), 'products');

// Public, read-only (active products only)
productsRouter.get('/', ah(async (req, res) => {
  const isAdmin = req.query.all === '1' && (await isAdminRequest(req));
  const rows = await listProducts({
    search: req.query.search,
    category: req.query.category,
    status: isAdmin ? req.query.status : 'active',
  });
  res.json({ products: rows });
}));

productsRouter.get('/:id', ah(async (req, res) => {
  const row = await db.get(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = ? OR p.slug = ?`,
    req.params.id,
    req.params.id
  );
  // Drafts are only visible to a signed-in admin
  if (!row || (row.status !== 'active' && !(await isAdminRequest(req)))) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product: parseProduct(row) });
}));

productsRouter.post('/', requirePermission('products'), ah(async (req, res) => {
  const { name, category_id, description, specs, image_url, featured, status } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'Product name is required.' });

  const slug = await uniqueSlug('products', slugify(name));
  const maxOrder = (await db.get('SELECT COALESCE(MAX(sort_order), -1) AS m FROM products')).m;

  const info = await db.run(
    `INSERT INTO products (slug, name, category_id, description, specs, image_url, featured, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    slug,
    name.trim(),
    category_id || null,
    description || '',
    JSON.stringify(Array.isArray(specs) ? specs : []),
    image_url || '',
    featured ? 1 : 0,
    status === 'draft' ? 'draft' : 'active',
    maxOrder + 1
  );

  const row = await db.get('SELECT * FROM products WHERE id = ?', info.lastInsertRowid);
  res.status(201).json({ product: parseProduct(row) });
}));

productsRouter.put('/:id', requirePermission('products'), ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found.' });

  const { name, category_id, description, specs, image_url, featured, status, sort_order } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'Product name is required.' });

  await db.run(
    `UPDATE products SET
      name = ?, category_id = ?, description = ?, specs = ?, image_url = ?,
      featured = ?, status = ?, sort_order = ?, updated_at = datetime('now')
     WHERE id = ?`,
    name.trim(),
    category_id || null,
    description || '',
    JSON.stringify(Array.isArray(specs) ? specs : []),
    image_url || '',
    featured ? 1 : 0,
    status === 'draft' ? 'draft' : 'active',
    Number.isFinite(sort_order) ? sort_order : existing.sort_order,
    req.params.id
  );

  const row = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
  res.json({ product: parseProduct(row) });
}));

productsRouter.delete('/:id', requirePermission('products'), ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found.' });
  await db.run('DELETE FROM products WHERE id = ?', req.params.id);
  res.json({ ok: true });
}));
