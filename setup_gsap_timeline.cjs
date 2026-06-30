const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexFile, 'utf-8');

html = html.replace('<div class="timeline-line"></div>', '<div class="timeline-line"></div>\n        <div class="timeline-line-fill"></div>');

// Remove reveal-card class so GSAP can control the animation exclusively
html = html.replace(/class="timeline-item reveal-card left"/g, 'class="timeline-item timeline-left"');
html = html.replace(/class="timeline-item reveal-card right"/g, 'class="timeline-item timeline-right"');
html = html.replace('data-reveal-stagger', '');

fs.writeFileSync(indexFile, html, 'utf-8');

const styleFile = path.join(__dirname, 'src', 'style.css');
let css = fs.readFileSync(styleFile, 'utf-8');

const newCSS = `
.timeline-line-fill { position: absolute; top: 0; left: 50%; width: 2px; background: #fff; box-shadow: 0 0 15px rgba(255,255,255,0.8); transform: translateX(-50%); height: 0; z-index: 1; }
.timeline-dot { transition: all 0.4s ease; }
.timeline-dot.active { background: #fff; color: #000; box-shadow: 0 0 30px rgba(255,255,255,0.4); transform: scale(1.1); }
`;

if (!css.includes('.timeline-line-fill')) {
    css += '\n' + newCSS;
}

// Mobile alignment for the fill line
css = css.replace('.timeline-line { left: 24px; transform: none; }', '.timeline-line, .timeline-line-fill { left: 24px; transform: none; }');

fs.writeFileSync(styleFile, css, 'utf-8');

console.log('HTML and CSS updated for timeline GSAP');
