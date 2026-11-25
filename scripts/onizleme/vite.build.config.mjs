// B-D14: onizleme.html'in uretim derlemesi (node_modules/.cache/onizleme/dist); yalnizca npm run a11y:envelopes kullanir.
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

const root = path.resolve(import.meta.dirname, "../..");
export default defineConfig({
  root,
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': root } },
  build: {
    outDir: path.join(root, 'node_modules/.cache/onizleme/dist'),
    emptyOutDir: true,
    rollupOptions: { input: path.join(root, 'onizleme.html') },
  },
});
