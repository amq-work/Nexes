const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regexTestimonialSection = /<section class="section" id="testimonials">[\s\S]*?<\/section>/;

const newTestimonialsHTML = `<section class="section" id="testimonials" style="overflow: hidden; padding: 120px 0; position: relative;">
    
    <div class="testi-marquee-bg-text">WHAT CLIENTS SAY</div>

    <div class="container relative z-10">
      <div class="section-header" style="text-align: center; margin-bottom: 80px;">
        <p class="eyebrow reveal-text">Client Words</p>
        <h2 class="section-title reveal-text scramble">Client Experiences</h2>
      </div>
    </div>
    
    <div class="testi-marquee-container">
      <div class="testi-marquee-track">
        
        <!-- Set 1 -->
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Digital Nexes provided valuable insights for improving our website content and online presence. Their understanding of both design and SEO made a real difference in how we appear to patients online.</p>
          <div class="tm-author">Al Ahad Dental Care — Healthcare Client</div>
        </div>
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</p>
          <div class="tm-author">Startup Client — Early-Stage Founder</div>
        </div>
        
        <!-- Set 2 -->
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Digital Nexes provided valuable insights for improving our website content and online presence. Their understanding of both design and SEO made a real difference in how we appear to patients online.</p>
          <div class="tm-author">Al Ahad Dental Care — Healthcare Client</div>
        </div>
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</p>
          <div class="tm-author">Startup Client — Early-Stage Founder</div>
        </div>

        <!-- Set 3 -->
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Digital Nexes provided valuable insights for improving our website content and online presence. Their understanding of both design and SEO made a real difference in how we appear to patients online.</p>
          <div class="tm-author">Al Ahad Dental Care — Healthcare Client</div>
        </div>
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</p>
          <div class="tm-author">Startup Client — Early-Stage Founder</div>
        </div>

        <!-- Set 4 (To ensure smooth infinite loop on large screens) -->
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Digital Nexes provided valuable insights for improving our website content and online presence. Their understanding of both design and SEO made a real difference in how we appear to patients online.</p>
          <div class="tm-author">Al Ahad Dental Care — Healthcare Client</div>
        </div>
        <div class="testi-marquee-card">
          <div class="tm-quote">"</div>
          <p class="tm-text">Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</p>
          <div class="tm-author">Startup Client — Early-Stage Founder</div>
        </div>
        
      </div>
    </div>
  </section>`;

if(html.match(regexTestimonialSection)){
  html = html.replace(regexTestimonialSection, newTestimonialsHTML);
  fs.writeFileSync('index.html', html);
  console.log("HTML replaced with Infinite Marquee layout.");
} else {
  console.log("Could not find testimonials section in HTML.");
}

let css = fs.readFileSync('src/style.css', 'utf8');

const newCSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   INFINITE MARQUEE TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════ */
.testi-marquee-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Outfit', sans-serif;
  font-size: 14vw;
  font-weight: 800;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.03);
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.testi-marquee-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
  display: flex;
  z-index: 1;
}

.testi-marquee-track {
  display: flex;
  gap: 40px;
  padding: 0 20px;
  width: max-content;
  /* Scroll half the width (which is 4 out of 8 cards) */
  animation: marquee 35s linear infinite; 
}

.testi-marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  /* Since we duplicated 2 cards into 8 total cards (4 sets), moving -50% shifts by exactly 4 cards. 
     To make it seamless, we shift by exactly half the track. */
  100% { transform: translateX(calc(-50% - 20px)); } 
}

.testi-marquee-card {
  width: 550px;
  background: rgba(255,255,255,0.015);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 50px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.testi-marquee-card:hover {
  transform: translateY(-8px);
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.15);
}

.tm-quote {
  font-family: 'Outfit', sans-serif;
  font-size: 6rem;
  line-height: 0.6;
  color: rgba(255,255,255,0.1);
  margin-bottom: 24px;
}

.tm-text {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  line-height: 1.6;
  color: #fff;
  margin-bottom: 40px;
  flex: 1;
}

.tm-author {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

@media (max-width: 768px) {
  .testi-marquee-card { width: 340px; padding: 32px; }
  .tm-text { font-size: 1.1rem; }
  .testi-marquee-bg-text { font-size: 20vw; }
}
`;

css += newCSS;
fs.writeFileSync('src/style.css', css);
console.log("CSS appended.");

