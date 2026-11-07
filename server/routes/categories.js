import { Router } from 'express';
import { db, ah, slugify, uniqueSlug } from '../db.js';
import { requirePermission } from '../auth.js';

export const categoriesRouter = Router();

function withCounts() {
  return db.all(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
     FROM categories c ORDER BY c.sort_order ASC, c.name ASC`
  );
}

// Public, read-only
categoriesRouter.get('/', ah(async (req, res) => {
  res.json({ categories: await withCounts() });
}));

// Admin writes
categoriesRouter.post('/', requirePermission('categories'), ah(async (req, res) => {
  const { name } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required.' });
  const slug = await uniqueSlug('categories', slugify(name));
  const maxOrder = (await db.get('SELECT COALESCE(MAX(sort_order), -1) AS m FROM categories')).m;
  await db.run('INSERT INTO categories (slug, name, sort_order) VALUES (?, ?, ?)', slug, name.trim(), maxOrder + 1);
  res.status(201).json({ categories: await withCounts() });
}));

categoriesRouter.put('/reorder', requirePermission('categories'), ah(async (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array of category ids.' });
  if (order.length) await db.batch(order.map((id, i) => ['UPDATE categories SET sort_order = ? WHERE id = ?', i, id]));
  res.json({ categories: await withCounts() });
}));

categoriesRouter.put('/:id', requirePermission('categories'), ah(async (req, res) => {
  const { name } = req.body || {};
  const existing = await db.get('SELECT * FROM categories WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found.' });
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required.' });
  await db.run('UPDATE categories SET name = ? WHERE id = ?', name.trim(), req.params.id);
  res.json({ categories: await withCounts() });
}));

categoriesRouter.delete('/:id', requirePermission('categories'), ah(async (req, res) => {
  const existing = await db.get('SELECT * FROM categories WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found.' });
  // Unlink products explicitly: hosted connections don't guarantee PRAGMA foreign_keys (ON DELETE SET NULL)
  await db.batch([
    ['UPDATE products SET category_id = NULL WHERE category_id = ?', req.params.id],
    ['DELETE FROM categories WHERE id = ?', req.params.id],
  ]);
  res.json({ categories: await withCounts() });
}));
