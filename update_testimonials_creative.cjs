const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regexTestimonialSection = /<section class="section" id="testimonials">[\s\S]*?<\/section>/;

const newTestimonialsHTML = `<section class="section" id="testimonials">
    <div class="container">
      <div class="section-header" style="text-align: center; margin-bottom: 80px;">
        <p class="eyebrow reveal-text">Client Words</p>
        <h2 class="section-title reveal-text scramble">What Clients Say</h2>
      </div>
      
      <div class="testi-scrub-wrapper">
        
        <div class="testi-scrub-item">
          <div class="testi-scrub-quote">"</div>
          <div class="testi-scrub-text" data-scrub-text>Digital Nexes provided valuable insights for improving our website content and online presence. Their understanding of both design and SEO made a real difference in how we appear to patients online.</div>
          <div class="testi-scrub-author">
             <div class="testi-author-line"></div>
             <div class="testi-author-info">
               <div class="testi-scrub-name">Al Ahad Dental Care</div>
               <div class="testi-scrub-role">Healthcare Client</div>
             </div>
          </div>
        </div>

        <div class="testi-scrub-item">
          <div class="testi-scrub-quote">"</div>
          <div class="testi-scrub-text" data-scrub-text>Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</div>
          <div class="testi-scrub-author">
             <div class="testi-author-line"></div>
             <div class="testi-author-info">
               <div class="testi-scrub-name">Startup Client</div>
               <div class="testi-scrub-role">Early-Stage Founder</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  </section>`;

if(html.match(regexTestimonialSection)){
  html = html.replace(regexTestimonialSection, newTestimonialsHTML);
  fs.writeFileSync('index.html', html);
  console.log("HTML replaced with scrubbing text testimonials.");
} else {
  console.log("Could not find testimonials section in HTML.");
}

let css = fs.readFileSync('src/style.css', 'utf8');

const newCSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   CREATIVE SCRUBBING TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════ */
.testi-scrub-wrapper {
  display: flex;
  flex-direction: column;
  gap: 160px;
  padding-bottom: 100px;
}

.testi-scrub-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.testi-scrub-quote {
  font-family: 'Outfit', sans-serif;
  font-size: 6rem;
  line-height: 1;
  color: rgba(255,255,255,0.1);
  margin-bottom: 20px;
}

.testi-scrub-text {
  font-family: 'Outfit', sans-serif;
  font-size: 2.8rem;
  font-weight: 500;
  line-height: 1.3;
  color: #fff; /* We will control opacity via JS spans */
  margin-bottom: 60px;
}

.testi-scrub-text span {
  display: inline-block;
  white-space: pre-wrap; /* to preserve spaces */
}

.testi-scrub-author {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.testi-author-line {
  width: 2px;
  height: 60px;
  background: linear-gradient(180deg, rgba(255,255,255,0.3), transparent);
}

.testi-scrub-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.testi-scrub-role {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 900px) {
  .testi-scrub-text { font-size: 1.8rem; }
  .testi-scrub-wrapper { gap: 100px; }
}
`;

css += newCSS;
fs.writeFileSync('src/style.css', css);
console.log("CSS appended.");

let mainJs = fs.readFileSync('src/main.js', 'utf8');

const scrubGSAP = `// ── 15. Creative Scrubbing Testimonials GSAP ─────────────────────────────────────
(function initTestimonialsScrub() {
  const scrubTexts = document.querySelectorAll('[data-scrub-text]');
  if (!scrubTexts.length) return;

  scrubTexts.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    
    // Split text into words and wrap in spans
    text.split(' ').forEach(word => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      // We start them dimmed
      span.style.opacity = 0.15;
      el.appendChild(span);
    });

    const words = el.querySelectorAll('span');
    
    // Create ScrollTrigger to scrub the opacity from 0.15 to 1
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "bottom 50%",
      scrub: true,
      animation: gsap.to(words, {
        opacity: 1,
        stagger: 0.1,
        ease: "none"
      })
    });
  });
})();
`;

if (!mainJs.includes('15. Creative Scrubbing Testimonials GSAP')) {
  mainJs += '\n' + scrubGSAP;
  fs.writeFileSync('src/main.js', mainJs);
  console.log("GSAP scrub logic appended to main.js");
} else {
  console.log("GSAP scrub logic already exists in main.js");
}
