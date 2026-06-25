// whatsapp.js — Handles the footer lead generation form and contact page forms

export function initWhatsAppForm() {
  // 1. Footer Lead Form
  const footerForms = document.querySelectorAll('#whatsapp-lead-form');
  footerForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('wa-name')?.value.trim();
      const email = document.getElementById('wa-email')?.value.trim();
      const service = document.getElementById('wa-service')?.value;
      const message = document.getElementById('wa-message')?.value.trim();
      
      if (!name || !email || !service || !message) {
        alert('Please fill out all fields.');
        return;
      }
      const waText = `Hello Digital Nexes,\n\nI would like to discuss a project.\n\nName: ${name}\nEmail: ${email}\nService Required: ${service}\n\nProject Details:\n${message}\n\nPlease get back to me regarding this inquiry.\n\nThank you.`;
      const encodedText = encodeURIComponent(waText);
      window.open(`https://wa.me/923455073802?text=${encodedText}`, '_blank');
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

      if (form.id === 'form-project') {
        const name = document.getElementById('pi-name').value.trim();
        const email = document.getElementById('pi-email').value.trim();
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
        const email = document.getElementById('sr-email').value.trim();
        const service = document.getElementById('sr-service').value;
        const message = document.getElementById('sr-message').value.trim();

        waText += `Name: ${name}\nEmail: ${email}\nPrimary Service: ${service}\n\nDetails:\n${message}`;

      } else if (form.id === 'form-partnership') {
        const name = document.getElementById('pa-name').value.trim();
        const email = document.getElementById('pa-email').value.trim();
        const org = document.getElementById('pa-org').value.trim();
        const pType = document.getElementById('pa-type').value;
        const message = document.getElementById('pa-message').value.trim();

        waText += `Name: ${name}\nEmail: ${email}\nOrganization: ${org}\nPartnership Type: ${pType}\n\nOpportunity:\n${message}`;

      } else if (form.id === 'form-general') {
        const name = document.getElementById('g-name').value.trim();
        const email = document.getElementById('g-email').value.trim();
        const subject = document.getElementById('g-subject').value.trim();
        const message = document.getElementById('g-message').value.trim();

        waText += `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
      }

      waText += `\n\nPlease get back to me.\n\nThank you.`;
      
      const encodedText = encodeURIComponent(waText);
      window.open(`https://wa.me/923455073802?text=${encodedText}`, '_blank');
      form.reset();
    });
  });
}
