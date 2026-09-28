'use client';

import {Shell, useNav} from '../../shell';
import {PackageDiagram} from '../../package-control';
import {ArrowUpRight,Download} from 'lucide-react';
import {DataTable,ExplainedGrid,Sec,SectionHead,Stats} from '../../detail';
import {absoluteMax,fixedVsPreliminary,operating,powerNotes} from '../../detail-content';
import {parts,pinGroups} from '../../content';
import Related from '../../related';
import {PackageScene} from '../../three/blocks';

export default function Page() {
  const {navigate, go} = useNav();

  return (
    <Shell route="package">
      <section className="page-wrap"><SectionHead title="44 signals in a 9 × 9 mm package" copy="The 64-pin QFN carries every signal a brushless drive needs; the remaining 20 pins are supplies and grounds. DG32-2DOM uses the identical pinout, supplies and limits."/>
  <PackageScene/>
  <div className="dr-pinout"><PackageDiagram/>
   <div className="table-scroll"><table className="dr-table"><caption>Signal pins by function</caption><thead><tr><th scope="col">Function</th><th scope="col">Signals</th><th scope="col" className="num">Pins</th></tr></thead><tbody>{pinGroups.map(([f,s,n])=><tr key={f}><th scope="row">{f}</th><td>{s}</td><td className="num">{n}</td></tr>)}</tbody><tfoot><tr><th scope="row">Total</th><td>Signal pins</td><td className="num">{pinGroups.reduce((a,[, ,n])=>a+Number(n),0)}</td></tr></tfoot></table></div></div>
  <Stats items={[['QFN-64','PACKAGE'],['9 × 9 mm','BODY'],['0.5 mm','PITCH'],['Ground','EXPOSED PADDLE'],['1.8 V','CORE SUPPLY'],['3.3 V','I/O SUPPLY']]}/>
  <Sec kicker="POWER, CLOCK AND RESET" title="One rail powers" em="all of the logic." copy="The parts of the datasheet a design commits to first: which supplies exist, the order they come up, and the single clock the whole die runs from.">
   <ExplainedGrid items={powerNotes}/>
  </Sec>
  <Sec kicker="ELECTRICAL LIMITS" title="Every electrical limit" em="is a nominal until silicon." copy="130 nm process nominals for each supply domain, the same on DG32-LITE and DG32-2DOM. First-silicon characterisation replaces this section.">
   <div className="dr-two-tables"><DataTable caption="Recommended operating conditions" head={['Parameter','Min','Typ','Max','Note']} rows={operating}/><DataTable caption="Absolute maximum ratings" head={['Parameter','Min','Max']} rows={absoluteMax}/></div>
   <p className="disclaimer">Power: ~0.43 W at 50 MHz, a vectorless tool estimate at 25 °C and 1.8 V, not a measurement.</p>
  </Sec>
  <Sec kicker="DESIGN LOCK STATUS" title="What a design can lock now," em="and what waits for silicon.">
   <div className="dr-fixed">{fixedVsPreliminary.map(f=><div key={f.state}><p className="dr-kicker">{f.state.toUpperCase()}</p><ul>{f.items.map(i=><li key={i}>{i}</li>)}</ul></div>)}</div>
   <div className="dr-links dr-sec-gap">
     <button className="text-link" onClick={()=>go('library')}>Download official QFN-64 datasheets (PDF) <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>navigate('control')}>100 kHz hardware control loop <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>navigate('architecture')}>Inside the safety core & power sequencing <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>go('ask')}>Ask DeepGrid about 1.8V/3.3V sequencing <ArrowUpRight size={16}/></button>
   </div>
  </Sec>
  <p className="disclaimer">Preliminary pin map. Register maps, the memory map and board-level design rules are in the engineering datasheet, not on this site.</p>
 <Related route="package"/>
 </section>
    </Shell>
  );
}
