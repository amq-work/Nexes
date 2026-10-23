// ── cms-client.js — Digital Nexes Frontend CMS Integration ────────────────────

// Environment detection:
// - On development (localhost or 127.0.0.1) → use http://localhost:3001/api
// - On production → use /cms/api (resolves seamlessly to https://digitalnexes.com/cms/api)
const API_BASE = (() => {
  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  return '/cms/api';
})();

document.addEventListener('DOMContentLoaded', () => {
  const blogGrid = document.getElementById('blog-grid');
  if (blogGrid) {
    initBlogListingPage();
  }

  const articleBody = document.getElementById('article-body');
  if (articleBody || window.location.pathname.includes('/insights/')) {
    initArticleViewPage();
  }
});

// ── 1. BLOG LISTING PAGE (/blog.html) ─────────────────────────────────────────
async function initBlogListingPage() {
  const blogGrid = document.getElementById('blog-grid');
  const topRow = document.getElementById('fi-top-row');
  const bottomRow = document.getElementById('fi-bottom-row');

  try {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('API unreachable');
    const blogs = await res.json();
    renderBlogListing(blogs, topRow, bottomRow, blogGrid);
  } catch (err) {
    console.warn('[CMS Client] API fallback/error:', err);
    if (blogGrid) {
      blogGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.6);">No blog articles currently available.</div>`;
    }
  }
}

function renderBlogListing(blogs, topRow, bottomRow, blogGrid) {
  if (!blogs || blogs.length === 0) {
    if (blogGrid) blogGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.6);">No blog articles published yet.</div>`;
    return;
  }

  // 1. Render Featured Insights Top Row (Posts 0, 1, 2)
  if (topRow) {
    if (blogs[0]) {
      const b0 = blogs[0];
      let topHtml = `
        <a href="/insights/${escapeHtml(b0.slug)}" class="fi-hero-card reveal-card">
          <div class="fi-hero-num">01</div>
          <div class="fi-hero-body">
            <span class="fi-cat-tag">${escapeHtml(b0.category || 'Featured')}</span>
            <h3 class="fi-hero-title">${escapeHtml(b0.title)}</h3>
            <p class="fi-hero-excerpt">${escapeHtml(b0.subtitle || b0.title)}</p>
            <div class="fi-hero-footer">
              <span class="fi-read-time">${escapeHtml(b0.readingTime || '5 min read')}</span>
              <span class="fi-cta">Read Article <span class="fi-arrow">→</span></span>
            </div>
          </div>
        </a>
      `;

      let stackHtml = '<div class="fi-stack">';
      if (blogs[1]) {
        const b1 = blogs[1];
        stackHtml += `
          <a href="/insights/${escapeHtml(b1.slug)}" class="fi-side-card reveal-card">
            <div class="fi-side-top">
              <span class="fi-cat-tag">${escapeHtml(b1.category || 'Insights')}</span>
              <span class="fi-side-num">02</span>
            </div>
            <h3 class="fi-side-title">${escapeHtml(b1.title)}</h3>
            <p class="fi-side-excerpt">${escapeHtml(b1.subtitle || '')}</p>
            <span class="fi-cta">Read Article <span class="fi-arrow">→</span></span>
          </a>
        `;
      }
      if (blogs[2]) {
        const b2 = blogs[2];
        stackHtml += `
          <a href="/insights/${escapeHtml(b2.slug)}" class="fi-side-card reveal-card">
            <div class="fi-side-top">
              <span class="fi-cat-tag">${escapeHtml(b2.category || 'Insights')}</span>
              <span class="fi-side-num">03</span>
            </div>
            <h3 class="fi-side-title">${escapeHtml(b2.title)}</h3>
            <p class="fi-side-excerpt">${escapeHtml(b2.subtitle || '')}</p>
            <span class="fi-cta">Read Article <span class="fi-arrow">→</span></span>
          </a>
        `;
      }
      stackHtml += '</div>';
      topRow.innerHTML = topHtml + stackHtml;
    } else {
      topRow.innerHTML = '';
    }
  }

  // 2. Render Featured Insights Bottom Row (Posts 3, 4, 5)
  if (bottomRow) {
    let bottomHtml = '';
    for (let i = 3; i <= 5; i++) {
      if (blogs[i]) {
        const b = blogs[i];
        bottomHtml += `
          <a href="/insights/${escapeHtml(b.slug)}" class="fi-mini-card reveal-card">
            <div class="fi-mini-top">
              <span class="fi-cat-tag">${escapeHtml(b.category || 'Insights')}</span>
              <span class="fi-mini-num">0${i + 1}</span>
            </div>
            <h3 class="fi-mini-title">${escapeHtml(b.title)}</h3>
            <p class="fi-mini-excerpt">${escapeHtml(b.subtitle || '')}</p>
            <span class="fi-cta">Read Article <span class="fi-arrow">→</span></span>
          </a>
        `;
      }
    }
    bottomRow.innerHTML = bottomHtml;
  }

  // 3. Render Article Grid (All published blogs)
  if (blogGrid) {
    blogGrid.innerHTML = blogs.map(b => {
      const catSlug = (b.category || 'general').toLowerCase();
      const tagsSlug = Array.isArray(b.tags) ? b.tags.map(t => t.toLowerCase()).join(' ') : '';
      const filterStr = `${catSlug} ${tagsSlug}`;

      return `
        <a href="/insights/${escapeHtml(b.slug)}" class="blog-card reveal-card" data-category="${escapeHtml(filterStr)}">
          <div class="bc-meta"><span class="bc-cat">${escapeHtml(b.category || 'General')}</span><span class="bc-date">${escapeHtml(b.date || '')}</span></div>
          <h3 class="bc-title">${escapeHtml(b.title)}</h3>
          <p class="bc-excerpt">${escapeHtml(b.subtitle || '')}</p>
          <div class="bc-footer"><span class="bc-read">${escapeHtml(b.readingTime || '5 min')}</span><span class="bc-link">Read Article →</span></div>
        </a>
      `;
    }).join('');

    // Re-attach filter button logic
    const filterBtns = document.querySelectorAll('#blog-filter-bar .filter-btn');
    const cards = document.querySelectorAll('#blog-grid .blog-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        cards.forEach(c => {
          c.style.display = (f === 'all' || (c.dataset.category || '').includes(f)) ? '' : 'none';
        });
      });
    });
  }
}

// ── 2. ARTICLE VIEW PAGE (/insights/[slug]) ───────────────────────────────────
async function initArticleViewPage() {
  const parts = window.location.pathname.split('/insights/');
  const slug = parts[1] ? parts[1].replace(/\/$/, '') : null;
  const articleBody = document.getElementById('article-body');

  if (!slug) {
    if (articleBody) articleBody.innerHTML = `<p style="text-align:center; padding: 60px; color:#ff4d4d;">Invalid article URL.</p>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
    if (!res.ok) throw new Error('Article not found');
    const blog = await res.json();
    renderArticleView(blog);
  } catch (err) {
    console.error('[CMS Client] Error loading article:', err);
    if (articleBody) {
      articleBody.innerHTML = `
        <div style="text-align:center; padding: 80px 20px;">
          <h1 style="font-size: 2rem; color: #fff; margin-bottom: 16px;">Article Not Found</h1>
          <p style="color: rgba(255,255,255,0.6); margin-bottom: 24px;">The blog post you are looking for does not exist or is no longer published.</p>
          <a href="/blog" class="btn-primary" style="display:inline-block;">← Return to All Insights</a>
        </div>
      `;
    }
  }
}

function renderArticleView(blog) {
  // Populate header info
  const titleEl = document.getElementById('article-title');
  const subtitleEl = document.getElementById('article-subtitle');
  const catEl = document.getElementById('article-category');
  const dateEl = document.getElementById('article-date');
  const readEl = document.getElementById('article-read-time');
  const featImgBox = document.getElementById('article-featured-image-box');
  const tagsBox = document.getElementById('article-tags-box');

  if (titleEl) titleEl.textContent = blog.title || '';
  if (subtitleEl) subtitleEl.textContent = blog.subtitle || '';
  if (catEl) catEl.textContent = blog.category || 'Insights';
  if (dateEl) dateEl.textContent = blog.date || '';
  if (readEl) readEl.textContent = blog.readingTime || '5 min read';

  if (featImgBox && blog.featuredImage) {
    featImgBox.innerHTML = `
      <figure class="article-hero-figure">
        <img src="${escapeHtml(blog.featuredImage)}" alt="${escapeHtml(blog.title)}" loading="eager">
      </figure>
    `;
  }

  // Render tags
  if (tagsBox && Array.isArray(blog.tags) && blog.tags.length > 0) {
    tagsBox.innerHTML = blog.tags.map(t => `<span class="article-tag">#${escapeHtml(t)}</span>`).join('');
  }

  // 1. Render Structured Blocks into Semantic HTML
  const bodyEl = document.getElementById('article-body');
  if (bodyEl && Array.isArray(blog.blocks)) {
    bodyEl.innerHTML = blog.blocks.map(blk => {
      const t = blk.type;
      const c = escapeHtml(blk.content || '');

      if (t === 'H2 Heading') {
        return `<h2 class="article-h2">${c}</h2>`;
      } else if (t === 'H3 Heading') {
        return `<h3 class="article-h3">${c}</h3>`;
      } else if (t === 'H4 Heading') {
        return `<h4 class="article-h4">${c}</h4>`;
      } else if (t === 'Paragraph') {
        return `<p class="article-p">${c}</p>`;
      } else if (t === 'Quote') {
        return `<blockquote class="article-quote"><p>${c}</p></blockquote>`;
      } else if (t === 'Divider') {
        return `<hr class="article-divider">`;
      } else if (t === 'Bullet List') {
        const items = c.split('\n').filter(Boolean);
        const liHtml = items.map(item => `<li>${item}</li>`).join('');
        return `<ul class="article-ul">${liHtml}</ul>`;
      } else if (t === 'Numbered List') {
        const items = c.split('\n').filter(Boolean);
        const liHtml = items.map(item => `<li>${item}</li>`).join('');
        return `<ol class="article-ol">${liHtml}</ol>`;
      } else if (t === 'Image') {
        const url = escapeHtml(blk.url || '');
        const alt = escapeHtml(blk.alt || blog.title);
        const cap = escapeHtml(blk.caption || '');
        return `
          <figure class="article-figure">
            <img src="${url}" alt="${alt}" loading="lazy">
            ${cap ? `<figcaption class="article-figcaption">${cap}</figcaption>` : ''}
          </figure>
        `;
      }
      return '';
    }).join('');
  }

  // 2. Automated SEO Metadata Generation
  document.title = blog.seoTitle || `${blog.title} | Digital Nexes`;

  setMetaTag('name', 'description', blog.metaDescription || blog.subtitle || '');
  setMetaTag('name', 'robots', (blog.robots === 'No Index') ? 'noindex, nofollow' : 'index, follow');

  // Open Graph
  setMetaTag('property', 'og:title', blog.seoTitle || blog.title);
  setMetaTag('property', 'og:description', blog.metaDescription || blog.subtitle || '');
  setMetaTag('property', 'og:image', blog.openGraphImage || blog.featuredImage || 'https://digitalnexes.com/logo.webp');
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:url', blog.canonicalUrl || window.location.href);

  // Twitter Card
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', blog.seoTitle || blog.title);
  setMetaTag('name', 'twitter:description', blog.metaDescription || blog.subtitle || '');
  setMetaTag('name', 'twitter:image', blog.openGraphImage || blog.featuredImage || 'https://digitalnexes.com/logo.webp');

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', blog.canonicalUrl || `https://digitalnexes.com/insights/${blog.slug}`);

  // 3. Schema.org Structured Data (BlogPosting JSON-LD)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.metaDescription || blog.subtitle || '',
    "image": blog.featuredImage ? [blog.featuredImage] : [],
    "datePublished": blog.createdAt || new Date().toISOString(),
    "dateModified": blog.updatedAt || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Digital Nexes Team",
      "url": "https://digitalnexes.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Digital Nexes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://digitalnexes.com/logo.webp"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blog.canonicalUrl || `https://digitalnexes.com/insights/${blog.slug}`
    }
  };

  let scriptLd = document.getElementById('schema-json-ld');
  if (!scriptLd) {
    scriptLd = document.createElement('script');
    scriptLd.setAttribute('type', 'application/ld+json');
    scriptLd.setAttribute('id', 'schema-json-ld');
    document.head.appendChild(scriptLd);
  }
  scriptLd.textContent = JSON.stringify(schemaData, null, 2);
}

function setMetaTag(attrName, attrVal, contentVal) {
  let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrVal);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', contentVal);
}

function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
