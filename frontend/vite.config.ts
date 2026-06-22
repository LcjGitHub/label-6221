import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** @see https://vitejs.dev/config/ */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3101,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
