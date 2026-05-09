import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const PLAYGROUND_UPSTREAM_DEFAULT = 'https://play.golang.org/compile';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const upstream = env.PLAYGROUND_UPSTREAM ?? PLAYGROUND_UPSTREAM_DEFAULT;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/compile': {
          target: upstream,
          changeOrigin: true,
          rewrite: () => '',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Origin', new URL(upstream).origin);
            });
          },
        },
      },
    },
  };
});
