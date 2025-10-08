import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Позволяет доступ с любого хоста
    port: 4201,
    strictPort: true,
  },
  preview: {
    host: true, // Позволяет доступ с любого хоста в режиме preview
    port: 4201,
    strictPort: true,
    allowedHosts: ['admin.steamtrust.ru', 'localhost', '127.0.0.1'],
  }
})
