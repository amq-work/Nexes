const fs = require('fs');
const path = require('path');

const dir = __dirname;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        // Update logo inline style to 48px height
        content = content.replace(
            /style="height: 40px; width: auto;"/g,
            'style="height: 48px; width: auto;"'
        );

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated logo size in ${file}`);
    }
});
