const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexFile, 'utf-8');

const startMarker = '<!-- ═══════════════════════════════════════════════════════════════════════\n       PROCESS — SCROLL-DRIVEN 5 STAGES';
const endMarker = '<!-- ═══════════════════════════════════════════════════════════════════════\n       WHY US / CORE VALUES';

const newHTML = `<!-- ═══════════════════════════════════════════════════════════════════════
       NEW PROCESS TIMELINE SECTION
  ════════════════════════════════════════════════════════════════════════════ -->
  <section id="process" class="section process-timeline-section" style="background: #050505; color: #fff; padding: 120px 0;">
    <div class="container">
      <div class="process-header" style="text-align: center; margin-bottom: 80px;">
        <p class="eyebrow reveal-hero">Five Stages, Zero Guesswork</p>
        <h2 class="section-title reveal-hero scramble">How We Work</h2>
      </div>

      <div class="timeline-container" data-reveal-stagger>
        <div class="timeline-line"></div>
        
        <!-- Stage 1 -->
        <div class="timeline-item reveal-card left">
          <div class="timeline-dot">01</div>
          <div class="timeline-content glass-card">
            <h3>Discover</h3>
            <p>We start with deep listening — stakeholder interviews, user research, competitive landscape analysis, and goal alignment. No assumptions, only data.</p>
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="timeline-item reveal-card right">
          <div class="timeline-dot">02</div>
          <div class="timeline-content glass-card">
            <h3>Strategize</h3>
            <p>Insights become blueprints. We define clear success metrics, map user journeys, establish the tech stack, and build a phased roadmap with ownership at every step.</p>
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="timeline-item reveal-card left">
          <div class="timeline-dot">03</div>
          <div class="timeline-content glass-card">
            <h3>Design</h3>
            <p>From wireframes to pixel-perfect high-fidelity designs. Every screen is backed by UX principles and validated through rapid iteration cycles with your team.</p>
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="timeline-item reveal-card right">
          <div class="timeline-dot">04</div>
          <div class="timeline-content glass-card">
            <h3>Build</h3>
            <p>Production-grade development with rigorous QA. We build in public, with regular demos and checkpoints so you always know exactly where things stand.</p>
          </div>
        </div>

        <!-- Stage 5 -->
        <div class="timeline-item reveal-card left">
          <div class="timeline-dot">05</div>
          <div class="timeline-content glass-card">
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
    console.log('Replaced Process section HTML');
} else {
    console.log('Markers not found in HTML!', startIndex, endIndex);
}
