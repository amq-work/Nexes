const fs = require('fs');
const path = require('path');

const services = [
  { id: 'ui-ux', title: 'UI/UX Design', sub: 'End-to-end user experience design — from research to high-fidelity UI.' },
  { id: 'web-dev', title: 'Website Development', sub: 'Production-grade engineering built for performance and scalability.' },
  { id: 'seo', title: 'Search Engine Optimization', sub: 'Data-driven SEO strategies to dominate search results.' },
  { id: 'marketing', title: 'Digital Marketing', sub: 'High-ROI campaigns that turn visibility into measurable revenue.' },
  { id: 'branding', title: 'Branding & Identity', sub: 'Strategic brand identity development that communicates authority.' },
  { id: 'business', title: 'Business Development', sub: 'Growth-focused strategy to expand your market footprint.' },
  { id: 'software', title: 'Custom Software', sub: 'Bespoke web applications engineered to solve complex problems.' }
];

const templatePath = path.join(__dirname, 'services.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

services.forEach(svc => {
  let content = templateHtml;
  // Replace Title
  content = content.replace(/<title>.*?<\/title>/, `<title>${svc.title} — Digital Nexes</title>`);
  
  // Replace Hero Title
  content = content.replace(/<h1 class="page-hero-title reveal-hero scramble">.*?<\/h1>/, `<h1 class="page-hero-title reveal-hero scramble"><span class="gradient-text">${svc.title}</span></h1>`);
  
  // Replace Hero Sub
  content = content.replace(/<p class="page-hero-sub reveal-hero">.*?<\/p>/, `<p class="page-hero-sub reveal-hero">${svc.sub}</p>`);

  fs.writeFileSync(path.join(__dirname, `service-${svc.id}.html`), content, 'utf8');
  console.log(`Created service-${svc.id}.html`);
});

const blogs = [
  { id: 'integrated-studio', title: 'Integrated Studio Model' },
  { id: 'rapid-delivery', title: 'Rapid, Structured Delivery' },
  { id: 'results-obsessed', title: 'Results-Obsessed' },
  { id: 'client-first', title: 'Client-First Culture' },
  { id: 'data-led', title: 'Data-Led Decisions' },
  { id: 'proven-industry', title: 'Proven Across Industries' }
];

const blogTemplatePath = path.join(__dirname, 'blog.html');
const blogTemplateHtml = fs.readFileSync(blogTemplatePath, 'utf8');

blogs.forEach(b => {
  let content = blogTemplateHtml;
  content = content.replace(/<title>.*?<\/title>/, `<title>${b.title} — Digital Nexes Insights</title>`);
  content = content.replace(/<h1 class="page-hero-title reveal-hero scramble">.*?<\/h1>/, `<h1 class="page-hero-title reveal-hero scramble"><span class="gradient-text">${b.title}</span></h1>`);
  fs.writeFileSync(path.join(__dirname, `blog-${b.id}.html`), content, 'utf8');
  console.log(`Created blog-${b.id}.html`);
});
