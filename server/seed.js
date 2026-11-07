import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { db, initSchema, slugify } from './db.js';
import { hashPassword } from './auth.js';

export async function ensureAdmin() {
  const count = (await db.get('SELECT COUNT(*) AS n FROM admins')).n;
  if (count > 0) return null;

  const email = (process.env.ADMIN_EMAIL || 'admin@timelessexim.com').trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD?.trim();
  let generated = false;
  if (!password) {
    password = crypto.randomBytes(9).toString('base64url');
    generated = true;
  }
  const { hash, salt } = hashPassword(password);
  // OR IGNORE: another server instance starting at the same moment may have just created it
  const { changes } = await db.run(
    "INSERT OR IGNORE INTO admins (email, name, password_hash, password_salt, role) VALUES (?, ?, ?, ?, 'admin')",
    email, 'Admin', hash, salt
  );
  if (!changes) return null;

  console.log('─'.repeat(56));
  console.log('First admin account created:');
  console.log(`  Email:    ${email}`);
  if (generated) {
    console.log(`  Password: ${password}  (generated — save this, it will not be shown again)`);
  } else {
    console.log('  Password: (set from ADMIN_PASSWORD in .env)');
  }
  console.log('─'.repeat(56));
  return { email, password: generated ? password : undefined };
}

const CATEGORY_SEED = [
  'Bedsheets',
  'Pillow Covers',
  'Cushion Covers',
  'Duvet Covers',
  'Bed Linen',
  'Comforter Covers',
  'Table Linen',
  'Custom Orders',
];

const PRODUCT_SEED = [
  { name: 'Hotel-Grade Bed Linen', category: 'Bedsheets', image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=900&q=80&auto=format&fit=crop', description: 'Crisp, hotel-grade cotton bedsheets finished for a smooth hand-feel and long-lasting colour.', specs: ['200 TC', '100% Cotton', 'OEKO-TEX'], featured: 1 },
  { name: 'Envelope & Oxford Pillow Covers', category: 'Pillow Covers', image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=900&q=80&auto=format&fit=crop', description: 'Envelope and Oxford-style pillow covers in a range of neutral and accent tones.', specs: ['Cotton Percale', 'Set of 2'], featured: 1 },
  { name: 'Textured Cushion Covers', category: 'Cushion Covers', image: 'https://images.unsplash.com/photo-1611489704164-6f73c62bd810?w=900&q=80&auto=format&fit=crop', description: 'Textured weave cushion covers in cream and rust tones for retail and hospitality ranges.', specs: ['Cotton Blend', 'Zip Closure'], featured: 1 },
  { name: 'Duvet & Comforter Covers', category: 'Duvet Covers', image: 'https://images.unsplash.com/photo-1564019472231-4586c552dc27?w=900&q=80&auto=format&fit=crop', description: 'Soft, durable duvet covers finished with corner ties and a hidden button closure.', specs: ['300 TC', 'Sateen Weave'], featured: 1 },
  { name: 'Coordinated Bed Linen Sets', category: 'Bed Linen', image: 'https://images.unsplash.com/photo-1688384452551-5cacc39946e0?w=900&q=80&auto=format&fit=crop', description: 'Coordinated bed linen sets combining fitted sheets, flat sheets and matching pillow covers.', specs: ['Full Set', 'Custom Sizing'], featured: 1 },
  { name: 'Quilted Comforter Covers', category: 'Comforter Covers', image: 'https://images.unsplash.com/photo-1639690222869-1e608aa51f82?w=900&q=80&auto=format&fit=crop', description: 'Quilted comforter covers designed for retail-ready packaging and private labelling.', specs: ['Microfiber', 'Quilted Finish'], featured: 0 },
  { name: 'Natural Table Linen', category: 'Table Linen', image: 'https://images.unsplash.com/photo-1588610992315-5654831ceebd?w=900&q=80&auto=format&fit=crop', description: 'Natural-fibre table linen for hospitality and homeware distributors.', specs: ['Linen Cotton Blend'], featured: 0 },
  { name: 'Custom & Private Label Programmes', category: 'Custom Orders', image: 'https://images.unsplash.com/photo-1596433904500-97b901c5d274?w=900&q=80&auto=format&fit=crop', description: 'Fully custom developments — fabric, fit, labelling and packaging to your specification.', specs: ['Private Label', 'MOQ on Request'], featured: 0 },
];

export async function seedCategoriesAndProducts({ reset = false } = {}) {
  if (reset) {
    await db.batch([['DELETE FROM products'], ['DELETE FROM categories']]);
  }

  // Only seed starter data into an empty database, so categories deleted in the admin don't reappear
  const productCount = (await db.get('SELECT COUNT(*) AS n FROM products')).n;
  const categoryCount = (await db.get('SELECT COUNT(*) AS n FROM categories')).n;
  if (productCount > 0 || categoryCount > 0) return;

  // Fixed slugs + OR IGNORE make this safe when two server instances seed the empty database at
  // the same moment: the second one skips rows the first already added instead of failing or duplicating.
  for (const [i, name] of CATEGORY_SEED.entries()) {
    await db.run('INSERT OR IGNORE INTO categories (slug, name, sort_order) VALUES (?, ?, ?)', slugify(name), name, i);
  }
  for (const [i, p] of PRODUCT_SEED.entries()) {
    await db.run(
      `INSERT OR IGNORE INTO products (slug, name, category_id, description, specs, image_url, featured, status, sort_order)
       VALUES (?, ?, (SELECT id FROM categories WHERE slug = ?), ?, ?, ?, ?, 'active', ?)`,
      slugify(p.name), p.name, slugify(p.category), p.description, JSON.stringify(p.specs), p.image, p.featured, i
    );
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  await initSchema();
  await ensureAdmin();
  await seedCategoriesAndProducts({ reset: process.argv.includes('--reset-products') });
  console.log('Seed complete.');
}
