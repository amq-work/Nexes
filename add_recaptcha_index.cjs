const fs = require('fs');

const siteKey = '6Lfl4j0tAAAAAHPe3u3URXHoq5BSRYO6njcJOsJg';
const recaptchaDiv = `\n            <div class="g-recaptcha" data-sitekey="${siteKey}" style="margin-bottom: 20px;"></div>`;

let pageHtml = fs.readFileSync('index.html', 'utf8');
if (!pageHtml.includes('recaptcha/api.js')) {
  pageHtml = pageHtml.replace('</head>', '  <script src="https://www.google.com/recaptcha/api.js" async defer></script>\n</head>');
}
const footerFormMatch = pageHtml.match(/<form id="whatsapp-lead-form"[\s\S]*?<\/form>/);
if (footerFormMatch && !footerFormMatch[0].includes('g-recaptcha')) {
  let modifiedForm = footerFormMatch[0].replace(/<button type="submit"/, recaptchaDiv + '\n          <button type="submit"');
  pageHtml = pageHtml.replace(footerFormMatch[0], modifiedForm);
  fs.writeFileSync('index.html', pageHtml);
  console.log('index.html updated with footer reCAPTCHA.');
} else {
  console.log('index.html skipped (no form found or already has recaptcha).');
}
