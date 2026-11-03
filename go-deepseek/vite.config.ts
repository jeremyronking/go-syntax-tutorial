import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_UPSTREAM = 'https://play.golang.org/compile';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const upstream = env.PLAYGROUND_UPSTREAM || DEFAULT_UPSTREAM;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Dev proxy: /api/compile -> play.golang.org/compile, form body preserved.
        '/api/compile': {
          target: upstream,
          changeOrigin: true,
          rewrite: () => '',
          headers: { Origin: new URL(upstream).origin },
        },
      },
    },
  };
});
