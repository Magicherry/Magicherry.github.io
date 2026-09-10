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
    cssTarget: 'safari16',
    rollupOptions: {
      output: {
        // The motion runtime is the single largest dependency and changes far
        // less often than site content - splitting it keeps content edits from
        // invalidating a sizeable chunk on every deploy.
        manualChunks: (id) =>
          id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')
            ? 'motion'
            : undefined,
      },
    },
  },
})
