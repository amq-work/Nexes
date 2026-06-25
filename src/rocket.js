import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function buildRocketScene() {
  const canvas = document.getElementById('rocket-canvas');
  const hint   = document.getElementById('rocket-hint');
  if (!canvas) return;

  const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (IS_REDUCED) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  // Group to handle the 3D element's base orientation
  const rocketGroup = new THREE.Group();
  rocketGroup.rotation.x = Math.PI / 4;
  rocketGroup.rotation.y = Math.PI / 4;
  scene.add(rocketGroup);

  const particles = [];

  function addPart(x, y, z) {
    const theta = Math.atan2(z, x);
    // Create streaks of silver/white winding up the rocket
    const streak = Math.sin(theta * 4 + y * 1.2);
    
    let c = new THREE.Color(0x888888); // Default Grey
    if (streak > 0.6) {
      c.setHex(0xffffff); // Pure White
    } else if (streak > 0.2) {
      c.setHex(0xbbbbbb); // Light Silver
    } else if (Math.random() > 0.8) {
      c.setHex(0xaaaaaa); // Mid Silver highlights
    }
    
    // Engine flame area (keep a subtle white/grey glow, maybe slightly warmer grey)
    if (y < -3.2) {
      c.setHex(Math.random() > 0.5 ? 0xffffff : 0xdddddd);
    }

    particles.push({
      hx: x, hy: y, hz: z,
      x: x + (Math.random() - 0.5) * 4, // Start widely scattered for form-in animation
      y: y + (Math.random() - 0.5) * 4,
      z: z + (Math.random() - 0.5) * 4,
      vx: 0, vy: 0, vz: 0,
      color: c,
      scatterDir: new THREE.Vector3(
        x * 2 + (Math.random() - 0.5) * 2,
        y * 0.5 + (Math.random() - 0.5) * 2,
        z * 2 + (Math.random() - 0.5) * 2
      ).normalize()
    });
  }

  // Procedural Abstract Geometry (Digital Nexus shape)
  const baseGeo = new THREE.TorusKnotGeometry(3.5, 1.2, 250, 40, 3, 4);
  baseGeo.computeVertexNormals();
  const basePos = baseGeo.attributes.position;
  const baseNorm = baseGeo.attributes.normal;
  
  // Create particles around the torus knot surface
  for (let i = 0; i < 7000; i++) {
    // Pick a random vertex
    const idx = Math.floor(Math.random() * basePos.count);
    
    // Base position
    const bx = basePos.getX(idx);
    const by = basePos.getY(idx);
    const bz = basePos.getZ(idx);
    
    // Normal direction
    const nx = baseNorm.getX(idx);
    const ny = baseNorm.getY(idx);
    const nz = baseNorm.getZ(idx);

    // Add some noise / spread along the normal and tangentially
    const spread = (Math.random() - 0.5) * 1.5;
    const x = bx + nx * spread + (Math.random() - 0.5) * 0.5;
    const y = by + ny * spread + (Math.random() - 0.5) * 0.5;
    const z = bz + nz * spread + (Math.random() - 0.5) * 0.5;

    // Color gradient based on position and spread
    let c = new THREE.Color(0x888888);
    if (Math.abs(spread) > 0.6) {
      c.setHex(0xffffff); // Pure white highlights
    } else if (Math.random() > 0.7) {
      c.setHex(0xaaaaaa);
    } else {
      c.setHex(0x555555); // darker inner core
    }

    particles.push({
      hx: x, hy: y, hz: z,
      x: x + (Math.random() - 0.5) * 6, // Start widely scattered for form-in animation
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

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particles.length * 3);
  const colors = new Float32Array(particles.length * 3);
  
  particles.forEach((p, i) => {
    positions[i*3]   = p.x;
    positions[i*3+1] = p.y;
    positions[i*3+2] = p.z;
    colors[i*3]   = p.color.r;
    colors[i*3+1] = p.color.g;
    colors[i*3+2] = p.color.b;
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  rocketGroup.add(points);

  // Post-processing for glowing particle effect
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  renderPass.clearColor = new THREE.Color(0, 0, 0);
  renderPass.clearAlpha = 0;
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.8,  // bloom strength
    0.4,  // radius
    0.15  // threshold
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // Mouse / Hover Interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-9999, -9999);
  let isHovering = false;
  
  const getCanvasBounds = () => canvas.getBoundingClientRect();
  
  window.addEventListener('mousemove', (e) => {
    const bounds = getCanvasBounds();
    // Check if mouse is within the canvas area
    if (e.clientX >= bounds.left && e.clientX <= bounds.right && 
        e.clientY >= bounds.top && e.clientY <= bounds.bottom) {
      isHovering = true;
      mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
      if (hint) hint.classList.add('hidden');
    } else {
      isHovering = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
  });

  window.addEventListener('mouseleave', () => {
    isHovering = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

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
  window.addEventListener('resize', resize);
  resize();

  // Physics animation loop
  let rafId;
  const posAttr = geometry.attributes.position;
  const clock = new THREE.Clock();

  const REPULSE_RADIUS = 3.5;
  const REPULSE_FORCE = 0.8;
  const SPRING_K = 0.08;
  const DAMPING = 0.82;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Slow rotation of the entire group
    rocketGroup.rotation.y = Math.PI / 4 + Math.sin(time * 0.4) * 0.15;
    rocketGroup.rotation.x = Math.cos(time * 0.5) * 0.05;

    raycaster.setFromCamera(mouse, camera);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, target);

    // Convert mouse world pos to rocket local space
    rocketGroup.worldToLocal(target);

    for(let i=0; i<particles.length; i++) {
      const p = particles[i];

      // 1. Scroll Scatter Explosion
      if (scrollProgress > 0.01) {
        const mag = scrollProgress * 25;
        const tx = p.hx + p.scatterDir.x * mag;
        const ty = p.hy + p.scatterDir.y * mag;
        const tz = p.hz + p.scatterDir.z * mag;
        
        p.vx += (tx - p.x) * 0.1;
        p.vy += (ty - p.y) * 0.1;
        p.vz += (tz - p.z) * 0.1;
      } 
      // 2. Hover Repulsion Scatter
      else if (isHovering) {
        const dx = p.x - target.x;
        const dy = p.y - target.y;
        const dz = p.z - target.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (dist < REPULSE_RADIUS && dist > 0.1) {
          const force = (1 - dist/REPULSE_RADIUS) * REPULSE_FORCE;
          p.vx += (dx/dist) * force;
          p.vy += (dy/dist) * force;
          p.vz += (dz/dist) * force;
        }
      }

      // 3. Spring back to original shape + breathing effect
      if (scrollProgress <= 0.01) {
        const breathe = Math.sin(time * 2 + p.hy * 0.5) * 0.06;
        p.vx += (p.hx + p.hx * breathe - p.x) * SPRING_K;
        p.vy += (p.hy + p.hy * breathe - p.y) * SPRING_K;
        p.vz += (p.hz + p.hz * breathe - p.z) * SPRING_K;
      }

      // Apply velocity and damping
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.vz *= DAMPING;

      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      posAttr.setXYZ(i, p.x, p.y, p.z);
    }
    
    posAttr.needsUpdate = true;
    
    // Fade out entirely as user scrolls past hero
    material.opacity = 0.85 * Math.max(0, 1 - scrollProgress * 1.5);

    composer.render();
  }

  animate();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  };
}
