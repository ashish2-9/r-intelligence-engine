import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// =============================================================================
// vite.config.js — FIXED
//
// KEY FIX: proxy target uses 'api' (Docker service name) inside Docker,
// but falls back to localhost when running the frontend standalone.
// The proxy rewrites /api/* → http://api:8000/* (container-to-container).
// The browser only ever talks to localhost:5173 — no CORS issue.
// =============================================================================

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Bind 0.0.0.0 — required for Docker port mapping
    port: 5173,
    watch: {
      usePolling: true, // Required for HMR inside Docker Desktop (macOS/Windows)
      interval: 300,
    },
    proxy: {
      // All /api/* calls go through Vite → forwarded to FastAPI container
      // 'api' resolves inside Docker network; use 'localhost' if running standalone
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('[proxy error]', err.message))
        }
      },
      // Health check also proxied
      '/health': {
        target: process.env.VITE_API_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})