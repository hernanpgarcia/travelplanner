import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // Allow external connections (for Docker)
    strictPort: true,
    watch: {
      usePolling: true, // Better for Docker on some systems
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Bundle size optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
  // Environment variable prefix
  envPrefix: 'VITE_',
})