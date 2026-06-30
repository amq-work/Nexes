const fs = require('fs');
let js = fs.readFileSync('src/whatsapp.js', 'utf8');

// Replace standard window.open with the secure version
js = js.replace(/window\.open\(([^,]+),\s*'_blank'\);/g, "window.open($1, '_blank', 'noopener,noreferrer');");

fs.writeFileSync('src/whatsapp.js', js);
console.log('whatsapp.js secured window.open calls.');
