const fs = require('fs');

let mainJs = fs.readFileSync('src/main.js', 'utf8');

const stackGSAP = `// ── 14. Stacking Testimonials GSAP ───────────────────────────────────────────────
(function initTestimonialsStack() {
  const cards = gsap.utils.toArray('.testi-stack-card');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    // We don't animate the last card because nothing stacks on top of it
    if (i === cards.length - 1) return;

    const inner = card.querySelector('.testi-stack-inner');
    
    ScrollTrigger.create({
      trigger: card,
      start: "top 15%", // When it becomes sticky
      endTrigger: cards[i + 1],
      end: "top 25%", // When the next card comes up over it
      animation: gsap.to(inner, {
        scale: 0.9,
        opacity: 0.5,
        filter: "blur(4px)",
        ease: "none"
      }),
      scrub: true
    });
  });
})();
`;

// Append to main.js if it's not already there
if (!mainJs.includes('14. Stacking Testimonials GSAP')) {
  mainJs += '\n' + stackGSAP;
  fs.writeFileSync('src/main.js', mainJs);
  console.log("GSAP stacking logic appended to main.js");
} else {
  console.log("GSAP stacking logic already exists in main.js");
}
