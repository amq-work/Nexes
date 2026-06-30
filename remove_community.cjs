const fs = require('fs');
const path = require('path');

const dir = __dirname;
const communityFile = path.join(dir, 'community.html');

// Delete community.html if it exists
if (fs.existsSync(communityFile)) {
    fs.unlinkSync(communityFile);
    console.log('Deleted community.html');
}

// Remove links to /community from all HTML files
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Regex to match <a href="/community">Community</a> or similar
        // usually it's in the footer like <a href="/community">Community</a>
        const originalContent = content;
        content = content.replace(/<a[^>]*href="\/community"[^>]*>.*?<\/a>/g, '');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Removed community link from ${file}`);
        }
    }
});
