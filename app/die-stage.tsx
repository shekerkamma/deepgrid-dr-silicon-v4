'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, Lock} from 'lucide-react';
import Silicon from './silicon';
import {useNav} from './shell';
import {blocks} from './content';
import {groupMembers} from './detail-content';
import './die-stage.css';

/** Split stage. Two columns in tension for the whole page: the die on one side, the region under
 *  discussion on the other, resolved by a collapse onto the one group that is not configurable.
 *
 *  The signature move is that scroll drives `selected` on the live canvas, so the die shows the
 *  region being read about. The die stays assembled throughout: explosion driven by scroll is the
 *  deepgrid-platform build's signature and this build does not reuse it.
 */

// The safety core is the frozen one. Everything else is configurable per SKU, which is the
// tension the page is built on and the thing the close resolves.
const FROZEN = 0;

export function DieStage({reduced}: {reduced: boolean}) {
  const {href} = useNav();
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const collapseRef = useRef<HTMLElement>(null);

  // Which region is under the reader. An observer rather than a scroll handler: the step that
  // occupies the middle band of the viewport is the one being read.
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = stepRefs.current.indexOf(e.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      {rootMargin: '-45% 0px -45% 0px', threshold: 0},
    );
    for (const el of stepRefs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  // The collapse: once the closing act is in view the split resolves and the safety core takes
  // the full width. Separate from the step observer so the die returns to it deliberately.
  useEffect(() => {
    const el = collapseRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { setCollapsed(e.isIntersecting); if (e.isIntersecting) setActive(FROZEN); },
      {rootMargin: '-30% 0px -20% 0px', threshold: 0},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const block = blocks[active];
  const members = groupMembers[active] || [];
  const frozen = active === FROZEN;

  return (
    <div className={'dg-split' + (collapsed ? ' is-collapsed' : '')}>
      {/* The hero establishes the split at 50/50 with both headlines readable at once, so the
          format is understood before the first scroll. */}
      <header className="dg-split-head">
        <div>
          <h1>Six functional groups.<br/><em>One of them is frozen.</em></h1>
        </div>
        <div>
          <p>
            The DG32-LITE die is organised into six regions. Five are configurable per SKU. The
            safety core is closed until silicon test, because the part that catches a fault is the
            part that cannot be allowed to change.
          </p>
          <p className="dg-split-hint">Drag the die to rotate it. Scroll to walk the regions.</p>
        </div>
      </header>

      <div className="dg-split-body">
        {/* LEFT: the die, held. Real content, never decorative: it shows the region being read. */}
        <div className="dg-split-stage">
          <div className="dg-die">
            <Silicon variant="lite" reduced={reduced} selected={active} exploded={false}/>
            <span className="dg-die-caption">
              ILLUSTRATIVE MODEL · NOT A MASK LAYOUT · DRAG TO ROTATE
            </span>
          </div>

          {/* The divider is the chrome. It carries both labels and the progress of the argument. */}
          <div className="dg-divider" aria-hidden="true">
            <ol className="dg-divider-rail">
              {blocks.map((b, i) => (
                <li key={b.code} className={i === active ? 'is-on' : i < active ? 'is-past' : ''}>
                  <span className="dg-divider-code">{b.code}</span>
                </li>
              ))}
            </ol>
            <p className={'dg-divider-state' + (frozen ? ' is-frozen' : '')}>
              {frozen ? 'FROZEN UNTIL SILICON TEST' : 'CONFIGURABLE PER SKU'}
            </p>
          </div>
        </div>

        {/* RIGHT: the argument, one region at a time. Every member is real content from
            groupMembers; none is written for this page. */}
        <div className="dg-split-copy">
          {blocks.map((b, i) => (
            <section
              key={b.code}
              className={'dg-step' + (i === active ? ' is-active' : '')}
              ref={el => { stepRefs.current[i] = el; }}
              aria-current={i === active ? 'step' : undefined}
            >
              <p className="dg-step-code">
                <span className="mono">{b.code}</span>
                {i === FROZEN
                  ? <span className="dg-tag dg-tag-frozen"><Lock size={11} aria-hidden="true"/> FROZEN</span>
                  : <span className="dg-tag">CONFIGURABLE</span>}
              </p>
              <h2>{b.name}</h2>
              <p className="dg-step-short">{b.short}</p>
              <ul className="dg-members">
                {(groupMembers[i] || []).map(m => (
                  <li key={m.name}>
                    <h3>{m.name}</h3>
                    <p>{m.what}</p>
                  </li>
                ))}
              </ul>
              <p className="dg-step-why"><span className="mono">WHY</span> {b.why}</p>
            </section>
          ))}
        </div>
      </div>

      {/* THE CLOSE: the collapse. The split resolves, the safety core takes the full width, and
          the action lives in the winning column. */}
      <section className="dg-collapse" ref={collapseRef}>
        <p className="dg-step-code">
          <span className="mono">{blocks[FROZEN].code}</span>
          <span className="dg-tag dg-tag-frozen"><Lock size={11} aria-hidden="true"/> FROZEN</span>
        </p>
        <h2>Five of the six are yours.<br/><em>This one is not.</em></h2>
        <p className="dg-collapse-copy">
          {blocks[FROZEN].why}
        </p>
        <ul className="dg-collapse-members">
          {(groupMembers[FROZEN] || []).map(m => (
            <li key={m.name}><strong>{m.name}</strong><span>{m.what}</span></li>
          ))}
        </ul>
        <div className="dg-collapse-actions">
          <a className="primary" href={href('safety')}>
            Watch it stop a fault <ArrowUpRight size={18} aria-hidden="true"/>
          </a>
          <a className="text-link" href={href('architecture')}>
            Block-by-block architecture <ArrowUpRight size={16} aria-hidden="true"/>
          </a>
          <a className="text-link" href={href('pinout')}>
            Pinout and package <ArrowUpRight size={16} aria-hidden="true"/>
          </a>
        </div>
        <p className="dg-collapse-foot">
          Pre-silicon. The die image is an illustrative model, not a mask layout, and the figures
          above are design values verified in simulation and static timing.
        </p>
      </section>
    </div>
  );
}

export default DieStage;
