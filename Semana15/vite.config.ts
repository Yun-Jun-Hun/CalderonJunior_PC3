import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/universidades": {
        target: "http://universities.hipolabs.com",
        changeOrigin: true,
        rewrite: () => "/search?country=Peru",
      },
    },
  },
})
