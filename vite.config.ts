import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Plusieurs pages : la V1 à la racine, les propositions de design sur /v2/ et /v3/.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        v2: resolve(import.meta.dirname, 'v2/index.html'),
        v3: resolve(import.meta.dirname, 'v3/index.html'),
      },
    },
  },
})
