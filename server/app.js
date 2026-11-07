import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { initSchema } from './db.js';
import { parseCookies } from './auth.js';
import { ensureAdmin, seedCategoriesAndProducts } from './seed.js';
import { authRouter } from './routes/auth.js';
import { categoriesRouter } from './routes/categories.js';
import { productsRouter } from './routes/products.js';
import { enquiriesRouter } from './routes/enquiries.js';
import { dashboardRouter } from './routes/dashboard.js';
import { teamRouter } from './routes/team.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// First-start setup: create tables, the admin account from env if none exists yet,
// and a starter product catalogue in an empty database. Runs once per process (or serverless cold start).
let setup;
const ready = () => {
  setup ??= (async () => {
    await initSchema();
    await ensureAdmin();
    await seedCategoriesAndProducts();
  })().catch((err) => {
    setup = undefined; // retry on the next request
    throw err;
  });
  return setup;
};

export const app = express();
app.disable('x-powered-by');

app.use((req, res, next) => {
  req.cookies = parseCookies(req.headers.cookie || '');
  next();
});
app.use(express.json());

app.use('/api', (req, res, next) => ready().then(() => next(), next));
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/admin', dashboardRouter);
app.use('/api/team', teamRouter);

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Admin SPA (built via `npm run build`, output to dist/ with base "/admin/")
const adminDist = path.join(root, 'dist');
if (fs.existsSync(path.join(adminDist, 'index.html'))) {
  app.use('/admin', express.static(adminDist));
  app.get('/admin/*', (req, res) => res.sendFile(path.join(adminDist, 'index.html')));
} else {
  app.get(['/admin', '/admin/*'], (req, res) => {
    res.type('text/plain').send(
      'Admin panel is not built yet.\n\n' +
        'During development, run `npm run dev` and open http://localhost:5173/admin/\n' +
        'For production, run `npm run build` first, then restart this server.'
    );
  });
}

// Public site (legacy-static)
app.use(express.static(path.join(root, 'legacy-static'), { extensions: ['html'] }));
app.use((req, res) => res.status(404).sendFile(path.join(root, 'legacy-static', '404.html')));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

export function start() {
  const port = process.env.PORT || 5175;
  ready().catch((err) => console.error('Database setup failed:', err));
  app.listen(port, () => {
    console.log(`Timeless Exim server running on http://localhost:${port}`);
    console.log(`  Public site:  http://localhost:${port}/`);
    console.log(`  Admin panel:  http://localhost:${port}/admin/ (after \`npm run build\`)`);
  });
}
