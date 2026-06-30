const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'blog.html');
let html = fs.readFileSync(file, 'utf-8');

const startMarker = '<!-- FEATURED ARTICLE -->';
const endMarker = '<section class="section cta-section" id="blog-cta">';

const featuredCards = [
  { href: "/blog-integrated-studio", cat: "Studio Advantage", title: "Integrated Studio Model", excerpt: "Design, development, marketing, and strategy under one roof. No handoff friction — your brand and product stay coherent from day one." },
  { href: "/blog-rapid-delivery", cat: "Studio Advantage", title: "Rapid, Structured Delivery", excerpt: "We move fast without breaking things. Every project runs on a clear timeline with milestones, demos, and accountability checkpoints built in." },
  { href: "/blog-results-obsessed", cat: "Studio Advantage", title: "Results-Obsessed", excerpt: "We don't ship and disappear. Every decision is tied to measurable business outcomes — traffic, conversion, retention, or revenue." },
  { href: "/blog-client-first", cat: "Studio Advantage", title: "Client-First Culture", excerpt: "Your success is our success. We act as a genuine partner — transparent about risks, proactive with solutions, and invested in your long-term growth." },
  { href: "/blog-data-led", cat: "Studio Advantage", title: "Data-Led Decisions", excerpt: "Intuition is validated with data. From UX research to campaign analytics, we let the numbers guide every creative and strategic call." },
  { href: "/blog-proven-industry", cat: "Studio Advantage", title: "Proven Across Industries", excerpt: "Healthcare, tech, real estate, education, e-commerce, and more. Our cross-sector experience means tested solutions, not costly experiments." }
];

const latestCards = [
  { href: "/blog-technical-seo", catMeta: "SEO", catData: "seo technology", date: "June 2024", title: "The 10 Technical SEO Fixes That Deliver the Fastest Results", excerpt: "Not all SEO tasks are created equal. These 10 technical fixes consistently deliver the fastest ranking improvements — ranked by impact and implementation difficulty.", read: "6 min" },
  { href: "/blog-design-systems", catMeta: "Design", catData: "design", date: "May 2024", title: "Design Systems: Why Every Growing Business Needs One", excerpt: "A design system is not just a Figma component library. It is the single most important investment for maintaining brand consistency as your team and product scale.", read: "7 min" },
  { href: "/blog-using-ai", catMeta: "AI", catData: "ai technology", date: "May 2024", title: "How We're Using AI to Accelerate Client Project Delivery", excerpt: "AI tools are transforming how we work — from research and wireframing to code generation and content optimization. Here's our honest take on what actually works.", read: "9 min" },
  { href: "/blog-b2b-funnel", catMeta: "Marketing", catData: "marketing business", date: "April 2024", title: "The B2B Digital Marketing Funnel: A Practical Guide", excerpt: "Most B2B marketing fails because it treats the purchase decision as a single moment rather than a multi-stage journey. Here's how to build a funnel that actually converts.", read: "11 min" },
  { href: "/blog-custom-software", catMeta: "Development", catData: "development technology", date: "April 2024", title: "When to Build Custom Software vs. Use Off-the-Shelf Solutions", excerpt: "Custom software is powerful — but expensive and time-consuming. Off-the-shelf tools are fast — but constraining. Here's the framework we use to help clients make the right decision.", read: "8 min" },
  { href: "/blog-presence-audit", catMeta: "Business Growth", catData: "business", date: "March 2024", title: "Digital Presence Audit: 15 Things to Fix on Your Website Today", excerpt: "Most business websites are leaving significant revenue on the table due to avoidable mistakes. This checklist covers the 15 highest-impact improvements across design, copy, SEO, and performance.", read: "12 min" },
  { href: "/blog-local-seo", catMeta: "SEO", catData: "seo marketing", date: "March 2024", title: "Local SEO for Service Businesses: The Complete 2024 Playbook", excerpt: "Local search is the highest-intent traffic channel for service businesses. This playbook covers everything you need to dominate local search results in your area.", read: "15 min" },
  { href: "/blog-dev-handoff", catMeta: "Design", catData: "design development", date: "February 2024", title: "The Designer-Developer Handoff: How to Eliminate Rework", excerpt: "Miscommunication between designers and developers is one of the most expensive inefficiencies in digital product development. Here's our structured handoff process.", read: "7 min" },
  { href: "/blog-budget", catMeta: "Business Growth", catData: "ai technology business", date: "February 2024", title: "How to Budget for Your Next Digital Transformation", excerpt: "Digital transformation projects frequently go over budget because of poor initial scoping. Here is how we accurately project costs and timelines for complex builds.", read: "8 min" }
];

let newContent = `  <!-- FEATURED ARTICLE -->
  <section class="section" id="blog-featured" style="padding-top: 24px;">
    <div class="container">
      <h2 style="margin-bottom: 24px; font-size: 2rem; color: #fff;">Featured Insights</h2>
      <div class="blog-grid" data-reveal-stagger="" style="margin-bottom: 64px;">
`;

featuredCards.forEach(c => {
  newContent += `        <a href="${c.href}" class="blog-card reveal-card" data-category="featured" style="text-decoration: none; display: flex;">
          <div class="bc-meta"><span class="bc-cat">${c.cat}</span></div>
          <h3 class="bc-title">${c.title}</h3>
          <p class="bc-excerpt">${c.excerpt}</p>
          <div class="bc-footer" style="margin-top: auto;"><span class="bc-link">Read Article →</span></div>
        </a>\n`;
});

newContent += `      </div>

      <h2 style="margin-bottom: 24px; font-size: 2rem; color: #fff;">Latest Articles</h2>

      <!-- ARTICLE GRID -->
      <div class="blog-grid" id="blog-grid" data-reveal-stagger="" style="margin-bottom: 64px;">
`;

latestCards.forEach(c => {
  newContent += `        <a href="${c.href}" class="blog-card reveal-card" data-category="${c.catData}" style="text-decoration: none; display: flex;">
          <div class="bc-meta"><span class="bc-cat">${c.catMeta}</span><span class="bc-date">${c.date}</span></div>
          <h3 class="bc-title">${c.title}</h3>
          <p class="bc-excerpt">${c.excerpt}</p>
          <div class="bc-footer" style="margin-top: auto;"><span class="bc-read">${c.read}</span><span class="bc-link">Read Article →</span></div>
        </a>\n`;
});

newContent += `      </div>
    </div>
  </section>

  `;

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + newContent + html.substring(endIndex);
  fs.writeFileSync(file, html, 'utf-8');
  console.log('Rebuilt blog grids successfully!');
} else {
  console.log('Markers not found!', { startIndex, endIndex });
}
