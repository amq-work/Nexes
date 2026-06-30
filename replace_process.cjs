const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexFile, 'utf-8');

// The start and end of the current PROCESS section in index.html
const startMarker = '<!-- ═══════════════════════════════════════════════════════════════════════\n       PROCESS — SCROLL-DRIVEN 5 STAGES';
const endMarker = '<!-- ═══════════════════════════════════════════════════════════════════════\n       PROJECTS (OUR WORK)';

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

const styleFile = path.join(__dirname, 'src', 'style.css');
let css = fs.readFileSync(styleFile, 'utf-8');

const newCSS = `
/* --- New Process Timeline --- */
.process-timeline-section { position: relative; overflow: hidden; }
.timeline-container { position: relative; max-width: 1000px; margin: 0 auto; padding: 20px 0; }
.timeline-line { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.15) 85%, rgba(255,255,255,0) 100%); transform: translateX(-50%); }
.timeline-item { position: relative; width: 50%; padding: 40px; margin-bottom: 24px; }
.timeline-item.left { left: 0; text-align: right; padding-right: 60px; }
.timeline-item.right { left: 50%; text-align: left; padding-left: 60px; }
.timeline-dot { position: absolute; top: 50px; width: 48px; height: 48px; background: #050505; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 1.1rem; color: #fff; z-index: 2; box-shadow: 0 0 20px rgba(255,255,255,0.02); transition: border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease; }
.timeline-item:hover .timeline-dot { border-color: #fff; box-shadow: 0 0 30px rgba(255,255,255,0.15); color: #fff; }
.timeline-item.left .timeline-dot { right: -24px; }
.timeline-item.right .timeline-dot { left: -24px; }
.timeline-content { padding: 40px 32px; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
.timeline-item:hover .timeline-content { transform: translateY(-8px); border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); }
.timeline-content h3 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 500; margin-bottom: 16px; color: #fff; }
.timeline-content p { color: rgba(255,255,255,0.6); line-height: 1.6; font-size: 0.95rem; }

@media (max-width: 768px) {
  .timeline-line { left: 24px; transform: none; }
  .timeline-item { width: 100%; padding: 0 0 40px 64px !important; text-align: left !important; left: 0 !important; }
  .timeline-dot { left: 0 !important; top: 0 !important; right: auto !important; width: 40px; height: 40px; font-size: 1rem; }
  .timeline-content { padding: 24px; }
}
`;

if (!css.includes('.process-timeline-section')) {
    css += '\n' + newCSS;
    fs.writeFileSync(styleFile, css, 'utf-8');
    console.log('Appended timeline CSS');
}

// Clean up old JS initialization just in case, though it will naturally abort since elements are missing
const mainFile = path.join(__dirname, 'src', 'main.js');
let mainJS = fs.readFileSync(mainFile, 'utf-8');
if (mainJS.includes('initProcessPin')) {
    // Modify initProcessPin to return early unconditionally
    mainJS = mainJS.replace('if (window.innerWidth <= 768) return;', 'return; // Disabled old process pin logic');
    fs.writeFileSync(mainFile, mainJS, 'utf-8');
    console.log('Disabled old process pinning in main.js');
}
