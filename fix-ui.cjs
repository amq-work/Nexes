const fs = require('fs');

// 1. Fix index.html (Scroll hint & fonts)
let html = fs.readFileSync('index.html', 'utf8');
// Remove scroll hint
html = html.replace(/<div class="hero-scroll-hint"[\s\S]*?<\/div>/, '');
// Change Fonts
html = html.replace(/family=Inter:.*?&family=Sora:.*?&display=swap/, 
  'family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
fs.writeFileSync('index.html', html);

// 2. Fix style.css
let css = fs.readFileSync('src/style.css', 'utf8');
// Change Fonts
css = css.replace(/family=Inter:.*?&family=Sora:.*?&display=swap/, 
  'family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
css = css.replace(/Sora/g, 'Outfit');
css = css.replace(/Inter/g, 'Plus Jakarta Sans');

// Fix Font Weights (decrease)
// In style.css, font weights are usually just 'font-weight: 400;' etc. But headings had no explicit weight except bold by browser.
// Let's explicitly set weights for headings to make them less bold.
css = css.replace(/h1, \.hero-title, \.overview-headline \{([\s\S]*?)\}/, 
  "h1, .hero-title, .overview-headline {$1 font-weight: 600; }");
css = css.replace(/h2, h3, h4, \.section-title \{([\s\S]*?)\}/, 
  "h2, h3, h4, .section-title {$1 font-weight: 500; }");

// Also reduce explicitly bold text if any
css = css.replace(/font-weight:\s*800/g, 'font-weight: 600');
css = css.replace(/font-weight:\s*700/g, 'font-weight: 500');

// Fix Alignment of cards
css = css.replace(/\.why-card \{([\s\S]*?)\}/, 
  ".why-card {$1 display: flex; flex-direction: column; height: 100%; justify-content: flex-start; }");
css = css.replace(/\.industry-card \{([\s\S]*?)\}/, 
  ".industry-card {$1 display: flex; flex-direction: column; height: 100%; justify-content: flex-start; }");

// Team section UI/Layout
css = css.replace(/\.team-grid \{[\s\S]*?\}/, 
  ".team-grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; }");

css = css.replace(/\.team-card \{([\s\S]*?)\}/, 
  ".team-card {$1 width: calc(33.333% - 16px); min-width: 280px; display: flex; flex-direction: column; align-items: center; text-align: center; }");

// Let's add some padding and background to team cards to make them pop and match others if not already there
// Checking team-card current CSS
if (!css.includes('background: var(--glass-bg)') && !css.match(/\.team-card \{[^}]*padding:/)) {
  css = css.replace(/\.team-card \{/, 
    ".team-card { padding: 40px 24px; border-radius: var(--radius-md); background: var(--glass-bg); border: 1px solid var(--border); backdrop-filter: var(--blur); transition: transform 0.4s ease, border-color 0.4s ease;");
}

fs.writeFileSync('src/style.css', css);
console.log("UI Fixed.");
