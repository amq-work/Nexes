// ── hero.js — Three.js hero particle network + CTA icosahedron ────────────
// Performance-optimized: IntersectionObserver pause, lower counts, capped DPR
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/examples/jsm/postprocessing/OutputPass.js';

// ── Shared state ─────────────────────────────────────────────────────────────
const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE     = window.innerWidth < 768;
// Low-end device: <= 2 CPU cores or saves-data hint
const LOW_END    = (navigator.hardwareConcurrency <= 2) ||
                   (navigator.connection && navigator.connection.saveData);
const MOUSE      = new THREE.Vector2(0.5, 0.5);

window.addEventListener('mousemove', e => {
  MOUSE.x = e.clientX / window.innerWidth;
  MOUSE.y = e.clientY / window.innerHeight;
}, { passive: true });

// ═══════════════════════════════════════════════════════════════════════════
// HERO SCENE — particle network mesh with bloom
// ═══════════════════════════════════════════════════════════════════════════
function buildHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Disable on very low-end mobile to avoid total freeze
  if (MOBILE && LOW_END) {
    canvas.style.display = 'none';
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !MOBILE,   // antialias off on mobile saves GPU fill-rate
    alpha: true,
    powerPreference: 'high-performance',
  });
  // Cap pixel ratio: mobile=1.0, desktop=1.5 (was 1.8)
  renderer.setPixelRatio(MOBILE ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 0, 18);

  // ── Reduced node/edge counts ─────────────────────────────────────────────
  // Mobile: 40 nodes / 60 edges  (was 60/90)
  // Desktop: 70 nodes / 120 edges (was 110/180)
  const COUNT_NODES  = MOBILE ? 40 : 70;
  const COUNT_EDGES  = MOBILE ? 60 : 120;
  const RADIUS       = 8;

  const nodes = [];
  for (let i = 0; i < COUNT_NODES; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = RADIUS * (0.7 + Math.random() * 0.3);
    nodes.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      vx: (Math.random() - 0.5) * 0.008,
      vy: (Math.random() - 0.5) * 0.008,
      vz: (Math.random() - 0.5) * 0.006,
    });
  }

  // ── Particle points ──────────────────────────────────────────────────────
  const ptGeo  = new THREE.BufferGeometry();
  const ptPos  = new Float32Array(COUNT_NODES * 3);
  const ptColors = new Float32Array(COUNT_NODES * 3);
  for (let i = 0; i < COUNT_NODES; i++) {
    ptPos[i * 3]     = nodes[i].x;
    ptPos[i * 3 + 1] = nodes[i].y;
    ptPos[i * 3 + 2] = nodes[i].z;
    const t = (nodes[i].y + RADIUS) / (RADIUS * 2);
    const brightness = 0.55 + t * 0.45;
    ptColors[i * 3]     = brightness;
    ptColors[i * 3 + 1] = brightness;
    ptColors[i * 3 + 2] = brightness;
  }
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
  ptGeo.setAttribute('color',    new THREE.BufferAttribute(ptColors, 3));

  const ptMat = new THREE.PointsMaterial({
    size: MOBILE ? 0.14 : 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(ptGeo, ptMat);
  scene.add(points);

  // ── Edge lines ──────────────────────────────────────────────────────────
  const DIST_THRESHOLD = RADIUS * 0.65;
  const edgePairs      = [];
  let edgeCount = 0;

  for (let i = 0; i < COUNT_NODES && edgeCount < COUNT_EDGES; i++) {
    for (let j = i + 1; j < COUNT_NODES && edgeCount < COUNT_EDGES; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < DIST_THRESHOLD) {
        edgePairs.push([i, j, dist]);
        edgeCount++;
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  const linePosArr   = new Float32Array(edgePairs.length * 6);
  const lineColorArr = new Float32Array(edgePairs.length * 6);

  edgePairs.forEach(([a, b, dist], idx) => {
    const alpha = 1 - dist / DIST_THRESHOLD;
    for (let k = 0; k < 2; k++) {
      const n = k === 0 ? nodes[a] : nodes[b];
      linePosArr[idx * 6 + k * 3]     = n.x;
      linePosArr[idx * 6 + k * 3 + 1] = n.y;
      linePosArr[idx * 6 + k * 3 + 2] = n.z;
      lineColorArr[idx * 6 + k * 3]     = 0.5 * alpha;
      lineColorArr[idx * 6 + k * 3 + 1] = 0.5 * alpha;
      lineColorArr[idx * 6 + k * 3 + 2] = 0.5 * alpha;
    }
  });

  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
  lineGeo.setAttribute('color',    new THREE.BufferAttribute(lineColorArr, 3));
  const lineMat  = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35 });
  const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSegs);

  // ── Post-processing: UnrealBloomPass ─────────────────────────────────────
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  if (!LOW_END) {
    // Skip bloom entirely on low-end devices — huge GPU savings
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        MOBILE ? window.innerWidth * 0.5 : window.innerWidth,
        MOBILE ? window.innerHeight * 0.5 : window.innerHeight
      ),
      MOBILE ? 0.7 : 1.1,  // reduced strength (was 0.9/1.35)
      0.4,
      0.15
    );
    composer.addPass(bloomPass);
  }
  composer.addPass(new OutputPass());

  // ── Resize ───────────────────────────────────────────────────────────────
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Update node positions & geometry ────────────────────────────────────
  function updateNodes() {
    const posArr  = ptGeo.attributes.position.array;
    const cPosArr = lineGeo.attributes.position.array;

    const mx = (MOUSE.x - 0.5) * 3;
    const my = (MOUSE.y - 0.5) * -2;
    scene.rotation.y = mx * 0.04;
    scene.rotation.x = my * 0.04;

    nodes.forEach((n, i) => {
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      const d = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z);
      if (d > RADIUS * 1.05) {
        n.vx *= -1; n.vy *= -1; n.vz *= -1;
      }
      posArr[i * 3]     = n.x;
      posArr[i * 3 + 1] = n.y;
      posArr[i * 3 + 2] = n.z;
    });
    ptGeo.attributes.position.needsUpdate = true;

    edgePairs.forEach(([a, b], idx) => {
      for (let k = 0; k < 2; k++) {
        const n = k === 0 ? nodes[a] : nodes[b];
        cPosArr[idx * 6 + k * 3]     = n.x;
        cPosArr[idx * 6 + k * 3 + 1] = n.y;
        cPosArr[idx * 6 + k * 3 + 2] = n.z;
      }
    });
    lineGeo.attributes.position.needsUpdate = true;
  }

  // ── Render loop with IntersectionObserver pause ───────────────────────────
  let rafId;
  let isVisible = true;

  function tick() {
    if (!isVisible) { rafId = null; return; }
    rafId = requestAnimationFrame(tick);
    if (!IS_REDUCED) updateNodes();
    composer.render();
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) tick(); // resume
    },
    { threshold: 0 }
  );
  observer.observe(canvas);
  tick();

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CTA SCENE — wireframe icosahedron with bloom
// ═══════════════════════════════════════════════════════════════════════════
function buildCtaScene() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;

  // Skip on low-end mobile
  if (MOBILE && LOW_END) {
    canvas.style.display = 'none';
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !MOBILE,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(MOBILE ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 7;

  // ── Main icosahedron ─────────────────────────────────────────────────────
  const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x00b5b8,
    emissive: 0x003040,
    metalness: 0.7,
    roughness: 0.35,
    wireframe: false,
    transparent: true,
    opacity: 0.55,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // ── Wireframe overlay ────────────────────────────────────────────────────
  const wireGeo = new THREE.IcosahedronGeometry(2.25, 1);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x00e5e8, wireframe: true, transparent: true, opacity: 0.28 });
  const wire    = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wire);

  // ── Orbiting torus rings ─────────────────────────────────────────────────
  // Reduced segment counts: torus1 8,60 (was 8,80), torus2 6,40 (was 6,60)
  const torusGeo = new THREE.TorusGeometry(3.2, 0.025, 8, 60);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0xa055b4, transparent: true, opacity: 0.45 });
  const torus1   = new THREE.Mesh(torusGeo, torusMat);
  torus1.rotation.x = Math.PI / 3;
  scene.add(torus1);

  const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.8, 0.015, 6, 40),
    new THREE.MeshBasicMaterial({ color: 0x0afbff, transparent: true, opacity: 0.25 })
  );
  torus2.rotation.x = Math.PI / 5;
  torus2.rotation.z = Math.PI / 4;
  scene.add(torus2);

  // ── Lights ───────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x112233, 1.5));
  const dirLight = new THREE.DirectionalLight(0x00e5e8, 3.5);
  dirLight.position.set(4, 6, 5);
  scene.add(dirLight);
  const dirLight2 = new THREE.DirectionalLight(0xa055b4, 2.0);
  dirLight2.position.set(-4, -3, 3);
  scene.add(dirLight2);

  const pLight = new THREE.PointLight(0x0afbff, 4, 12);
  scene.add(pLight);

  // ── Bloom (skip on low-end) ───────────────────────────────────────────────
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (!LOW_END) {
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(MOBILE ? 256 : 512, MOBILE ? 256 : 512),
      MOBILE ? 1.0 : 1.6,
      0.4,
      0.05
    );
    composer.addPass(bloom);
  }
  composer.addPass(new OutputPass());

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const timer = new THREE.Timer();
  let rafId;
  let isVisible = false; // start paused — only render when in view

  function tick() {
    if (!isVisible) { rafId = null; return; }
    rafId = requestAnimationFrame(tick);
    timer.update();
    const t = timer.getElapsed();
    if (!IS_REDUCED) {
      ico.rotation.x = t * 0.20;
      ico.rotation.y = t * 0.28;
      wire.rotation.copy(ico.rotation);
      torus1.rotation.z = t * 0.18;
      torus2.rotation.y = t * 0.14;
      torus2.rotation.x = Math.PI / 5 + t * 0.08;

      pLight.position.set(
        Math.sin(t * 0.9) * 4,
        Math.cos(t * 0.7) * 3,
        Math.cos(t * 1.1) * 3
      );

      const mx = (MOUSE.x - 0.5) * 0.8;
      const my = (MOUSE.y - 0.5) * -0.5;
      scene.rotation.y += (mx - scene.rotation.y) * 0.05;
      scene.rotation.x += (my - scene.rotation.x) * 0.05;
    }
    composer.render();
  }

  // Only render CTA scene when visible in viewport
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) tick(); // resume
    },
    { threshold: 0 }
  );
  observer.observe(canvas);

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
  };
}

// ── Boot ──────────────────────────────────────────────────────────────────
buildHeroScene();
buildCtaScene();
