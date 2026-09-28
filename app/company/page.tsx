'use client';

import {Shell, useNav} from '../shell';
import {ArrowUpRight} from 'lucide-react';
import {DataTable, ExplainedGrid, Sec, SectionHead, Stats} from '../detail';
import {PRE_SILICON} from '../copy';
import CompanyStress from '../company-stress';
import Related from '../related';
import {SceneFigure} from '../scene-figure';
import {MotionLoop} from '../motion-loop';
import {url} from '../routes';
import {
  companyNotClaimed, companyStats, milestones, moats, pillars, revenueBuild,
  stopRules, team, unitEconomics, fundsAllocation,
} from '../company-content';

export default function Page() {
  const {go} = useNav();

  return (
    <Shell route="company">
      <section className="page-wrap">
        <SectionHead
          title="A silicon team in Hyderabad building for a market that is already obliged to buy domestic"
          copy="DeepGrid Semi Pvt Ltd designs motor control, condition monitoring and zonal compute on mature nodes. The bet is not that we can beat a 40 nm part on performance. It is that a ≥130 nm part designed in India can be bought where an imported one cannot."
        />
        <Stats items={companyStats}/>
        <SceneFigure name="company-wafer"
          alt="Illustration of a 200 mm silicon wafer covered in identical small dies, lit in copper"
          caption="Illustration of a mature-node wafer. DG32-LITE first silicon is on the September 2026 shuttle."/>

        <Sec
          kicker="THE MARKET"
          title="About $9B of India’s annual IC imports are mature node,"
          em="and an open-source flow is what makes 10k-unit volumes worth serving."
          copy="India imports roughly $23.4B of integrated circuits a year. The mature-node share is the part a 130 nm design centre can actually address, and it is the part where per-seat EDA licensing and mask costs, not transistor density, decide whether a 10,000-unit defence order is profitable."
        >
          <DataTable caption="Unit economics of a mature-node spin" head={['Line', 'Where it lands']} rows={unitEconomics} wide/>
        </Sec>

        <Sec
          kicker="STRATEGY"
          title="Three pillars, and each one is a constraint the design already answers"
          em="rather than a value it aspires to."
          copy="Sovereignty decides who may buy. Determinism decides what the part is good at. Lockstep decides whether it can be used where a failure destroys hardware."
        >
          <ExplainedGrid items={pillars} cols={3}/>
        </Sec>

        <Sec
          kicker="MILESTONES"
          title="A 198-day shuttle-to-shuttle loop,"
          em="with each spin committed to closing a named gap."
          copy="Each step has a job. First silicon proves the architecture; the second spin closes the two largest gaps against the incumbent; connectivity and debug follow."
        >
          <MotionLoop wide name="shuttle-loop" label="Animation: one spin going round the loop, RTL to GDSII to shuttle to bring-up, 198 days shuttle to shuttle"/>
          <div className="dr-rail"><div className="dr-rail-stage"><div className="dr-rail-track">
            <ol className="dr-roadmap">{milestones.map(([when, title, what, proves]) => (
              <li key={title}>
                <span className="mono">{when}</span>
                <h3>{title}</h3>
                <p>{what}</p>
                <p className="dr-proves"><span className="mono">WHAT IT DELIVERS</span>{proves}</p>
              </li>
            ))}</ol>
          </div><div className="dr-rail-progress" aria-hidden="true"><i/></div></div></div>
        </Sec>

        <Sec
          kicker="TEAM"
          title="The flow has already taped out once,"
          em="so first silicon is not also the first test of the tools."
          copy="What the team is built on, and how large the seed round makes it."
        >
          <ExplainedGrid items={team} cols={3}/>
        </Sec>

        <Sec
          kicker="RECOGNITION"
          title="Selected among the Top 50 Startups in Telangana,"
          em="TiE50 Hyderabad, 2024."
          copy="Recognised at the Hyderabad Entrepreneurship Summit for building an edge-first semiconductor and AI ecosystem in India. Source: DeepGrid Semi's own announcement on deepgridsemi.com."
        >
          <div className="st-recog">
            <figure>
              <img src={url('/images/deepgridsemi/tie50-award-ceremony-1280.webp')} srcSet={`${url('/images/deepgridsemi/tie50-award-ceremony-640.webp')} 640w, ${url('/images/deepgridsemi/tie50-award-ceremony-1280.webp')} 1280w`} sizes="(max-width: 900px) 100vw, 600px" alt="The DeepGrid Semi team receiving the TiE50 award on stage at the Hyderabad Entrepreneurship Summit" width={1280} height={960} loading="lazy" decoding="async"/>
              <figcaption>The award, at the Hyderabad Entrepreneurship Summit.</figcaption>
            </figure>
            <figure>
              <img src={url('/images/deepgridsemi/tie50-top50-telangana-1280.webp')} srcSet={`${url('/images/deepgridsemi/tie50-top50-telangana-640.webp')} 640w, ${url('/images/deepgridsemi/tie50-top50-telangana-1280.webp')} 1280w`} sizes="(max-width: 900px) 100vw, 600px" alt="TiE50 Hyderabad announcement: Congratulations to Team DeepGrid Semi, selected among the Top 50 Startups in Telangana" width={1280} height={1280} loading="lazy" decoding="async"/>
              <figcaption>The TiE50 Hyderabad announcement.</figcaption>
            </figure>
          </div>
        </Sec>

        <Sec
          kicker="INVESTORS"
          title="The plan reaches ₹1,000 Cr by FY31,"
          em="and the company’s own whitepaper tries to break it."
          copy="Every figure here is a target, not a result: nothing is audited and nothing is contracted revenue. The build below is the plan as written. Under it are the two tests the whitepaper runs on its own number, handed to you."
        >
          <DataTable caption="Revenue build (company plan)" head={['Year or line', 'Plan figure']} rows={revenueBuild} wide/>
          <CompanyStress/>
        </Sec>

        <Sec
          kicker="STRUCTURAL POSITION"
          title="Four of the five moats are policy, not technology,"
          em="which is why a mature node is the right place to stand."
          copy="Each one is a published instrument with a date or a list attached, rather than an advantage that has to be argued."
        >
          <ExplainedGrid items={moats} cols={2}/>
        </Sec>

        <Sec
          kicker="RISK MANAGEMENT"
          title="Four stop rules are written before they are needed,"
          em="because the expensive decision is the one taken after a mask set is committed."
          copy="Each names the trigger and the action, so the decision is not re-argued under pressure."
        >
          <DataTable caption="Stop rules" head={['Rule', 'Trigger and action']} rows={stopRules} wide/>
        </Sec>

        <Sec
          kicker="USE OF FUNDS"
          title="60% of a ₹10 Cr raise goes to silicon and the people who make it,"
          em="and 10% to going to market."
          copy="Factory runs, mask sets and engineering staff are the two largest lines, in that order."
        >
          <DataTable caption="Use of funds (₹10 Cr)" head={['Line', 'Amount', 'What it buys']} rows={fundsAllocation} wide/>
        </Sec>

        <div className="dr-notclaimed">
          <p className="dr-kicker">WHAT THIS PAGE DOES NOT CLAIM</p>
          <ul>{companyNotClaimed.map(n => <li key={n}>{n}</li>)}</ul>
        </div>

        <Sec
          kicker="NEXT"
          title="If the stress test did not scare you off,"
          em="the next conversation is about your application."
          copy="Tell us the motor, the control requirement and the sensing constraint, and we will route you to the right variant, reference design and engineer."
        >
          <div className="dr-links">
            <button className="primary" onClick={() => go('contact')}>Discuss your application <ArrowUpRight size={17} aria-hidden="true"/></button>
          </div>
        </Sec>
        <p className="disclaimer">{PRE_SILICON} Evidence for every figure on this site, and the claims withdrawn after verification, are on the Evidence page.</p>
      <Related route="company"/>
      </section>
    </Shell>
  );
}
