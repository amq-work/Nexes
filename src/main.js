// ── main.js — Digital Nexes full site interactivity ───────────────────────
import './style.css';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildRocketScene } from './rocket.js';
import { initWhatsAppForm } from './whatsapp.js';

gsap.registerPlugin(ScrollTrigger);

const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH   = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

initWhatsAppForm();

// ── 1. Page Loader ───────────────────────────────────────────────────────────
const loader = document.getElementById('page-loader');
window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('done'), 900);
});

// ── 2. Lenis smooth scroll ───────────────────────────────────────────────────
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

// ── 3. Feed scroll to WebGL gradient shader ──────────────────────────────────
lenis.on('scroll', ({ scroll, limit }) => {
  if (window.GradientShader && limit > 0)
    window.GradientShader.setScroll(scroll / limit);
});

// ── 4. Scroll progress bar ───────────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
lenis.on('scroll', ({ scroll, limit }) => {
  if (progressBar && limit > 0)
    progressBar.style.width = ((scroll / limit) * 100) + '%';
});

// ── 5. Navbar scroll class ───────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll }) => {
  navbar?.classList.toggle('scrolled', scroll > 60);
});

// ── 6. Mobile hamburger ──────────────────────────────────────────────────────
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

// ── 7. Custom Cursor ─────────────────────────────────────────────────────────
if (!IS_TOUCH && !IS_REDUCED) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring) {
    let mx = -200, my = -200; // Start off-screen — no flicker
    let rx = -200, ry = -200;
    let hasMoved = false;

    // Pure CSS transform — no GSAP opacity changes
    const setPos = (el, x, y) => {
      el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px)`;
    };

    window.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        rx = mx; ry = my;
      }
    }, { passive: true });

    // RAF loop for smooth tracking
    (function cursorRAF() {
      requestAnimationFrame(cursorRAF);
      // Dot: instant
      setPos(dot, mx, my);
      // Ring: lerp (elastic follow)
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      setPos(ring, rx, ry);
    })();

    // Hover scale on interactive elements
    const interactiveEls = document.querySelectorAll(
      'a, button, .team-card, .work-card, .svc-card, .why-card, .industry-card, .faq-btn, .roadmap-card, .stat-card, .vm-card'
    );
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });
  }
}

// ── 8. Magnetic Buttons ───────────────────────────────────────────────────────
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

// ── 9. Text Scramble ──────────────────────────────────────────────────────────
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
    let out = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        out += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        out += `<span style="color:rgba(255,255,255,0.25)">${char}</span>`;
      } else {
        out += from;
      }
    }
    this.el.innerHTML = out;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
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

// ── 10. Hero Entrance Animation ────────────────────────────────────────────────
if (!IS_REDUCED) {
  const heroEls = [
    document.querySelector('.hero-badge'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-sub'),
    document.querySelector('.hero-ctas'),
    document.querySelector('.hero-scroll-hint'),
    document.querySelector('.hero-glow'),
  ].filter(Boolean);

  gsap.set(heroEls, { opacity: 0, y: 32 });
  const heroTl = gsap.timeline({ delay: 1.0 });
  heroEls.forEach((el, i) => {
    heroTl.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, i === 0 ? 0 : `-=0.5`);
  });
}

// ── 11. Generic Scroll Reveals ─────────────────────────────────────────────────
if (!IS_REDUCED) {
  // Text reveals
  document.querySelectorAll('.reveal-text').forEach(el => {
    if (el.closest('.hero')) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
    });
  });

  // Card reveals (staggered within parent)
  document.querySelectorAll('.why-grid, .industries-grid, .roadmap-flex, .vm-cards, .faq-col').forEach(parent => {
    const cards = parent.querySelectorAll('.reveal-card');
    if (!cards.length) return;
    gsap.from(cards, {
      scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      opacity: 0, y: 48, duration: 0.8, ease: 'power3.out', stagger: 0.1,
    });
  });

  // reveal-left / reveal-right
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

  // Section titles scale in
  document.querySelectorAll('.section-title:not(.scramble)').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      scale: 0.95, opacity: 0, duration: 1.0, ease: 'power3.out',
    });
  });
}

// ── 12. Services — Horizontal Sticky Scroll ────────────────────────────────────
(function initServicesHScroll() {
  const outer  = document.getElementById('services-outer');
  const track  = document.getElementById('services-track');
  const dots   = Array.from(document.querySelectorAll('.svc-dot'));
  if (!outer || !track) return;

  const cards = Array.from(track.querySelectorAll('.svc-card'));

  // Animate cards in from the right initially
  gsap.set(cards, { x: 80, opacity: 0 });

  ScrollTrigger.create({
    trigger: outer,
    start: 'top top',
    end: 'bottom bottom',
    onEnter() {
      gsap.to(cards, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 });
    },
    onUpdate(self) {
      // Calculate how far to scroll the track horizontally
      const trackWidth = track.scrollWidth;
      const viewportW  = window.innerWidth;
      const maxScroll  = trackWidth - viewportW + 64; // 64px padding buffer
      const x = -(self.progress * maxScroll);
      gsap.to(track, { x, duration: 0.5, ease: 'power3.out', overwrite: true });

      // Update active dot
      const activeDotIdx = Math.min(
        cards.length - 1,
        Math.floor(self.progress * cards.length * 1.001)
      );
      dots.forEach((d, i) => d.classList.toggle('active', i === activeDotIdx));
    },
  });
})();

// ── 13. Process — Scroll-driven 5-stage pin ────────────────────────────────────
(function initProcessPin() {
  const outer  = document.getElementById('process');
  const stages = Array.from(document.querySelectorAll('.process-stage'));
  const dots   = Array.from(document.querySelectorAll('.pdot'));
  const TOTAL  = stages.length;
  if (!outer || !TOTAL) return;

  let currentStage = 0;

  stages.forEach((s, i) => {
    gsap.set(s, i === 0
      ? { opacity: 1, y: 0, pointerEvents: 'auto' }
      : { opacity: 0, y: 60, pointerEvents: 'none' }
    );
  });

  let stageTl = null;
  function goToStage(idx, dir) {
    if (idx === currentStage) return;
    
    // Kill any ongoing animation to prevent overlap
    if (stageTl) stageTl.kill();
    
    // Hide everything else immediately to ensure no ghosting
    stages.forEach((s, i) => {
      if (i !== currentStage && i !== idx) gsap.set(s, { opacity: 0, pointerEvents: 'none' });
    });

    const outStage = stages[currentStage];
    const inStage  = stages[idx];
    const outY     = dir > 0 ? -60 : 60;
    const inYStart = dir > 0 ?  60 : -60;

    gsap.set(inStage, { y: inYStart, opacity: 0, pointerEvents: 'none' });
    
    stageTl = gsap.timeline();
    stageTl.to(outStage, { opacity: 0, y: outY, duration: 0.35, ease: 'power2.inOut',
      onComplete: () => gsap.set(outStage, { pointerEvents: 'none' }) });
    stageTl.to(inStage,  { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out',
      onComplete: () => gsap.set(inStage, { pointerEvents: 'auto' }) }, '-=0.1');

    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    currentStage = idx;
  }

  const pathActive = document.getElementById('process-path-active');
  let pathLen = 1000;
  if (pathActive) {
    pathLen = pathActive.getTotalLength() || 1000;
    pathActive.style.strokeDasharray = pathLen;
    pathActive.style.strokeDashoffset = pathLen;
  }

  ScrollTrigger.create({
    trigger: outer,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      const rawIdx = Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL * 1.001));
      const dir = rawIdx > currentStage ? 1 : -1;
      goToStage(rawIdx, dir);
      
      if (pathActive) {
        pathActive.style.strokeDashoffset = pathLen - (self.progress * pathLen);
      }
    },
  });
})();

// ── 13b. Projects List Reveal ─────────────────────────────────────────────────────
(function initProjectsReveal() {
  const items = document.querySelectorAll('.project-item');
  if (!items.length) return;
  items.forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        delay: i * 0.12,
      }
    );
  });
})();

// ── 14. Stats Counters ─────────────────────────────────────────────────────────
function runCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target, duration: 2.2, ease: 'power3.out',
    onUpdate() { el.textContent = Math.round(obj.val) + suffix; },
  });
}
ScrollTrigger.create({
  trigger: '#stats', start: 'top 80%', once: true,
  onEnter() { document.querySelectorAll('.stat-number[data-target]').forEach(runCounter); },
});

// ── 15. 3D Card Tilt ──────────────────────────────────────────────────────────
if (!IS_TOUCH && !IS_REDUCED) {
  const tiltTargets = document.querySelectorAll('.team-card, .why-card, .industry-card, .roadmap-card, .vm-card, .svc-card, .stat-card');
  tiltTargets.forEach(card => {
    const MAX = 6;
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      gsap.to(card, {
        rotateX: -dy * MAX,
        rotateY: dx * MAX,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.35,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        ease: 'elastic.out(1, 0.5)',
        duration: 1.0,
      });
    });
  });
}

// ── 16. Work Cards Expand on Hover ────────────────────────────────────────────
if (!IS_TOUCH && !IS_REDUCED) {
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.025, duration: 0.5, ease: 'power3.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.6, ease: 'power3.out' });
    });
  });
}

// ── 17. Team Cards — stagger from bottom with scale ───────────────────────────
if (!IS_REDUCED) {
  const teamGrid = document.querySelector('.team-grid');
  if (teamGrid) {
    const teamCards = teamGrid.querySelectorAll('.team-card');
    gsap.from(teamCards, {
      scrollTrigger: { trigger: teamGrid, start: 'top 82%', once: true },
      y: 64, opacity: 0, scale: 0.92, duration: 0.9, ease: 'power3.out',
      stagger: { amount: 0.6, from: 'start' },
    });
  }
}



// ── 19. FAQ Accordion ─────────────────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn  = item.querySelector('.faq-btn');
  const body = item.querySelector('.faq-body');
  if (!btn || !body) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
      const ob = other.querySelector('.faq-body');
      if (ob) gsap.to(ob, { maxHeight: 0, duration: 0.4, ease: 'power3.in' });
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      gsap.to(body, { maxHeight: body.scrollHeight + 40, duration: 0.5, ease: 'power3.out' });
    }
  });
});

// ── 20. Testimonials Carousel ─────────────────────────────────────────────────
const slides    = document.querySelectorAll('.testimonial-slide');
const dots      = document.querySelectorAll('.testimonial-dot');
let current     = 0;
let autoTimer   = null;

function showSlide(idx) {
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  dots.forEach((d, i)   => d.classList.toggle('active', i === idx));
  current = idx;
}
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(autoTimer);
    showSlide(i);
    startAuto();
  });
});
function startAuto() {
  if (slides.length < 2) return;
  autoTimer = setInterval(() => showSlide((current + 1) % slides.length), 6000);
}
if (slides.length > 0) { showSlide(0); startAuto(); }

// ── 21. Active Nav on Scroll ───────────────────────────────────────────────────
const navMap = {
  services: 'nav-services',
  process:  'nav-process',
  'why-us': 'nav-why',
  work:     'nav-work',
  team:     'nav-team',
  faq:      'nav-faq',
};
Object.entries(navMap).forEach(([sId, nId]) => {
  const section = document.getElementById(sId);
  const navEl   = document.getElementById(nId);
  if (!section || !navEl) return;
  ScrollTrigger.create({
    trigger: section, start: 'top 55%', end: 'bottom 55%',
    onEnter()     { navEl.classList.add('nav-active');    },
    onLeave()     { navEl.classList.remove('nav-active'); },
    onEnterBack() { navEl.classList.add('nav-active');    },
    onLeaveBack() { navEl.classList.remove('nav-active'); },
  });
});

// ── 22. Services section parallax header ──────────────────────────────────────
if (!IS_REDUCED) {
  const servicesHeader = document.querySelector('.services-sticky-header');
  if (servicesHeader) {
    gsap.from(servicesHeader, {
      scrollTrigger: { trigger: '#services-outer', start: 'top 80%', once: true },
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
    });
  }
}

// ── 23. Particle Rocket (3D Three.js) ─────────────────────────────────────────
buildRocketScene();
