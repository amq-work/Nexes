const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'blog.html');
let html = fs.readFileSync(file, 'utf-8');

// The blog-featured-card needs an a tag wrap or replacement.
html = html.replace(
  /<article class="blog-featured-card reveal-card" data-category="design uiux">/,
  '<a href="/blog-design-systems" class="blog-featured-card reveal-card" data-category="design uiux" style="text-decoration: none; display: block; cursor: pointer;">'
);
html = html.replace(
  /<div class="bfc-footer"><div class="bfc-author"><div class="bfc-avatar">DN<\/div><span>Digital Nexes Team<\/span><\/div><span class="bfc-link">Read Article →<\/span><\/div>\s*<\/article>/g,
  '<div class="bfc-footer"><div class="bfc-author"><div class="bfc-avatar">DN</div><span>Digital Nexes Team</span></div><span class="bfc-link">Read Article →</span></div>\n      </a>'
);

// Map of card titles to their respective links
const linkMap = {
  "The 10 Technical SEO Fixes That Deliver the Fastest Results": "/blog-technical-seo",
  "Design Systems: Why Every Growing Business Needs One": "/blog-design-systems",
  "How We're Using AI to Accelerate Client Project Delivery": "/blog-using-ai",
  "The B2B Digital Marketing Funnel: A Practical Guide": "/blog-b2b-funnel",
  "When to Build Custom Software vs. Use Off-the-Shelf Solutions": "/blog-custom-software",
  "Digital Presence Audit: 15 Things to Fix on Your Website Today": "/blog-presence-audit"
};

for (const [title, link] of Object.entries(linkMap)) {
  // Regex to find the article wrapping this title
  const regexStr = `<article class="blog-card reveal-card"([^>]*)>([\\s\\S]*?<h3 class="bc-title">${title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}<\\/h3>[\\s\\S]*?)<\\/article>`;
  const regex = new RegExp(regexStr, 'g');
  
  html = html.replace(regex, (match, p1, p2) => {
    // Also remove the nested <a> we added before, to avoid nested links
    let innerContent = p2.replace(/<span class="bc-link"><a href="[^"]+">Read Article →<\/a><\/span>/, '<span class="bc-link">Read Article →</span>');
    return `<a href="${link}" class="blog-card reveal-card"${p1} style="text-decoration: none;">${innerContent}</a>`;
  });
}

fs.writeFileSync(file, html, 'utf-8');
console.log('Fixed blog card links in blog.html');
