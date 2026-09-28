'use client';
// The scenes as page blocks: a model beside the two sentences that say what it shows.
import { useState } from 'react';
import { useReduced } from '../shell';
import { LockstepScene, MotorScene, QfnScene, WaferScene } from './scenes';
import { packageSides } from '../detail-content';

export function SafetyScene() {
  const reduced = useReduced();
  return (
    <section className="s3-block" aria-labelledby="s3-safety">
      <LockstepScene reduced={reduced} />
      <div>
        <h2 id="s3-safety">The same path, in three dimensions</h2>
        <p>Both cores commit the same values; CHECKER runs behind MAIN. When one value differs, the comparator catches it on that store, the latch holds the first cause, FAULT_N falls and the gate driver turns the bridge off.</p>
      </div>
    </section>
  );
}

export function ControlScene() {
  const reduced = useReduced();
  return (
    <section className="page-wrap"><div className="s3-block" aria-labelledby="s3-motor">
      <MotorScene reduced={reduced} />
      <div>
        <h2 id="s3-motor">What the loop is driving</h2>
        <p>A brushless motor has three phase windings. Every control tick samples their currents, transforms them, regulates them and updates the bridge, so the field keeps leading the rotor.</p>
      </div>
    </div></section>
  );
}

export function PackageScene() {
  const reduced = useReduced();
  const [side, setSide] = useState<string | null>('left');
  return (
    <section className="s3-block" aria-labelledby="s3-qfn">
      <QfnScene reduced={reduced} side={side} />
      <div>
        <h2 id="s3-qfn">Where each group of signals leaves the package</h2>
        <p>Pick a side to light its pads. The groups sit between supplies and grounds on every side.</p>
        <div className="s3-controls" role="group" aria-label="Package side">
          {packageSides.map((p) => (
            <button key={p.side} type="button" aria-pressed={side === p.side} onClick={() => setSide(side === p.side ? null : p.side)}>
              {p.groups} · pins {p.pins}
            </button>
          ))}
        </div>
        {side && <p className="s3-side-signals">{packageSides.find((p) => p.side === side)!.signals}</p>}
      </div>
    </section>
  );
}

export function ShuttleScene() {
  const reduced = useReduced();
  return (
    <section className="s3-block" aria-labelledby="s3-wafer">
      <WaferScene reduced={reduced} />
      <div>
        <h2 id="s3-wafer">First silicon rides a shared shuttle</h2>
        <p>A multi-project wafer lets several designs share each reticle, which is how a first spin reaches silicon without a full mask set. DG32-LITE is on the September 2026 shuttle.</p>
      </div>
    </section>
  );
}

// Products: one package model, both chips. The footprint and signal pinout are identical (Pinout & package); the
// 2DOM adds an INT8 attention engine on a second clock. Die sizes are not printed here: two sources disagree.
import Silicon from '../silicon';
export function ProductsScene() {
  const reduced = useReduced();
  const [v, setV] = useState<'lite' | '2dom'>('lite');
  const [lifted, setLifted] = useState(false);
  return (
    <section className="s3-block" aria-labelledby="s3-parts">
      <figure className="s3">
        <div className="s3-stage s3-silicon">
          <Silicon key={v} variant={v} reduced={reduced} selected={v === '2dom' ? 6 : 0} exploded={lifted}
            label={`Interactive 3D model of the ${v === '2dom' ? 'DG32-2DOM' : 'DG32-LITE'} in its QFN-64 package. Drag to rotate.`} />
        </div>
        <figcaption className="s3-caption">Drag to rotate. Conceptual model, not a mask layout.</figcaption>
      </figure>
      <div>
        <h2 id="s3-parts">One footprint, two chips</h2>
        <p>{v === 'lite'
          ? 'DG32-LITE: two RISC-V cores in hardware lockstep, the motor-drive peripherals and the FOC maths, at 50 MHz.'
          : 'DG32-2DOM: the same lockstep core and pinout, plus an INT8 attention engine on its own, faster clock.'}</p>
        <div className="s3-controls" role="group" aria-label="Chip">
          <button type="button" aria-pressed={v === 'lite'} onClick={() => setV('lite')}>DG32-LITE</button>
          <button type="button" aria-pressed={v === '2dom'} onClick={() => setV('2dom')}>DG32-2DOM</button>
          <button type="button" aria-pressed={lifted} onClick={() => setLifted(!lifted)}>{lifted ? 'Seat the die' : 'Lift the die'}</button>
        </div>
      </div>
    </section>
  );
}
