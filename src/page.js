// ── page.js — Digital Nexes shared page utilities ─────────────────────────
// Imported by every inner page (about, services, projects, etc.)
// The homepage (index.html) uses main.js instead.

import './style.css';
import './pages.css';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWhatsAppForm } from './whatsapp.js';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ overwrite: 'auto', force3D: true });
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Use screen width instead of touch detection — many laptops have touch AND a mouse
const IS_TOUCH   = window.innerWidth <= 768;

initWhatsAppForm();

// ── 2. Lenis smooth scroll ────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 2.4,
});
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

// ── 3. Scroll progress bar ────────────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
lenis.on('scroll', ({ scroll, limit }) => {
  if (progressBar && limit > 0)
    progressBar.style.width = ((scroll / limit) * 100) + '%';
});

// ── 4. Navbar scroll class ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll }) => {
  navbar?.classList.toggle('scrolled', scroll > 60);
});

// ── 5. Mobile hamburger ───────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger?.addEventListener('click', () => {
  const open = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!open));
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
  document.body.style.overflow = open ? '' : 'hidden';
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger?.setAttribute('aria-expanded', 'false');
  hamburger?.classList.remove('active');
  navLinks?.classList.remove('open');
  document.body.style.overflow = '';
}));

// ── 6. Custom Cursor ──────────────────────────────────────────────────────────
if (!IS_TOUCH && !IS_REDUCED) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = -200, my = -200, rx = -200, ry = -200;
    const setPos = (el, x, y) => {
      el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px)`;
    };
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function cursorRAF() {
      requestAnimationFrame(cursorRAF);
      setPos(dot, mx, my);
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      setPos(ring, rx, ry);
    })();
    const selector = 'a, button, .team-row, .team-featured, .why-row, .industry-card, .project-card, .blog-card, .service-block, .value-card, .story-item, .process-step, .career-card, .community-card';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(selector)) { dot.classList.add('hover'); ring.classList.add('hover'); }
    }, { passive: true });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(selector)) { dot.classList.remove('hover'); ring.classList.remove('hover'); }
    }, { passive: true });
  }
}

// ── 7. Magnetic Buttons ───────────────────────────────────────────────────────
if (!IS_TOUCH && !IS_REDUCED) {
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      gsap.to(btn, { x: dx * 10, y: dy * 6, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// ── 8. Text Scramble ──────────────────────────────────────────────────────────
class TextScramble {
  constructor(el) {
    this.el    = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const len = Math.max(this.el.innerText.length, newText.length);
    const promise = new Promise(res => (this.resolve = res));
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from  = this.el.innerText[i] || '';
      const to    = newText[i] || '';
      const start = Math.floor(Math.random() * 10);
      const end   = start + Math.floor(Math.random() * 10);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let out = '', complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) { complete++; out += to; }
      else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        out += `<span style="color:rgba(255,255,255,0.25)">${char}</span>`;
      } else { out += from; }
    }
    this.el.innerHTML = out;
    if (complete === this.queue.length) { this.resolve(); }
    else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
  }
}
if (!IS_REDUCED) {
  document.querySelectorAll('.scramble').forEach(el => {
    const fx = new TextScramble(el);
    const original = el.textContent;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter() { fx.setText(original); },
    });
  });
}

// ── 9. Page Hero Entrance ─────────────────────────────────────────────────────
if (!IS_REDUCED) {
  const heroEls = document.querySelectorAll('.page-hero .reveal-hero');
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 32 });
    const tl = gsap.timeline({ delay: 0.5 });
    heroEls.forEach((el, i) => {
      tl.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, i === 0 ? 0 : '-=0.55');
    });
  }
}

// ── 10. Generic Scroll Reveals ────────────────────────────────────────────────
if (!IS_REDUCED) {
  document.querySelectorAll('.reveal-text').forEach(el => {
    if (el.closest('.page-hero')) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
    });
  });

  // Generic staggered card reveals for any container with .reveal-card children
  document.querySelectorAll('[data-reveal-stagger]').forEach(parent => {
    const cards = parent.querySelectorAll('.reveal-card');
    if (!cards.length) return;
    gsap.from(cards, {
      scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      opacity: 0, y: 48, duration: 0.8, ease: 'power3.out', stagger: 0.1,
    });
  });

  document.querySelectorAll('.reveal-left').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0, x: -48, duration: 0.9, ease: 'power3.out',
    });
  });
  document.querySelectorAll('.reveal-right').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0, x: 48, duration: 0.9, ease: 'power3.out',
    });
  });
  document.querySelectorAll('.reveal-card:not([data-reveal-stagger] .reveal-card)').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
    });
  });
}

// ── 11. Active Nav Link Highlight ─────────────────────────────────────────────
// Highlight the nav link matching the current page
(function highlightActiveNav() {
  const path = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '') || 'index';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === path) a.classList.add('nav-active');
  });
})();

// ── 12. 3D Card Tilt (Inner Pages) ────────────────────────────────────────────
if (!IS_TOUCH && !IS_REDUCED) {
  const tiltTargets = document.querySelectorAll('.career-card, .community-card, .service-detail-card, .roadmap-about-card, .vision-card, .internship-card, .project-full, .cs-card, .blog-card, .blog-featured-card');
  tiltTargets.forEach(card => {
    const MAX = 6;
    card.addEventListener('mouseenter', () => { card._cachedBounds = card.getBoundingClientRect(); }, { passive: true });
    card.addEventListener('mousemove', e => {
      const r  = card._cachedBounds || card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      gsap.to(card, {
        rotateX: -dy * MAX,
        rotateY: dx * MAX,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.35,
      });
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        ease: 'elastic.out(1, 0.5)',
        duration: 1.0,
      });
    }, { passive: true });
  });
}
