const fs = require('fs');
const path = require('path');

const styleFile = path.join(__dirname, 'src', 'style.css');
let css = fs.readFileSync(styleFile, 'utf-8');

const newCSS = `
/* --- Enhanced Timeline CSS --- */
.ambient-orb { position: absolute; border-radius: 50%; filter: blur(120px); z-index: 0; pointer-events: none; opacity: 0.4; }
.orb-1 { width: 600px; height: 600px; background: rgba(80, 40, 255, 0.15); top: -100px; left: -200px; animation: pulseOrb 8s ease-in-out infinite alternate; }
.orb-2 { width: 500px; height: 500px; background: rgba(0, 200, 255, 0.1); bottom: -50px; right: -150px; animation: pulseOrb 10s ease-in-out infinite alternate-reverse; }

@keyframes pulseOrb {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.2) translate(50px, 30px); }
}

.timeline-svg-path {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100px;
  height: 100%;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}

.timeline-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
  color: #fff;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

.timeline-item:hover .timeline-icon-wrap {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05) translateY(-2px);
}

.glass-spotlight {
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.glass-spotlight::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 50% -20%, rgba(255,255,255,0.08) 0%, transparent 60%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.timeline-item:hover .glass-spotlight::before {
  opacity: 1;
}

@media (max-width: 768px) {
  .timeline-svg-path {
    left: 24px;
    transform: translateX(-50px);
  }
}
`;

if (!css.includes('.ambient-orb')) {
    css += '\n' + newCSS;
    fs.writeFileSync(styleFile, css, 'utf-8');
    console.log('Appended enhanced timeline CSS');
}
