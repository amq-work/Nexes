const fs = require('fs');
const path = require('path');

const styleFile = path.join(__dirname, 'src', 'style.css');
let css = fs.readFileSync(styleFile, 'utf-8');

// Fix the CSS class names for alternating timeline
css = css.replace('.timeline-item.left { left: 0; text-align: right; padding-right: 60px; }', '.timeline-item.timeline-left { left: 0; text-align: right; padding-right: 60px; }');
css = css.replace('.timeline-item.right { left: 50%; text-align: left; padding-left: 60px; }', '.timeline-item.timeline-right { left: 50%; text-align: left; padding-left: 60px; }');
css = css.replace('.timeline-item.left .timeline-dot { right: -24px; }', '.timeline-item.timeline-left .timeline-dot { right: -24px; }');
css = css.replace('.timeline-item.right .timeline-dot { left: -24px; }', '.timeline-item.timeline-right .timeline-dot { left: -24px; }');

fs.writeFileSync(styleFile, css, 'utf-8');
console.log('Fixed timeline alternating classes');
