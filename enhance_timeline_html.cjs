const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexFile, 'utf-8');

const startMarker = '<!-- ═══════════════════════════════════════════════════════════════════════\n       NEW PROCESS TIMELINE SECTION';
const endMarker = '<!-- ═══════════════════════════════════════════════════════════════════════\n       WHY US / CORE VALUES';

const newHTML = `<!-- ═══════════════════════════════════════════════════════════════════════
       ENHANCED PROCESS TIMELINE SECTION
  ════════════════════════════════════════════════════════════════════════════ -->
  <section id="process" class="section process-timeline-section" style="background: #050505; color: #fff; padding: 120px 0;">
    
    <!-- Ambient Background Orbs -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>

    <div class="container relative z-10">
      <div class="process-header" style="text-align: center; margin-bottom: 100px;">
        <p class="eyebrow reveal-hero">Five Stages, Zero Guesswork</p>
        <h2 class="section-title reveal-hero scramble">How We Work</h2>
      </div>

      <div class="timeline-container">
        
        <!-- Curving SVG Path -->
        <svg class="timeline-svg-path" viewBox="0 0 100 1000" preserveAspectRatio="none">
          <!-- Base subtle path -->
          <path id="process-base-path" d="M 50 0 C 80 200, 20 400, 50 500 S 80 800, 50 1000" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"></path>
          <!-- Glowing active path to be drawn by GSAP -->
          <path id="process-glow-path" d="M 50 0 C 80 200, 20 400, 50 500 S 80 800, 50 1000" fill="none" stroke="url(#gradient-glow)" stroke-width="4" stroke-dasharray="2000" stroke-dashoffset="2000" style="filter: drop-shadow(0 0 8px rgba(255,255,255,0.6));"></path>
          <defs>
            <linearGradient id="gradient-glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(255,255,255,0)" />
              <stop offset="20%" stop-color="#fff" />
              <stop offset="80%" stop-color="#fff" />
              <stop offset="100%" stop-color="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Stage 1 -->
        <div class="timeline-item timeline-left">
          <div class="timeline-dot">01</div>
          <div class="timeline-content glass-spotlight">
            <div class="timeline-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h3>Discover</h3>
            <p>We start with deep listening — stakeholder interviews, user research, competitive landscape analysis, and goal alignment. No assumptions, only data.</p>
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="timeline-item timeline-right">
          <div class="timeline-dot">02</div>
          <div class="timeline-content glass-spotlight">
            <div class="timeline-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
            </div>
            <h3>Strategize</h3>
            <p>Insights become blueprints. We define clear success metrics, map user journeys, establish the tech stack, and build a phased roadmap with ownership at every step.</p>
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="timeline-item timeline-left">
          <div class="timeline-dot">03</div>
          <div class="timeline-content glass-spotlight">
            <div class="timeline-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
            </div>
            <h3>Design</h3>
            <p>From wireframes to pixel-perfect high-fidelity designs. Every screen is backed by UX principles and validated through rapid iteration cycles with your team.</p>
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="timeline-item timeline-right">
          <div class="timeline-dot">04</div>
          <div class="timeline-content glass-spotlight">
            <div class="timeline-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h3>Build</h3>
            <p>Production-grade development with rigorous QA. We build in public, with regular demos and checkpoints so you always know exactly where things stand.</p>
          </div>
        </div>

        <!-- Stage 5 -->
        <div class="timeline-item timeline-left">
          <div class="timeline-dot">05</div>
          <div class="timeline-content glass-spotlight">
            <div class="timeline-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
            </div>
            <h3>Launch &amp; Grow</h3>
            <p>Go live with confidence. Post-launch, we monitor performance, optimize based on real data, and continue iterating toward sustainable, compounding growth.</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  `;

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    html = html.substring(0, startIndex) + newHTML + html.substring(endIndex);
    fs.writeFileSync(indexFile, html, 'utf-8');
    console.log('Replaced Timeline section HTML');
} else {
    console.log('Markers not found in HTML!', startIndex, endIndex);
}
