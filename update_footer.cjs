const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf-8');
const splitPoint = '/* ═══════════════════════════════════════════════════════════════════════════\r\n   FOOTER — REDESIGN';
let parts = css.split(splitPoint);
if (parts.length === 1) {
  parts = css.split('/* ═══════════════════════════════════════════════════════════════════════════\n   FOOTER — REDESIGN');
}

let newCSS = parts[0] + `
/* ═══════════════════════════════════════════════════════════════════════════
   CREATIVE FOOTER
   ════════════════════════════════════════════════════════════════════════ */
.creative-footer {
  background: #000;
  border-top: 1px solid rgba(255,255,255,0.06);
  position: relative;
  overflow: hidden;
  padding-top: 60px;
}

.cf-marquee-wrap {
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  border-top: 1px solid rgba(255,255,255,0.05);
  padding: 24px 0;
  background: rgba(255,255,255,0.02);
}

.cf-marquee {
  display: flex;
  align-items: center;
  gap: 40px;
  white-space: nowrap;
  animation: cfMarquee 20s linear infinite;
}

.cf-marquee span {
  font-family: 'Outfit', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: -0.02em;
}
.cf-marquee .cf-dot {
  font-size: 2rem;
  color: rgba(255,255,255,0.2);
}

@keyframes cfMarquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.cf-inner {
  padding-top: 80px;
  padding-bottom: 60px;
}

.cf-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 60px;
}

.cf-left {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.cf-tagline {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  max-width: 350px;
}

.cf-contact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cf-contact a {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 500;
  color: #fff;
  transition: opacity 0.3s ease;
}
.cf-contact a:hover { opacity: 0.7; }

.cf-socials {
  display: flex;
  gap: 24px;
}
.cf-socials a {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
  transition: color 0.3s ease;
}
.cf-socials a:hover { color: #fff; }

.cf-right {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.cf-links-col h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
}

.cf-links-col a {
  display: block;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 14px;
  transition: color 0.3s ease, transform 0.3s ease;
}
.cf-links-col a:hover {
  color: #fff;
  transform: translateX(4px);
}

.cf-giant-text-wrap {
  width: 100%;
  overflow: hidden;
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.cf-giant-text {
  font-family: 'Outfit', sans-serif;
  font-size: 18vw;
  font-weight: 800;
  line-height: 0.8;
  color: rgba(255,255,255,0.03);
  margin: 0;
  white-space: nowrap;
  letter-spacing: -0.04em;
  user-select: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: color 0.5s ease;
}
.cf-giant-text:hover {
  background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
  -webkit-background-clip: text;
}

.cf-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.cf-bottom p, .cf-back-to-top {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
}
.cf-back-to-top:hover { color: #fff; }

@media (max-width: 900px) {
  .cf-grid { grid-template-columns: 1fr; gap: 60px; }
  .cf-right { grid-template-columns: repeat(2, 1fr); }
  .cf-giant-text { font-size: 24vw; }
}
@media (max-width: 600px) {
  .cf-right { grid-template-columns: 1fr; }
  .cf-bottom { flex-direction: column; gap: 16px; text-align: center; }
}

/* ── Blogs Split Header ── */
.bi-header-split {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 72px;
  gap: 40px;
}
.bi-header-left { flex: 1; }
.bi-header-right { flex: 1; display: flex; justify-content: flex-end; }
@media (max-width: 768px) {
  .bi-header-split { flex-direction: column; align-items: flex-start; gap: 20px; margin-bottom: 48px; }
  .bi-header-right { justify-content: flex-start; }
}
`;
fs.writeFileSync('src/style.css', newCSS);
console.log('CSS replaced successfully');
