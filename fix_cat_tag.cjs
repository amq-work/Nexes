const fs = require('fs');
const path = require('path');
const directory = 'd:\\Personal\\Digital_Nexes_Website';
const stylePath = path.join(directory, 'src', 'pages.css');
if (fs.existsSync(stylePath)) {
    let styleContent = fs.readFileSync(stylePath, 'utf8');
    
    // add width: fit-content to fi-cat-tag
    styleContent = styleContent.replace(
        /\.fi-cat-tag \{/g,
        '.fi-cat-tag {\n  width: fit-content;'
    );
    
    fs.writeFileSync(stylePath, styleContent);
    console.log('Fixed pages.css cat tag width');
}
