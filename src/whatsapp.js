// whatsapp.js — Handles the footer lead generation form and contact page forms

function validateEmail(email) {
  if (!email) return { isValid: false, error: 'Email is required.' };
  
  const cleanEmail = email.trim().toLowerCase();
  
  // Strict regex: prevents consecutive dots, leading/trailing dots, requires >=2 char TLD
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;
  
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  // Disposable email blocklist
  const disposableDomains = [
    'tempmail', 'guerrillamail', '10minutemail', 'mailinator', 'yopmail', 
    'throwawaymail', 'temp-mail', 'getnada', 'dispostable', 'sharklasers',
    'mailcatch', 'dropmail', 'nada'
  ];
  
  const domainPart = cleanEmail.split('@')[1];
  
  if (disposableDomains.some(domain => domainPart.includes(domain))) {
    return { isValid: false, error: 'Disposable or temporary email addresses are not allowed. Please use a valid email.' };
  }

  return { isValid: true, cleanEmail };
}

export function initWhatsAppForm() {
  // 1. Footer Lead Form
  const footerForms = document.querySelectorAll('#whatsapp-lead-form');
  footerForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('wa-name')?.value.trim();
      const rawEmail = document.getElementById('wa-email')?.value;
      const service = document.getElementById('wa-service')?.value;
      const message = document.getElementById('wa-message')?.value.trim();
      
      if (!name || !rawEmail || !service || !message) {
        alert('Please fill out all fields.');
        return;
      }

      const emailValidation = validateEmail(rawEmail);
      if (!emailValidation.isValid) {
        alert(emailValidation.error);
        return;
      }
      const email = emailValidation.cleanEmail;

      const waText = `Hello Digital Nexes,\n\nI would like to discuss a project.\n\nName: ${name}\nEmail: ${email}\nService Required: ${service}\n\nProject Details:\n${message}\n\nPlease get back to me regarding this inquiry.\n\nThank you.`;
      const encodedText = encodeURIComponent(waText);
      window.open(`https://wa.me/923455073802?text=${encodedText}`, '_blank', 'noopener,noreferrer');
      form.reset();
    });
  });

  // 2. Contact Page Forms
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const type = form.querySelector('input[name="inquiry_type"]')?.value || 'General Inquiry';

      let waText = `Hello Digital Nexes,\n\nI am reaching out regarding: ${type}\n\n`;
      let email = '';

      if (form.id === 'form-project') {
        const name = document.getElementById('pi-name').value.trim();
        const rawEmail = document.getElementById('pi-email').value;
        const emailValidation = validateEmail(rawEmail);
        if (!emailValidation.isValid) { alert(emailValidation.error); return; }
        email = emailValidation.cleanEmail;

        const company = document.getElementById('pi-company').value.trim();
        const budget = document.getElementById('pi-budget').value;
        const timeline = document.getElementById('pi-timeline').value;
        const message = document.getElementById('pi-message').value.trim();
        const services = Array.from(form.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value).join(', ');

        waText += `Name: ${name}\nEmail: ${email}\n`;
        if (company) waText += `Company: ${company}\n`;
        if (budget) waText += `Budget: ${budget}\n`;
        if (timeline) waText += `Timeline: ${timeline}\n`;
        if (services) waText += `Services Needed: ${services}\n`;
        waText += `\nProject Details:\n${message}`;

      } else if (form.id === 'form-service') {
        const name = document.getElementById('sr-name').value.trim();
        const rawEmail = document.getElementById('sr-email').value;
        const emailValidation = validateEmail(rawEmail);
        if (!emailValidation.isValid) { alert(emailValidation.error); return; }
        email = emailValidation.cleanEmail;

        const service = document.getElementById('sr-service').value;
        const message = document.getElementById('sr-message').value.trim();

        waText += `Name: ${name}\nEmail: ${email}\nPrimary Service: ${service}\n\nDetails:\n${message}`;

      } else if (form.id === 'form-partnership') {
        const name = document.getElementById('pa-name').value.trim();
        const rawEmail = document.getElementById('pa-email').value;
        const emailValidation = validateEmail(rawEmail);
        if (!emailValidation.isValid) { alert(emailValidation.error); return; }
        email = emailValidation.cleanEmail;

        const org = document.getElementById('pa-org').value.trim();
        const pType = document.getElementById('pa-type').value;
        const message = document.getElementById('pa-message').value.trim();

        waText += `Name: ${name}\nEmail: ${email}\nOrganization: ${org}\nPartnership Type: ${pType}\n\nOpportunity:\n${message}`;

      } else if (form.id === 'form-general') {
        const name = document.getElementById('g-name').value.trim();
        const rawEmail = document.getElementById('g-email').value;
        const emailValidation = validateEmail(rawEmail);
        if (!emailValidation.isValid) { alert(emailValidation.error); return; }
        email = emailValidation.cleanEmail;

        const subject = document.getElementById('g-subject').value.trim();
        const message = document.getElementById('g-message').value.trim();

        waText += `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
      }

      waText += `\n\nPlease get back to me.\n\nThank you.`;
      
      const encodedText = encodeURIComponent(waText);
      
      // Removed reCAPTCHA execution, launch WhatsApp directly
      window.open(`https://wa.me/923455073802?text=${encodedText}`, '_blank', 'noopener,noreferrer');
      form.reset();
    });
  });
}
