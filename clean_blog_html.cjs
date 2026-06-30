const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'blog.html');
let html = fs.readFileSync(file, 'utf-8');

// Remove any inline 'display: flex;' or other conflicting inline styles from blog-card elements
html = html.replace(/<a href="([^"]+)" class="blog-card reveal-card" data-category="([^"]+)" style="text-decoration: none; display: flex;">/g, '<a href="$1" class="blog-card reveal-card" data-category="$2">');

html = html.replace(/<a href="([^"]+)" class="blog-card reveal-card" data-category="([^"]+)" style="text-decoration: none;">/g, '<a href="$1" class="blog-card reveal-card" data-category="$2">');

fs.writeFileSync(file, html, 'utf-8');
console.log('Removed inline styles from blog cards in blog.html');
