import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path is configurable via VITE_BASE_PATH so the repository can be
// renamed (or the site moved to a custom domain) without touching code.
//   GitHub Pages project site : VITE_BASE_PATH=/repository-name/
//   User/org site or domain   : VITE_BASE_PATH=/
// The deploy workflow sets this automatically from the repository name.
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
