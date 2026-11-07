// Vercel build: the React app (public website + /admin) is static; the API runs as a function (api/index.js).
// Output: vercel-out/ (set as outputDirectory in vercel.json)
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const out = 'vercel-out';
fs.rmSync(out, { recursive: true, force: true });

execSync('npx vite build', { stdio: 'inherit' });
fs.cpSync('dist', out, { recursive: true });

console.log(`Vercel output ready in ${out}/`);
