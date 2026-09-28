'use client';
// v3 three.js scene kit. Every scene on the site repeats the same chores, so they live here once:
// - a WebGL renderer with a still fallback when WebGL is unavailable (the scene's `fallback` text is shown);
// - resize with the host, capped pixel ratio;
// - drag to rotate (pointer) and arrow keys, on a pivot group, with a gentle return;
// - paused while off-screen (IntersectionObserver) and one static frame under reduced motion;
// - HTML labels pinned to 3D points (real text: sharp, selectable, and read by screen readers);
// - geometry and material disposal on unmount.
// A scene supplies `build(ctx)` returning `update(t)`; `t` is seconds since mount, frozen under reduced motion.
import { useEffect, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

export type Label = { text: string; at: THREE.Vector3; tone?: 'copper' | 'teal' | 'muted' };
export type SceneCtx = {
  THREE: typeof THREE;
  scene: THREE.Scene;
  pivot: THREE.Group;
  camera: THREE.PerspectiveCamera;
  mat: (color: string, o?: Partial<THREE.MeshStandardMaterialParameters>) => THREE.MeshStandardMaterial;
  box: (w: number, h: number, d: number, m: THREE.Material, x?: number, y?: number, z?: number, parent?: THREE.Object3D) => THREE.Mesh;
  labels: Label[];
};
export type Build = (ctx: SceneCtx) => { update?: (t: number) => void; frozenAt?: number };

export const C = {
  ground: '#101212', surface: '#191d1b', line: '#3d453b', paper: '#eeeae2',
  copper: '#d4a36e', hardware: '#bf7f3b', teal: '#2f9e8c', muted: '#6b736a', silicon: '#3a4146',
};

export function Scene3D({
  build, reduced, label, fallback, camera = [6, 5.2, 7], height = 420, deps = [], children,
}: {
  build: Build; reduced: boolean; label: string; fallback: string;
  camera?: [number, number, number]; height?: number; deps?: unknown[]; children?: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const labelHost = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = host.current!, lh = labelHost.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      if (fallbackRef.current) fallbackRef.current.hidden = false;
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
    cam.position.set(...camera);
    cam.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight('#e6ecef', '#2a2014', 2.2));
    const key = new THREE.DirectionalLight('#ffd6a0', 3.2); key.position.set(4, 8, 5); scene.add(key);
    const rim = new THREE.DirectionalLight('#9fb4c8', 1.6); rim.position.set(-5, 3, -4); scene.add(rim);
    const pivot = new THREE.Group(); scene.add(pivot);

    const mats: THREE.Material[] = [];
    const mat: SceneCtx['mat'] = (color, o = {}) => { const m = new THREE.MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.5, ...o }); mats.push(m); return m; };
    const box: SceneCtx['box'] = (w, h, d, m, x = 0, y = 0, z = 0, parent = pivot) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); parent.add(b); return b; };
    const labels: Label[] = [];
    const s = build({ THREE, scene, pivot, camera: cam, mat, box, labels });

    // labels as HTML over the canvas
    lh.replaceChildren(...labels.map((l) => { const sp = document.createElement('span'); sp.className = 's3-label is-' + (l.tone || 'muted'); sp.textContent = l.text; return sp; }));
    const spans = [...lh.children] as HTMLElement[];
    const v = new THREE.Vector3();
    const placeLabels = () => {
      const w = el.clientWidth, h = el.clientHeight;
      labels.forEach((l, i) => {
        v.copy(l.at); pivot.localToWorld(v); v.project(cam);
        spans[i].style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -50%)`;
        spans[i].style.opacity = v.z < 1 ? '1' : '0';
      });
    };

    // drag / keys rotate the pivot
    let yaw = 0, pitch = 0, dragging = false, px = 0, py = 0, idle = 0;
    const down = (e: PointerEvent) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!dragging) return; yaw += (e.clientX - px) * 0.008; pitch = Math.max(-0.5, Math.min(0.6, pitch + (e.clientY - py) * 0.005)); px = e.clientX; py = e.clientY; idle = 0; if (reduced) draw(); };
    const up = () => { dragging = false; };
    const keys = (e: KeyboardEvent) => {
      const d = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key];
      if (!d) return; e.preventDefault(); yaw += d[0]; pitch = Math.max(-0.5, Math.min(0.6, pitch + d[1])); idle = 0; if (reduced) draw();
    };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('keydown', keys);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight || height;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); draw();
    };
    let t0 = performance.now(), frame = 0, visible = false;
    function draw() {
      const t = reduced ? (s.frozenAt ?? 0) : (performance.now() - t0) / 1000;
      if (!dragging && !reduced) { idle += 1; if (idle > 240) yaw *= 0.985; }
      pivot.rotation.set(pitch, yaw + (reduced ? 0 : Math.sin(t * 0.25) * 0.12), 0);
      s.update?.(t);
      renderer.render(scene, cam);
      placeLabels();
    }
    const tick = () => { frame = requestAnimationFrame(tick); if (visible) draw(); };
    const ro = new ResizeObserver(resize); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && reduced) draw(); });
    io.observe(el);
    resize();
    if (!reduced) frame = requestAnimationFrame(tick); else draw();

    return () => {
      cancelAnimationFrame(frame); ro.disconnect(); io.disconnect();
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('keydown', keys);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); });
      mats.forEach((m) => m.dispose());
      renderer.dispose(); renderer.domElement.remove(); lh.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return (
    <figure className="s3" aria-label={label}>
      <div className="s3-stage" ref={host} tabIndex={0} role="img" aria-label={label + ' Drag or use the arrow keys to rotate.'} style={{ height }}>
        <div className="s3-labels" ref={labelHost} aria-hidden="true" />
        <p className="s3-fallback" ref={fallbackRef} hidden>{fallback}</p>
      </div>
      {children && <figcaption className="s3-caption">{children}</figcaption>}
    </figure>
  );
}
