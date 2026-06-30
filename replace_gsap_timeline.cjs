const fs = require('fs');
const path = require('path');

const mainFile = path.join(__dirname, 'src', 'main.js');
let js = fs.readFileSync(mainFile, 'utf-8');

const startMarker = '// ── 13. Process — Scroll-driven 5-stage pin ────────────────────────────────────';
const endMarker = '// ── 13b. Projects List Reveal ─────────────────────────────────────────────────────';

const newJS = `// ── 13. Process — Timeline GSAP ────────────────────────────────────────────────
(function initTimelineAnimation() {
  const container = document.querySelector('.timeline-container');
  if (!container) return;

  const lineFill = container.querySelector('.timeline-line-fill');
  const items = gsap.utils.toArray('.timeline-item');

  // Set initial states
  if (lineFill) {
    gsap.set(lineFill, { height: 0 });
    
    // Create a scroll trigger for the timeline line fill
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      animation: gsap.to(lineFill, { height: "100%", ease: "none" }),
      scrub: true
    });
  }
  
  items.forEach((item, i) => {
    // Initial state: hidden and slightly pushed down
    gsap.set(item, { opacity: 0, y: 60 });
    const dot = item.querySelector('.timeline-dot');
    
    ScrollTrigger.create({
      trigger: item,
      start: "top 65%", // Trigger when top of item is 65% down the viewport
      onEnter: () => {
        gsap.to(item, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
        if (dot) dot.classList.add('active');
      },
      onLeaveBack: () => {
        gsap.to(item, { opacity: 0, y: 60, duration: 0.5, ease: "power2.in" });
        if (dot) dot.classList.remove('active');
      }
    });
  });
})();

`;

const startIndex = js.indexOf(startMarker);
const endIndex = js.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    js = js.substring(0, startIndex) + newJS + js.substring(endIndex);
    fs.writeFileSync(mainFile, js, 'utf-8');
    console.log('Replaced GSAP animation logic');
} else {
    console.log('Markers not found in main.js', startIndex, endIndex);
}
