'use client';
import {useState} from 'react';
import {ArrowUpRight, ArrowRight, Pause, Play} from 'lucide-react';
import Silicon from './silicon';
import FaultTrace from './fault-trace';
import {faultPath, evidenceLadder} from './detail-content';
import {areas} from './applications-story-data';
import {claims} from './claims';
import {url} from './routes';
import {PRE_SILICON} from './copy';
import './home-refined.css';

export function Overview({reduced}: {reduced: boolean}) {
 const [paused,setPaused]=useState(false), [exploded,setExploded]=useState(false);
 return <div className="dg-home">
  <section className="home-intro" aria-labelledby="home-title">
   <div className="home-intro-copy">
    <h1 id="home-title">Motor-control silicon.<br/><em>Safety in hardware.</em></h1>
    <p className="home-summary">DG32 combines a RISC-V control core, motor-control peripherals and a hardware lockstep safety monitor on one chip.</p>
    <div className="home-actions"><a className="home-primary" href={url('/contact')}>Discuss your application <ArrowUpRight size={18} aria-hidden="true"/></a><a className="home-link" href={url('/products')}>Compare the two variants <ArrowRight size={18} aria-hidden="true"/></a></div>
    <p className="home-status"><strong>Pre-silicon.</strong> Design values, not measured silicon results. <a href={url('/procurement')}>View readiness and roadmap <ArrowUpRight size={14} aria-hidden="true"/></a></p>
   </div>
   <figure className="home-model">
    <div className="home-model-stage"><Silicon variant="lite" reduced={reduced || paused} exploded={exploded} selected={0}/></div>
    <div className="home-model-controls" aria-label="Chip model controls"><button type="button" onClick={()=>setExploded(v=>!v)} aria-pressed={exploded}>{exploded?'Close package':'Look inside'}</button>{!reduced && <button type="button" onClick={()=>setPaused(v=>!v)} aria-label={paused?'Resume chip rotation':'Pause chip rotation'} aria-pressed={paused}>{paused?<Play size={15} aria-hidden="true"/>:<Pause size={15} aria-hidden="true"/>}</button>}</div>
    <figcaption><strong>DG32-LITE</strong><span>{claims['qfn-64'].figure}</span><small>Illustrative model, not a mask layout. Drag to rotate.</small></figcaption>
   </figure>
  </section>
  <nav className="home-shortcuts" aria-label="Start your technical evaluation"><span>Evaluate DG32</span><a href={url('/technology/package')}>Pinout &amp; electrical limits <ArrowUpRight size={16} aria-hidden="true"/></a><a href={url('/resources/docs')}>Datasheets &amp; architecture <ArrowUpRight size={16} aria-hidden="true"/></a><a href={url('/evidence')}>Evidence register <ArrowUpRight size={16} aria-hidden="true"/></a></nav>
  <section className="home-section home-proof" aria-labelledby="home-proof-title">
   <div className="home-section-head"><h2 id="home-proof-title">Know the mechanism.<br/><em>Check the evidence.</em></h2><p>Start with the limits that decide whether DG32 fits your design. Each figure links to its source and engineering context.</p></div>
   <div className="home-proof-rows">{([
    ['fault-39','Fault response without firmware','An injected fault asserts FAULT_N and disables the PWM bridge.','/technology/safety'],
    ['loop-100k','A defined control-loop ceiling','The simulated closed current-loop rate, including acquisition and compute.','/technology/control-loop'],
    ['headroom-82','Room for diagnostics at 10 kHz','Diagnostic headroom after the hardware datapath and control firmware. This is not the headroom at 100 kHz.','/technology/control-loop'],
   ] as const).map(([id,title,detail,path])=>{const c=claims[id];return <article className="home-proof-row" key={id}><div className="home-proof-value"><strong>{c.figure}</strong><span>{c.kind}</span></div><div><h3>{title}</h3><p>{detail}</p></div><div className="home-proof-links"><a href={url(path)}>Inspect the detail <ArrowUpRight size={16} aria-hidden="true"/></a><a href={url('/downloads/'+c.source)}>Source specification</a></div></article>;})}</div>
   <p className="home-footnote">{PRE_SILICON}</p>
  </section>
  <section id="fault-isolation" className="home-section home-mechanism" aria-labelledby="home-mechanism-title"><FaultTrace steps={faultPath} intro={<>
   <h2 id="home-mechanism-title">A fault takes<br/><em>the hardware path.</em></h2>
   <p className="dr-lead">The checker core, comparator and fault latch connect to the PWM brake. An injected fault can stop the bridge without waiting for application firmware.</p>
   <p className="dr-lead">In the control loop, the ADC, CORDIC and PWM are dedicated hardware. The CPU still runs the d and q PI regulators in software.</p>
   <div className="home-actions"><a className="home-link" href={url('/technology/safety')}>Read the safety architecture <ArrowUpRight size={16} aria-hidden="true"/></a></div>
   <a className="home-skip" href="#home-family">Skip the walkthrough <ArrowRight size={16} aria-hidden="true"/></a>
  </>}/></section>
  <section id="home-family" className="home-section" aria-labelledby="home-family-title">
   <div className="home-section-head"><h2 id="home-family-title">Two DG32 variants.<br/><em>One control foundation.</em></h2><p>The same lockstep safety core, motor peripherals and package. DG32-2DOM adds a separate INT8 attention engine.</p></div>
   <div className="home-family"><article><h3>DG32-LITE</h3><p>Motor control and diagnostics on the RISC-V core, without an attention accelerator.</p><p className="home-product-note">Pre-silicon. See the roadmap for shuttle and bring-up status.</p><a className="home-link" href={url('/products')}>Explore DG32-LITE <ArrowUpRight size={17} aria-hidden="true"/></a></article><article><h3>DG32-2DOM</h3><p>The DG32 control foundation plus an INT8 attention engine in a separate clock domain.</p><p className="home-product-note">Design complete, in physical trials. No measured silicon results.</p><a className="home-link" href={url('/products')}>Compare DG32-2DOM <ArrowUpRight size={17} aria-hidden="true"/></a></article></div>
   <div className="home-portfolio"><h3>DG32 is part of a wider ten-chip portfolio.</h3><p>Explore the system first, then the chips that serve it.</p><nav aria-label="Applications in the wider DeepGrid portfolio">{areas.map(a=><a key={a.id} href={url('/use-cases/'+a.id)}>{a.name}<ArrowUpRight size={16} aria-hidden="true"/></a>)}</nav></div>
  </section>
  <section className="home-section home-readiness" aria-labelledby="home-readiness-title"><div><h2 id="home-readiness-title">Evidence today.<br/><em>Readiness stated plainly.</em></h2><p>DG32 is pre-silicon. Hardware lockstep is a safety mechanism, not a functional-safety certificate. Multi-foundry qualification remains in progress.</p><div className="home-actions"><a className="home-link" href={url('/evidence')}>Review the evidence register <ArrowUpRight size={16} aria-hidden="true"/></a><a className="home-link" href={url('/procurement')}>Check the roadmap <ArrowUpRight size={16} aria-hidden="true"/></a></div></div><dl className="home-evidence-kinds">{evidenceLadder.map(e=><div key={e.kind}><dt>{e.kind}</dt><dd>{e.means}</dd></div>)}</dl></section>
  <section className="home-section home-next" aria-labelledby="home-next-title"><div><h2 id="home-next-title">Bring your<br/><em>control requirement.</em></h2><p>Tell us the motor, sensing constraints and project timing. The enquiry page helps you compose an email to the DeepGrid team.</p><a className="home-primary" href={url('/contact')}>Discuss your application <ArrowUpRight size={18} aria-hidden="true"/></a></div><aside><h3>Explore the architecture in detail.</h3><p>Ask DeepGrid searches the technical documents and cites its sources.</p><a className="home-link" href={url('/ask')}>Ask a specification question <ArrowUpRight size={17} aria-hidden="true"/></a></aside></section>
 </div>;
}
