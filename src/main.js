// ── main.js — Digital Nexes full site interactivity ───────────────────────
import './style.css';
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

// ── 2. Lenis smooth scroll ───────────────────────────────────────────────────
// Disable smooth-scroll entirely on mobile — native scroll is faster
const IS_MOBILE_SCROLL = window.innerWidth <= 768;
const lenis = new Lenis({
  smoothWheel: !IS_MOBILE_SCROLL,   // desktop only
  duration: 1.2,                    // slightly snappier (was 1.4)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  touchMultiplier: IS_MOBILE_SCROLL ? 1.0 : 1.4, // reduced (was 2.4)
});
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ── 3–5. Consolidated scroll handler (single callback = less overhead) ────────
const progressBar = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll, limit }) => {
  if (limit <= 0) return;
  const pct = scroll / limit;
  // Gradient shader
  if (window.GradientShader) window.GradientShader.setScroll(pct);
  // Progress bar
  if (progressBar) progressBar.style.width = (pct * 100) + '%';
  // Navbar
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

    // Hover scale on interactive elements via event delegation
    const selector = 'a, button, .team-card, .work-card, .svc-card, .why-card, .industry-card, .faq-btn, .roadmap-card, .stat-card, .vm-card';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(selector)) {
        dot.classList.add('hover');
        ring.classList.add('hover');
      }
    }, { passive: true });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(selector)) {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    }, { passive: true });
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
      gsap.to(btn, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
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
  document.querySelectorAll('.why-grid, .industries-grid, .vm-cards, .faq-col').forEach(parent => {
    const cards = parent.querySelectorAll('.reveal-card');
    if (!cards.length) return;
    gsap.from(cards, {
      scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      opacity: 0, y: 48, duration: 1.2, ease: 'power3.out', stagger: 0.1,
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

// ── 12. Services — Responsive Rendering & Horizontal Sticky Scroll ─────────────
(function initServicesSection() {
  const mount = document.getElementById('services-mount');
  if (!mount) return;

  let currentMode = null;
  let svcScrollTrigger = null;

  function renderServices() {
    const isMobile = window.innerWidth <= 768;
    const targetMode = isMobile ? 'mobile' : 'desktop';
    if (currentMode === targetMode) return;
    currentMode = targetMode;

    if (svcScrollTrigger) { svcScrollTrigger.kill(); svcScrollTrigger = null; }
    mount.innerHTML = '';

    if (isMobile) {
      // Render ONLY static mobile Core Services component
      const template = document.getElementById('services-mobile-template');
      if (template) mount.appendChild(template.content.cloneNode(true));
      // No GSAP timelines or ScrollTriggers initialized on mobile!
    } else {
      // Render ONLY desktop GSAP Services component
      const template = document.getElementById('services-desktop-template');
      if (template) mount.appendChild(template.content.cloneNode(true));

      const outer = document.getElementById('services-outer');
      const track = document.getElementById('services-track');
      const dots  = Array.from(document.querySelectorAll('.svc-dot'));
      if (!outer || !track) return;

      const cards = Array.from(track.querySelectorAll('.svc-card'));
      gsap.set(cards, { x: 80, opacity: 0 });

      svcScrollTrigger = ScrollTrigger.create({
        trigger: outer,
        start: 'top top',
        end: 'bottom bottom',
        onEnter() {
          gsap.to(cards, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.08 });
        },
        onUpdate(self) {
          const trackWidth = track.scrollWidth;
          const viewportW  = window.innerWidth;
          const maxScroll  = trackWidth - viewportW + 64; // 64px padding buffer
          const x = -(self.progress * maxScroll);
          gsap.to(track, { x, duration: 0.8, ease: 'power3.out', overwrite: true });

          const activeDotIdx = Math.min(
            cards.length - 1,
            Math.floor(self.progress * cards.length * 1.001)
          );
          dots.forEach((d, i) => d.classList.toggle('active', i === activeDotIdx));
        },
      });

      if (!IS_REDUCED) {
        const servicesHeader = document.querySelector('.services-sticky-header');
        if (servicesHeader) {
          gsap.from(servicesHeader, {
            scrollTrigger: { trigger: '#services-outer', start: 'top 80%', once: true },
            y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
          });
        }
      }
    }
  }

  renderServices();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderServices, 150);
  });
})();

// ── 13. Process — Timeline GSAP ────────────────────────────────────────────────
(function initTimelineAnimation() {
  const container = document.querySelector('.timeline-container');
  if (!container) return;

  const glowPath = document.getElementById('process-glow-path');
  const items = gsap.utils.toArray('.timeline-item');

  // SVG Line Animation
  if (glowPath) {
    const pathLength = glowPath.getTotalLength() || 2000;
    gsap.set(glowPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      animation: gsap.to(glowPath, { strokeDashoffset: 0, ease: "none" }),
      scrub: true
    });
  }
  
  items.forEach((item, i) => {
    // Initial state: hidden and slightly pushed down
    gsap.set(item, { opacity: 0, y: 60 });
    const dot = item.querySelector('.timeline-dot');
    
    ScrollTrigger.create({
      trigger: item,
      start: "top 65%", // Trigger when top of item is 65% down the viewport
      onEnter: () => {
        gsap.to(item, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
        if (dot) dot.classList.add('active');
      },
      onLeaveBack: () => {
        gsap.to(item, { opacity: 0, y: 60, duration: 0.8, ease: "power2.in" });
        if (dot) dot.classList.remove('active');
      }
    });
  });
})();

// ── 13a. Roadmap Timeline GSAP ──────────────────────────────────────────────────
(function initRoadmapTimeline() {
  const container = document.querySelector('.roadmap-timeline');
  if (!container) return;

  const progressLine = document.getElementById('roadmap-progress');
  const items = gsap.utils.toArray('.roadmap-step');

  if (progressLine) {
    gsap.set(progressLine, { height: '0%' });
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      animation: gsap.to(progressLine, { height: '100%', ease: "none" }),
      scrub: true
    });
  }

  items.forEach((item, i) => {
    gsap.set(item, { opacity: 0, y: 60 });
    const dot = item.querySelector('.roadmap-dot');
    
    ScrollTrigger.create({
      trigger: item,
      start: "top 75%",
      onEnter: () => {
        gsap.to(item, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
        if (dot) gsap.to(dot, { scale: 1.3, backgroundColor: '#fff', duration: 0.4 });
      },
      onLeaveBack: () => {
        gsap.to(item, { opacity: 0, y: 60, duration: 0.8, ease: "power2.in" });
        if (dot) gsap.to(dot, { scale: 1, backgroundColor: '#000', duration: 0.4 });
      }
    });
  });
})();

// ── 13b. Projects Carousel & Header ──────────────────────────────────────────
(function initProjectCarousel() {
  const workHeaderEls = document.querySelectorAll('.work-header-anim');
  if (workHeaderEls.length > 0) {
    gsap.from(workHeaderEls, {
      scrollTrigger: {
        trigger: '.work-header-anim-container',
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  const stackedCards = gsap.utils.toArray('.stacked-card');
  if (stackedCards.length === 0) return;

  stackedCards.forEach((card, i) => {
    // 1. Incoming animation: Card scales up and fades in as it slides into place
    if (i > 0) {
      gsap.fromTo(card,
        { scale: 0.95, opacity: 0.7, boxShadow: '0 0px 0px rgba(0,0,0,0)' },
        {
          scale: 1,
          opacity: 1,
          boxShadow: '0 -20px 40px rgba(0,0,0,0.5)',
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'top 12.5vh', // Matches the sticky top position in CSS
            scrub: true
          }
        }
      );
    }

    // 2. Outgoing animation: Current card scales down slightly and darkens as the NEXT card slides over it
    if (i < stackedCards.length - 1) {
      const nextCard = stackedCards[i + 1];
      gsap.to(card, {
        scale: 0.95,
        opacity: 0,
        filter: 'blur(8px)',
        ease: 'none',
        scrollTrigger: {
          trigger: nextCard,
          start: 'top 50%',
          end: 'top 17.5vh', // Closes out slightly before it reaches the top
          scrub: true
        }
      });
    }
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

// ── 16. Work Cards Expand on Hover ────────────────────────────────────────────
if (!IS_TOUCH && !IS_REDUCED) {
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.025, duration: 0.8, ease: 'power3.out' });
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
      gsap.to(body, { maxHeight: body.scrollHeight + 40, duration: 0.8, ease: 'power3.out' });
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

// ── 22. Services section parallax header (moved to initServicesSection) ──────

// ── 23. Particle Rocket (3D Three.js) ─────────────────────────────────────────
if (document.getElementById('rocket-canvas')) {
  import('./rocket.js').then((module) => {
    module.buildRocketScene();
  });
}

// ── 14. Stacking Testimonials GSAP ───────────────────────────────────────────────
(function initTestimonialsStack() {
  const cards = gsap.utils.toArray('.testi-stack-card');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    // We don't animate the last card because nothing stacks on top of it
    if (i === cards.length - 1) return;

    const inner = card.querySelector('.testi-stack-inner');
    
    ScrollTrigger.create({
      trigger: card,
      start: "top 15%", // When it becomes sticky
      endTrigger: cards[i + 1],
      end: "top 25%", // When the next card comes up over it
      animation: gsap.to(inner, {
        scale: 0.9,
        opacity: 0.5,
        filter: "blur(4px)",
        ease: "none"
      }),
      scrub: true
    });
  });
})();

// ── 15. Creative Scrubbing Testimonials GSAP ─────────────────────────────────────
(function initTestimonialsScrub() {
  const scrubTexts = document.querySelectorAll('[data-scrub-text]');
  if (!scrubTexts.length) return;

  scrubTexts.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    
    // Split text into words and wrap in spans
    text.split(' ').forEach(word => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      // We start them dimmed
      span.style.opacity = 0.15;
      el.appendChild(span);
    });

    const words = el.querySelectorAll('span');
    
    // Create ScrollTrigger to scrub the opacity from 0.15 to 1
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "bottom 50%",
      scrub: true,
      animation: gsap.to(words, {
        opacity: 1,
        stagger: 0.1,
        ease: "none"
      })
    });
  });
})();
