const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'blog.html');
let html = fs.readFileSync(file, 'utf-8');

// The HTML is currently broken. Let's fix it by finding the broken blocks.
// They start with <article class="blog-card reveal-card" and end with </a>
// and have an inner <a href="/blog-something">Read Article →</a>

html = html.replace(
  /<article class="blog-card reveal-card" data-category="seo technology">([\s\S]*?)<a href="\/blog-technical-seo">Read Article →<\/a><\/span><\/div>\s*<\/a>/g,
  '<a href="/blog-technical-seo" class="blog-card reveal-card" data-category="seo technology" style="text-decoration: none;">$1Read Article →</span></div></a>'
);

html = html.replace(
  /<article class="blog-card reveal-card" data-category="design">([\s\S]*?)<a href="\/blog-design-systems">Read Article →<\/a><\/span><\/div>\s*<\/a>/g,
  '<a href="/blog-design-systems" class="blog-card reveal-card" data-category="design" style="text-decoration: none;">$1Read Article →</span></div></a>'
);

html = html.replace(
  /<article class="blog-card reveal-card" data-category="ai technology">([\s\S]*?)<a href="\/blog-using-ai">Read Article →<\/a><\/span><\/div>\s*<\/a>/g,
  '<a href="/blog-using-ai" class="blog-card reveal-card" data-category="ai technology" style="text-decoration: none;">$1Read Article →</span></div></a>'
);

html = html.replace(
  /<article class="blog-card reveal-card" data-category="marketing business">([\s\S]*?)<a href="\/blog-b2b-funnel">Read Article →<\/a><\/span><\/div>\s*<\/a>/g,
  '<a href="/blog-b2b-funnel" class="blog-card reveal-card" data-category="marketing business" style="text-decoration: none;">$1Read Article →</span></div></a>'
);

html = html.replace(
  /<article class="blog-card reveal-card" data-category="development technology">([\s\S]*?)<a href="\/blog-custom-software">Read Article →<\/a><\/span><\/div>\s*<\/a>/g,
  '<a href="/blog-custom-software" class="blog-card reveal-card" data-category="development technology" style="text-decoration: none;">$1Read Article →</span></div></a>'
);

html = html.replace(
  /<article class="blog-card reveal-card" data-category="business">([\s\S]*?)<a href="\/blog-presence-audit">Read Article →<\/a><\/span><\/div>\s*<\/a>/g,
  '<a href="/blog-presence-audit" class="blog-card reveal-card" data-category="business" style="text-decoration: none;">$1Read Article →</span></div></a>'
);

fs.writeFileSync(file, html, 'utf-8');
console.log('Fixed broken HTML in blog.html');
