const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, 'src', 'style.css');
let css = fs.readFileSync(stylePath, 'utf-8');

// Fix Process Stage Area height on mobile
if (!css.includes('.process-stage-area { height: auto !important; }')) {
  css = css.replace(
    '.process-stage { position: static !important;',
    '.process-stage-area { height: auto !important; min-height: auto !important; }\n  .process-stage { position: static !important;'
  );
}

// Fix Navbar layout and backdrop-filter containment issue on mobile
css = css.replace(
  '.navbar { position: fixed !important; top: 0 !important; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); }',
  '.navbar { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; background: rgba(0,0,0,0.95) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; z-index: 9000 !important; }'
);

// Make sure the logo is properly aligned
css = css.replace(
  '.logo .logo-mark {\n    height: 34px !important;\n    width: auto !important;\n  }',
  '.logo .logo-mark {\n    height: 34px !important;\n    width: auto !important;\n    display: block !important;\n  }'
);

fs.writeFileSync(stylePath, css, 'utf-8');
console.log('Fixed mobile process and header CSS');
