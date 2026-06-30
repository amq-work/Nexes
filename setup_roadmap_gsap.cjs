const fs = require('fs');

let mainJs = fs.readFileSync('src/main.js', 'utf8');

// 1. Remove roadmap-flex from the generic reveal list so it doesn't clash
mainJs = mainJs.replace('.why-grid, .industries-grid, .roadmap-flex, .vm-cards, .faq-col', '.why-grid, .industries-grid, .vm-cards, .faq-col');

// 2. Append the new roadmap timeline GSAP block right after the process timeline
const oldProcessGSAPEnd = `    });
  });
})();

// ── 13b. Projects List Reveal ─────────────────────────────────────────────────────`;

const roadmapGSAP = `    });
  });
})();

// ── 13a. Roadmap Timeline GSAP ──────────────────────────────────────────────────
(function initRoadmapTimeline() {
  const container = document.querySelector('.roadmap-timeline');
  if (!container) return;

  const progressLine = document.getElementById('roadmap-progress');
  const items = gsap.utils.toArray('.roadmap-step');

  // Scrub the vertical progress line height based on scroll
  if (progressLine) {
    gsap.set(progressLine, { height: '0%' });
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      animation: gsap.to(progressLine, { height: '100%', ease: "none" }),
      scrub: true
    });
  }

  // Fade in each step and active dot
  items.forEach((item, i) => {
    // Initial state: hidden and slightly pushed down
    gsap.set(item, { opacity: 0, y: 60 });
    const dot = item.querySelector('.roadmap-dot');
    
    ScrollTrigger.create({
      trigger: item,
      start: "top 75%", // Trigger when top of item is 75% down viewport
      onEnter: () => {
        gsap.to(item, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
        if (dot) gsap.to(dot, { scale: 1.3, backgroundColor: '#fff', duration: 0.4 });
      },
      onLeaveBack: () => {
        gsap.to(item, { opacity: 0, y: 60, duration: 0.8, ease: "power2.in" });
        if (dot) gsap.to(dot, { scale: 1, backgroundColor: '#000', duration: 0.4 });
      }
    });
  });
})();

// ── 13b. Projects List Reveal ─────────────────────────────────────────────────────`;

if (mainJs.includes(oldProcessGSAPEnd)) {
  mainJs = mainJs.replace(oldProcessGSAPEnd, roadmapGSAP);
  fs.writeFileSync('src/main.js', mainJs);
  console.log("main.js successfully updated with Roadmap GSAP animation.");
} else {
  console.log("Could not find insertion point in main.js.");
}
