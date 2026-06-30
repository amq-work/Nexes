const fs = require('fs');
const path = require('path');

const dir = __dirname;
const faviconTag = '<link rel="icon" type="image/png" href="/favicon.png">';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Remove existing favicon if any
        content = content.replace(/<link[^>]*rel=["']icon["'][^>]*>/gi, '');
        content = content.replace(/<link[^>]*rel=["']shortcut icon["'][^>]*>/gi, '');
        
        // Ensure title is Digital Nexes if not already present or something else
        // But let's just inject the favicon tag before </head>
        if (content.includes('</head>')) {
            content = content.replace('</head>', `    ${faviconTag}\n</head>`);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Updated ${file}`);
        }
    }
});
