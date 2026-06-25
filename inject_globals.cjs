const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith(''));

const navbarHtml = `  <header class="navbar" id="navbar">
    <div class="container nav-inner">
      <a href="/" class="logo" id="logo-link">
        <svg class="logo-mark" width="26" height="26" viewBox="0 0 26 26" fill="none">
          <polygon points="13,1 25,7.5 25,18.5 13,25 1,18.5 1,7.5" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" fill="none"/>
          <polygon points="13,7 19,10.5 19,17.5 13,21 7,17.5 7,10.5" fill="rgba(255,255,255,0.06)"/>
          <circle cx="13" cy="13" r="2.5" fill="#ffffff"/>
        </svg>
        <span>Digital Nexes</span>
      </a>
      <nav class="nav-links" id="nav-links" role="navigation" aria-label="Primary navigation">
        <a href="/"       data-page="index">Home</a>
        <a href="/about"       data-page="about">About</a>
        <a href="/services"    data-page="services">Services</a>
        <a href="/projects"    data-page="projects">Work</a>
        <a href="/careers"     data-page="careers">Careers</a>
        <a href="/blog"        data-page="blog">Insights</a>
        <a href="/contact"     data-page="contact">Contact</a>
      </nav>
      <a href="/contact" class="btn-primary nav-cta" id="nav-cta">Let's Talk</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;

const ctaHtml = `  <!-- ═══════════════════════════════════════════════════════════════════════
       CTA / CONTACT
  ════════════════════════════════════════════════════════════════════════════ -->
  <section class="cta-section" id="contact">
    <div class="container cta-inner">
      <p class="eyebrow reveal-text">Let's Build Together</p>
      <h2 class="reveal-text">
        Ready to establish,<br />
        <span class="gradient-text">optimize, and scale?</span>
      </h2>
      <p class="reveal-text">Tell us about your project and let's map a path to real results. No fluff, no jargon — just honest strategy.</p>
      <a href="/contact" class="btn-primary btn-large reveal-text" id="cta-email-btn">Start a Conversation &rarr;</a>
    </div>
  </section>`;

const footerHtml = `  <footer class="footer" id="footer">
    <div class="container footer-inner">

      <div class="footer-lead-form glass-card">
        <div class="flf-content">
          <h3>Let's Build Something Great Together</h3>
          <p>Interested in working with Digital Nexes? Tell us about your project and start the conversation directly through WhatsApp.</p>
        </div>
        <form id="whatsapp-lead-form" class="flf-form">
          <div class="form-row">
            <div class="form-group">
              <input type="text" id="wa-name" placeholder="Enter your full name" required />
            </div>
            <div class="form-group">
              <input type="email" id="wa-email" placeholder="Enter your email address" required />
            </div>
          </div>
          <div class="form-group">
            <select id="wa-service" required>
              <option value="" disabled selected>Service Required</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Website Development">Website Development</option>
              <option value="Web Application Development">Web Application Development</option>
              <option value="Custom Software Development">Custom Software Development</option>
              <option value="SEO">SEO</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Branding">Branding</option>
              <option value="Business Development">Business Development</option>
              <option value="Automation Solutions">Automation Solutions</option>
              <option value="Technology Consulting">Technology Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <textarea id="wa-message" placeholder="Tell us about your project, goals, requirements, or challenges..." required rows="4"></textarea>
          </div>
          <button type="submit" class="btn-primary">Start Conversation</button>
        </form>
      </div>

      <div class="footer-top">
        <div class="footer-brand">
          <a href="/" class="logo footer-logo" id="footer-logo">
            <svg class="logo-mark" width="24" height="24" viewBox="0 0 26 26" fill="none">
              <polygon points="13,1 25,7.5 25,18.5 13,25 1,18.5 1,7.5" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" fill="none"/>
              <polygon points="13,7 19,10.5 19,17.5 13,21 7,17.5 7,10.5" fill="rgba(255,255,255,0.05)"/>
              <circle cx="13" cy="13" r="2.5" fill="#ffffff"/>
            </svg>
            <span>Digital Nexes</span>
          </a>
          <p class="footer-tagline">A growth-focused digital studio helping businesses establish, optimize, and scale their digital presence.</p>
        </div>
        <div class="footer-links-group">
          <div class="footer-col">
            <h5>Services</h5>
            <a href="/services">UI/UX Design</a>
            <a href="/services">Website Development</a>
            <a href="/services">SEO</a>
            <a href="/services">Digital Marketing</a>
            <a href="/services">Branding &amp; Identity</a>
            <a href="/services">Business Development</a>
            <a href="/services">Custom Software</a>
          </div>
          <div class="footer-col">
            <h5>Company</h5>
            <a href="/#why-us">Why Us</a>
            <a href="/projects">Our Work</a>
            <a href="/about">Team</a>
            <a href="/about#roadmap">Roadmap</a>
            <a href="/#faq">FAQ</a>
          </div>
          <div class="footer-col">
            <h5>Contact</h5>
            <a href="mailto:info@digitalnexes.com">info@digitalnexes.com</a>
            <a href="tel:03455073802">03455073802</a>
            <a href="/careers">Careers</a>
            <a href="/community">Community</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 Digital Nexes. All rights reserved.</p>
        <div class="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>`;

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove Header
  content = content.replace(/<header class="navbar" id="navbar">[\s\S]*?<\/header>/, navbarHtml);

  // Remove CTA completely from everywhere
  content = content.replace(/<!-- ═══════════════════════════════════════════════════════════════════════\s*CTA \/ CONTACT\s*════════════════════════════════════════════════════════════════════════════ -->/g, '');
  content = content.replace(/<section class="cta-section"[^>]*>[\s\S]*?<\/section>/g, '');

  // Replace Footer
  content = content.replace(/<footer class="footer" id="footer">[\s\S]*?<\/footer>/, footerHtml);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed:', file);
});
