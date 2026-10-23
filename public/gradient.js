// gradient.js — WebGL GLSL scroll-linked background shader
// Performance-optimized: 2-octave FBM (was 4), 30fps throttle, hidden-tab pause
// Loaded as a regular <script> from index.html (not a module)
// Exposes window.GradientShader.setScroll(0..1)
(function () {
  'use strict';
  
  function initGradient() {
    const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('gradient-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { antialias: false, depth: false, alpha: false });
  if (!gl) { canvas.style.display = 'none'; return; }

  // ── GLSL shaders ────────────────────────────────────────────────────────
  const VERT = `
    precision mediump float;
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_pos + 1.0) * 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Reduced from 4 octaves to 2 — cuts GPU shader cost ~50%
  const FRAG = `
    precision mediump float;
    varying  vec2 v_uv;
    uniform  float u_time;
    uniform  float u_scroll;

    vec3 hash3(vec2 p) {
      vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                    dot(p, vec2(269.5, 183.3)),
                    dot(p, vec2(419.2, 371.9)));
      return fract(sin(q) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = dot(hash3(i).xy,            f - vec2(0.0, 0.0));
      float b = dot(hash3(i + vec2(1,0)).xy, f - vec2(1.0, 0.0));
      float c = dot(hash3(i + vec2(0,1)).xy, f - vec2(0.0, 1.0));
      float d = dot(hash3(i + vec2(1,1)).xy, f - vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    float fbm(vec2 p) {
      /* 2 octaves instead of 4 — ~50% faster on GPU */
      float v = 0.0, a = 0.5;
      v += a * noise(p); p *= 2.0; a *= 0.5;
      v += a * noise(p);
      return v;
    }

    vec3 palette(float s) {
      vec3 c0 = vec3(0.03, 0.03, 0.03);
      vec3 c1 = vec3(0.08, 0.08, 0.08);
      vec3 c2 = vec3(0.14, 0.14, 0.14);
      vec3 c3 = vec3(0.06, 0.06, 0.06);
      if (s < 0.33)      return mix(c0, c1, s / 0.33);
      else if (s < 0.66) return mix(c1, c2, (s - 0.33) / 0.33);
      else               return mix(c2, c3, (s - 0.66) / 0.34);
    }

    void main() {
      vec2 uv = v_uv;
      float t = u_time * 0.18;

      float q = fbm(uv * 2.5 + t);
      float r = fbm(uv * 2.5 - t + vec2(q, q * 1.3));
      float n = fbm(uv * 3.0 + r * 1.2);

      vec3 base  = palette(u_scroll);
      vec3 light = base + vec3(0.06, 0.09, 0.08) * n;
      vec3 dark  = base * 0.3;
      vec3 col   = mix(dark, light, smoothstep(0.2, 0.85, n + u_scroll * 0.2));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime   = gl.getUniformLocation(prog, 'u_time');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');

  let scroll    = 0;
  let startTime = performance.now();
  let rafId;
  let frameCount = 0;  // for 30fps throttle

  function resize() {
    // Render at 50% resolution — upscaled by CSS (already was 0.5)
    const w = Math.floor(canvas.clientWidth  * 0.5);
    const h = Math.floor(canvas.clientHeight * 0.5);
    canvas.width  = Math.max(w, 1);
    canvas.height = Math.max(h, 1);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function render() {
    rafId = requestAnimationFrame(render);

    // Throttle to ~30fps: only draw on every other frame
    frameCount++;
    if (frameCount % 2 !== 0) return;

    const t = IS_REDUCED ? 0 : (performance.now() - startTime) / 1000;
    gl.uniform1f(uTime,   t);
    gl.uniform1f(uScroll, scroll);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  render();

  // Pause when browser tab is hidden — save GPU entirely
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      startTime = performance.now() - startTime; // keep time continuity
      render();
    }
  });

  window.GradientShader = {
    setScroll(v) { scroll = Math.max(0, Math.min(1, v)); },
  };
} // end init function

// Defer WebGL initialization until after critical page load
if (window.requestIdleCallback) {
  window.requestIdleCallback(initGradient, { timeout: 2000 });
} else {
  setTimeout(initGradient, 500);
}

})();
