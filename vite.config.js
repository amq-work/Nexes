import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Dynamically grab all HTML files for the build input
const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
const inputMap = {};
htmlFiles.forEach(file => {
  const name = file.replace('.html', '');
  inputMap[name] = resolve(__dirname, file);
});

// Plugin to serve clean URLs during development and generate directories for production
function cleanUrlsPlugin() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/') return next();
        const url = req.url.split('?')[0].split('#')[0];
        // If url doesn't have an extension, try appending .html
        if (!url.includes('.')) {
          const filePath = resolve(__dirname, url.slice(1) + '.html');
          if (fs.existsSync(filePath)) {
            req.url = url + '.html';
          }
        }
        next();
      });
    },
    closeBundle() {
      // After build, move about.html to about/index.html
      const dist = resolve(__dirname, 'dist');
      if (!fs.existsSync(dist)) return;
      const distFiles = fs.readdirSync(dist);
      distFiles.forEach(file => {
        if (file.endsWith('.html') && file !== 'index.html' && file !== '404.html') {
          const name = file.replace('.html', '');
          const dir = resolve(dist, name);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir);
          fs.renameSync(resolve(dist, file), resolve(dir, 'index.html'));
        }
      });
    }
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [cleanUrlsPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: inputMap,
    },
  },
  server: {
    port: 4200,
    open: true,
  },
});
