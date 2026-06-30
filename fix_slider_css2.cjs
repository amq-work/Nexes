const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'pages.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// Ensure .blog-card has text-decoration: none and color: inherit since it is an anchor tag now
if (!css.includes('text-decoration: none; color: inherit;')) {
  css = css.replace(
    '.blog-card { padding: 32px 28px; border-radius: var(--radius-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease; display: flex; flex-direction: column; gap: 12px; cursor: pointer; height: 100%; }',
    '.blog-card { padding: 32px 28px; border-radius: var(--radius-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease; display: flex; flex-direction: column; gap: 12px; cursor: pointer; height: 100%; text-decoration: none; color: inherit; }'
  );
  fs.writeFileSync(cssPath, css, 'utf-8');
  console.log('Added text-decoration: none and color: inherit to .blog-card in pages.css');
}

// Ensure the slider layout is perfectly clean
css = css.replace(
  '.blog-slider > .blog-card { flex: 0 0 calc(33.333% - 10.66px); scroll-snap-align: start; }',
  '.blog-slider > .blog-card { flex: 0 0 calc(33.333333% - 10.67px); scroll-snap-align: start; }'
);
fs.writeFileSync(cssPath, css, 'utf-8');
