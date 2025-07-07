import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(),tailwindcss(),visualizer()],
  build: {
    chunkSizeWarningLimit: 1000 // set to 1000kb or any value that fits your need
  }
})
