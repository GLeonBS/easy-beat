import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminhos relativos: o mesmo build funciona no GitHub Pages (/easy-beat/) e no `npm run preview`.
  base: './',
  plugins: [react()],
})
