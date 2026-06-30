const fs = require('fs');
const path = require('path');

const dir = __dirname;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        let changed = false;

        // 1. Fix logo size — shrink to proper navbar height (40px)
        content = content.replace(
            /style="width: 100%; max-width: 180px; height: auto;"/g,
            'style="height: 40px; width: auto;"'
        );
        
        // 2. Remove the hero badge containing "Digital Growth Studio"
        content = content.replace(
            /<p class="hero-badge"[^>]*>[\s\S]*?<\/p>/g,
            ''
        );

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed ${file}`);
    }
});
