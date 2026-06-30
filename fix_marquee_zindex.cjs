const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');
css = css.replace('z-index: 1;\n}', 'z-index: 20;\n}');
fs.writeFileSync('src/style.css', css);
console.log("Updated z-index for testi-marquee-container.");
