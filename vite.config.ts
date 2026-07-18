import { defineConfig } from 'vitest/config'
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
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/services/**/*.ts',
        'src/utils/**/*.ts',
        'src/constants/sentiment.ts',
      ],
      exclude: ['src/services/aiService.ts', 'src/services/storageService.ts'],
    },
  },
}))
