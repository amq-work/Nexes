const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// --- 1. Live Gradients for Hero & Footer ---
const liveGradientCSS = `
/* Live Moving Gradients */
@keyframes liveMesh {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes spinRing {
  100% { transform: rotate(360deg); }
}

.hero-glass-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(-45deg, #000000, #1c1c1c, #0a0a0a, #242424);
  background-size: 400% 400%;
  animation: liveMesh 18s ease-in-out infinite;
  opacity: 0.9;
}
.hero-glass-grid::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
}

.footer {
  position: relative;
  overflow: hidden;
}
.footer::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: linear-gradient(135deg, #050505, #1a1a1a, #000, #222);
  background-size: 300% 300%;
  animation: liveMesh 25s ease infinite;
  z-index: 0;
  pointer-events: none;
}
.footer-inner {
  position: relative;
  z-index: 1;
}
`;

if (!css.includes('@keyframes liveMesh')) {
  css += '\n' + liveGradientCSS;
}

// Ensure the hero elements have proper z-index above the animated background
css = css.replace(/\.hero-content \{([\s\S]*?)\}/, ".hero-content {$1 position: relative; z-index: 2; }");

// --- 2. Improve TEAM section more ---
// Replace the previous team-card CSS with a much more premium version
const newTeamCardCSS = `
.team-card {
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: var(--blur);
  padding: 48px 32px;
  width: calc(33.333% - 16px); 
  min-width: 280px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.5s var(--ease-out), box-shadow 0.5s ease, border-color 0.5s ease;
}
.team-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 100%;
  background: radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.team-card:hover {
  transform: translateY(-12px);
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
}
.team-card:hover::before {
  opacity: 1;
}
.team-avatar-wrap {
  position: relative;
  width: 90px;
  height: 90px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.team-avatar {
  width: 100%;
  height: 100%;
  background: #111;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  color: #fff;
  position: relative;
  z-index: 2;
  transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease;
}
.team-card:hover .team-avatar {
  transform: scale(1.05);
  border-color: rgba(255,255,255,0.3);
  background: #1a1a1a;
}
.team-avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), transparent 60%);
  animation: spinRing 4s linear infinite;
  opacity: 0;
  transition: opacity 0.5s ease;
  mask-image: radial-gradient(transparent 55%, black 56%);
  -webkit-mask-image: radial-gradient(transparent 55%, black 56%);
}
.team-card:hover .team-avatar-ring {
  opacity: 1;
}
.team-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}
.team-role {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.team-bio {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
}
`;

// Remove old .team-card CSS blocks
css = css.replace(/\.team-card \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-card::after \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-card:hover \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-avatar-wrap \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-card:hover \.team-avatar \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-avatar-ring \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-card:hover \.team-avatar-ring \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-name \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-role \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-bio \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.team-avatar \{[\s\S]*?\}\n/g, '');

// Append new team CSS
css += '\n' + newTeamCardCSS;

fs.writeFileSync('src/style.css', css);
console.log("Enhancements applied.");
