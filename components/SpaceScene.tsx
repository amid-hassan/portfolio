'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MOONS, REQUESTS } from '../lib/content';
import { ATMO_FS, ATMO_VS, CLOUD_FS, PLANET_FS, PLANET_VS, SKY_FS, SKY_VS } from '../lib/shaders';

const SUN = new THREE.Vector3(-0.85, 0.32, -0.25).normalize();
const PLANET_R = 2.2;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Tag order: planet, then the moons, then the ship. */
const TAGS = [{ name: 'Database', tech: 'PostgreSQL' }, ...MOONS.map((m) => ({ name: m.name, tech: m.tech })), { name: 'Request', tech: REQUESTS[0] }];

const glowTexture = (inner: string, outer: string) => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  if (g) {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner);
    gr.addColorStop(1, outer);
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(c);
};

export default function SpaceScene() {
  const cv = useRef<HTMLCanvasElement>(null);
  const tagEls = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas) return;
    THREE.ColorManagement.enabled = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch {
      canvas.style.display = 'none';
      return;
    }
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setClearColor(0x05060f, 1);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
    const world = new THREE.Group();
    scene.add(world);

    const sunLight = new THREE.DirectionalLight(0xfff1de, 2.6);
    sunLight.position.copy(SUN).multiplyScalar(50);
    scene.add(sunLight, new THREE.AmbientLight(0x6070a0, 0.3));

    const uni = { uSun: { value: SUN }, uTime: { value: 0 } };

    // Nebula sky, stars and a distant sun.
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(150, 32, 16),
        new THREE.ShaderMaterial({ vertexShader: SKY_VS, fragmentShader: SKY_FS, uniforms: uni, side: THREE.BackSide, depthWrite: false }),
      ),
    );
    const N_STARS = 2600;
    const sp = new Float32Array(N_STARS * 3);
    const sc = new Float32Array(N_STARS * 3);
    for (let i = 0; i < N_STARS; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = 70 + Math.random() * 40;
      const s = Math.sqrt(1 - u * u);
      sp.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3);
      const warm = Math.random();
      const b = 0.5 + Math.random() * 0.5;
      sc.set([b * (0.8 + warm * 0.2), b * 0.9, b * (1 - warm * 0.3)], i * 3);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(sc, 3));
    const dot = glowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ map: dot, size: 2.4, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    scene.add(stars);
    const sunTex = glowTexture('rgba(255,236,200,1)', 'rgba(255,170,90,0)');
    const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    sunSprite.position.copy(SUN).multiplyScalar(110);
    sunSprite.scale.setScalar(60);
    scene.add(sunSprite);

    // Exoplanet: surface, clouds, atmosphere.
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(PLANET_R, 96, 64),
      new THREE.ShaderMaterial({ vertexShader: PLANET_VS, fragmentShader: PLANET_FS, uniforms: uni }),
    );
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(PLANET_R * 1.015, 64, 48),
      new THREE.ShaderMaterial({ vertexShader: PLANET_VS, fragmentShader: CLOUD_FS, uniforms: uni, transparent: true, depthWrite: false }),
    );
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(PLANET_R * 1.14, 64, 48),
      new THREE.ShaderMaterial({ vertexShader: ATMO_VS, fragmentShader: ATMO_FS, uniforms: uni, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    world.add(planet, clouds, atmo);

    // Moons and their faint orbit rings.
    const moons = MOONS.map((m) => {
      const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(m.radius, 3), new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.95, metalness: 0 }));
      world.add(mesh);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 160; i++) pts.push(new THREE.Vector3(Math.cos((i / 160) * Math.PI * 2) * m.orbit, 0, Math.sin((i / 160) * Math.PI * 2) * m.orbit).applyEuler(new THREE.Euler(m.tilt, 0, 0)));
      const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 }));
      world.add(ring);
      return { mesh, def: m, tilt: new THREE.Euler(m.tilt, 0, 0) };
    });

    // Spaceship (forward is +z) with an engine glow and a fading trail.
    const ship = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0xdfe6f5, roughness: 0.35, metalness: 0.6 });
    const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.55, 6, 12), metal);
    hull.rotation.x = Math.PI / 2;
    const wings = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.24), metal);
    wings.position.z = -0.12;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.2, 0.22), metal);
    fin.position.set(0, 0.1, -0.26);
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), new THREE.MeshBasicMaterial({ color: 0x8fe3ff }));
    cockpit.scale.set(1, 0.8, 1.5);
    cockpit.position.set(0, 0.07, 0.15);
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.065, 0.4, 16),
      new THREE.MeshBasicMaterial({ color: 0xffa24a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    flame.rotation.x = -Math.PI / 2;
    flame.position.z = -0.6;
    const engineGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,190,110,1)', 'rgba(255,120,40,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    engineGlow.scale.setScalar(0.7);
    engineGlow.position.z = -0.42;
    ship.add(hull, wings, fin, cockpit, flame, engineGlow);
    world.add(ship);

    const TRAIL = 140;
    const tp = new Float32Array(TRAIL * 3);
    const tc = new Float32Array(TRAIL * 3);
    for (let i = 0; i < TRAIL; i++) {
      const f = Math.pow(1 - i / TRAIL, 2);
      tc.set([f, 0.62 * f, 0.28 * f], i * 3);
    }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(tp, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(tc, 3));
    const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    trail.frustumCulled = false;
    world.add(trail);
    const SHIP_R = 3.15;
    const shipTilt = new THREE.Euler(0.5, 0, 0.4);

    let W = 1;
    let H = 1;
    let narrow = false;
    let target = 0;
    let ps = 0;
    let t = 0;
    let reqIdx = 0;
    const v = new THREE.Vector3();
    const to = new THREE.Vector3();
    const look = new THREE.Matrix4();
    const UP = new THREE.Vector3(0, 1, 0);

    const place = (a: number, out: THREE.Vector3) => out.set(Math.cos(a) * SHIP_R, 0, Math.sin(a) * SHIP_R).applyEuler(shipTilt);

    const draw = () => {
      uni.uTime.value = t;
      planet.rotation.y = t * 0.035;
      clouds.rotation.y = t * 0.05;
      stars.rotation.y = t * 0.002 + ps * 0.4;
      moons.forEach((m) => {
        const a = m.def.phase + t * m.def.speed;
        m.mesh.position.set(Math.cos(a) * m.def.orbit, 0, Math.sin(a) * m.def.orbit).applyEuler(m.tilt);
        m.mesh.rotation.y = t * 0.2;
      });
      const a = 0.6 + t * 0.34;
      place(a, ship.position);
      place(a + 0.05, to);
      look.lookAt(to, ship.position, UP);
      ship.quaternion.setFromRotationMatrix(look);
      flame.scale.set(1, 1 + Math.sin(t * 40) * 0.12, 1);
      if (!reduce) {
        tp.copyWithin(3, 0, (TRAIL - 1) * 3);
        tp.set([ship.position.x, ship.position.y, ship.position.z], 0);
        trailGeo.attributes.position.needsUpdate = true;
      }

      // Scroll-driven camera: a slow orbit around the planet that closes in as you read.
      const e = ease(ps);
      const r = narrow ? lerp(18, 14.5, e) : lerp(11.8, 9.6, e);
      const th = 0.35 + ps * Math.PI * 1.5;
      cam.position.set(Math.sin(th) * r, 1.1 * Math.cos(ps * Math.PI * 2.2), Math.cos(th) * r);
      cam.lookAt(0, 0, 0);
      const settle = 1 - ease(clamp(ps * 3.5));
      cam.setViewOffset(W, H, narrow ? 0 : -W * 0.17 * settle, narrow ? H * 0.17 * settle : 0, W, H);
      world.scale.setScalar(narrow ? 0.78 : 1);
      renderer.render(scene, cam);

      // Labels follow their bodies and fade out as the camera leaves the hero.
      const bodies = [planet, ...moons.map((m) => m.mesh), ship];
      const fade = clamp(1 - ps * 5);
      bodies.forEach((b, i) => {
        const el = tagEls.current[i];
        if (!el) return;
        b.getWorldPosition(v);
        v.project(cam);
        const x = (v.x * 0.5 + 0.5) * W;
        const y = (-v.y * 0.5 + 0.5) * H;
        const inView = x > 24 && x < W - 24 && y > 70 && y < H - 24 && v.z < 1;
        el.style.opacity = inView ? String(fade) : '0';
        el.style.transform = i === 0 ? `translate(${x}px,${y}px) translate(-50%,-50%)` : `translate(${x}px,${y}px) translate(16px,-50%)`;
      });
    };

    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      narrow = W < 720;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.5 : 1.75));
      renderer.setSize(W, H, false);
      cam.aspect = W / H;
      draw();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? clamp(window.scrollY / max) : 0;
      if (reduce) {
        ps = target;
        draw();
      }
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      ps += (target - ps) * Math.min(1, dt * 4);
      if (Math.floor(t / 2.4) !== reqIdx) {
        reqIdx = Math.floor(t / 2.4);
        const el = tagEls.current[TAGS.length - 1];
        const sub = el?.querySelector('span');
        if (sub) sub.textContent = REQUESTS[reqIdx % REQUESTS.length];
      }
      draw();
    };

    window.addEventListener('resize', size);
    window.addEventListener('scroll', onScroll, { passive: true });
    size();
    onScroll();
    ps = target;
    if (!reduce) raf = requestAnimationFrame(loop);
    else draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      window.removeEventListener('scroll', onScroll);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mt = m.material as THREE.Material | THREE.Material[] | undefined;
        if (mt) (Array.isArray(mt) ? mt : [mt]).forEach((x) => x.dispose());
      });
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={cv} className="space" aria-hidden="true" />
      <div className="tags" aria-hidden="true">
        {TAGS.map((tg, i) => (
          <div
            key={tg.name}
            className="tag"
            ref={(e) => {
              tagEls.current[i] = e;
            }}
          >
            <b>{tg.name}</b>
            <span>{tg.tech}</span>
          </div>
        ))}
      </div>
    </>
  );
}
