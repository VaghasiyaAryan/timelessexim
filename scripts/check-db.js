// Connectivity check for the configured database: node scripts/check-db.js
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error('TURSO_DATABASE_URL is not set.');
  process.exit(1);
}
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
const rs = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
console.log('Connected to', url);
console.log('Tables:', rs.rows.map((r) => r[0]).join(', ') || '(none yet; created on first request)');
