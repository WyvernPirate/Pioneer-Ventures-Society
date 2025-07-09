import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Set base path for admin subdomain
  base: './', // Use relative paths for better subdomain/subfolder deployment
  build: {
    rollupOptions: {
      input: {
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
    outDir: 'dist-admin',
    // Ensure assets are referenced correctly
    assetsDir: 'assets',
  },
  // Define environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
})