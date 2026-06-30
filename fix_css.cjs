const fs = require('fs');
const path = require('path');
const directory = 'd:\\Personal\\Digital_Nexes_Website';
const stylePath = path.join(directory, 'src', 'pages.css');
if (fs.existsSync(stylePath)) {
    let styleContent = fs.readFileSync(stylePath, 'utf8');
    
    // Add flex-grow to bc-excerpt
    styleContent = styleContent.replace(
        /\.bc-excerpt \{ font-size: 0\.85rem; color: rgba\(255,255,255,0\.55\); line-height: 1\.65; \}/,
        '.bc-excerpt { font-size: 0.85rem; color: rgba(255,255,255,0.55); line-height: 1.65; flex-grow: 1; }'
    );
    
    // Make sure bc-link is always aligned to the right, even when alone
    styleContent = styleContent.replace(
        /\.bc-link \{ font-size: 0\.8rem; color: rgba\(255,255,255,0\.5\); transition: color 0\.3s ease; \}/,
        '.bc-link { font-size: 0.8rem; color: rgba(255,255,255,0.5); transition: color 0.3s ease; margin-left: auto; }'
    );
    
    fs.writeFileSync(stylePath, styleContent);
    console.log('Fixed pages.css');
}
