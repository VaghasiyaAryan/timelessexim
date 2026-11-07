import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PORT || 5175;

  return {
    base: '/',
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': `http://localhost:${apiPort}`,
      },
    },
  };
});
