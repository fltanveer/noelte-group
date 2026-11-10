import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        audit: resolve(__dirname, 'index.html'),
        proposal: resolve(__dirname, 'proposal/index.html'),
      },
    },
  },
  resolve: { dedupe: ['react', 'react-dom'] },
})
