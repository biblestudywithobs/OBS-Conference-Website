"use client";
import { useEffect, useRef } from "react";

// Hero background: particles fly in from all around and gather into an open
// Bible, then a few "light" particles keep rising off its pages.
// Three.js is loaded on demand so it never blocks the first paint.

const vertex = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aTarget;
  attribute float aSeed;
  attribute float aRise;
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uMouse;   // pointer in canvas NDC
  uniform float uHover;  // 0..1, eased in while the pointer is over the hero
  uniform float uAspect;
  varying float vAlpha;
  varying float vRise;
  varying float vFly;

  void main() {
    float d = aSeed * 0.45;
    float p = smoothstep(d, d + 0.55, uProgress);
    float e = 1.0 - pow(1.0 - p, 3.0);
    vec3 pos = mix(aStart, aTarget, e);
    // swirl in: particles spiral around the book on their way to it
    float sw = (1.0 - e) * (2.2 + aSeed * 2.0);
    pos.xz = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * pos.xz;
    pos.y += sin(e * 3.1416) * (aSeed - 0.3) * 0.9;
    pos.y += sin(uTime * 0.9 + aSeed * 40.0) * 0.012 * p;
    vAlpha = 0.9;
    vFly = 1.0 - p;

    if (aRise > 0.5) {
      float t = fract(uTime * (0.035 + aSeed * 0.05) + aSeed * 13.0);
      pos = aTarget + vec3(sin(t * 6.283 + aSeed * 10.0) * 0.12, t * 1.9, cos(t * 6.283 + aSeed * 7.0) * 0.12);
      vAlpha = sin(t * 3.1416) * p;
    }
    vRise = aRise;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) * (1.0 + vFly * 0.25) / -mv.z;
    gl_Position = projectionMatrix * mv;

    // mouse: particles part around the pointer and drift back when it leaves
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 dir = (ndc - uMouse) * vec2(uAspect, 1.0);
    float dist = length(dir);
    float push = smoothstep(0.32, 0.0, dist) * uHover;
    gl_Position.xy += normalize(dir + 1e-5) / vec2(uAspect, 1.0) * push * 0.16 * gl_Position.w;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uPage;
  uniform vec3 uLight;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vRise;
  varying float vFly;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(mix(uPage, uLight, max(vRise, vFly)), a);
  }
`;

// A point on an open book lying in the x–z plane, spine along z.
function pagePoint(side, u, v) {
  const x = side * (0.06 + u * 1.55);
  const y = 0.34 * (1 - Math.exp(-u * 5)) - 0.06 * u * u;
  const z = v * 1.05;
  return [x, y, z];
}

function buildBook(count) {
  const start = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const rise = new Float32Array(count);
  const rows = 14;

  for (let i = 0; i < count; i++) {
    const side = i % 2 ? 1 : -1;
    const r = Math.random();
    let u, v;
    if (r < 0.45) {
      // "lines of text": rows across each page, with a margin
      u = 0.12 + Math.random() * 0.76;
      v = -0.85 + (Math.floor(Math.random() * rows) / (rows - 1)) * 1.7 + (Math.random() - 0.5) * 0.015;
    } else if (r < 0.7) {
      // page edges, so the shape reads clearly
      const e = Math.random();
      if (e < 0.5) { u = 1; v = Math.random() * 2 - 1; }
      else { u = Math.random(); v = e < 0.75 ? -1 : 1; }
    } else {
      u = Math.random();
      v = Math.random() * 2 - 1;
    }
    const [x, y, z] = pagePoint(side, u, v);
    target.set([x, y, z], i * 3);

    // start scattered on a large shell around the book
    start.set([(Math.random() * 2 - 1) * 6.5, (Math.random() * 2 - 1) * 3.2, -3.5 + Math.random() * 4], i * 3);

    seed[i] = Math.random();
    rise[i] = Math.random() < 0.12 ? 1 : 0;
  }
  return { start, target, seed, rise };
}

export default function BookScene() {
  const host = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const el = host.current;
      if (disposed || !el) return;

      const canvas = document.createElement("canvas");
      let gl;
      try {
        gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      } catch { gl = null; }
      if (!gl) return; // no WebGL: the page looks fine without it

      const restOpacity = 0.55;
      const small = false; // desktop only (see Site.js)
      const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: false, powerPreference: "low-power" });
      const ratio = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
      renderer.setPixelRatio(ratio);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.set(0, 0.2, 6);

      const { start, target, seed, rise } = buildBook(small ? 1400 : 3200);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(target.slice(), 3));
      geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
      geo.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      geo.setAttribute("aRise", new THREE.BufferAttribute(rise, 1));

      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSize: { value: small ? 22 : 40 },
        uPixelRatio: { value: ratio },
        uOpacity: { value: 1 },
        uMouse: { value: new THREE.Vector2(9, 9) },
        uHover: { value: 0 },
        uAspect: { value: 1 },
        uPage: { value: new THREE.Color("#1B623A") },
        uLight: { value: new THREE.Color("#D9902F") },
      };
      const mat = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthWrite: false });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;

      const group = new THREE.Group();
      group.add(points);
      group.rotation.x = 0.62;
      scene.add(group);

      const layout = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        uniforms.uAspect.value = w / h;
        camera.updateProjectionMatrix();
        const narrow = w < 900;
        group.position.set(narrow ? 0.75 : 1.6, narrow ? -1.0 : -0.35, 0);
        group.scale.setScalar(narrow ? Math.min(1, w / 520) * 0.75 : 0.9);
      };
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(el);

      const mouse = { x: 0, y: 0, nx: 9, ny: 9, inside: false };
      const onMove = (e) => {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = (e.clientY / innerHeight) * 2 - 1;
        const r = el.getBoundingClientRect();
        mouse.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        mouse.nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouse.ny = -((e.clientY - r.top) / r.height) * 2 + 1;
      };
      addEventListener("pointermove", onMove, { passive: true });

      const reduced = () =>
        matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";

      let visible = true, raf = 0, last = performance.now(), t = 0;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      });
      io.observe(el);

      function frame(now) {
        raf = 0;
        if (disposed) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (reduced()) {
          uniforms.uProgress.value = 1;
          uniforms.uOpacity.value = restOpacity;
          renderer.render(scene, camera);
          return; // one still frame; MotionToggle / visibility restarts it
        }
        t += dt;
        uniforms.uTime.value = t;
        uniforms.uProgress.value = Math.min(1, uniforms.uProgress.value + dt / 4.5);
        // bold while gathering, then settle back so the heading stays readable
        const settle = Math.max(0, (uniforms.uProgress.value - 0.75) / 0.25);
        uniforms.uOpacity.value = 1 - settle * (1 - restOpacity);
        uniforms.uHover.value += ((mouse.inside ? 1 : 0) - uniforms.uHover.value) * 0.08;
        uniforms.uMouse.value.set(mouse.nx, mouse.ny);
        group.rotation.y += (mouse.x * 0.35 + Math.sin(t * 0.25) * 0.12 - group.rotation.y) * 0.04;
        group.rotation.x += (0.62 + mouse.y * 0.12 - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
        if (visible) raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);

      const replay = (e) => {
        if (!e.persisted) return;
        uniforms.uProgress.value = 0; t = 0;
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      };
      addEventListener("pageshow", replay);

      // restart when the footer "Reduce motion" toggle is switched off again
      const mo = new MutationObserver(() => {
        if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect(); ro.disconnect(); mo.disconnect();
        removeEventListener("pointermove", onMove);
        removeEventListener("pageshow", replay);
        geo.dispose(); mat.dispose(); renderer.dispose();
        canvas.remove();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  return <div ref={host} className="hero-gl" aria-hidden="true" />;
}
