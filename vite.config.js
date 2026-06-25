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
