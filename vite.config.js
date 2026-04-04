import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative base path to support both Vercel (root) 
  // and GitHub Pages (/SecureVault/) deployments simultaneously
  base: './',
})