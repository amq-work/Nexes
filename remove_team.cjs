const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Regex to remove the team section safely
const regexTeamSection = /<!-- ═══════════════════════════════════════════════════════════════════════\s*TEAM\s*════════════════════════════════════════════════════════════════════════════ -->\s*<section class="section" id="team">[\s\S]*?<\/section>\s*/;

if(html.match(regexTeamSection)){
  html = html.replace(regexTeamSection, '');
  fs.writeFileSync('index.html', html);
  console.log("Team section removed successfully");
} else {
  // If it doesn't match the comments, try just the section
  const backupRegex = /<section class="section" id="team">[\s\S]*?<\/section>/;
  if(html.match(backupRegex)){
    html = html.replace(backupRegex, '');
    fs.writeFileSync('index.html', html);
    console.log("Team section removed without comments");
  } else {
    console.log("Could not find team section");
  }
}
