const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, 'src', 'style.css');
let css = fs.readFileSync(stylePath, 'utf-8');

// Fix Process Pin Wrap
if (!css.includes('.process-pin-wrap { position: static !important;')) {
  css = css.replace(
    '.process-stage-area { height: auto !important; min-height: auto !important; }',
    '.process-pin-wrap { position: static !important; height: auto !important; overflow: visible !important; }\n  .process-stage-area { height: auto !important; min-height: auto !important; }'
  );
}

fs.writeFileSync(stylePath, css, 'utf-8');
console.log('Fixed process pin wrap for mobile');
