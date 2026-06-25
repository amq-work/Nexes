const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// Update Google Fonts import
css = css.replace(/@import url\('.*?'\);/, 
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap');");

// Replace all Space Grotesk with Inter
css = css.replace(/Space Grotesk/g, 'Inter');

// Replace all Syne with Inter initially
css = css.replace(/Syne/g, 'Inter');

// Now, properly fix the global heading selectors
css = css.replace(/h1, h2, h3, h4 \{ font-family: 'Inter', sans-serif; line-height: 1\.05; letter-spacing: -0\.03em; \}/, 
  "h1, .hero-title, .overview-headline { font-family: 'Sora', sans-serif; line-height: 1.05; letter-spacing: -0.03em; }\nh2, h3, h4, .section-title { font-family: 'Inter', sans-serif; line-height: 1.05; letter-spacing: -0.03em; }");

// Make sure any .hero-title explicit declarations use Sora
css = css.replace(/\.hero-title \{\n\s+font-family: 'Inter', sans-serif;/g, ".hero-title {\n  font-family: 'Sora', sans-serif;");

fs.writeFileSync('src/style.css', css);
console.log("CSS Updated successfully.");
