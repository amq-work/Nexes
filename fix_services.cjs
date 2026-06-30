const fs = require('fs');
const path = require('path');

const dir = __dirname;

// 1. Update services.html
const servicesPath = path.join(dir, 'services.html');
let servicesHtml = fs.readFileSync(servicesPath, 'utf-8');
servicesHtml = servicesHtml.replace(
    '<h1 class="page-hero-title reveal-hero scramble">Full-Stack<br /><span class="gradient-text">Digital Growth</span></h1>',
    '<h1 class="page-hero-title reveal-hero scramble">Services and<br /><span class="gradient-text">Digital Solutions</span></h1>'
);
fs.writeFileSync(servicesPath, servicesHtml, 'utf-8');
console.log('Updated services.html hero');

// 2. Update index.html service links
const indexPath = path.join(dir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

const replacements = {
    'href="/service-ui-ux"': 'href="/services.html#design-services"',
    'href="/service-web-dev"': 'href="/services.html#dev-services"',
    'href="/service-seo"': 'href="/services.html#marketing-services"',
    'href="/service-marketing"': 'href="/services.html#marketing-services"',
    'href="/service-branding"': 'href="/services.html#design-services"',
    'href="/service-business"': 'href="/services.html#biz-services"',
    'href="/service-software"': 'href="/services.html#dev-services"'
};

for (const [oldHref, newHref] of Object.entries(replacements)) {
    // Regex to match globally
    const regex = new RegExp(oldHref.replace('/', '\\/'), 'g');
    indexHtml = indexHtml.replace(regex, newHref);
}

fs.writeFileSync(indexPath, indexHtml, 'utf-8');
console.log('Updated index.html service links');

// 3. Delete obsolete service files
const filesToDelete = [
    'service-ui-ux.html',
    'service-web-dev.html',
    'service-seo.html',
    'service-marketing.html',
    'service-branding.html',
    'service-business.html',
    'service-software.html'
];

for (const file of filesToDelete) {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted ${file}`);
    }
}
