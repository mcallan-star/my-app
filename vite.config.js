//Role: glue between Vite + React + Tailwind so you get a lightning-fast dev server and production build.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // 👈 this does all the Tailwind work
  ],
})
