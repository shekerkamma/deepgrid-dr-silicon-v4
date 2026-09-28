'use client';
// v3's procedural three.js scenes. Each draws only what the site already states, from its own data:
// - Lockstep: the safety path on /technology/safety (MAIN and CHECKER commit the same values, CHECKER behind MAIN;
//   a mismatch at the comparator latches the first cause, drops FAULT_N and the gate driver turns the bridge off).
// - Motor: a three-phase stator and rotor; each coil's glow is its phase current, a sine 120° apart, the quantity
//   the field-oriented-control tick on /technology/control-loop regulates.
// - QFN-64: 16 pads a side at 0.5 mm pitch on a 9 × 9 mm body, pin 1 upper left, numbered counter-clockwise, with
//   the side groups from detail-content.ts `packageSides`. The per-pin map awaits the foundry's bond diagram, so
//   pins are lit by side group, never pin by pin.
// - Wafer: an illustration of a multi-project shuttle, DG32's slot on each shared reticle (first silicon on the
//   September 2026 shuttle, applications-story-data.ts).
import { useRef } from 'react';
import { Scene3D, C, type Build } from './use-scene';
import { packageSides } from '../detail-content';

// ------------------------------------------------------------------ lockstep
export function LockstepScene({ reduced }: { reduced: boolean }) {
  const build: Build = ({ THREE, mat, box, labels, pivot }) => {
    box(7.2, 0.16, 4.6, mat(C.silicon, { metalness: 0.6, roughness: 0.35 }), 0, -0.12, 0);
    const coreMat = (tone: string) => mat('#26302c', { emissive: tone, emissiveIntensity: 0.12 });
    const main = box(1.9, 0.34, 1.3, coreMat(C.copper), -2.4, 0.12, -1.15);
    const checker = box(1.9, 0.34, 1.3, coreMat(C.copper), -2.4, 0.12, 1.15);
    [main, checker].forEach((c) => { for (let i = 0; i < 12; i++) box(0.22, 0.02, 0.22, mat(i % 3 ? C.muted : C.copper), (i % 4 - 1.5) * 0.4, 0.19, (Math.floor(i / 4) - 1) * 0.38, c); });
    const cmpMat = mat('#2a302d', { emissive: C.copper, emissiveIntensity: 0.08 });
    const cmp = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 32), cmpMat); cmp.position.set(0, 0.12, 0); pivot.add(cmp);
    const latchMat = mat('#2a302d', { emissive: C.hardware, emissiveIntensity: 0 });
    box(0.7, 0.3, 0.7, latchMat, 1.35, 0.11, 0);
    const faultMat = mat(C.line, { emissive: C.hardware, emissiveIntensity: 0 });
    box(1.05, 0.05, 0.08, faultMat, 2.2, 0.02, 0);
    const bridgeMat = mat('#39413c', { emissive: C.teal, emissiveIntensity: 0 });
    for (let i = 0; i < 3; i++) for (const zz of [-0.25, 0.25]) box(0.28, 0.55, 0.28, bridgeMat, 2.95, 0.22, (i - 1) * 0.95 + zz);
    // value chips from each core to the comparator
    const chipGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const good = mat(C.paper, { emissive: C.paper, emissiveIntensity: 0.25 });
    const bad = mat(C.hardware, { emissive: C.hardware, emissiveIntensity: 1.1 });
    const N = 6;
    const lanes = [-1.15, 1.15].map((z) => Array.from({ length: N }, () => { const m = new THREE.Mesh(chipGeo, good); m.position.set(0, 0.42, z); pivot.add(m); return m; }));
    const faulty = new THREE.Mesh(chipGeo.clone(), bad); faulty.scale.setScalar(1.25); pivot.add(faulty);
    labels.push(
      { text: 'MAIN', at: new THREE.Vector3(-2.4, 0.55, -1.15), tone: 'copper' },
      { text: 'CHECKER · runs behind', at: new THREE.Vector3(-2.4, 0.55, 1.15), tone: 'copper' },
      { text: 'COMPARATOR', at: new THREE.Vector3(0, 0.62, 0) },
      { text: 'FAULT LATCH', at: new THREE.Vector3(1.35, 0.55, -0.1) },
      { text: 'FAULT_N', at: new THREE.Vector3(2.15, 0.25, -0.55), tone: 'copper' },
      { text: 'BRIDGE', at: new THREE.Vector3(2.95, 0.9, 1.2), tone: 'teal' },
    );
    const P = 7;
    return {
      frozenAt: 4.2,
      update: (t) => {
        const ph = t % P, tripped = ph > 3.1;
        lanes.forEach((lane, li) => lane.forEach((m, i) => {
          const p = ((t * 0.55 + i / N + (li ? -0.06 : 0)) % 1 + 1) % 1; // CHECKER a step behind MAIN
          m.visible = ph < 2.9 || ph > P - 0.2;
          m.position.x = -1.45 + p * 1.1; m.position.z = (li ? 1.15 : -1.15) * (1 - p);
        }));
        const fp = (ph - 2.0) / 0.9;
        faulty.visible = fp > 0 && fp < 1;
        if (faulty.visible) faulty.position.set(-1.45 + fp * 1.1, 0.42, -1.15 * (1 - fp));
        cmpMat.emissiveIntensity = ph > 2.9 && ph < 3.5 ? 1.2 : tripped ? 0.35 : 0.08;
        latchMat.emissiveIntensity = tripped ? 0.9 : 0;
        faultMat.emissiveIntensity = ph > 3.2 ? 1 : 0;
        bridgeMat.emissiveIntensity = ph > 3.4 ? 0.9 : 0;
      },
    };
  };
  return (
    <Scene3D build={build} reduced={reduced} height={420} camera={[4.7, 5.4, 6.4]}
      label="3D model of the DG32-LITE safety path: MAIN and CHECKER cores feed a comparator; a wrong value from MAIN trips the fault latch, drops FAULT_N and turns the motor bridge off."
      fallback="MAIN and CHECKER commit the same values; a mismatch at the comparator latches the fault, drops FAULT_N and the gate driver turns the bridge off.">
      A wrong value from MAIN (copper) meets CHECKER’s at the comparator. The mismatch latches the first cause, FAULT_N falls and the bridge turns off (teal), with no firmware in that path. Illustration of the path, not a floorplan.
    </Scene3D>
  );
}

// ------------------------------------------------------------------ motor
export function MotorScene({ reduced }: { reduced: boolean }) {
  const build: Build = ({ THREE, mat, box, labels, pivot }) => {
    const back = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.22, 16, 72), mat('#3a403c', { metalness: 0.7, roughness: 0.35 }));
    back.rotation.x = Math.PI / 2; pivot.add(back);
    const tones = [C.copper, C.teal, '#b9c4b8'];
    const coils: { m: import('three').MeshStandardMaterial; phase: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, phase = i % 3;
      const g = new THREE.Group(); g.rotation.y = -a; pivot.add(g);
      box(0.55, 0.42, 0.22, mat('#4a524d', { metalness: 0.7 }), 1.85, 0, 0, g);
      const cm = mat(tones[phase], { emissive: tones[phase], emissiveIntensity: 0, metalness: 0.2, roughness: 0.6 });
      box(0.38, 0.5, 0.36, cm, 1.72, 0, 0, g);
      coils.push({ m: cm, phase });
    }
    const rotor = new THREE.Group(); pivot.add(rotor);
    const core = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.6, 48), mat('#2a302d', { metalness: 0.6 })); rotor.add(core);
    for (let k = 0; k < 4; k++) {
      const g = new THREE.Group(); g.rotation.y = (k / 4) * Math.PI * 2; rotor.add(g);
      box(0.28, 0.58, 0.95, mat(k % 2 ? C.muted : C.hardware, { metalness: 0.5 }), 1.12, 0, 0, g);
    }
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.6, 20), mat('#9aa39b', { metalness: 0.9, roughness: 0.2 })); rotor.add(shaft);
    labels.push(
      { text: 'PHASE A', at: new THREE.Vector3(2.55, 0.35, 0), tone: 'copper' },
      { text: 'PHASE B', at: new THREE.Vector3(-1.3, 0.35, -2.2), tone: 'teal' },
      { text: 'PHASE C', at: new THREE.Vector3(-1.3, 0.35, 2.2) },
      { text: 'ROTOR', at: new THREE.Vector3(0, 0.9, 0) },
    );
    return {
      frozenAt: 0.8,
      update: (t) => {
        const th = t * 1.1; rotor.rotation.y = -th;
        coils.forEach(({ m, phase }) => { m.emissiveIntensity = Math.max(0, Math.sin(2 * th - (phase * 2 * Math.PI) / 3)) * 1.1; });
      },
    };
  };
  return (
    <Scene3D build={build} reduced={reduced} height={380} camera={[4.8, 5.4, 5.8]}
      label="3D model of a three-phase brushless motor: twelve stator coils in three phases around a four-magnet rotor; each coil glows with its phase current."
      fallback="Three phases, 120° apart, drive the stator coils; the rotor follows the rotating field.">
      Three phases, 120° apart. Each coil glows with its phase current as the rotor turns: the currents the field-oriented-control tick measures and regulates. Illustration, not a specific motor.
    </Scene3D>
  );
}

// ------------------------------------------------------------------ QFN-64
const SIDES = ['left', 'bottom', 'right', 'top'] as const;
export function QfnScene({ reduced, side }: { reduced: boolean; side: string | null }) {
  const sel = useRef(side); sel.current = side;
  const build: Build = ({ THREE, mat, box, labels, pivot }) => {
    box(4.5, 0.42, 4.5, mat('#1c201e', { metalness: 0.1, roughness: 0.75 }), 0, 0.21, 0);
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24), mat(C.copper, { emissive: C.copper, emissiveIntensity: 0.5 })); dot.position.set(-1.8, 0.43, -1.8); pivot.add(dot);
    box(3.3, 0.02, 0.5, mat('#2a302d'), 0, 0.43, 0);
    const pads: { m: import('three').MeshStandardMaterial; side: string }[] = [];
    const pos = (s: string, i: number): [number, number, number, number, number] => {
      const off = -1.875 + i * 0.25, e = 2.3;
      if (s === 'left') return [-e, 0.05, off, 0.32, 0.13];
      if (s === 'bottom') return [off, 0.05, e, 0.13, 0.32];
      if (s === 'right') return [e, 0.05, -off, 0.32, 0.13];
      return [-off, 0.05, -e, 0.13, 0.32];
    };
    SIDES.forEach((s) => { for (let i = 0; i < 16; i++) { const [x, y, z, w, d] = pos(s, i); const m = mat('#b7bdb6', { metalness: 0.9, roughness: 0.25, emissive: C.copper, emissiveIntensity: 0 }); box(w, 0.1, d, m, x, y, z); pads.push({ m, side: s }); } });
    labels.push(
      { text: 'PIN 1', at: new THREE.Vector3(-2.75, 0.3, -2.05), tone: 'copper' },
      ...packageSides.map((p) => {
        const at = { left: [-3.25, 0.2, 0], bottom: [0, 0.2, 3.1], right: [3.25, 0.2, 0], top: [0, 0.2, -3.1] }[p.side as (typeof SIDES)[number]] as [number, number, number];
        return { text: `${p.pins}`, at: new THREE.Vector3(...at) };
      }),
      { text: 'DG32-LITE · QFN-64', at: new THREE.Vector3(0, 0.6, 0.55) },
    );
    const silver = new THREE.Color('#b7bdb6'), copper = new THREE.Color(C.copper);
    return { frozenAt: 0, update: () => { pads.forEach((p) => { const on = sel.current === p.side; p.m.color.copy(on ? copper : silver); p.m.emissiveIntensity = on ? 0.85 : 0; }); } };
  };
  return (
    <Scene3D build={build} reduced={reduced} height={380} camera={[1.3, 10.2, 5.6]} deps={reduced ? [side] : []}
      label={`3D model of the DG32-LITE QFN-64 package: 16 pads a side, pin 1 upper left.${side ? ' The ' + side + ' side is lit.' : ''}`}
      fallback="QFN-64, 9 × 9 mm: sixteen pads a side, pin 1 upper left, numbered counter-clockwise.">
      9 × 9 mm, 16 pads a side at 0.5 mm pitch, pin 1 upper left and numbered counter-clockwise. Pads are lit by side group: the pin-by-pin map awaits the foundry’s bond-diagram confirmation.
    </Scene3D>
  );
}

// ------------------------------------------------------------------ wafer
export function WaferScene({ reduced }: { reduced: boolean }) {
  const build: Build = ({ THREE, mat, labels, pivot }) => {
    const wafer = new THREE.Group(); pivot.add(wafer);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.06, 96), mat('#5b6770', { metalness: 0.85, roughness: 0.22 })); wafer.add(disc);
    const slotGeo = new THREE.BoxGeometry(0.4, 0.03, 0.4);
    const tones = ['#46525a', '#3c474e', '#505c63'];
    const dg = mat(C.hardware, { emissive: C.hardware, emissiveIntensity: 0.55, metalness: 0.4 });
    const others = tones.map((c) => mat(c, { metalness: 0.7, roughness: 0.3 }));
    let marked: import('three').Vector3 | null = null;
    for (let rx = -3; rx <= 3; rx++) for (let rz = -3; rz <= 3; rz++) {
      const cx = rx * 0.9, cz = rz * 0.9;
      if (Math.hypot(Math.abs(cx) + 0.45, Math.abs(cz) + 0.45) > 2.9) continue;
      for (let k = 0; k < 4; k++) {
        const x = cx + (k % 2 ? 0.21 : -0.21), z = cz + (k < 2 ? -0.21 : 0.21);
        const m = new THREE.Mesh(slotGeo, k === 1 ? dg : others[(k + rx + rz + 9) % 3]); m.position.set(x, 0.045, z); wafer.add(m);
        if (k === 1 && rx === 1 && rz === -1) marked = new THREE.Vector3(x, 0.1, z);
      }
    }
    labels.push({ text: 'DG32, one slot on each shared reticle', at: marked ?? new THREE.Vector3(0.8, 0.1, -0.8), tone: 'copper' });
    return { frozenAt: 0, update: (t) => { wafer.rotation.y = t * 0.08; } };
  };
  return (
    <Scene3D build={build} reduced={reduced} height={380} camera={[3.6, 6.4, 5.6]}
      label="Illustration of a multi-project wafer: each reticle is shared by several designs, and DG32 holds one slot in each."
      fallback="On a multi-project shuttle, several designs share each reticle; DG32 holds one slot in each.">
      Illustration of a multi-project shuttle: several designs share each reticle, and DG32 holds one slot in each. DG32-LITE’s first silicon comes from the September 2026 shuttle.
    </Scene3D>
  );
}
