'use client';

// Lifted verbatim from the single-page app/page.tsx during the multi-page split. Both were
// local to that file, so splitting the routes would otherwise have dropped them.

import {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import ControlWaveform from './control-waveform';
import {loopStages,loopRates,CLOCK_HZ,HW_FIXED_CYCLES,CYCLES_PER_INSTRUCTION,fmax} from './content';
import {Eyebrow,SectionHead,Sec,ExplainedGrid,DataTable,Stats,Callout} from './detail';
import {fetchBound,controlNotes,peripheralLimits,packageSides} from './detail-content';
import {claims} from './claims';

export function PackageDiagram(){
 const [active,setActive]=useState<string|null>(null);
 const side=(k:string)=>{
  const x=packageSides.find(s=>s.side===k)!;
  const isSelected=active===k;
  return <div className={'dr-qfn-side dr-qfn-'+k+(isSelected?' is-active':'')} onPointerEnter={()=>setActive(k)} onPointerLeave={()=>setActive(null)}>
   <span className="mono">{k.toUpperCase()} · PINS {x.pins}</span>
   <strong>{x.groups}</strong>
   <p>{x.signals}</p>
  </div>;
 };
 return <figure className="dr-package" aria-label="DG32-LITE QFN-64 top view, with the signal groups on each side of the package">
  {side('top')}{side('left')}<div className="dr-qfn-body" aria-hidden="true"><i className="dr-pin1"/><strong>DG32-LITE</strong><span>QFN-64 · 9 × 9 MM</span><span>TOP VIEW</span></div>{side('right')}{side('bottom')}
  <figcaption>Supplies and grounds sit between the groups on every side. Pin 1 (dot) is upper left, numbered counter-clockwise. Pin map awaiting the foundry’s bond-diagram confirmation.</figcaption>
 </figure>;
}

export function ControlLoop({go}:{go:(hash:string)=>void}){
 const [rate,setRate]=useState(1);
 const r=loopRates[rate],period=CLOCK_HZ/(r.khz*1000),budget=period-HW_FIXED_CYCLES,hwPct=HW_FIXED_CYCLES/period*100;
 const maxF=180,target=50;
 return <section className="page-wrap"><SectionHead title="The CPU runs two regulators, not the loop" copy="Each field-oriented-control tick samples current, transforms it, regulates it and updates the bridge. DG32 moves every expensive step into hardware, so the loop cost is fixed and known."/>
  <h2 className="sr-only">One control tick, stage by stage</h2>
  <ol className="dr-loop">{loopStages.map(([n,t,d,c])=><li key={n}><span className="dr-loop-n">{n}</span><div><h3>{t}</h3><p>{d}</p></div><strong>{c}</strong></li>)}</ol>
  <ControlWaveform khz={r.khz}/>
  <p className="disclaimer">Cycle costs measured in simulation at the 50 MHz clock, where one cycle is 20 ns.</p>

  <Sec kicker="WHY THE LOOP RUNS IN HARDWARE" title="The core fetches every instruction," em="so the peripherals do the maths." copy="The core fetches every instruction over the bus. That one measured constant is what the whole peripheral set is designed around.">
   <div className="dr-factcards">{fetchBound.map(([v,l,d])=><div key={l}><strong>{v}</strong><span className="mono">{l}</span><p>{d}</p></div>)}</div>
   <ExplainedGrid items={controlNotes} cols={2}/>
  </Sec>

  <div className="dr-budget"><div className="dr-budget-copy"><Eyebrow>LOOP TIMING & BUDGET</Eyebrow><h2>About 300 cycles are hardware,<br/><em>whatever the loop rate.</em></h2><p>One ADC sample, two CORDIC operations and a PWM write cost about 300 cycles at any loop rate. Pick a rate to see what is left for the regulators and observers.</p>
   <div className="dr-rates" role="group" aria-label="Loop rate">{loopRates.map((x,i)=><button key={x.khz} aria-pressed={rate===i} className={rate===i?'active':''} onClick={()=>setRate(i)}>{x.khz} kHz</button>)}</div></div>
   <div className="dr-budget-viz"><div className="dr-stats"><div><strong>{period.toLocaleString('en-US')}</strong><span>CYCLES PER PERIOD</span></div><div><strong>~{HW_FIXED_CYCLES}</strong><span>HARDWARE, FIXED</span></div><div><strong>~{budget.toLocaleString('en-US')}</strong><span>CPU BUDGET</span></div><div><strong>~{Math.floor(budget/CYCLES_PER_INSTRUCTION).toLocaleString('en-US')}</strong><span>CPU INSTRUCTIONS*</span></div></div>
    <div className="dr-stack" role="img" aria-label={`At ${r.khz} kHz, hardware uses ${HW_FIXED_CYCLES} of ${period} cycles (${hwPct.toFixed(0)}%), leaving ${budget} for firmware.`}><div className="dr-seg dr-seg-hw" style={{width:hwPct+'%'}} title={`Hardware: ~${HW_FIXED_CYCLES} cycles`}/><div className="dr-seg dr-seg-cpu" style={{width:(100-hwPct)+'%'}} title={`CPU budget: ~${budget} cycles`}/></div>
    <div className="dr-legend"><span><i className="dr-seg-hw"/>Hardware · {hwPct.toFixed(0)}%</span><span><i className="dr-seg-cpu"/>CPU budget · {(100-hwPct).toFixed(0)}%</span></div>
    <p className="dr-fits"><span className="mono">WHAT FITS AT {r.khz} KHZ</span>{r.fits}</p>
    <p className="disclaimer">*Derived: CPU budget ÷ ~8 cycles per instruction, the measured cost of this fetch-bound core.</p></div></div>


  <Callout label="WHY THE CLOCK IS 50 MHz" action={<button className="text-link" onClick={()=>go('architecture')}>Per-block post-route frequency <ArrowUpRight size={15}/></button>}>
    The lockstep core reaches about 55 to 62 MHz after place and route, and every other block clears
    90 MHz, so the core is what sets the die&rsquo;s 50 MHz clock. That is also why DG32-2DOM puts its
    engine on a second clock instead of raising this one. <span className="mono">POST-ROUTE</span>
  </Callout>

  <Sec kicker="PERIPHERAL LIMITS & CAPABILITIES" title="What firmware can count on," em="block by block." copy="Capability and timing per block, from the datasheet’s block notes. Design and simulated values, pending silicon.">
   <DataTable caption="Peripheral limits" head={['Block','Limit','Note']} rows={peripheralLimits}/>
   <Callout label="WITH DG32-2DOM" action={<button className="text-link" onClick={()=>go('architecture?chip=2dom')}>How the engine is isolated <ArrowUpRight size={15}/></button>}>The attention engine runs on its own 114 MHz clock and reaches memory only through clock-domain bridges, so none of these loop numbers change while it runs.</Callout>
  </Sec>

  <div className="dr-sec-gap">
    <p className="dr-kicker">WHAT THE FIGURES ON THIS PAGE REST ON</p>
    <div className="table-scroll">
      <table className="dr-table">
        <caption>Evidence behind the control-loop figures</caption>
        <thead><tr><th scope="col">Figure</th><th scope="col">Evidence</th><th scope="col">Source</th></tr></thead>
        <tbody>
          {['loop-100k','hw-300','adc-177','cordic-53','cpi-8','fmax-lockstep','headroom-82'].map(id=>{
            const c=claims[id];
            return <tr key={id}><th scope="row">{c.figure}</th><td>{c.kind ?? <span className="mono">design constant</span>}</td><td>{c.sourceTitle}</td></tr>;
          })}
        </tbody>
      </table>
    </div>
  </div>

  <div className="dr-links dr-sec-gap">
    <button className="text-link" onClick={()=>go('architecture')}>Explore block architecture <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>go('pinout')}>QFN-64 pinout & package <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>go('library')}>Official DG32-LITE datasheet (PDF) <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>go('ask')}>Ask DeepGrid about loop latency & CORDIC <ArrowUpRight size={16}/></button>
  </div>
 </section>;
}
