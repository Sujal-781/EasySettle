import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for a React application
// This configuration includes the necessary plugins and can be extended
// with additional settings such as base URL or public directory for deployment.
export default defineConfig({
  plugins: [react()],
  // Uncomment and set the base URL if needed for deployment
  // base: '/your-base-url/',
  // Uncomment and set the public directory if needed
  // publicDir: 'public',
})