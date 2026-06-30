const fs = require('fs');

let css = fs.readFileSync('src/style.css', 'utf8');

const oldHover = `.testi-marquee-card:hover {
  transform: translateY(-8px);
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.15);
}`;

const newHover = `.testi-marquee-card:hover {
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.25);
  box-shadow: 0 0 30px rgba(255,255,255,0.05); /* Light premium glow */
}`;

if (css.includes(oldHover)) {
  css = css.replace(oldHover, newHover);
  fs.writeFileSync('src/style.css', css);
  console.log("Hover effect updated successfully.");
} else {
  console.log("Could not find the exact hover CSS block to replace.");
}
