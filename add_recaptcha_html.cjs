const fs = require('fs');

const siteKey = '6Lfl4j0tAAAAAHPe3u3URXHoq5BSRYO6njcJOsJg';
const recaptchaDiv = `\n            <div class="g-recaptcha" data-sitekey="${siteKey}" style="margin-bottom: 20px;"></div>`;

// 1. Update contact.html
let html = fs.readFileSync('contact.html', 'utf8');

// Add script to head if not present
if (!html.includes('recaptcha/api.js')) {
  html = html.replace('</head>', '  <script src="https://www.google.com/recaptcha/api.js" async defer></script>\n</head>');
}

// Add widget before submit buttons
const forms = [
  'id="pi-submit"',
  'id="sr-submit"',
  'id="pa-submit"',
  'id="g-submit"',
  'id="wa-submit"' // Need to check if wa-submit exists in footer
];

html = html.replace('<button type="submit" class="btn-primary form-submit" id="pi-submit">', recaptchaDiv + '\n            <button type="submit" class="btn-primary form-submit" id="pi-submit">');
html = html.replace('<button type="submit" class="btn-primary form-submit" id="sr-submit">', recaptchaDiv + '\n            <button type="submit" class="btn-primary form-submit" id="sr-submit">');
html = html.replace('<button type="submit" class="btn-primary form-submit" id="pa-submit">', recaptchaDiv + '\n            <button type="submit" class="btn-primary form-submit" id="pa-submit">');
html = html.replace('<button type="submit" class="btn-primary form-submit" id="g-submit">', recaptchaDiv + '\n            <button type="submit" class="btn-primary form-submit" id="g-submit">');

// The footer lead form might just have a <button> inside the form
html = html.replace('<button type="submit" class="btn-primary form-submit">Send Message</button>', recaptchaDiv + '\n          <button type="submit" class="btn-primary form-submit">Send Message</button>');
// Let's do a more robust replace for the footer form if we don't know the exact button text
// I'll check index.html as well for the footer form
fs.writeFileSync('contact.html', html);
console.log("contact.html updated with reCAPTCHA widgets.");

// 2. Update index.html for footer form
const pagesToUpdate = ['index.html', 'about.html', 'services.html', 'projects.html', 'blog.html'];

pagesToUpdate.forEach(page => {
  if (fs.existsSync(page)) {
    let pageHtml = fs.readFileSync(page, 'utf8');
    if (!pageHtml.includes('recaptcha/api.js')) {
      pageHtml = pageHtml.replace('</head>', '  <script src="https://www.google.com/recaptcha/api.js" async defer></script>\n</head>');
    }
    
    // Inject before the footer form submit button
    const footerSubmitRegex = /<button type="submit" class="btn-primary[^>]*>.*?<\/button>/;
    // We only want to inject inside the footer form. 
    // Let's find the whatsapp-lead-form and inject before its button
    const footerFormMatch = pageHtml.match(/<form id="whatsapp-lead-form"[\s\S]*?<\/form>/);
    if (footerFormMatch && !footerFormMatch[0].includes('g-recaptcha')) {
      let modifiedForm = footerFormMatch[0].replace(/<button type="submit"/, recaptchaDiv + '\n          <button type="submit"');
      pageHtml = pageHtml.replace(footerFormMatch[0], modifiedForm);
      fs.writeFileSync(page, pageHtml);
      console.log(`${page} updated with footer reCAPTCHA.`);
    }
  }
});
