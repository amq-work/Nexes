const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'pages.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// Ensure the blog slider forces cards to stretch and the footer to stick to the bottom.
css = css.replace(
  '.blog-slider { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }',
  '.blog-slider { display: flex; align-items: stretch; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 8px; }'
);

// Remove any potential flex-grow on the title that might mess up the layout
css = css.replace('.bc-title { font-family: \'Outfit\', sans-serif; font-size: 1.05rem; font-weight: 500; color: #fff; line-height: 1.4; flex-grow: 1; }', '.bc-title { font-family: \'Outfit\', sans-serif; font-size: 1.05rem; font-weight: 500; color: #fff; line-height: 1.4; margin-bottom: 8px; }');

// Make sure bc-footer is always at the bottom
if (!css.includes('.blog-card { padding: 32px 28px; border-radius: var(--radius-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease; display: flex; flex-direction: column; gap: 12px; cursor: pointer; height: 100%; }')) {
  css = css.replace(
    '.blog-card { padding: 32px 28px; border-radius: var(--radius-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease; display: flex; flex-direction: column; gap: 12px; cursor: pointer; }',
    '.blog-card { padding: 32px 28px; border-radius: var(--radius-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease; display: flex; flex-direction: column; gap: 12px; cursor: pointer; height: 100%; }'
  );
}

fs.writeFileSync(cssPath, css, 'utf-8');
console.log('Fixed CSS for slider cards');
