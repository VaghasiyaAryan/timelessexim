import { Router } from 'express';
import { db, ah } from '../db.js';
import { requirePermission } from '../auth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', requirePermission('dashboard'), ah(async (req, res) => {
  const count = async (sql) => (await db.get(sql)).n;
  const [totalProducts, activeProducts, totalCategories, totalEnquiries, newEnquiries, enquiries7d] = await Promise.all([
    count('SELECT COUNT(*) AS n FROM products'),
    count("SELECT COUNT(*) AS n FROM products WHERE status = 'active'"),
    count('SELECT COUNT(*) AS n FROM categories'),
    count('SELECT COUNT(*) AS n FROM enquiries'),
    count("SELECT COUNT(*) AS n FROM enquiries WHERE status = 'new'"),
    count("SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= datetime('now', '-7 days')"),
  ]);

  const byStatus = (await db.all('SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status'))
    .reduce((acc, r) => ({ ...acc, [r.status]: r.n }), {});

  const byCategory = await db.all(
    `SELECT c.name, COUNT(p.id) AS n FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id ORDER BY c.sort_order ASC`
  );

  const recentEnquiries = await db.all('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 6');

  res.json({
    totals: { totalProducts, activeProducts, totalCategories, totalEnquiries, newEnquiries, enquiries7d },
    enquiriesByStatus: byStatus,
    productsByCategory: byCategory,
    recentEnquiries,
  });
}));
