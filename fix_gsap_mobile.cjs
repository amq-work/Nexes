const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, 'src', 'main.js');
let js = fs.readFileSync(jsPath, 'utf-8');

// Wrap the GSAP process pin in a mobile check so it doesn't break our stacked layout
js = js.replace('function initProcessPin() {', 'function initProcessPin() {\n  if (window.innerWidth <= 768) return;');
js = js.replace('const lenis = new Lenis({', 'const lenis = new Lenis({\n  smoothWheel: window.innerWidth > 768,'); // optionally disable lenis on mobile if needed, but let's just disable the process pin for now.

fs.writeFileSync(jsPath, js, 'utf-8');
console.log('GSAP disabled on mobile for process section');
