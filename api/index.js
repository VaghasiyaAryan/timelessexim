// Vercel serverless entry: every /api/* request is rewritten here (see vercel.json).
// Environment variables come from the Vercel project settings, not .env.
import { app } from '../server/app.js';

export default app;
