const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'style.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// 1. Navbar sticky issue: On mobile, 'position: fixed' can be buggy if a parent has a transform. 
// However, adding a fallback and ensuring the navbar stays on top.
if (!css.includes('/* Mobile Fixes */')) {
    css += `\n/* Mobile Fixes */
@media (max-width: 768px) {
  /* Hide nav CTA button on mobile as it overlaps hamburger */
  .nav-cta { display: none !important; }
  
  /* Ensure header remains sticky and has background */
  .navbar { position: fixed !important; top: 0 !important; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); }
  
  /* Fix 5 stages of work misaligned on mobile */
  #process { height: auto !important; min-height: auto !important; padding: 60px 0; }
  .process-scroll-track { width: 100% !important; flex-direction: column !important; position: static !important; }
  .process-stage { position: static !important; opacity: 1 !important; transform: none !important; pointer-events: auto !important; margin-bottom: 24px; height: auto !important; }
  .process-dots { display: none !important; }
  .process-scroll-line { display: none !important; }
  
  /* Footer alignment */
  .footer-links-group { flex-direction: column !important; gap: 32px !important; }
  .footer-col { text-align: left !important; align-items: flex-start !important; }
  .footer-bottom { flex-direction: column !important; gap: 16px !important; text-align: center !important; }
  
  /* Hero alignment across all pages */
  .hero-container { padding: 120px 20px 60px !important; text-align: center !important; }
  .hero-title { font-size: 2.8rem !important; }
  .hero-sub { font-size: 1rem !important; }
}
`;
}

fs.writeFileSync(cssPath, css, 'utf-8');
console.log('Mobile CSS fixes applied');
