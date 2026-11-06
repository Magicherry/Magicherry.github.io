import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2022',
    /*
     * Every engine the site supports, not just Safari. With `safari16` alone the
     * minifier rewrote `backdrop-filter` to only its `-webkit-` form - which is
     * correct for Safari 16 and invisible to Chrome, so every glass surface
     * lost its blur in the most common browser.
     */
    cssTarget: ['chrome111', 'edge111', 'firefox115', 'safari16'],
  },
})
