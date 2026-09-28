'use client';
// The Products page's story beats (docs/products-story.md): the tension, the fault path, the
// interactive chip map and the loop-cost summary. Every line comes from the DG32-LITE
// Architecture Guide, through the same records the rest of the site reads.
import {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {blocks, parts, loopRates, CLOCK_HZ, HW_FIXED_CYCLES} from './content';
import {faultPath} from './detail-content';
import {tabIndexFor, tablistKeys} from './tablist';
import {url} from './routes';
import './products-story.css';

/* ---------- tension: why a second core ---------- */

const contrast = [
  ['When it checks', 'Periodically, when the test is scheduled', 'On every committed store'],
  ['Between checks', 'Blind: a fault can act before the next run', 'No gap: CHECKER runs two cycles behind'],
  ['Who stops the bridge', 'Firmware, once it notices', 'FAULT_N, in hardware, without waiting for firmware'],
] as const;

export function WhyLockstep() {
  return (
    <div className="ps-why">
      <div className="table-scroll">
        <table className="ps-contrast">
          <caption className="sr-only">Software self-test compared with hardware lockstep</caption>
          <thead><tr><th scope="col"><span className="sr-only">Question</span></th><th scope="col">Software self-test</th><th scope="col">DG32 hardware lockstep</th></tr></thead>
          <tbody>{contrast.map(([q, a, b]) => <tr key={q}><th scope="row">{q}</th><td>{a}</td><td>{b}</td></tr>)}</tbody>
        </table>
      </div>
      <ol className="ps-fault" aria-label="What happens when the CPU faults">
        {faultPath.map(([t, d], i) => (
          <li key={t} data-last={i === faultPath.length - 1 ? 'true' : undefined}>
            <span className="ps-fault-n" aria-hidden="true">{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- the chip map: six groups on one clock, plus the engine ---------- */

const dom = parts.find(p => p.id === '2dom')!;
const spec = (k: string) => dom.specs.find(([key]) => key === k)?.[1] ?? '';
const engine = {
  code: 'AI',
  name: 'Attention engine',
  short: 'INT8 attention on its own 114 MHz clock',
  what: [spec('Accelerator'), spec('Accuracy'), 'Keys: ' + spec('Keys').toLowerCase(), spec('Isolation'), spec('Timing')],
  why: 'Condition monitoring runs beside the control loop, never in it: the engine reaches memory through clock-domain bridges, so it cannot stall the 50 MHz core or extend its worst-case execution time.',
};
// Grid placement mirrors the source diagram: safety and memory on top, the bus across, the
// peripherals below. Index into `blocks`.
const layout = [
  {i: 0, area: 'safe'}, {i: 1, area: 'mem'}, {i: 5, area: 'bus'},
  {i: 2, area: 'mtr'}, {i: 3, area: 'sns'}, {i: 4, area: 'com'},
] as const;
const chipTabs = [['lite', 'DG32-LITE', 'One 50 MHz domain'], ['2dom', 'DG32-2DOM', '50 MHz + 114 MHz']] as const;

export function ChipMap() {
  const [chip, setChip] = useState<'lite' | '2dom'>('lite');
  const [sel, setSel] = useState<number | 'ai'>(0);
  const is2 = chip === '2dom';
  const choose = (c: 'lite' | '2dom') => { setChip(c); setSel(c === '2dom' ? 'ai' : 0); };
  const cur = sel === 'ai' ? engine : blocks[sel];
  return (
    <div className="ps-map" data-chip={chip}>
      <div className="ps-map-tabs" role="tablist" aria-label="Chip to show">
        {chipTabs.map(([id, name, sub]) => (
          <button key={id} role="tab" aria-selected={chip === id} aria-controls="ps-map-panel" tabIndex={tabIndexFor(chip === id)} onKeyDown={tablistKeys} onClick={() => choose(id)}>
            <strong>{name}</strong><span>{sub}</span>
          </button>
        ))}
      </div>
      <div className="ps-map-body" id="ps-map-panel" role="tabpanel">
        <div className="ps-die" aria-label={is2 ? 'DG32-2DOM: the six DG32-LITE block groups, unchanged, plus an attention engine on its own clock' : 'DG32-LITE: six block groups on one 50 MHz clock'}>
          <div className="ps-domain">
            <p className="ps-domain-label">50 MHz control domain{is2 ? ' · identical to DG32-LITE' : ''}</p>
            <div className="ps-grid">
              {layout.map(({i, area}) => {
                const b = blocks[i];
                return (
                  <button key={b.code} className="ps-block" data-area={area} aria-pressed={sel === i} onClick={() => setSel(i)}>
                    <span className="ps-code">{b.code}</span>
                    <strong>{b.name}</strong>
                    <span className="ps-short">{b.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {is2 && (
            <div className="ps-domain ps-domain-ai">
              <p className="ps-domain-label">114 MHz compute domain · new</p>
              <span className="ps-bridge">Clock-domain bridges</span>
              <button className="ps-block ps-block-ai" aria-pressed={sel === 'ai'} onClick={() => setSel('ai')}>
                <span className="ps-code">{engine.code}</span>
                <strong>{engine.name}</strong>
                <span className="ps-short">{engine.short}</span>
              </button>
            </div>
          )}
        </div>
        <div className="ps-detail" aria-live="polite">
          <p className="ps-code">{cur.code}{is2 && sel !== 'ai' ? ' · identical in both chips' : ''}</p>
          <h3>{cur.name}</h3>
          <ul>{cur.what.map(w => <li key={w}>{w}</li>)}</ul>
          <p className="ps-why-line"><span>Why</span>{cur.why}</p>
          <a className="st-link" href={url(is2 ? '/diagrams/dg32-2dom-architecture.svg' : '/diagrams/dg32-lite-architecture.svg')} target="_blank" rel="noreferrer">
            Open the full {is2 ? 'DG32-2DOM' : 'DG32-LITE'} diagram <ArrowUpRight size={14} aria-hidden="true"/>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- the loop: fixed hardware cost, known CPU budget ---------- */

export function LoopCost() {
  const n = (v: number) => v.toLocaleString('en-US');
  return (
    <ul className="ps-loop" aria-label="Cycles per control-loop period at 50 MHz, hardware share and CPU budget">
      {loopRates.map(r => {
        const period = CLOCK_HZ / (r.khz * 1000), cpu = period - HW_FIXED_CYCLES, hw = HW_FIXED_CYCLES / period * 100;
        return (
          <li key={r.khz}>
            <strong className="ps-loop-rate">{r.khz}&nbsp;kHz</strong>
            <span className="ps-loop-bar" aria-hidden="true"><i className="dr-seg-hw" style={{width: hw + '%'}}/><i className="dr-seg-cpu" style={{width: (100 - hw) + '%'}}/></span>
            <span className="ps-loop-num">{n(period)} cycles · ~{n(HW_FIXED_CYCLES)} hardware · ~{n(cpu)} CPU</span>
            <span className="ps-loop-fits">{r.fits}</span>
          </li>
        );
      })}
    </ul>
  );
}
