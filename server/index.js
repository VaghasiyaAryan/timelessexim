// Bootstrap: load .env (synchronously) before anything that reads process.env is evaluated.
// Static `import`s are hoisted in ESM, so loading env vars has to happen here, in a file with
// no other imports, before dynamically importing the real app module.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const { start } = await import('./app.js');
start();
