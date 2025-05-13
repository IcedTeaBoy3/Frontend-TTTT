import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        "./index.html",
      ],
      theme: {
        extend: {},
      },
    }),
  ],
  server: {
    port: 4000,
    open: true,
    proxy: {
      target: 'http://localhost:5001',
    }
  }
})
