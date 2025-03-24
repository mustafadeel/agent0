import path from 'path'
import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.slice(-3) === '.md') {
          return `export default ${JSON.stringify(code)};`
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envPrefix: 'AUTH0_',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true,
  },
})
