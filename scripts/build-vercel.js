// Vercel build: public site at the root, admin SPA under /admin. The API runs as a function (api/index.js).
// Output: vercel-out/ (set as outputDirectory in vercel.json)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const out = 'vercel-out';
fs.rmSync(out, { recursive: true, force: true });

execSync('npx vite build', { stdio: 'inherit' });

fs.cpSync('legacy-static', out, {
  recursive: true,
  filter: (src) => path.basename(src) !== 'serve.cjs',
});
fs.cpSync('dist', path.join(out, 'admin'), { recursive: true });

console.log(`Vercel output ready in ${out}/`);
