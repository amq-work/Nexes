import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
const inputMap = {};
htmlFiles.forEach(file => {
  const name = file.replace('.html', '');
  inputMap[name] = resolve(__dirname, file);
});

function cleanUrlsPlugin() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/') return next();
        const url = req.url.split('?')[0].split('#')[0];
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
  base: './',
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
  },
});
