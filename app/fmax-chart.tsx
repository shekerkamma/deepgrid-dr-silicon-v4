'use client';

import {Eyebrow} from './detail';
import {fmax} from './content';

/** Post-route maximum frequency per hardened block.
 *
 *  Lifted off /technology/control-loop, where it sat between the cycle budget and the peripheral
 *  limits. It charts eight blocks and only three of them are in the control loop: it is an
 *  implementation result, which is what /technology is for. The control page keeps the one
 *  sentence that bears on the loop, and links here.
 */
export function FmaxChart() {
  // Both constants carried verbatim from the original ControlLoop. maxF is the axis maximum, not
  // the tallest bar: deriving it from the data would rescale every bar and move the 50 MHz target
  // line relative to them.
  const maxF = 180, target = 50;
  return (
    <>
    <div className="dr-fmax"><div><Eyebrow>TIMING HEADROOM & FMAX</Eyebrow><h2>The lockstep core is the slowest block,<br/><em>so it sets the clock.</em></h2><p>Maximum frequency of each hardened block after place-and-route. Every peripheral clears 90 MHz; the lockstep core reaches ~55–62 MHz, which is why the die runs at 50 MHz. The same limit is why DG32-2DOM puts its engine on a second clock instead of raising this one.</p></div>
     <figure className="dr-chart"><figcaption className="sr-only">Post-route maximum frequency by block, in MHz</figcaption><div className="dr-chart-plot">{fmax.map(([n,v])=><div className="dr-bar-row" key={n}><span className="dr-bar-label">{n}</span><div className="dr-bar-track"><div className={'dr-bar'+(n==='Lockstep core'?' dr-bar-core':'')} style={{width:(v/maxF*100)+'%'}}><span className="dr-tip" aria-hidden="true">{n} · {n==='Lockstep core'?'55–62':v} MHz</span></div></div><span className="dr-bar-value">{n==='Lockstep core'?'55–62':v}</span></div>)}<div className="dr-target" style={{left:`calc(var(--label-w) + (100% - var(--label-w) - var(--value-w)) * ${target/maxF})`}}><span>50 MHz target</span></div></div><div className="dr-axis"><span>0</span><span>{maxF} MHz</span></div></figure></div>
    <p className="disclaimer">Post-route figures on the 130 nm process. The lockstep-core bar is drawn at 55 MHz, the low end of its measured range.</p>
    </>
  );
}

export default FmaxChart;
