import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MOBILE   = window.innerWidth < 768;
const LOW_END  = (navigator.hardwareConcurrency <= 2) ||
                 (navigator.connection && navigator.connection.saveData);

export function buildRocketScene() {
  const canvas = document.getElementById('rocket-canvas');
  const hint   = document.getElementById('rocket-hint');
  if (!canvas) return;

  const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (IS_REDUCED) return;

  // On low-end mobile skip entirely and hide the canvas section
  if (MOBILE && LOW_END) {
    canvas.style.display = 'none';
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,   // antialias off — saves significant GPU fillrate
    alpha: true,
    powerPreference: 'high-performance',
  });
  // Cap pixel ratio: 1.0 on mobile (was 2), 1.5 on desktop
  renderer.setPixelRatio(MOBILE ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  const rocketGroup = new THREE.Group();
  rocketGroup.rotation.x = Math.PI / 4;
  rocketGroup.rotation.y = Math.PI / 4;
  scene.add(rocketGroup);

  const particles = [];

  // ── Reduced particle count ────────────────────────────────────────────────
  // Desktop: 3000 (was 7000), Mobile: 1200
  const PARTICLE_COUNT = MOBILE ? 1200 : 3000;

  const baseGeo = new THREE.TorusKnotGeometry(3.5, 1.2, 150, 24, 3, 4); // reduced segments too
  baseGeo.computeVertexNormals();
  const basePos  = baseGeo.attributes.position;
  const baseNorm = baseGeo.attributes.normal;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = Math.floor(Math.random() * basePos.count);

    const bx = basePos.getX(idx);
    const by = basePos.getY(idx);
    const bz = basePos.getZ(idx);

    const nx = baseNorm.getX(idx);
    const ny = baseNorm.getY(idx);
    const nz = baseNorm.getZ(idx);

    const spread = (Math.random() - 0.5) * 1.5;
    const x = bx + nx * spread + (Math.random() - 0.5) * 0.5;
    const y = by + ny * spread + (Math.random() - 0.5) * 0.5;
    const z = bz + nz * spread + (Math.random() - 0.5) * 0.5;

    let c = new THREE.Color(0x888888);
    if (Math.abs(spread) > 0.6) {
      c.setHex(0xffffff);
    } else if (Math.random() > 0.7) {
      c.setHex(0xaaaaaa);
    } else {
      c.setHex(0x555555);
    }

    particles.push({
      hx: x, hy: y, hz: z,
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      z: z + (Math.random() - 0.5) * 6,
      vx: 0, vy: 0, vz: 0,
      color: c,
      scatterDir: new THREE.Vector3(
        x * 2 + (Math.random() - 0.5) * 2,
        y * 2 + (Math.random() - 0.5) * 2,
        z * 2 + (Math.random() - 0.5) * 2
      ).normalize()
    });
  }

  // Free the base geometry — no longer needed
  baseGeo.dispose();

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particles.length * 3);
  const colors    = new Float32Array(particles.length * 3);

  particles.forEach((p, i) => {
    positions[i * 3]     = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
    colors[i * 3]     = p.color.r;
    colors[i * 3 + 1] = p.color.g;
    colors[i * 3 + 2] = p.color.b;
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: MOBILE ? 0.10 : 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  rocketGroup.add(points);

  // ── Post-processing (skip bloom on low-end) ───────────────────────────────
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  renderPass.clearColor = new THREE.Color(0, 0, 0);
  renderPass.clearAlpha = 0;
  composer.addPass(renderPass);

  if (!LOW_END) {
    // Lower bloom resolution on mobile
    const bloomRes = MOBILE
      ? new THREE.Vector2(Math.floor(window.innerWidth * 0.5), Math.floor(window.innerHeight * 0.5))
      : new THREE.Vector2(window.innerWidth, window.innerHeight);
    const bloomPass = new UnrealBloomPass(bloomRes, 1.6, 0.4, 0.2); // slightly higher threshold
    composer.addPass(bloomPass);
  }
  composer.addPass(new OutputPass());

  // Mouse / Hover Interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-9999, -9999);
  let isHovering = false;

  const getCanvasBounds = () => canvas.getBoundingClientRect();

  // Only track mouse on desktop
  if (!MOBILE) {
    window.addEventListener('mousemove', (e) => {
      const bounds = getCanvasBounds();
      if (e.clientX >= bounds.left && e.clientX <= bounds.right &&
          e.clientY >= bounds.top  && e.clientY <= bounds.bottom) {
        isHovering = true;
        mouse.x = ((e.clientX - bounds.left) / bounds.width)  * 2 - 1;
        mouse.y = -((e.clientY - bounds.top)  / bounds.height) * 2 + 1;
        if (hint) hint.classList.add('hidden');
      } else {
        isHovering = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      isHovering = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });
  }

  // GSAP ScrollTrigger for Scroll Scatter
  let scrollProgress = 0;
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => { scrollProgress = self.progress; }
  });

  // Resize handler
  function resize() {
    const p = canvas.parentElement;
    const w = p.clientWidth;
    const h = p.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // ── Optimized physics loop ────────────────────────────────────────────────
  let rafId;
  let isVisible = true;
  const posAttr = geometry.attributes.position;
  const clock   = new THREE.Clock();

  const REPULSE_RADIUS_SQ = 3.5 * 3.5; // use squared distance to avoid sqrt
  const REPULSE_RADIUS    = 3.5;
  const REPULSE_FORCE     = 0.8;
  const SPRING_K          = 0.08;
  const DAMPING           = 0.82;

  // Pre-compute target workspace vectors
  const targetVec = new THREE.Vector3();
  const planeZ    = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  function animate() {
    if (!isVisible) { rafId = null; return; }
    rafId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Slow rotation
    rocketGroup.rotation.y = Math.PI / 4 + Math.sin(time * 0.4) * 0.15;
    rocketGroup.rotation.x = Math.cos(time * 0.5) * 0.05;

    // Only compute raycaster intersection if hovering (saves CPU)
    if (isHovering && !MOBILE) {
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(planeZ, targetVec);
      rocketGroup.worldToLocal(targetVec);
    }

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];

      if (scrollProgress > 0.01) {
        // Scroll scatter
        const mag = scrollProgress * 25;
        p.vx += (p.hx + p.scatterDir.x * mag - p.x) * 0.1;
        p.vy += (p.hy + p.scatterDir.y * mag - p.y) * 0.1;
        p.vz += (p.hz + p.scatterDir.z * mag - p.z) * 0.1;
      } else if (isHovering && !MOBILE) {
        // Hover repulsion — use squared distance to skip sqrt when outside radius
        const dx = p.x - targetVec.x;
        const dy = p.y - targetVec.y;
        const dz = p.z - targetVec.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < REPULSE_RADIUS_SQ && distSq > 0.01) {
          const dist  = Math.sqrt(distSq);
          const force = (1 - dist / REPULSE_RADIUS) * REPULSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.vz += (dz / dist) * force;
        }
      }

      // Spring back + breathing
      if (scrollProgress <= 0.01) {
        const breathe = Math.sin(time * 2 + p.hy * 0.5) * 0.06;
        p.vx += (p.hx + p.hx * breathe - p.x) * SPRING_K;
        p.vy += (p.hy + p.hy * breathe - p.y) * SPRING_K;
        p.vz += (p.hz + p.hz * breathe - p.z) * SPRING_K;
      }

      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.vz *= DAMPING;
      p.x  += p.vx;
      p.y  += p.vy;
      p.z  += p.vz;

      posAttr.setXYZ(i, p.x, p.y, p.z);
    }

    posAttr.needsUpdate = true;
    material.opacity = 0.85 * Math.max(0, 1 - scrollProgress * 1.5);
    composer.render();
  }

  // ── IntersectionObserver — pause when off-screen ──────────────────────────
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) animate(); // resume
    },
    { threshold: 0 }
  );
  observer.observe(canvas);
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
