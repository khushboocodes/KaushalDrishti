import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function syncToFrontend() {
  return {
    name: 'sync-to-frontend',
    closeBundle() {
      try {
        const src = path.resolve(__dirname, 'dist');
        const dest = path.resolve(__dirname, '../frontend');
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      } catch {
        // quiet fallback
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), syncToFrontend()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
    },
    server: {
      proxy: {
        '/api': 'http://localhost:8000',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
