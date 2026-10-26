import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // A fixed port so this never collides with other local projects on Vite's default 5173.
  server: { port: 4321, strictPort: true },
  preview: { port: 4322, strictPort: true },
  build: {
    rollupOptions: {
      output: {
        // Split vendor code from site code so content updates don't bust the framework cache.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'router'
          if (/node_modules[/](react|react-dom|scheduler)[/]/.test(id)) return 'react'
        },
      },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
