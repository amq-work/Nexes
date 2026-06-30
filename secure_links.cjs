const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let original = content;

  // Find all <a ... target="_blank" ...> and ensure rel="noopener noreferrer" is present
  content = content.replace(/<a([^>]+)target="_blank"([^>]*)>/gi, (match, p1, p2) => {
    if (match.includes('rel=')) {
      // It already has a rel attribute, let's make sure it contains noopener noreferrer
      return match.replace(/rel="([^"]+)"/, (relMatch, relContent) => {
        let newRel = relContent;
        if (!newRel.includes('noopener')) newRel += ' noopener';
        if (!newRel.includes('noreferrer')) newRel += ' noreferrer';
        return `rel="${newRel.trim()}"`;
      });
    } else {
      // Doesn't have a rel attribute, so we add it
      return `<a${p1}target="_blank" rel="noopener noreferrer"${p2}>`;
    }
  });

  if (content !== original) {
    fs.writeFileSync(path.join(dir, file), content);
    console.log(`Secured external links in ${file}`);
  }
});
console.log('Link security scan complete.');
