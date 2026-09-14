import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `${process.env.VITE_BASE_PATH || '/adaemlak'}/`.replace(/\/{2,}/g, '/') : '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3205',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4310,
    host: '0.0.0.0',
    proxy: {
      '/adaemlak/api': {
        target: 'http://127.0.0.1:3205',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/adaemlak\/api/, '/api'),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('.'),
    }
  }
}));
