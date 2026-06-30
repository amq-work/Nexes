const fs = require('fs');
const path = require('path');

const directory = 'd:\\Personal\\Digital_Nexes_Website';

// 1. Fix .scramble in HTML files
const htmlFiles = [
    'services.html', 'projects.html', 'contact.html', 'case-studies.html',
    'careers.html', 'blog.html', 'about.html'
];

htmlFiles.forEach(file => {
    let filePath = path.join(directory, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace inner text with scramble spans for various patterns
        // We look for: <h1 class="page-hero-title reveal-hero scramble">text<br /><span class="gradient-text">text</span></h1>
        // and its variations.
        
        content = content.replace(/class="page-hero-title reveal-hero scramble"/g, 'class="page-hero-title reveal-hero"');
        
        // This regex covers: Text<br><span...>Text</span> or Text<br /><span...>Text</span>
        // Also it covers cases where there is &amp;
        content = content.replace(/<h1 class="page-hero-title reveal-hero">([\s\S]*?)<br(?: \/)?>(?:\s*)<span class="gradient-text">([\s\S]*?)<\/span><\/h1>/g, (match, p1, p2) => {
            return `<h1 class="page-hero-title reveal-hero"><span class="scramble">${p1.trim()}</span><br /><span class="gradient-text scramble">${p2.trim()}</span></h1>`;
        });
        
        fs.writeFileSync(filePath, content);
        console.log('Fixed scramble in ' + file);
    }
});

// 2. Fix hamburger z-index in src/style.css
const stylePath = path.join(directory, 'src', 'style.css');
if (fs.existsSync(stylePath)) {
    let styleContent = fs.readFileSync(stylePath, 'utf8');
    styleContent = styleContent.replace(
        /\.hamburger \{\s*display: none;\s*flex-direction: column;\s*gap: 5px;\s*background: none;\s*border: none;\s*cursor: none;\s*padding: 4px;\s*\}/,
        '.hamburger {\n  display: none;\n  flex-direction: column;\n  gap: 5px;\n  background: none;\n  border: none;\n  cursor: none;\n  padding: 4px;\n  position: relative;\n  z-index: 9001;\n}'
    );
    fs.writeFileSync(stylePath, styleContent);
    console.log('Fixed hamburger z-index in style.css');
}

// 3. Fix projects.html padding
const projectsPath = path.join(directory, 'projects.html');
if (fs.existsSync(projectsPath)) {
    let projectsContent = fs.readFileSync(projectsPath, 'utf8');
    projectsContent = projectsContent.replace(
        /<section class="section" id="projects-filter" style="padding-top: 0; padding-bottom: 32px;">/,
        '<section class="section" id="projects-filter" style="padding-top: 48px; padding-bottom: 32px;">'
    );
    fs.writeFileSync(projectsPath, projectsContent);
    console.log('Fixed padding in projects.html');
}

// 4. Fix blog.html sections
const blogPath = path.join(directory, 'blog.html');
if (fs.existsSync(blogPath)) {
    let blogContent = fs.readFileSync(blogPath, 'utf8');
    
    // Close #blog-featured properly
    blogContent = blogContent.replace(
        /<\/div>\s*<\/div>\s*<h2 style="margin-bottom: 24px; font-size: 2rem; color: #fff; margin-top: 64px;">Latest Articles<\/h2>\s*<!-- CATEGORY FILTER -->\s*<section class="section" id="blog-filter" style="margin-top: 48px; padding-top: 0; padding-bottom: 24px;">\s*<div class="container">\s*<div class="filter-bar" id="blog-filter-bar" role="group" aria-label="Article categories">/,
        '        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class="section" id="blog-latest" style="padding-top: 0; padding-bottom: 24px;">\n    <div class="container">\n      <h2 style="margin-bottom: 24px; font-size: 2rem; color: #fff; margin-top: 64px;">Latest Articles</h2>\n\n<!-- CATEGORY FILTER -->\n      <div class="filter-bar" id="blog-filter-bar" role="group" aria-label="Article categories">'
    );
    fs.writeFileSync(blogPath, blogContent);
    console.log('Fixed sections in blog.html');
}
