const fs = require('fs');
const path = require('path');

const dir = __dirname;
const imgTag = '<img src="/logo.png" alt="Digital Nexes Logo" class="logo-mark" style="width: 32px; height: auto;">';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Regex to match the SVG logo in header, footer, and loader
        // <svg class="logo-mark"...>...</svg> or <svg width="32" height="32" viewBox="0 0 26 26"...>...</svg>
        
        const svgRegex = /<svg[^>]*class="logo-mark"[^>]*>[\s\S]*?<\/svg>/g;
        content = content.replace(svgRegex, imgTag);
        
        const loaderSvgRegex = /<svg width="32" height="32" viewBox="0 0 26 26" fill="none">[\s\S]*?<\/svg>/g;
        content = content.replace(loaderSvgRegex, imgTag);

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated logos in ${file}`);
    }
});
