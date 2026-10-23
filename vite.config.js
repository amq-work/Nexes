import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// ── Pages to bundle (CMS excluded intentionally) ──────────────────────────────
const pages = [
  'index',
  'about',
  'services',
  'projects',
  'contact',
  'blog',
  'blog-view',
  'careers',
  'case-studies',
  // Case study pages
  'nestly-for-labors',
  'nexcafe',
  'al-ahad-dental',
  'falah-welfare',
];

const inputMap = Object.fromEntries(
  pages.map(name => [name, resolve(__dirname, `${name}.html`)])
);

function cleanUrlsPlugin() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/') return next();
        const url = req.url.split('?')[0].split('#')[0];
        if (url.startsWith('/insights/')) {
          req.url = '/blog-view.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
          return next();
        }
        if (!url.includes('.')) {
          const filePath = resolve(__dirname, url.slice(1) + '.html');
          if (fs.existsSync(filePath)) {
            req.url = url + '.html';
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',
  plugins: [cleanUrlsPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Increase chunk size warning limit (Three.js is large by design)
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: inputMap,
      output: {
        // Split vendor libraries into separate chunks for better browser caching
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'vendor-three'; // Three.js in its own chunk
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';  // GSAP in its own chunk
          }
          if (id.includes('node_modules/@studio-freight/lenis')) {
            return 'vendor-lenis'; // Lenis in its own chunk
          }
        },
      },
    },
  },
  server: {
    port: 4200,
    open: true,
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
      '/cms': 'http://localhost:3001'
    }
  },
});
