'use client';

import {ArrowUpRight, ArrowRight, Check, Download} from 'lucide-react';
import Silicon from './silicon';
import FaultTrace from './fault-trace';
import {MotionLoop} from './motion-loop';
import {Eyebrow, DataTable, Callout} from './detail';
import {evidenceLadder, faultPath, notClaimed} from './detail-content';
import {areas, products} from './applications-story-data';
import {useNav} from './shell';
import {headline} from './content';
import './overview.css';

// The site's front door: what DG32 is, who it is for, why the architecture matters, where it
// fits, what is verifiable today, and what to do next. Six sections, the spine from PLAN.md.
//
// Evidence cards reuse the verification-ladder styling from the original overview,
// which colours each card through --evidence-color and tints its badge and icon.
const evidenceColors: Record<string, string> = {
  Simulated: '#bf7f3b',
  'Post-route': '#2f9e8c',
  Analytic: '#8f9d6b',
  'Tool estimate': '#7486ab',
  'Process nominal': '#bf7f3b',
};
const evidenceImages: Record<string, string> = {
  Simulated: '/media/sims_image.png',
  'Post-route': '/media/sims_image2.png',
  Analytic: '/media/sims_image3.png',
  'Tool estimate': '/media/sims_image4.png',
  'Process nominal': '/media/sims_image4.png',
};
const evidenceBadges: Record<string, string> = {
  Simulated: 'SIMULATION',
  'Post-route': 'POST-ROUTE',
  Analytic: 'ANALYTIC',
  'Tool estimate': 'TOOL EST.',
  'Process nominal': 'PROCESS',
};
const evidenceIcons: Record<string, React.ReactNode> = {
  Simulated: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2"/><path d="M8 12h8M12 8v8"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  'Post-route': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16M12 4v16"/><path d="M8 8l4 4 4-4M8 16l4-4 4 4"/>
    </svg>
  ),
  Analytic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l4-4 4 4M3 15l4-4 4 4M3 21l4-4 4 4"/>
    </svg>
  ),
};

// Three outcomes, merged from the original Executive Impact and Product Essence
// grids. Shape matches what .dr-exec-card was written for, so no new CSS.
const outcomes = [
  {
    kpi: 'PREDICTABLE CONTROL',
    loop: 'loop-cost',
    loopLabel: 'Animation: one control-loop period at 50 MHz; the hardware share stays about 300 cycles while the CPU budget shrinks from 10 to 100 kHz',
    metric: '~100 kHz',
    title: 'The loop cost is fixed and known',
    summary:
      'ADC sampling, Clarke/Park transforms and PWM generation run in dedicated blocks rather than firmware, so a field-oriented-control tick costs the same number of cycles every time. The CPU is left free for diagnostics.',
    details: ['Hardware FOC datapath', 'CORDIC transforms', '82% CPU headroom'],
    businessImpact: 'A control loop that does not drift under load or interrupt pressure.',
    citation: 'Evidence: Simulated. Loop stage costs, ~100 kHz closed loop',
    links: [{label: 'Control-loop budget', target: 'control'}],
  },
  {
    kpi: 'DEFINED FAULT RESPONSE',
    loop: 'fault-response',
    loopLabel: 'Animation: MAIN commits a wrong value, the comparator flags it, FAULT_N drops and the bridge turns off; 39 cycles, simulated',
    metric: '39 cycles',
    title: 'A wrong value reaches a safe bridge without firmware',
    summary:
      'A trailing checker core compares every value the first core commits, as it commits it. A mismatch trips the FAULT pin and disables the PWM bridge in 39 cycles, on a path that never passes through software.',
    details: ['Hardware lockstep pair', 'Locked injection register', 'Windowed watchdog'],
    businessImpact: 'The failure path is a mechanism you can test, not a self-test interval you hope is short enough.',
    citation: 'Evidence: Simulated. 39-cycle fault-to-latch, lockstep under interrupts',
    links: [{label: 'Inside the safety core', target: 'architecture?block=0'}],
  },
  {
    kpi: 'SUPPLY PLANNING',
    loop: 'second-source',
    loopLabel: 'Animation: one 130 nm design moving through three foundries in sequence: SkyWater (USA), IHP (Germany), SCL Mohali (India)',
    metric: '130 nm',
    title: 'A mature node with a second source',
    summary:
      'DG32 targets mature 130 nm/180 nm process nodes qualified at more than one foundry, on a 198-day RTL-to-GDSII shuttle loop. Node maturity and second sourcing are the two things a production schedule actually depends on.',
    details: ['Mature-node process', 'Multi-foundry qualification', '198-day shuttle loop'],
    businessImpact: 'Sourcing risk becomes a planning input rather than an unknown.',
    citation: 'Status: qualification in progress. See the roadmap for what is committed',
    links: [{label: 'Position & roadmap', target: 'roadmap'}],
  },
];

export function Overview({
  reduced,
  navigate,
  go,
}: {
  reduced: boolean;
  navigate: (v: string) => void;
  go: (v: string) => void;
}) {
  const {href} = useNav();
  return (
    <>
      {/* 1 — HERO. What this is, who it is for, and what to do next. */}
      <section className="hero dr-hero">
        <div className="hero-canvas">
          <Silicon variant="lite" reduced={reduced} selected={0}/>
        </div>
        <div className="hero-shade"/>
        <div className="hero-copy">
          <Eyebrow>DG32 / MOTOR-CONTROL SILICON</Eyebrow>
          <h1>Motor-control silicon,<br/>built for <em>predictable</em><br/>behaviour.</h1>
          <p>
            DG32 puts a RISC-V control core, the motor-control peripherals and a hardware
            lockstep safety monitor on one 130&nbsp;nm chip.<br/>
            Pre-silicon: first silicon rides the September 2026 shuttle, and every figure on
            this site is a design value until bring-up.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate('ask')} aria-label="Discuss your application">
              Discuss your application <ArrowUpRight size={19} aria-hidden="true"/>
            </button>
            <button className="text-link" onClick={() => navigate('family')} aria-label="Explore the product family">
              Explore products <ArrowRight size={18} aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div className="hero-annotation">
          <span className="cross">+</span>
          <div>DG32-LITE<small>QFN-64 · 9 × 9 MM · 130 NM CMOS</small></div>
        </div>
        <p className="image-disclaimer">ILLUSTRATIVE MODEL · NOT A MASK LAYOUT · DRAG TO ROTATE</p>
        <div className="hero-bottom"><span>DEEPGRID SEMI PVT LTD / HYDERABAD, INDIA</span></div>
      </section>

      <section className="metrics-strip">
        {headline.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}
        <p>Pre-silicon figures.<br/>Design values, not measurements.</p>
      </section>

      {/* 2 — OUTCOMES. Why the architecture matters for the reader's system. */}
      <section className="content-section dr-exec-pillars-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>OUTCOMES</Eyebrow>
          <span>WHAT IMPROVES IN YOUR SYSTEM?</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Three things change<br/><em>when safety is hardware.</em></h2>
          <div>
            <p>
              Entry-level motor-control parts catch faults between faults: watchdogs, brown-out
              reset and periodic self-test all run in the gaps. DG32 moves the control loop and
              the fault check into hardware, so both have a cost you can state in cycles.
            </p>
          </div>
        </div>
        <div className="dr-exec-grid">
          {outcomes.map((o, idx) => (
            <article key={o.kpi} className="dr-exec-card" data-rv data-rv-delay={idx * 150 + 300}>
              <div className="dr-exec-card-content">
                <MotionLoop name={o.loop} label={o.loopLabel}/>
                <div className="dr-exec-card-head">
                  <span className="mono dr-exec-kpi">{o.kpi}</span>
                  <span className="dr-exec-metric">{o.metric}</span>
                </div>
                <h3>{o.title}</h3>
                <p>{o.summary}</p>
                <div className="dr-exec-story-pills">
                  {o.details.map(d => (
                    <span key={d} className="dr-story-pill">
                      <Check size={12} aria-hidden="true"/><span>{d}</span>
                    </span>
                  ))}
                </div>
                <div className="dr-exec-impact">
                  <span className="mono">WHAT IT MEANS:</span>
                  <strong>{o.businessImpact}</strong>
                </div>
                <div className="dr-exec-citation"><span className="mono">{o.citation}</span></div>
                <div className="dr-pillar-links">
                  {o.links.map(l => (
                    <button key={l.label} className="text-link dr-pillar-link" onClick={() => go(l.target)}>
                      {l.label} <ArrowUpRight size={14} aria-hidden="true"/>
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3 — ARCHITECTURE. One explanatory moment: the two paths across the die. */}
      <section id="fault-isolation" className="content-section dr-fault-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>ARCHITECTURE</Eyebrow>
          <span>HOW DO THOSE OUTCOMES RELATE TO THE HARDWARE?</span>
        </div>
        <FaultTrace steps={faultPath} intro={
          <>
            <h2 className="dr-h2">Two paths cross the die,<br/><em>and only one is firmware.</em></h2>
            <p className="dr-lead">
              The control path runs ADC, CORDIC, PI regulators and PWM, and the CPU only
              supervises it. The fault-response path runs lockstep comparator, fault latch and
              PWM brake, and firmware is not in it at all. Sharing nothing but the die is what
              keeps a busy control loop from delaying a fault response.
            </p>
            <p className="dr-lead">
              Firmware can still prove the fault path works: a locked injection register fires it
              on purpose, which is the only way to test it on real silicon.
            </p>
            <div className="dr-links">
              <button className="text-link" onClick={() => navigate('control')}>
                Follow the control path <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
              <button className="text-link" onClick={() => go('architecture?block=0')}>
                Inside the safety core <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
              <button className="text-link" onClick={() => navigate('architecture')}>
                Explore the full architecture <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
            </div>
          </>
        }/>
      </section>

      {/* 4 — APPLICATIONS. Where DeepGrid's chips go, by the system they end up in: the same five
          areas /applications opens on, from the same data, so the two cannot drift. This replaced four
          DG32 task-family cards with stock photos and per-domain fields no source carried (an
          AEC-Q100 label on motion tasks, "CWRU Audited", a "10 kHz – 100 kHz sample rate"). */}
      <section className="content-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>APPLICATIONS</Eyebrow>
          <span>WHERE DOES IT GO?</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Ten chips,<br/><em>five kinds of system.</em></h2>
          <div>
            <p>
              DG32-LITE is one of ten DeepGrid chips, each built to take a socket an imported part holds
              today. It targets the safety-microcontroller socket in battery packs, motor drives, braking and
              steering controllers, robot joints and drones, and it is the only one on first silicon. It can also watch the motor it controls for faults, in
              the cycles left after control.
            </p>
          </div>
        </div>
        <MotionLoop wide name="portfolio" label="Animation: the ten DeepGrid chips connecting in turn to the five kinds of system they go into; DG32-LITE is SKU-4"/>
        <nav className="st-families st-cols-5" aria-label="Where the chips go">
          {areas.map(a => (
            <a key={a.id} href={href('applications') + '#area-' + a.id}>
              <span className="st-fam-n num">{a.items.length}</span>
              <strong>{a.name}</strong>
              <span className="st-fam-line">{a.items.map(i => products[i.product].tag).join(' · ')}</span>
            </a>
          ))}
        </nav>
        <div className="dr-links dr-sec-gap">
          <button className="text-link" onClick={() => navigate('applications')}>
            Every chip, where it goes and what it replaces <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => navigate('control')}>
            The control headroom DG32&rsquo;s diagnostics run in <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
        </div>
      </section>

      {/* 5 — EVIDENCE. The posture and the five kinds, stated plainly. The register, the
          artefacts and the full "does not claim" list live on /evidence. */}
      <section className="content-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>EVIDENCE</Eyebrow>
          <span>WHAT CAN BE VERIFIED TODAY?</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Every figure says<br/><em>how it was obtained.</em></h2>
          <div>
            <p>
              DG32 is pre-silicon as of September 2026. Every number on this site carries the kind
              of evidence behind it. These are five different kinds of evidence, not five stages of
              a ladder, and none of them is a measurement on fabricated silicon.
            </p>
          </div>
        </div>
        <MotionLoop wide name="evidence" label="Animation: each site figure dropping into its kind of evidence; the silicon lane stays empty until the September 2026 shuttle"/>
        <DataTable
          caption="The five kinds of evidence behind the figures on this site"
          head={['Evidence kind', 'What it means']}
          rows={evidenceLadder.map(e => [e.kind, e.means] as const)}
        />
        <Callout label="WHAT THIS SITE DOES NOT CLAIM">
          {notClaimed[0]}
        </Callout>
        <div className="dr-links dr-sec-gap">
          <button className="text-link" onClick={() => navigate('evidence')}>
            The full evidence register <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => go('library?pkg=lite')}>
            Download the specification suite <Download size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => navigate('ask')}>
            Audit a specification in Ask DeepGrid <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
        </div>
      </section>

      {/* 6 — NEXT STEP. */}
      <section className="content-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>NEXT STEP</Eyebrow>
          <span>WHAT SHOULD YOU DO NOW?</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Tell us what<br/><em>your system needs.</em></h2>
          <div>
            <p>
              Describe the drive, the requirement that decides the design, and the timing you are
              working to. Ask DeepGrid answers specification questions directly from the
              whitepaper and technical annex, with the source cited on every answer.
            </p>
            <button className="primary" onClick={() => navigate('ask')} aria-label="Discuss your application">
              Discuss your application <ArrowUpRight size={18} aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div className="dr-links dr-sec-gap">
          <button className="text-link" onClick={() => navigate('roadmap')}>
            Position &amp; roadmap <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => navigate('pinout')}>
            Pinout &amp; package <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => navigate('library')}>
            Documents, decks &amp; films <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
        </div>
      </section>
    </>
  );
}

export default Overview;
