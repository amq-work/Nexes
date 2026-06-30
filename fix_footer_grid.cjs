const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

css = css.replace('.cf-right { grid-template-columns: 1fr; }', '.cf-right { grid-template-columns: repeat(2, 1fr); gap: 24px; }');

// Make the 3rd column (Legal) span both columns on small screens so it looks clean underneath
css += `
@media (max-width: 600px) {
  .cf-right > div:nth-child(3) {
    grid-column: 1 / -1;
  }
}
`;

fs.writeFileSync('src/style.css', css);
console.log("Footer mobile grid updated.");
