const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Wrap with <main>
if (!html.includes('<main>')) {
  // Find where the hero section starts
  const heroStart = html.indexOf('<section class="hero" id="hero">');
  // Find where the footer starts
  const footerStart = html.indexOf('<footer class="footer"');
  
  if (heroStart !== -1 && footerStart !== -1) {
    const beforeHero = html.substring(0, heroStart);
    const content = html.substring(heroStart, footerStart);
    const afterFooter = html.substring(footerStart);
    html = beforeHero + '<main>\n\n  ' + content + '\n</main>\n\n  ' + afterFooter;
  }
}

// Convert some divs to articles for cards to improve semantics
const classesToArticle = ['vm-card', 'svc-card', 'process-stage', 'why-card', 'project-item', 'team-card', 'roadmap-card', 'testimonial-card'];

for (const cls of classesToArticle) {
  // Regex to match <div class="some-class cls">...
  // Since we only want to change the tag to <article>, it's easier to use a global replace.
  // Note: we can't just blindly replace closing divs, we have to match them properly.
  // Actually, replacing <div class="project-item"... with <article class="project-item"... is easy, 
  // but replacing the corresponding </div> is hard without a proper parser. 
  // Let's just use regex for simple ones, or just leave them if they are too complex.
}

// Since I have node, I can use a simple regex replacement for the opening tag, 
// BUT closing tag requires balancing. 
// A safer way is to just replace specific known blocks.

fs.writeFileSync('index.html', html);
console.log("HTML main wrapper added.");
