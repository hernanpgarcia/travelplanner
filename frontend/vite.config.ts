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
    sourcemap: process.env.NODE_ENV !== 'production', // Disable sourcemaps in production
    minify: 'esbuild', // Use esbuild for faster minification
    // Bundle size optimization - simplified for production builds
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    port: 3000,
    host: true,
  },
  // Environment variable prefix
  envPrefix: 'VITE_',
})