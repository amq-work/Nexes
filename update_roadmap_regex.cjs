const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

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

// Use regex to match the exact .roadmap-flex block
const regex = /<div class="roadmap-flex" id="roadmap-flex">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;

// Wait, the outer section ends with </div></section>. So let's just match roadmap-flex itself.
const flexRegex = /<div class="roadmap-flex" id="roadmap-flex">[\s\S]*?(?=<\/div>\s*<\/section>)/;

const match = html.match(flexRegex);
if (match) {
  html = html.replace(flexRegex, newRoadmap + "\n      ");
  fs.writeFileSync('index.html', html);
  console.log("HTML successfully updated via regex!");
} else {
  console.log("Regex did not match.");
}
