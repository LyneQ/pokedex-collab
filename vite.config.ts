import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['module-needing-require'], // Skip bundling problematic modules
    },
  },
});


