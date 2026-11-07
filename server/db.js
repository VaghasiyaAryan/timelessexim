import { createClient } from '@libsql/client';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Production (e.g. Vercel): a hosted Turso database via TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
// Local development: the SQLite file at DATABASE_FILE.
// String.trim() also strips a stray BOM, which Windows shells can prepend to piped env values
const env = (name) => process.env[name]?.trim() || undefined;

function connect() {
  if (env('TURSO_DATABASE_URL')) {
    return createClient({ url: env('TURSO_DATABASE_URL'), authToken: env('TURSO_AUTH_TOKEN') });
  }
  const dbFile = path.join(root, process.env.DATABASE_FILE || 'data/timeless-exim.db');
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  return createClient({ url: pathToFileURL(dbFile).href });
}

const client = connect();

const toObject = (rs, row) => Object.fromEntries(rs.columns.map((c, i) => [c, row[i]]));
const stmt = (sql, args) => ({ sql, args: args.map((a) => (a === undefined ? null : a)) });

// A dropped connection or brief outage on the hosted database, as opposed to a problem with the SQL itself
const isTransient = (err) =>
  /fetch failed|ECONNRESET|ETIMEDOUT|ECONNREFUSED|EAI_AGAIN|socket hang up|network|timed? ?out|50[234]/i.test(
    `${err?.message} ${err?.cause?.message ?? ''} ${err?.cause?.code ?? ''}`
  );

// Reads are retried once after a transient failure. Writes are not: a write that actually landed
// before the connection dropped would be applied twice (e.g. a duplicate enquiry).
async function read(statement) {
  try {
    return await client.execute(statement);
  } catch (err) {
    if (!isTransient(err)) throw err;
    await new Promise((r) => setTimeout(r, 250));
    return client.execute(statement);
  }
}

// Small async query helpers: db.get / db.all / db.run take SQL plus positional `?` args.
export const db = {
  async get(sql, ...args) {
    const rs = await read(stmt(sql, args));
    return rs.rows.length ? toObject(rs, rs.rows[0]) : undefined;
  },
  async all(sql, ...args) {
    const rs = await read(stmt(sql, args));
    return rs.rows.map((row) => toObject(rs, row));
  },
  async run(sql, ...args) {
    const rs = await client.execute(stmt(sql, args));
    return { changes: rs.rowsAffected, lastInsertRowid: rs.lastInsertRowid === undefined ? undefined : Number(rs.lastInsertRowid) };
  },
  // Runs several [sql, ...args] statements in one transaction
  async batch(statements) {
    await client.batch(statements.map(([sql, ...args]) => stmt(sql, args)), 'write');
  },
};

export async function initSchema() {
  await client.executeMultiple(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'employee',
      department TEXT NOT NULL DEFAULT '',
      permissions TEXT NOT NULL DEFAULT '[]',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      admin_id INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      description TEXT NOT NULL DEFAULT '',
      specs TEXT NOT NULL DEFAULT '[]',
      image_url TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL,
      business_type TEXT NOT NULL DEFAULT '',
      products TEXT NOT NULL DEFAULT '',
      quantity TEXT NOT NULL DEFAULT '',
      timeline TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Databases created before team accounts existed: add the new columns. Accounts that already
  // existed were full admins, so they keep that role.
  // Two serverless instances can run this at the same moment, so "already added" is not an error.
  const cols = (await db.all('PRAGMA table_info(admins)')).map((c) => c.name);
  const ignoreDuplicate = (err) => {
    if (!/duplicate column/i.test(String(err?.message))) throw err;
  };
  if (!cols.includes('role')) {
    await db
      .batch([
        ["ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'employee'"],
        ["UPDATE admins SET role = 'admin'"],
      ])
      .catch(ignoreDuplicate);
  }
  if (!cols.includes('department')) await db.run("ALTER TABLE admins ADD COLUMN department TEXT NOT NULL DEFAULT ''").catch(ignoreDuplicate);
  if (!cols.includes('permissions')) await db.run("ALTER TABLE admins ADD COLUMN permissions TEXT NOT NULL DEFAULT '[]'").catch(ignoreDuplicate);
  if (!cols.includes('active')) await db.run('ALTER TABLE admins ADD COLUMN active INTEGER NOT NULL DEFAULT 1').catch(ignoreDuplicate);
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

export async function uniqueSlug(table, base) {
  let slug = base;
  let i = 2;
  while (await db.get(`SELECT 1 FROM ${table} WHERE slug = ?`, slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// Wraps an async Express handler so a rejected promise reaches the error handler (Express 4)
export const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
