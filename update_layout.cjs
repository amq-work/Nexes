const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'blog.html');
let html = fs.readFileSync(file, 'utf-8');

// 1. Remove the CATEGORY FILTER from its current position
const filterStart = html.indexOf('<!-- CATEGORY FILTER -->');
const filterEnd = html.indexOf('</section>', filterStart) + 10;
const filterBlock = html.substring(filterStart, filterEnd);

html = html.substring(0, filterStart) + html.substring(filterEnd);

// 2. We'll reconstruct everything from <!-- FEATURED ARTICLE --> down to </section> before CTA
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
  { href: "/blog-budget", catMeta: "Business Growth", catData: "ai technology business", date: "February 2024", title: "How to Budget for Your Next Digital Transformation", excerpt: "Digital transformation projects frequently go over budget because of poor initial scoping. Here is how we accurately project costs and timelines for complex builds.", read: "8 min" },
  // 3 NEW BLOGS
  { href: "/blog-page-speed", catMeta: "Development", catData: "development technology", date: "January 2024", title: "How Page Speed Directly Impacts Your Conversion Rate", excerpt: "A one-second delay in page response can result in a 7% reduction in conversions. Here are the most effective ways to optimize web performance.", read: "6 min" },
  { href: "/blog-color-psychology", catMeta: "Design", catData: "design", date: "January 2024", title: "The Psychology of Color in UI Design", excerpt: "Color is a powerful communication tool. We break down how different color palettes influence user perception, trust, and ultimately, behavior.", read: "8 min" },
  { href: "/blog-ecommerce-architecture", catMeta: "Technology", catData: "technology development", date: "December 2023", title: "Building a Scalable E-commerce Architecture", excerpt: "Scaling an e-commerce platform requires more than just adding servers. It demands an architecture built to handle sudden traffic spikes and complex integrations.", read: "11 min" }
];

let newContent = `  <!-- FEATURED ARTICLE -->
  <section class="section" id="blog-featured" style="padding-top: 24px;">
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
        <h2 style="font-size: 2rem; color: #fff; margin: 0;">Featured Insights</h2>
        <div class="slider-nav" style="display: flex; gap: 12px;">
          <button class="slider-btn" onclick="document.getElementById('featured-slider').scrollBy({ left: -document.getElementById('featured-slider').offsetWidth / 3, behavior: 'smooth' })">←</button>
          <button class="slider-btn" onclick="document.getElementById('featured-slider').scrollBy({ left: document.getElementById('featured-slider').offsetWidth / 3, behavior: 'smooth' })">→</button>
        </div>
      </div>
      
      <div class="blog-slider-wrapper" style="margin-bottom: 64px;">
        <div class="blog-slider" id="featured-slider" data-reveal-stagger="">
`;

featuredCards.forEach(c => {
  newContent += `          <a href="${c.href}" class="blog-card reveal-card" data-category="featured" style="text-decoration: none;">
            <div class="bc-meta"><span class="bc-cat">${c.cat}</span></div>
            <h3 class="bc-title">${c.title}</h3>
            <p class="bc-excerpt">${c.excerpt}</p>
            <div class="bc-footer"><span class="bc-link">Read Article →</span></div>
          </a>\n`;
});

newContent += `        </div>
      </div>

      <h2 style="margin-bottom: 24px; font-size: 2rem; color: #fff; margin-top: 64px;">Latest Articles</h2>

${filterBlock}

      <!-- ARTICLE GRID -->
      <div class="blog-grid" id="blog-grid" data-reveal-stagger="" style="margin-bottom: 64px;">
`;

latestCards.forEach(c => {
  newContent += `        <a href="${c.href}" class="blog-card reveal-card" data-category="${c.catData}" style="text-decoration: none;">
          <div class="bc-meta"><span class="bc-cat">${c.catMeta}</span><span class="bc-date">${c.date}</span></div>
          <h3 class="bc-title">${c.title}</h3>
          <p class="bc-excerpt">${c.excerpt}</p>
          <div class="bc-footer"><span class="bc-read">${c.read}</span><span class="bc-link">Read Article →</span></div>
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
  console.log('Updated blog.html with slider and new alignment!');
} else {
  console.log('Markers not found!');
}

// Write the CSS for the slider to src/pages.css
let pagesCssPath = path.join(__dirname, 'src/pages.css');
let pagesCss = fs.readFileSync(pagesCssPath, 'utf-8');
if (!pagesCss.includes('.blog-slider')) {
  const cssInjection = `
/* --- Blog Slider --- */
.blog-slider-wrapper { position: relative; width: 100%; }
.blog-slider { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.blog-slider::-webkit-scrollbar { display: none; }
.blog-slider > .blog-card { flex: 0 0 calc(33.333% - 10.66px); scroll-snap-align: start; }
@media (max-width: 1000px) { .blog-slider > .blog-card { flex: 0 0 calc(50% - 8px); } }
@media (max-width: 600px) { .blog-slider > .blog-card { flex: 0 0 100%; } }
.slider-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
.slider-btn:hover { background: rgba(255,255,255,0.15); }
`;
  pagesCss = pagesCss.replace('.blog-grid {', cssInjection + '\n.blog-grid {');
  fs.writeFileSync(pagesCssPath, pagesCss, 'utf-8');
  console.log('Injected slider CSS into pages.css');
}

// Create the 3 new HTML files
const newBlogs = [
  { file: 'blog-page-speed.html', title: 'How Page Speed Directly Impacts Your Conversion Rate', cat: 'Development', date: 'January 2024' },
  { file: 'blog-color-psychology.html', title: 'The Psychology of Color in UI Design', cat: 'Design', date: 'January 2024' },
  { file: 'blog-ecommerce-architecture.html', title: 'Building a Scalable E-commerce Architecture', cat: 'Technology', date: 'December 2023' }
];

const headMatch = html.match(/([\s\S]*?<main>)/);
const headAndNav = headMatch ? headMatch[1] : '';
const footerMatch = html.match(/(<\/main>[\s\S]*)/);
const footerAndScripts = footerMatch ? footerMatch[1] : '';

newBlogs.forEach(blog => {
    const filePath = path.join(__dirname, blog.file);
    const articleHtml = `
  <!-- ARTICLE HERO -->
  <section class="page-hero" style="min-height: 50vh; display: flex; align-items: center; justify-content: center; padding-top: 120px;">
    <div class="hero-glass-grid"></div>
    <div class="container page-hero-inner" style="max-width: 800px; text-align: left;">
      <p class="eyebrow reveal-hero">${blog.cat} · ${blog.date}</p>
      <h1 class="page-hero-title reveal-hero scramble" style="font-size: 3.5rem; text-align: left; margin-bottom: 24px;">${blog.title}</h1>
      <div class="article-meta reveal-hero" style="display: flex; align-items: center; gap: 16px; color: var(--grey-600);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">DN</div>
          <span>Digital Nexes Team</span>
        </div>
        <span>·</span>
        <span>5 min read</span>
      </div>
    </div>
  </section>

  <!-- ARTICLE CONTENT -->
  <section class="section" style="padding-top: 40px; padding-bottom: 120px;">
    <div class="container" style="max-width: 800px; margin: 0 auto; color: var(--grey-600); line-height: 1.8; font-size: 1.1rem;">
      <p style="margin-bottom: 24px; font-size: 1.25rem; color: #fff;">This is a full article page for <strong>${blog.title}</strong>.</p>
      <p style="margin-bottom: 24px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
      <a href="/blog" class="btn-ghost" style="margin-top: 48px; display: inline-flex;">← Back to All Articles</a>
    </div>
  </section>
`;
    const fullHtml = headAndNav + '\n' + articleHtml + '\n' + footerAndScripts;
    fs.writeFileSync(filePath, fullHtml, 'utf-8');
    console.log("Created layout for " + blog.file);
});
