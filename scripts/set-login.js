// Change a team member's sign-in email and/or password directly in the database.
// Useful when an admin is locked out (the admin panel can't change sign-in emails).
//
//   node scripts/set-login.js <current-email> <new-email> <new-password>
//
// Uses the local database file by default; set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to change the live one.
// Signs the account out everywhere, so the old password stops working immediately.
import fs from 'node:fs';

if (!process.env.TURSO_DATABASE_URL && fs.existsSync('.env')) process.loadEnvFile('.env');

const [currentEmail, newEmail, newPassword] = process.argv.slice(2).map((s) => s?.trim());
if (!currentEmail || !newEmail || !newPassword) {
  console.error('Usage: node scripts/set-login.js <current-email> <new-email> <new-password>');
  process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newEmail)) {
  console.error(`"${newEmail}" is not a valid email address.`);
  process.exit(1);
}
if (newPassword.length < 8) {
  console.error('The new password must be at least 8 characters.');
  process.exit(1);
}

const { db, initSchema } = await import('../server/db.js');
const { hashPassword } = await import('../server/auth.js');
await initSchema();

const from = currentEmail.toLowerCase();
const to = newEmail.toLowerCase();
const account = await db.get('SELECT id, role FROM admins WHERE email = ?', from);
if (!account) {
  console.error(`No account with the email ${from}.`);
  process.exit(1);
}
const taken = await db.get('SELECT id FROM admins WHERE email = ? AND id != ?', to, account.id);
if (taken) {
  console.error(`Another account already uses ${to}.`);
  process.exit(1);
}

const { hash, salt } = hashPassword(newPassword);
await db.batch([
  ['UPDATE admins SET email = ?, password_hash = ?, password_salt = ? WHERE id = ?', to, hash, salt, account.id],
  ['DELETE FROM sessions WHERE admin_id = ?', account.id],
]);
console.log(`Updated ${account.role} account: ${from} -> ${to} (password changed, signed out everywhere).`);
