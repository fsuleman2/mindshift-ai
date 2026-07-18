import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Base path must match the GitHub Pages repo name (placeholder: mindshift-ai).
// Update REPO_NAME before the first real deploy, or set VITE_BASE_PATH at build time.
const REPO_NAME = 'mindshift-ai'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${REPO_NAME}/` : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
}))
