const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regexTestimonialSection = /<section class="section" id="testimonials">[\s\S]*?<\/section>/;

const newTestimonialsHTML = `<section class="section" id="testimonials">
    <div class="container">
      <div class="section-header">
        <p class="eyebrow reveal-text">Client Words</p>
        <h2 class="section-title reveal-text scramble">What Clients Say</h2>
      </div>
      
      <div class="testimonial-grid">
        
        <div class="testimonial-premium reveal-card" id="testi-1">
          <div class="testi-quote-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <p class="testi-body">Digital Nexes provided valuable insights for improving our website content and online presence. Their understanding of both design and SEO made a real difference in how we appear to patients online.</p>
          <div class="testi-footer">
            <div class="testi-author">
              <span class="testi-name">Al Ahad Dental Care</span>
              <span class="testi-role">Healthcare Client</span>
            </div>
            <div class="testi-glow"></div>
          </div>
        </div>

        <div class="testimonial-premium reveal-card stagger-1" id="testi-2">
          <div class="testi-quote-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <p class="testi-body">Their combination of design thinking and business strategy makes them more than just a service provider — they think like a partner. That approach is rare and genuinely valuable when you're building something from scratch.</p>
          <div class="testi-footer">
            <div class="testi-author">
              <span class="testi-name">Startup Client</span>
              <span class="testi-role">Early-Stage Founder</span>
            </div>
            <div class="testi-glow"></div>
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
   PREMIUM TESTIMONIALS GRID
   ════════════════════════════════════════════════════════════════════════ */
.testimonial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 24px;
}

.testimonial-premium {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s ease, border-color 0.4s ease;
}

.testimonial-premium:hover {
  transform: translateY(-8px);
  border-color: rgba(255,255,255,0.15);
}

.testi-quote-icon {
  color: rgba(255,255,255,0.1);
  margin-bottom: 32px;
}

.testi-body {
  font-family: 'Outfit', sans-serif;
  font-size: 1.35rem;
  font-weight: 400;
  color: #fff;
  line-height: 1.5;
  margin-bottom: 48px;
  flex: 1;
}

.testi-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 24px;
}

.testi-author {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.testi-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.testi-role {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.testi-glow {
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
  filter: blur(20px);
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
  transition: opacity 0.4s ease;
}

.testimonial-premium:hover .testi-glow {
  opacity: 1;
}

@media (max-width: 900px) {
  .testimonial-grid { grid-template-columns: 1fr; }
  .testimonial-premium { padding: 32px; }
  .testi-body { font-size: 1.2rem; }
}
`;

css += newCSS;
fs.writeFileSync('src/style.css', css);
console.log("CSS appended.");
