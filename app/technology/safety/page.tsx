'use client';

import {useEffect} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {Shell, useNav} from '../../shell';
import {ExplainedGrid,Sec,SectionHead,Steps} from '../../detail';
import {faultPath} from '../../detail-content';
import {PRE_SILICON} from '../../copy';
import FaultTrace from '../../fault-trace';
import {url} from '../../routes';
import Related from '../../related';
import {SafetyScene} from '../../three/blocks';

export default function Page() {
  const {href, go} = useNav();
  // A link to #film (from Products) lands before the pinned fault map above has its height, so
  // the browser's own jump falls short; land on the film once the page has laid out.
  useEffect(() => {
    if (location.hash === '#film') requestAnimationFrame(() => document.getElementById('film')?.scrollIntoView({block: 'start', behavior: 'instant'}));
  }, []);
  return (
    <Shell route="safety">
      <section className="page-wrap">
        <SectionHead
          title="From a wrong value to a safe bridge"
          copy="Software self-test runs periodically and cannot see a fault between runs. DG32-LITE compares every value the CPU commits, as it commits it, and the path from mismatch to a switched-off bridge never passes through firmware."
        />
        <FaultTrace steps={faultPath} intro={
          <>
            <h2 className="dr-h2">Two paths cross the die,<br/><em>and only one is firmware.</em></h2>
            <p className="dr-lead">A trailing checker core compares every committed store. A mismatch trips the FAULT pin and disables the PWM bridge in 39 cycles, on a path with no software in it.</p>
            <p className="dr-lead">Firmware can still prove the path works: a locked injection register fires it on purpose, which is the only way to test it on real silicon.</p>
            <div className="dr-links">
              <a className="text-link" href={href('architecture?block=0')}>Inside the safety core <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="text-link" href={href('control')}>Control-loop timing <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="text-link" href={href('evidence')}>What backs the 39 cycles <ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
          </>
        }/>
        <SafetyScene/>
        <p className="disclaimer">{PRE_SILICON}</p>

        {/* Motion explainer (HyperFrames + GSAP, rendered to MP4; narration Kokoro bm_george).
            Source project: ~/hyperframes-videos/videos/dg32-fault-path-explained. */}
        <Sec kicker="THE FAULT PATH, ANIMATED" title="The same path in ninety seconds," em="from a wrong value to a switched-off bridge.">
          <figure className="st-film" id="film">
            <video controls preload="none" playsInline width={1920} height={1080}
              poster={url('/media/dg32-fault-path-explained-poster.jpg')}
              aria-label="Animated explainer: how DG32-LITE's lockstep pair turns a CPU fault into a switched-off bridge">
              <source src={url('/media/dg32-fault-path-explained.mp4')} type="video/mp4"/>
              <track kind="captions" srcLang="en" label="English" src={url('/media/dg32-fault-path-explained.vtt')}/>
            </video>
            <figcaption>Animated explainer, 1:29, captioned. The 39-cycle figure is from simulation; DG32-LITE is pre-silicon.</figcaption>
          </figure>
        </Sec>

        {/* Story beats from docs/site-story.md: every failure ends at a signal; how the path is
            proven on silicon; where diagnostics stop; the close. Source: DG32-LITE Architecture
            Guide (Safety core, Bus, Design Decisions) and the datasheet's Fault CSR row. */}
        <Sec kicker="EVERY WAY THE CPU CAN FAIL" title="Each failure ends at a signal," em="never at silence." copy="Lockstep catches a wrong value. It does not catch a CPU that stops, or one that reads an address that is not there. Each of those has its own detector, because on a die with no debugger halt a silent failure is the one nobody can diagnose.">
          <ExplainedGrid cols={2} items={[
            {name:'A wrong value',what:'The lockstep comparator. CHECKER repeats every instruction two cycles later on mirrored inputs and bus responses; the first store that differs latches its cause and drives FAULT_N.',why:'A silent datapath fault produces a wrong PWM edge, and a wrong edge can destroy a bridge.'},
            {name:'A hang or a runaway',what:'The windowed watchdog. A kick that arrives too late faults, and so does one that arrives too early.',why:'Too early catches code that is running, but running the wrong way. It arms only when firmware enables it, so it cannot deadlock a cold boot.'},
            {name:'An address that is not there',what:'The error slave. An unmapped or disabled address completes with a bus error instead of hanging the bus.',why:'With no debugger on the die, a hung bus would be a brick.'},
            {name:'A supply that sags',what:'Supply supervision: two supply-good inputs, deglitched, with reset sequencing.',why:'A brown-out would otherwise corrupt state that both cores then agree on.'},
          ]}/>
        </Sec>

        <Sec kicker="HOW THE PATH IS PROVEN" title="Firmware fires the fault on purpose," em="because that is the only test real silicon allows." copy="A path that only ever runs when something breaks has to be exercised deliberately. The injection register is locked, so ordinary code cannot trip it by accident.">
          <Steps label="Proving the fault path on silicon" steps={[
            ['Unlock and inject','Firmware writes the magic value to the Fault CSR, which fires the comparator path without a real fault.'],
            ['The path runs','The same hardware path as a real mismatch: comparator, latch, FAULT_N, gate-driver enable.'],
            ['Read the first cause','The latch holds cause 001, DATA_MISMATCH, until reset, so firmware can confirm what fired.'],
            ['Time it','39 cycles from injection to latch in simulation. First-silicon bring-up measures it on the September 2026 shuttle parts.'],
          ]}/>
        </Sec>

        <Sec kicker="WHERE DIAGNOSTICS STOP" title="A classifier can warn." em="Only hardware trips the bridge." copy={<><p>Condition monitoring on DG32, including anything the DG32-2DOM engine runs, is advisory: it reports health and recommends service. Hard trip limits stay with the hardware path above, which no model output can hold open or close.</p><p>Lockstep is a mechanism for a safety case, not a certificate. ISO 26262 ASIL-D is the path the design is aimed at; no functional-safety certification is claimed.</p></>}>
          <div className="dr-links">
            <a className="text-link" href={href('applications')}>What the diagnostics watch, and what they never hold <ArrowUpRight size={16} aria-hidden="true"/></a>
            <a className="text-link" href={href('evidence')}>What each figure here rests on <ArrowUpRight size={16} aria-hidden="true"/></a>
            <a className="primary" href={href('contact')}>Discuss the safety case for your drive <ArrowUpRight size={17} aria-hidden="true"/></a>
          </div>
        </Sec>
      <Related route="safety"/>
      </section>
    </Shell>
  );
}
