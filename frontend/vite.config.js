import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7286', // <--- REPLACE THIS with your port from launchSettings.json
        changeOrigin: true,
        secure: false
      }
    }
  }
})