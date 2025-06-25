import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const apiKey = process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // This makes process.env.API_KEY available in your client-side code.
      // Vercel will set process.env.API_KEY during the build from your environment variables.
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    server: {
      port: 3000, // Optional: specify dev server port
    },
    build: {
      outDir: 'dist', // Optional: specify output directory
    },
  };
});
