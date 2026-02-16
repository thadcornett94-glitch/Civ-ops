import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This allows existing code using process.env to work without crashing,
    // though we updated geminiService.ts to use import.meta.env
    'process.env': {}
  }
})