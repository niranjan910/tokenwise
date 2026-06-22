import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this project under /tokenwise/.
  // Use the repo path for production builds and root for local dev.
  base: command === 'build' ? '/tokenwise/' : '/',
}))
