import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // 🚨 MUST
    minify: 'esbuild', // ensure proper minification
  },
})