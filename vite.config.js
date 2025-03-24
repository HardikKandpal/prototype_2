import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './src', // Ensure this points to your source directory
  build: {
    outDir: '../build', // Ensure this points to your desired output directory
    rollupOptions: {
      input: '/src/main.tsx', // Ensure this matches your entry file
    },
  },
});