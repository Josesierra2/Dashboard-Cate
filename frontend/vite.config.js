import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, todo lo que empiece por /api se reenvía al backend Spring Boot
// (puerto 8080 por defecto). Así no hace falta configurar CORS en el backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
