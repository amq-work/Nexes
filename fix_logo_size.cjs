const fs = require('fs');
const path = require('path');

const dir = __dirname;
const imgTagSmall = '<img src="/logo.png" alt="Digital Nexes Logo" class="logo-mark" style="width: 32px; height: auto;">';
const imgTagFull = '<img src="/logo.png" alt="Digital Nexes Logo" class="logo-mark" style="width: 100%; max-width: 180px; height: auto;">';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Remove <span>Digital Nexes</span> that comes right after the logo
        content = content.replace(/<img[^>]*src="\/logo\.png"[^>]*>\s*<span>Digital Nexes<\/span>/g, imgTagSmall);
        
        // Now change the width of the logo to full width
        content = content.replace(/style="width: 32px; height: auto;"/g, 'style="width: 100%; max-width: 180px; height: auto;"');

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated logos and removed text in ${file}`);
    }
});
