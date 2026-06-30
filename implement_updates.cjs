const fs = require('fs');
const path = require('path');

// 1. Remove "DIGITAL NEXES" giant text from index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
const giantTextRegex = /<div class="cf-giant-text-wrap">\s*<h1 class="cf-giant-text">DIGITAL NEXES<\/h1>\s*<\/div>/g;
indexHtml = indexHtml.replace(giantTextRegex, '');
fs.writeFileSync('index.html', indexHtml);

// 2. Replace #page-loader in all HTML files with a skeleton screen
const skeletonHTML = `<div id="page-loader" class="skeleton-screen" aria-hidden="true">
    <div class="sk-nav">
      <div class="sk-logo"></div>
      <div class="sk-links"></div>
    </div>
    <div class="sk-hero">
      <div class="sk-title"></div>
      <div class="sk-title short"></div>
      <div class="sk-sub"></div>
      <div class="sk-btn"></div>
    </div>
  </div>`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match the old loader. It starts with <div id="page-loader" ...> and ends with </div> before <!-- ══ CUSTOM CURSOR
  // Or we can just use regex to match from <div id="page-loader" to the next </div> that ends it.
  // The old loader looks like:
  // <div id="page-loader" aria-hidden="true">
  //   <div class="loader-brand">...</div>
  //   <div class="loader-bar-wrap">...</div>
  //   <p class="loader-copy">...</p>
  // </div>
  const loaderRegex = /<div id="page-loader" aria-hidden="true">([\s\S]*?)<\/div>\s*<\/div>\s*<p class="loader-copy">.*?<\/p>\s*<\/div>/;
  const altRegex = /<div id="page-loader" aria-hidden="true">([\s\S]*?)<p class="loader-copy">.*?<\/p>\s*<\/div>/;
  const baseRegex = /<div id="page-loader" aria-hidden="true">\s*(?:<div class="loader-brand">[\s\S]*?<\/div>\s*)?(?:<div class="loader-bar-wrap">[\s\S]*?<\/div>\s*)?(?:<p class="loader-copy">.*?<\/p>\s*)?<\/div>/;
  
  content = content.replace(baseRegex, skeletonHTML);
  // Also fix dist folder just in case
  fs.writeFileSync(file, content);
});

// 3. Update style.css to style the skeleton screen
let css = fs.readFileSync('src/style.css', 'utf8');
// Remove old loader CSS
css = css.replace(/\.page-loader \{[\s\S]*?\.loader-copy \{[\s\S]*?\}/, ''); // rough
// Just append the skeleton CSS at the end
css += `
/* ── Skeleton Screen ── */
.skeleton-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #000;
  display: flex;
  flex-direction: column;
  padding: 32px;
  transition: opacity 0.6s ease, visibility 0.6s ease;
}
.skeleton-screen.done {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.sk-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 120px;
}
.sk-logo {
  width: 140px; height: 40px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  animation: skPulse 1.5s infinite ease-in-out;
}
.sk-links {
  width: 400px; height: 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  animation: skPulse 1.5s infinite ease-in-out 0.2s;
}
.sk-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex: 1;
}
.sk-title {
  width: 60%; height: 64px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  animation: skPulse 1.5s infinite ease-in-out 0.1s;
}
.sk-title.short { width: 40%; }
.sk-sub {
  width: 50%; height: 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  margin-top: 16px;
  animation: skPulse 1.5s infinite ease-in-out 0.3s;
}
.sk-btn {
  width: 160px; height: 56px;
  background: rgba(255,255,255,0.08);
  border-radius: 100px;
  margin-top: 32px;
  animation: skPulse 1.5s infinite ease-in-out 0.4s;
}
@keyframes skPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
`;
fs.writeFileSync('src/style.css', css);

// 4. Update main.js to reduce the delay from 900ms to 200ms
let mainJs = fs.readFileSync('src/main.js', 'utf8');
mainJs = mainJs.replace(/setTimeout\(\(\) => loader\?\.classList\.add\('done'\), 900\);/, "setTimeout(() => loader?.classList.add('done'), 200); // reduced for efficiency");
fs.writeFileSync('src/main.js', mainJs);

console.log('Skeleton screens added, delay reduced, and giant text removed.');
