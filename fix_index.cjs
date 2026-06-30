const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix the corrupted testimonial 2
const badTestimonialStart = html.indexOf('<div class="testimonial-slide" id="testi-2">');
const testimonialDotsStart = html.indexOf('<div class="testimonial-dots" id="testimonial-dots">');

const originalTestimonial2 = `          <div class="testimonial-slide" id="testi-2">
            <div class="testimonial-card">
              <span class="testimonial-quote-mark">"</span>
              <blockquote>
                <p>Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</p>
                <footer><cite>
                  <span class="testi-name">Startup Client</span>
                  <span class="testi-role">Early-Stage Founder</span>
                </cite></footer>
              </blockquote>
            </div>
          </div>
        </div>
        `;

html = html.substring(0, badTestimonialStart) + originalTestimonial2 + html.substring(testimonialDotsStart);

// 2. Replace the old .bi-grid with the new layout
const newLayout = `      <div class="bi-editorial-layout">
        
        <!-- Left Side: Massive Featured Article -->
        <a href="/blog-integrated-studio" class="bi-ed-featured reveal-left" id="bi-card-1">
          <div class="bi-ed-image-wrap">
             <div class="bi-ed-glow"></div>
             <span class="bi-ed-badge">Studio Advantage</span>
          </div>
          <div class="bi-ed-content">
            <h3 class="bi-ed-title">Why an Integrated Studio Model Wins Every Time</h3>
            <p class="bi-ed-excerpt">Design, development, marketing, and strategy under one roof. No handoff friction — your brand and product stay coherent from day one.</p>
            <div class="bi-ed-meta">
              <span>5 min read</span>
              <span class="bi-ed-read">Read Article →</span>
            </div>
          </div>
        </a>

        <!-- Right Side: Minimal List -->
        <div class="bi-ed-list">
          
          <a href="/blog-technical-seo" class="bi-ed-item reveal-card" id="bi-card-2">
            <span class="bi-ed-num">02</span>
            <div class="bi-ed-item-content">
              <span class="bi-ed-category">SEO</span>
              <h4 class="bi-ed-item-title">Technical SEO in 2025: What Actually Moves the Needle</h4>
            </div>
            <span class="bi-ed-arrow">→</span>
          </a>

          <a href="/blog-using-ai" class="bi-ed-item reveal-card" id="bi-card-3">
            <span class="bi-ed-num">03</span>
            <div class="bi-ed-item-content">
              <span class="bi-ed-category">AI &amp; Tech</span>
              <h4 class="bi-ed-item-title">Using AI Without Losing Your Brand's Soul</h4>
            </div>
            <span class="bi-ed-arrow">→</span>
          </a>

          <a href="/blog-page-speed" class="bi-ed-item reveal-card" id="bi-card-4">
            <span class="bi-ed-num">04</span>
            <div class="bi-ed-item-content">
              <span class="bi-ed-category">Performance</span>
              <h4 class="bi-ed-item-title">Page Speed is a Revenue Problem</h4>
            </div>
            <span class="bi-ed-arrow">→</span>
          </a>

          <a href="/blog-design-systems" class="bi-ed-item reveal-card" id="bi-card-5">
            <span class="bi-ed-num">05</span>
            <div class="bi-ed-item-content">
              <span class="bi-ed-category">Design</span>
              <h4 class="bi-ed-item-title">Design Systems That Actually Scale</h4>
            </div>
            <span class="bi-ed-arrow">→</span>
          </a>

          <a href="/blog-b2b-funnel" class="bi-ed-item reveal-card" id="bi-card-6">
            <span class="bi-ed-num">06</span>
            <div class="bi-ed-item-content">
              <span class="bi-ed-category">Marketing</span>
              <h4 class="bi-ed-item-title">Building a B2B Funnel That Converts</h4>
            </div>
            <span class="bi-ed-arrow">→</span>
          </a>

        </div>
      </div>`;

// Use regex to carefully replace just the .bi-grid inside the blogs section
const biGridRegex = /<div class="bi-grid">[\s\S]*?<!-- \/bi-grid -->/;
html = html.replace(biGridRegex, newLayout);

fs.writeFileSync('index.html', html);

// Now write the CSS for this new layout to style.css
let css = fs.readFileSync('src/style.css', 'utf8');

const newCSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   BLOGS & INSIGHTS (EDITORIAL LAYOUT)
   ════════════════════════════════════════════════════════════════════════ */
.bi-editorial-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}

/* Left: Featured */
.bi-ed-featured {
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease;
  position: relative;
  height: 100%;
}
.bi-ed-featured:hover {
  transform: translateY(-8px);
  background: rgba(255,255,255,0.04);
}

.bi-ed-image-wrap {
  width: 100%;
  height: 320px;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.bi-ed-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 50%);
  animation: edPulse 8s infinite alternate ease-in-out;
}
@keyframes edPulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 1; }
}

.bi-ed-badge {
  position: absolute;
  top: 24px; left: 24px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  border-radius: 100px;
}

.bi-ed-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.bi-ed-title {
  font-family: 'Outfit', sans-serif;
  font-size: 2.2rem;
  font-weight: 500;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.bi-ed-excerpt {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  margin-bottom: 40px;
  flex: 1;
}

.bi-ed-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.bi-ed-read {
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s ease;
}
.bi-ed-featured:hover .bi-ed-read { opacity: 0.7; }

/* Right: List */
.bi-ed-list {
  display: flex;
  flex-direction: column;
}

.bi-ed-item {
  display: flex;
  align-items: center;
  padding: 36px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  text-decoration: none;
  transition: padding-left 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease;
  position: relative;
}
.bi-ed-item:first-child { border-top: 1px solid rgba(255,255,255,0.06); }

.bi-ed-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}
.bi-ed-item:hover::before { opacity: 1; }
.bi-ed-item:hover { padding-left: 20px; border-color: rgba(255,255,255,0.15); }

.bi-ed-num {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255,255,255,0.15);
  width: 64px;
  position: relative;
  z-index: 1;
}

.bi-ed-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.bi-ed-category {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.bi-ed-item-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.35rem;
  font-weight: 500;
  color: #fff;
  line-height: 1.3;
  margin: 0;
}

.bi-ed-arrow {
  font-size: 1.5rem;
  color: rgba(255,255,255,0.15);
  transition: transform 0.4s ease, color 0.4s ease;
  position: relative;
  z-index: 1;
}
.bi-ed-item:hover .bi-ed-arrow {
  transform: translateX(-12px);
  color: #fff;
}

/* Responsive */
@media (max-width: 1024px) {
  .bi-editorial-layout { grid-template-columns: 1fr; gap: 40px; }
  .bi-ed-image-wrap { height: 260px; }
  .bi-ed-title { font-size: 1.8rem; }
}
@media (max-width: 768px) {
  .bi-ed-item { padding: 24px 0; }
  .bi-ed-num { font-size: 1.2rem; width: 48px; }
  .bi-ed-item-title { font-size: 1.15rem; }
  .bi-ed-content { padding: 32px 24px; }
}
`;

css += newCSS;
fs.writeFileSync('src/style.css', css);

console.log('HTML restored and updated successfully.');
