const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let original = content;

  // Remove the specific paragraph and the orphaned closing div that follows it
  content = content.replace(/<p class="loader-copy">Digital Growth Studio<\/p>\s*<\/div>/g, '');

  if (content !== original) {
    fs.writeFileSync(path.join(dir, file), content);
    console.log(`Updated ${file}`);
  }
});
console.log('Text removal complete.');
