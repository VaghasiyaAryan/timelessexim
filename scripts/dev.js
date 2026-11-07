// Runs the API server and the Vite dev server together: npm run dev
import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const procs = ['dev:server', 'dev:client'].map((script) =>
  spawn(npm, ['run', script], { stdio: 'inherit', shell: process.platform === 'win32' })
);

const stop = () => procs.forEach((p) => p.kill());
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
procs.forEach((p) => p.on('exit', (code) => { if (code) { stop(); process.exit(code); } }));
