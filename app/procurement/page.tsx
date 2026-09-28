'use client';

import {Shell, useReduced, useQuery, useNav} from '../shell';
import {ArrowUpRight,Check,Download} from 'lucide-react';
import {DataTable,ExplainedGrid,Eyebrow,Sec,SectionHead} from '../detail';
import {notClaimed,positionNotes,roadmapDetail} from '../detail-content';
import {comparison,gaps,leads} from '../content';
import Related from '../related';
import {MotionLoop} from '../motion-loop';
import {ShuttleScene} from '../three/blocks';

export default function Page() {
  const {navigate, go} = useNav();

  return (
    <Shell route="procurement">
      <section className="page-wrap"><SectionHead title="Where DG32 leads, and where it does not yet" copy="Measured against the STM32G0, the incumbent entry-level motor-control MCU. DG32 wins on safety hardware and control acceleration; the G0 wins on analog, memory and maturity."/>
  <div className="table-scroll"><table className="dr-table dr-compare"><caption>DG32-LITE compared with the STM32G0 series</caption><thead><tr><th scope="col">Dimension</th><th scope="col">DG32-LITE</th><th scope="col">STM32G0 series</th><th scope="col">What it means</th></tr></thead><tbody>{comparison.map(([d,a,b,m])=><tr key={d}><th scope="row">{d}</th><td>{a}</td><td>{b}</td><td>{m}</td></tr>)}</tbody></table></div>
  <p className="disclaimer">STM32G0 column: public datasheet values for the STM32G0x1 / G0B1 family (Arm Cortex-M0+). DG32-LITE column: first-silicon design values, verified in simulation and static timing, not yet measured on silicon.</p>

  {/* An "Executive procurement scorecard" sat here, pricing DG32 against the STM32G0 and TI Hercules and
      promising "80% cost reduction", "100% compliant with Make-II" and guaranteed supply. None of it is in a
      shipped source or the whitepaper, and the not-claimed list below says "No price or cost claims against
      any competitor". Removed 2026-09-24 (docs/brainstorm-visual-audit.md, V1). */}
  <div className="dr-leadgap"><div><Eyebrow>WHERE DG32 LEADS</Eyebrow><ul>{leads.map(l=><li key={l}><Check size={15}/>{l}</li>)}</ul></div><div><Eyebrow>WHERE THE G0 LEADS TODAY</Eyebrow><ul>{gaps.map(l=><li key={l}><span className="dr-dash" aria-hidden="true"/>{l}</li>)}</ul></div></div>
  <Sec kicker="WHY THE DIFFERENCE" title="Every gap is a deliberate sequencing choice," em="and each one closes in the order that first silicon makes possible.">
   <ExplainedGrid items={positionNotes} cols={2}/>
  </Sec>
  <ShuttleScene/>
  <Sec kicker="THE MULTI-SPIN ROADMAP" title="Closing the gaps" em="in deliberate order." copy="Each step has a job: first silicon proves the architecture, the second spin closes the largest gaps, and connectivity follows.">
   <MotionLoop wide name="roadmap-gaps" label="Animation: where the STM32G0 leads today, and the spin that closes each gap: the 12-bit ADC and embedded flash in the second spin, CAN-FD and interactive debug after; USB, package range and production maturity are not yet scheduled"/>
   <div className="dr-rail"><div className="dr-rail-stage"><div className="dr-rail-track"><ol className="dr-roadmap">{roadmapDetail.map(([when,t,what,proves])=><li key={t}><span className="mono">{when}</span><h3>{t}</h3><p>{what}</p><p className="dr-proves"><span className="mono">WHAT IT DELIVERS</span>{proves}</p></li>)}</ol></div><div className="dr-rail-progress" aria-hidden="true"><i/></div></div></div>
  </Sec>
  <div className="dr-notclaimed"><p className="dr-kicker">WHAT THIS SITE DOES NOT CLAIM</p><ul>{notClaimed.map(n=><li key={n}>{n}</li>)}</ul></div>
  {/* The close (docs/site-story.md): turn the leads and gaps into the buying decision. */}
  <Sec kicker="WHAT TO DO NOW" title="Evaluate DG32-LITE now if the drive needs lockstep;" em="wait for the second spin if it needs a 12-bit ADC or embedded flash.">
   <ExplainedGrid cols={2} items={[
    {name:'Evaluate now',what:'A drive where hardware lockstep, native DShot or hardware CORDIC decides the part, and an 8-bit converter and boot-from-QSPI are acceptable.',why:'Those are the rows DG32-LITE leads on, and the pinout, package and supplies are fixed enough to lay out a board today.'},
    {name:'Plan for the second spin',what:'A drive that needs a 12-bit multi-channel ADC, execute-in-place flash, USB or CAN-FD.',why:'Those are the G0 rows, and the roadmap closes the ADC and flash first, then CAN-FD and interactive debug.'},
   ]}/>
   <div className="dr-links dr-sec-gap">
    <button className="primary" onClick={()=>navigate('contact')}>Discuss your application <ArrowUpRight size={17}/></button>
    <button className="text-link" onClick={()=>navigate('pinout')}>QFN-64 pinout &amp; package <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>navigate('control')}>100 kHz control-loop budget <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>go('library')}>The whitepaper and datasheets <ArrowUpRight size={16}/></button>
   </div>
  </Sec>
 <Related route="procurement"/>
 </section>
    </Shell>
  );
}
