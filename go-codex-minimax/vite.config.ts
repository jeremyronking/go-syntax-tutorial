import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const PLAYGROUND_UPSTREAM = process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/compile': {
        target: PLAYGROUND_UPSTREAM,
        changeOrigin: true,
        secure: true,
        rewrite: () => '',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            proxyReq.setHeader('Accept', 'application/json');
          });
        },
      },
    },
  },
  preview: {
    port: 5173,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ['monaco-editor', '@monaco-editor/react'],
          react: ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
});
