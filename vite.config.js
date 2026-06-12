import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base: './' — относительные пути к ассетам, чтобы сайт работал и локально
// в Capacitor (http://localhost/), и на GitHub Pages в подпапке (/partseeker/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
