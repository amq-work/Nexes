const fs = require('fs');
const path = require('path');

const dir = __dirname;
const blogFiles = [
    { file: 'blog-integrated-studio.html', title: 'Integrated Studio Model', cat: 'Studio Advantage', date: 'June 2024' },
    { file: 'blog-rapid-delivery.html', title: 'Rapid, Structured Delivery', cat: 'Studio Advantage', date: 'June 2024' },
    { file: 'blog-results-obsessed.html', title: 'Results-Obsessed', cat: 'Studio Advantage', date: 'June 2024' },
    { file: 'blog-client-first.html', title: 'Client-First Culture', cat: 'Studio Advantage', date: 'June 2024' },
    { file: 'blog-data-led.html', title: 'Data-Led Decisions', cat: 'Studio Advantage', date: 'June 2024' },
    { file: 'blog-proven-industry.html', title: 'Proven Across Industries', cat: 'Studio Advantage', date: 'June 2024' }
];

// Read a base file to get the head, navbar, and footer
const baseHtml = fs.readFileSync(path.join(dir, 'blog.html'), 'utf-8');

// Extract head & navbar (everything before <main>)
const headMatch = baseHtml.match(/([\s\S]*?<main>)/);
const headAndNav = headMatch ? headMatch[1] : '';

// Extract footer & scripts (everything after </main>)
const footerMatch = baseHtml.match(/(<\/main>[\s\S]*)/);
const footerAndScripts = footerMatch ? footerMatch[1] : '';

blogFiles.forEach(blog => {
    const filePath = path.join(dir, blog.file);
    
    // Create the article content
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
      <p style="margin-bottom: 24px; font-size: 1.25rem; color: #fff;">This is a full article page for <strong>${blog.title}</strong>. It replaces the old listing duplicate with a dedicated reading layout.</p>
      
      <p style="margin-bottom: 24px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
      
      <h2 style="color: #fff; margin: 48px 0 24px; font-size: 2rem;">The Challenge</h2>
      <p style="margin-bottom: 24px;">Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.</p>
      
      <blockquote style="border-left: 4px solid #fff; padding-left: 24px; margin: 40px 0; font-size: 1.4rem; color: #fff; font-style: italic;">
        "Digital growth doesn't happen by accident. It requires a systematic approach, rigorous testing, and an obsession with measurable outcomes."
      </blockquote>
      
      <h2 style="color: #fff; margin: 48px 0 24px; font-size: 2rem;">Our Approach</h2>
      <p style="margin-bottom: 24px;">Proin eget tortor risus. Nulla porttitor accumsan tincidunt. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Donec rutrum congue leo eget malesuada.</p>
      
      <a href="/blog" class="btn-ghost" style="margin-top: 48px; display: inline-flex;">← Back to All Articles</a>
    </div>
  </section>
`;

    const fullHtml = headAndNav + '\n' + articleHtml + '\n' + footerAndScripts;
    fs.writeFileSync(filePath, fullHtml, 'utf-8');
    console.log(`Updated layout for ${blog.file}`);
});
