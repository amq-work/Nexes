const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldRoadmap = `<div class="roadmap-flex" id="roadmap-flex">
        <div class="roadmap-card reveal-card">
          <div class="roadmap-meta">Phase 1</div>
          <h3 class="roadmap-title">SaaS Products</h3>
          <p class="roadmap-body">Transitioning from custom agency work to building, launching, and scaling proprietary Software-as-a-Service platforms designed to solve specialized industry challenges on a global scale.</p>
        </div>

        <div class="roadmap-card reveal-card stagger-1">
          <div class="roadmap-meta">Phase 2</div>
          <h3 class="roadmap-title">AI-Powered Business Solutions</h3>
          <p class="roadmap-body">Integrating advanced AI models — LLMs, generative AI, and machine learning — into everyday business workflows for unprecedented automation, deep data insights, and operational efficiency.</p>
        </div>

        <div class="roadmap-card reveal-card stagger-2">
          <div class="roadmap-meta">Phase 3</div>
          <h3 class="roadmap-title">Architecture Tech &amp; Robotics</h3>
          <p class="roadmap-body">Expanding into the physical-digital intersection. Investing in R&amp;D for architecture technology, smart automation systems, and robotics applications that bridge hardware with our software expertise.</p>
        </div>
      </div>`;

const newRoadmap = `<div class="roadmap-timeline" id="roadmap-timeline">
        <div class="roadmap-line">
          <div class="roadmap-line-progress" id="roadmap-progress"></div>
        </div>
        
        <div class="roadmap-step reveal-card">
          <div class="roadmap-dot"></div>
          <div class="roadmap-content">
            <div class="roadmap-meta">Phase 1</div>
            <h3 class="roadmap-title">SaaS Products</h3>
            <p class="roadmap-body">Transitioning from custom agency work to building, launching, and scaling proprietary Software-as-a-Service platforms designed to solve specialized industry challenges on a global scale.</p>
          </div>
        </div>

        <div class="roadmap-step reveal-card stagger-1">
          <div class="roadmap-dot"></div>
          <div class="roadmap-content">
            <div class="roadmap-meta">Phase 2</div>
            <h3 class="roadmap-title">AI-Powered Business Solutions</h3>
            <p class="roadmap-body">Integrating advanced AI models — LLMs, generative AI, and machine learning — into everyday business workflows for unprecedented automation, deep data insights, and operational efficiency.</p>
          </div>
        </div>

        <div class="roadmap-step reveal-card stagger-2">
          <div class="roadmap-dot"></div>
          <div class="roadmap-content">
            <div class="roadmap-meta">Phase 3</div>
            <h3 class="roadmap-title">Architecture Tech &amp; Robotics</h3>
            <p class="roadmap-body">Expanding into the physical-digital intersection. Investing in R&amp;D for architecture technology, smart automation systems, and robotics applications that bridge hardware with our software expertise.</p>
          </div>
        </div>
      </div>`;

if (html.includes(oldRoadmap)) {
  html = html.replace(oldRoadmap, newRoadmap);
  fs.writeFileSync('index.html', html);
  console.log("HTML updated.");
} else {
  console.log("Could not find the exact old Roadmap HTML string.");
}

// Now append CSS
let css = fs.readFileSync('src/style.css', 'utf8');

const newCSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   ROADMAP TIMELINE LAYOUT
   ════════════════════════════════════════════════════════════════════════ */
.roadmap-timeline {
  position: relative;
  max-width: 900px;
  margin: 60px auto 0;
  padding: 40px 0;
}

.roadmap-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: rgba(255,255,255,0.05);
  transform: translateX(-50%);
}

.roadmap-line-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0%; /* We will animate this with GSAP later or keep it simple */
  background: linear-gradient(180deg, #fff, transparent);
}

.roadmap-step {
  position: relative;
  width: 50%;
  padding: 0 50px;
  margin-bottom: 60px;
}

.roadmap-step:nth-child(even) {
  left: 0;
  text-align: right;
}

.roadmap-step:nth-child(odd) {
  left: 50%;
  text-align: left;
}

.roadmap-step:last-child {
  margin-bottom: 0;
}

.roadmap-dot {
  position: absolute;
  top: 24px;
  width: 16px;
  height: 16px;
  background: #000;
  border: 2px solid #fff;
  border-radius: 50%;
  z-index: 2;
  transition: transform 0.3s ease, background 0.3s ease;
}

.roadmap-step:nth-child(even) .roadmap-dot {
  right: -8px;
}

.roadmap-step:nth-child(odd) .roadmap-dot {
  left: -8px;
}

.roadmap-step:hover .roadmap-dot {
  transform: scale(1.3);
  background: #fff;
}

.roadmap-content {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 40px;
  border-radius: 16px;
  transition: transform 0.4s ease, border-color 0.4s ease;
}

.roadmap-step:hover .roadmap-content {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.15);
}

.roadmap-meta {
  display: inline-block;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 20px;
}

.roadmap-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 500;
  color: #fff;
  margin-bottom: 12px;
}

.roadmap-body {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .roadmap-line {
    left: 20px;
  }
  .roadmap-step {
    width: 100%;
    left: 0 !important;
    padding: 0 0 0 60px;
    text-align: left !important;
  }
  .roadmap-step:nth-child(even) .roadmap-dot,
  .roadmap-step:nth-child(odd) .roadmap-dot {
    left: 12px;
    right: auto;
  }
  .roadmap-content {
    padding: 24px;
  }
}
`;

css += newCSS;
fs.writeFileSync('src/style.css', css);
console.log("CSS appended.");
