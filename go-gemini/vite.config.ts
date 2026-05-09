import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/compile': {
        target: 'https://play.golang.org/compile',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/compile/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@monaco-editor/react') || id.includes('monaco-editor')) {
            return 'monaco'
          }
          if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router')) {
            return 'react-vendor'
          }
          if (id.includes('react-markdown') || id.includes('remark-gfm')) {
            return 'markdown'
          }
        }
      }
    }
  }
})
