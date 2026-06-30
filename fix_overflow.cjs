const fs = require('fs');
const path = require('path');
const directory = 'd:\\Personal\\Digital_Nexes_Website';
const stylePath = path.join(directory, 'src', 'pages.css');
if (fs.existsSync(stylePath)) {
    let styleContent = fs.readFileSync(stylePath, 'utf8');
    
    // Change overflow-x: auto to overflow-x: hidden
    styleContent = styleContent.replace(
        /overflow-x:\s*auto\s*;/g,
        'overflow-x: hidden;'
    );
    
    fs.writeFileSync(stylePath, styleContent);
    console.log('Fixed pages.css overflow-x');
}
