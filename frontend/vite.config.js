import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',      // bind to all interfaces — LAN devices can connect
    port: 5173,
    // Note: No proxy needed for party (connects directly to sidecar on 8787)
    // or updates (uses GitHub API directly). Wiki and character data use Tauri invoke.
  },
})
