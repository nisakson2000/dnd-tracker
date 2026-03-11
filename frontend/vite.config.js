import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tauri expects a fixed port during development
const host = process.env.TAURI_DEV_HOST || 'localhost'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // prevent vite from obscuring rust errors
  clearScreen: false,
  server: {
    host,
    port: 5173,
    strictPort: true,
    open: false,
    watch: {
      // tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
    proxy: {
      '/characters': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
      '/wiki/search': 'http://localhost:8000',
      '/wiki/categories': 'http://localhost:8000',
      '/wiki/articles': 'http://localhost:8000',
    },
  },
})
