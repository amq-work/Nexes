const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regexTestimonialSection = /<section class="section" id="testimonials">[\s\S]*?<\/section>/;

const newTestimonialsHTML = `<section class="section" id="testimonials">
    <div class="container">
      <div class="section-header" style="text-align: center;">
        <p class="eyebrow reveal-text">Client Words</p>
        <h2 class="section-title reveal-text scramble" style="margin-bottom: 20px;">What Clients Say</h2>
      </div>
      
      <div class="testi-stack-wrapper">
        <div class="testi-stack-track">
          
          <!-- Card 1 -->
          <div class="testi-stack-card" id="tc-1">
            <div class="testi-stack-inner">
              <div class="testi-stack-bg"></div>
              <div class="testi-stack-content">
                <div class="testi-stack-mark">"</div>
                <p class="testi-stack-body">Digital Nexes provided valuable insights for improving our website content and online presence. Their understanding of both design and SEO made a real difference in how we appear to patients online.</p>
                <div class="testi-stack-author">
                  <span class="testi-stack-name">Al Ahad Dental Care</span>
                  <span class="testi-stack-role">Healthcare Client</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="testi-stack-card" id="tc-2">
            <div class="testi-stack-inner">
              <div class="testi-stack-bg"></div>
              <div class="testi-stack-content">
                <div class="testi-stack-mark">"</div>
                <p class="testi-stack-body">Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</p>
                <div class="testi-stack-author">
                  <span class="testi-stack-name">Startup Client</span>
                  <span class="testi-stack-role">Early-Stage Founder</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>`;

if(html.match(regexTestimonialSection)){
  html = html.replace(regexTestimonialSection, newTestimonialsHTML);
  fs.writeFileSync('index.html', html);
  console.log("HTML replaced");
} else {
  console.log("Could not find testimonials section");
}

let css = fs.readFileSync('src/style.css', 'utf8');

const newCSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED GSAP STACKING TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════ */
.testi-stack-wrapper {
  position: relative;
  padding-bottom: 100px;
}

.testi-stack-track {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.testi-stack-card {
  position: sticky;
  top: 15vh; /* sticks near the top */
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  /* Extra space at bottom to allow scrolling over it */
  padding-bottom: 40px; 
}

.testi-stack-inner {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
  transition: transform 0.1s ease;
}

.testi-stack-bg {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  z-index: 0;
}

.testi-stack-content {
  position: relative;
  z-index: 1;
  padding: 80px 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.testi-stack-mark {
  font-family: 'Outfit', sans-serif;
  font-size: 8rem;
  line-height: 0.5;
  color: rgba(255,255,255,0.1);
  margin-bottom: 20px;
}

.testi-stack-body {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 400;
  color: #fff;
  line-height: 1.4;
  margin-bottom: 40px;
}

.testi-stack-author {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.testi-stack-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.testi-stack-role {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .testi-stack-content { padding: 60px 30px; }
  .testi-stack-body { font-size: 1.2rem; }
  .testi-stack-card { top: 10vh; }
}
`;

css += newCSS;
fs.writeFileSync('src/style.css', css);
console.log("CSS appended.");
