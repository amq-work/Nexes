const fs = require('fs');

let js = fs.readFileSync('src/whatsapp.js', 'utf8');

const footerCheck = `
      if (!name || !email || !service || !message) {
        alert('Please fill out all fields.');
        return;
      }
      
      const recaptchaResponse = form.querySelector('.g-recaptcha-response');
      if (recaptchaResponse && !recaptchaResponse.value) {
        alert('Please complete the reCAPTCHA to verify you are human.');
        return;
      }
`;

const contactCheck = `
      const type = form.querySelector('input[name="inquiry_type"]')?.value || 'General Inquiry';
      
      const recaptchaResponse = form.querySelector('.g-recaptcha-response');
      if (recaptchaResponse && !recaptchaResponse.value) {
        alert('Please complete the reCAPTCHA to verify you are human.');
        return;
      }
`;

if (!js.includes('recaptchaResponse')) {
  js = js.replace(`
      if (!name || !email || !service || !message) {
        alert('Please fill out all fields.');
        return;
      }`, footerCheck);

  js = js.replace(`
      const type = form.querySelector('input[name="inquiry_type"]')?.value || 'General Inquiry';`, contactCheck);

  fs.writeFileSync('src/whatsapp.js', js);
  console.log('whatsapp.js updated with reCAPTCHA verification.');
} else {
  console.log('whatsapp.js already has reCAPTCHA verification.');
}
