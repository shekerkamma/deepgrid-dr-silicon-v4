'use client';

import {ArrowUpRight, Download} from 'lucide-react';
import {useNav} from './shell';
import {url} from './routes';
import {FilmMoment, type Clip} from './evidence-clip';
import {diagnosticTasks, type UseCase} from './diagnostic-tasks';
import {clips, families, models, needsResolution, sockets, SOCKET_SOURCE} from './applications-story-data';
import ApplicationsPortfolio from './applications-portfolio';

/** /applications told as a story: docs/applications-story.md is the storyboard, and the playbook
 *  (public/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf) is its spine, in its own order.
 *
 *  This replaced a catalogue of thirty identical labels beside a stats plate, which listed the tasks
 *  without ever saying what they are for, why they fit on this chip, or what limits them. The films
 *  sit inside the beat they explain, each a whole slide segment with its narration printed beside it,
 *  so a reader who never presses play still gets what the film says.
 */

const PLAYBOOK = '/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf';

// A task below 1 kHz is marked where it sits. The playbook names six; the page counts them from the
// data rather than restating the number, so a corrected row cannot leave the prose behind.
const slow = (t: UseCase) => !t.rate.startsWith('>');
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const socketsFor = (name: string) => sockets.filter(k => k.tasks.includes(name));

function Source({children}: {children: React.ReactNode}) {
  return <p className="st-source">{children}</p>;
}

/** One beat: a finding as the heading, the argument under it, and the film moment that explains it
 *  beside the argument: a small frame and the narration, opening into a player only on request. */
function Beat({id, title, films, wide, children}: {
  id: string; title: string; films?: {clip: Clip; label: string}[]; wide?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className={'st-beat' + (films?.length ? ' has-aside' : '')} id={id} aria-labelledby={id + '-h'}>
      <div className="st-beat-text">
        <h2 id={id + '-h'}>{title}</h2>
        {children}
      </div>
      {films?.length ? (
        <div className="st-beat-aside">
          {films.map(f => <FilmMoment key={f.label} clip={f.clip} label={f.label}/>)}
        </div>
      ) : null}
      {wide && <div className="st-beat-wide">{wide}</div>}
    </section>
  );
}

function Task({t}: {t: UseCase}) {
  const features = t.features === 'None' ? '' : ` · ${t.features}`;
  return (
    <li className="st-task" id={'task-' + slug(t.name)}>
      <div className="st-task-problem">
        <h3>{t.name}</h3>
        <p>{t.detects}</p>
        {socketsFor(t.name).length > 0 && (
          <p className="st-task-where">
            Goes into: {socketsFor(t.name).map((k, i) => (
              <span key={k.id}>{i > 0 && ', '}<a href={'#socket-' + k.id}>{k.short}</a></span>
            ))}
          </p>
        )}
        {needsResolution.has(t.name) && (
          <p className="st-task-note"><a href="#st-sensors">Needs a 12 to 16-bit converter, or analog gain ahead of it</a></p>
        )}
      </div>
      <dl className="st-task-facts">
        <div><dt>Signal</dt><dd>{t.sensing}{features}</dd></div>
        <div><dt>Runs</dt><dd>{t.model}</dd></div>
        <div className="st-task-nums">
          <dt>Cost</dt>
          <dd>
            <span className="num">{t.latency}</span>
            <span className={'num' + (slow(t) ? ' st-slow' : '')}>{t.rate}{slow(t) && <em> below 1&nbsp;kHz</em>}</span>
            <span className="num">{t.memory}</span>
          </dd>
        </div>
      </dl>
    </li>
  );
}

export default function ApplicationsStory() {
  const {href} = useNav();
  const byFamily = (id: string) => diagnosticTasks.filter(t => t.domain === id);
  const usedModels = models
    .map(m => ({...m, uses: diagnosticTasks.filter(t => t.model === m.name).length}))
    .filter(m => m.uses > 0)
    .sort((a, b) => b.uses - a.uses);
  const slowCount = diagnosticTasks.filter(slow).length;

  return (
    <div className="st-story">
      {/* 0. The portfolio, by where it goes: structured like the showcase's Product lines page. */}
      <ApplicationsPortfolio/>

      {/* 1. DG32 in depth: the answer for the one part on silicon. */}
      <section className="st-beat st-answer" id="st-answer" aria-labelledby="st-answer-h">
        <div className="st-beat-text">
          <p className="st-fam-kicker">Motors and drives, in depth</p>
          <h2 id="st-answer-h">DG32-LITE is a safety microcontroller for motors and batteries, and it can watch the machine it controls.</h2>
          <p>
            In DeepGrid&rsquo;s portfolio it is SKU-4, the safety MCU. It is built to take the socket a
            Microchip or Renesas functional-safety microcontroller holds today: the independent processor
            in a battery pack, a motor drive, a braking or steering controller, a robot joint or a
            drone&rsquo;s redundant flight path, whose job is to catch a fault and shut the system down.
          </p>
          <p>
            Because it already sits beside the motor, it can do a second job in its spare cycles: watch
            that motor for faults before they trip anything. A wearing bearing, a broken rotor bar, a
            pump running dry, a winding getting hot. That is what the thirty tasks on this page are, and
            every one fits on its single 50&nbsp;MHz core with no accelerator and no second chip.
          </p>
          <p>
            {diagnosticTasks.length - slowCount} of the {diagnosticTasks.length} run faster than
            1&nbsp;kHz. The slowest takes 10.3&nbsp;ms and the largest needs 20&nbsp;KB. The limit that
            actually binds is the sensor on the motor, not the chip, and this page says where.
          </p>
          <Source>{SOCKET_SOURCE} · DG32-AI use-case playbook, pages 1 and 3</Source>
        </div>
        <nav className="st-families st-cols-4" aria-label="The four families of tasks">
          {families.map(f => (
            <a key={f.id} href={'#fam-' + f.id}>
              <span className="st-fam-n num">{byFamily(f.id).length}</span>
              <strong>{f.name}</strong>
              <span className="st-fam-line">{f.headline}</span>
            </a>
          ))}
        </nav>
      </section>

      {/* 1b. Where it goes: the Annex's sockets, each with the tasks that fit it. */}
      <section className="st-beat" id="st-sockets" aria-labelledby="st-sockets-h">
        <div className="st-beat-text">
          <h2 id="st-sockets-h">It goes into five places, and each one has its own faults worth watching.</h2>
          <p>
            The sockets below are DeepGrid&rsquo;s own, from the portfolio annex. Beside each are the
            tasks from this page that fit it. That pairing is ours: the annex names the sockets and the
            playbook costs the tasks, but neither document matches them up.
          </p>
          <Source>{SOCKET_SOURCE}: &ldquo;replaces Microchip/Renesas functional-safety MCU sockets&rdquo;</Source>
        </div>
        <div className="st-beat-wide">
          <ol className="st-sockets">
            {sockets.map(k => (
              <li key={k.id} id={'socket-' + k.id}>
                <div>
                  <h3>{k.name}</h3>
                  <p>{k.what}</p>
                  {k.limit && <p className="st-socket-limit">{k.limit}</p>}
                </div>
                <ul aria-label={'Tasks that fit: ' + k.name}>
                  {k.tasks.map(n => <li key={n}><a href={'#task-' + slug(n)}>{n}</a></li>)}
                </ul>
              </li>
            ))}
          </ol>
          <p className="st-aside st-sockets-foot">
            The annex describes the lockstep safety MCU as on an ISO&nbsp;26262 ASIL-D path. That is a
            direction, not a certification: no functional-safety certification is claimed for DG32.
          </p>
        </div>
      </section>

      {/* 2. Context: control comes first. */}
      <Beat id="st-why" title="In a motor drive, control comes first. Diagnostics has to fit around it."
        films={[{clip: clips.why, label: 'Why control comes first'}]}>
        <p>
          A drive switches its power transistors thousands of times a second, and one wrong switching
          edge can short the bridge. So anything else the processor does must never delay the control
          loop, and must never be the thing that decides to shut the motor down.
        </p>
        <p>
          DG32 keeps those two jobs apart. A lockstepped pair of cores and a hardware fault pin hold the
          trip limits. The diagnostic models on this page only advise: they raise a score or a class,
          and the deterministic monitor keeps the final say.
        </p>
        <Source>Playbook, page 12 · DG32-LITE architecture film, slide 3</Source>
      </Beat>

      {/* 3. The budget. */}
      <Beat id="st-budget" title="Control costs a fixed amount of hardware time, so what is left is a known budget."
        films={[{clip: clips.budget, label: 'What one control loop costs'}]}>
        <p>
          The expensive steps of motor control run in dedicated hardware, so one loop costs about
          300&nbsp;cycles at any loop rate. The diagnostics live in what remains, and the playbook
          sizes every task against four numbers.
        </p>
        <dl className="st-figs">
          <div><dt>Scalar throughput</dt><dd className="num">12.5&nbsp;MMAC/s</dd><dd className="st-fig-note">RV32IM at 50&nbsp;MHz, int8</dd></div>
          <div><dt>Model budget</dt><dd className="num">16.5&nbsp;KB</dd><dd className="st-fig-note">29.5&nbsp;KB with the runtime moved to mask ROM</dd></div>
          <div><dt>Free cycles</dt><dd className="num">82&nbsp;%</dd><dd className="st-fig-note">with a 10&nbsp;kHz field-oriented control loop running</dd></div>
          <div><dt>Hardware help</dt><dd>CORDIC</dd><dd className="st-fig-note">sin, cos, atan2 and magnitude, already in the loop</dd></div>
        </dl>
        <p className="st-aside">
          The film and the playbook count different things. The film&rsquo;s 4,700&nbsp;cycles at
          10&nbsp;kHz are what is left after the hardware part of one loop; the playbook&rsquo;s 82&nbsp;%
          is what is left for diagnostics with the whole control loop running. The budget for one
          inference is 12.5&nbsp;million multiply-accumulates a second divided by the rate: 12.5&nbsp;thousand
          at 1&nbsp;kHz.
        </p>
        <Source>Playbook, page 3 · DG32-LITE architecture film, slides 9 and 10</Source>
      </Beat>

      {/* 4. The method. */}
      <Beat id="st-method" title="On this core, small classical models beat neural networks, and the signal matters more than the model."
        wide={
          <div className="st-table-scroll">
            <table className="st-models">
              <caption>
                The {usedModels.length} models the thirty tasks use, of the {models.length} that fit.
                Inference cost only; feature extraction is costed separately.
              </caption>
              <thead>
                <tr><th scope="col">Model</th><th scope="col">What it does</th><th scope="col" className="num">Cycles</th><th scope="col" className="num">Inference</th><th scope="col" className="num">Tasks</th></tr>
              </thead>
              <tbody>
                {usedModels.map(m => (
                  <tr key={m.name}>
                    <th scope="row">{m.name}</th><td>{m.role}</td>
                    <td className="num">{m.cycles}</td><td className="num">{m.inference}</td><td className="num">{m.uses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }>
        <p>
          Without a multiply array, comparisons and table lookups are the cheap operations. A 100-tree
          random forest at depth 8 is about 800 comparisons and no multiplies. That is not a compromise:
          on the CWRU bearing benchmark a random forest over five features reaches 95.6&nbsp;%, and a
          review of 42 papers finds support-vector machines at 95 to 100&nbsp;% against deep methods at
          97 to 100&nbsp;%, statistically the same.
        </p>
        <p>
          What moves accuracy is the signal. In a twelve-feature ranking study, features taken at the
          known fault frequency outscored raw statistics four to five times (225.9 against 51.8). So the
          cycles go to band selection and envelope demodulation first, and a larger model last.
        </p>
        <Source>Playbook, pages 4 to 6</Source>
      </Beat>

      {/* 5 to 8. The four families, every task as problem, signal, what runs. */}
      {families.map(f => (
        <section key={f.id} className="st-beat" id={'fam-' + f.id} aria-labelledby={'fam-' + f.id + '-h'}>
          <div className="st-beat-text">
            <p className="st-fam-kicker"><span className="num">{byFamily(f.id).length}</span> {f.name}</p>
            <h2 id={'fam-' + f.id + '-h'}>{f.headline}</h2>
            <p>{f.lede}</p>
            {f.standards && <p className="st-standards">{f.standards}</p>}
            <Source>Playbook, page {f.page}{f.id === 'rotating' || f.id === 'electrical' ? ' and page 11' : ''}</Source>
          </div>
          <div className="st-beat-wide">
            <div className="st-task-head" aria-hidden="true">
              <span>What it catches</span><span>Signal</span><span>Runs</span><span>Latency · rate · memory</span>
            </div>
            <ol className="st-tasks" aria-label={f.name + ': ' + byFamily(f.id).length + ' tasks'}>
              {byFamily(f.id).map(t => <Task key={t.name} t={t}/>)}
            </ol>
          </div>
        </section>
      ))}

      {/* 9. The honest limit. */}
      <Beat id="st-sensors" title="Compute is not the limit. The sensors are."
        films={[{clip: clips.analog, label: 'Where DG32 trails on analog'}]}>
        <p>
          Rotor-bar and eccentricity faults show up as sidebands 40 to 60&nbsp;dB below the supply
          frequency. An 8-bit converter resolves 42&nbsp;dB, so the whole diagnostic range sits at or
          under its noise floor. Broken rotor bar, air-gap eccentricity and stator inter-turn detection
          need a 12 to 16-bit converter, or analog suppression and gain ahead of it. The sidebands are
          also close together, so they need 30 to 100&nbsp;seconds of record at steady load.
        </p>
        <ul className="st-tiers">
          <li>
            <strong>Add one accelerometer</strong>
            <span>The highest-value addition, because bearings are 44&nbsp;% of motor failures. It needs
              at least 5&nbsp;kHz of usable bandwidth, which many low-cost MEMS parts lack, and a stud
              mount rather than a magnet or adhesive.</span>
          </li>
          <li>
            <strong>Add three-phase current and voltage</strong>
            <span>Unlocks stator inter-turn detection and instantaneous power analysis. It needs a
              multi-channel converter; the part has one differential channel today.</span>
          </li>
          <li>
            <strong>Works today, unchanged</strong>
            <span>Sensorless observation, plausibility checking, regime identification, anomaly scoring
              and duty tracking run on the sensing already present, because they read relative change.</span>
          </li>
        </ul>
        <Source>Playbook, page 11 (ISO 13373-1, 13373-2, 20958) · DG32-LITE architecture film, slide 14</Source>
      </Beat>

      {/* 10. The upgrade path. */}
      <Beat id="st-engine" title="DG32-2DOM adds an attention engine, on its own clock, for the models the scalar core runs slowly."
        films={[
          {clip: clips.engine, label: 'What DG32-2DOM adds'},
          {clip: clips.bearing, label: 'What the engine is for'},
        ]}>
        <p>
          None of the thirty tasks needs it. An attention kernel at 64/32/32 is 0.26 million
          multiply-accumulates, about 21&nbsp;ms in software on DG32-LITE: it fits, but slowly. DG32-2DOM
          keeps the same lockstep controller and adds an INT8 engine on a separate clock, behind bridges,
          so it can never hold up motor control.
        </p>
        <p>
          So the line is simple. DG32-LITE covers the thirty tasks on this page. DG32-2DOM is for the
          next class of model, the kind an entry-level motor MCU can only run in software.
        </p>
        <Source>Playbook, page 3 · DG32-2DOM architecture film, slides 1 and 12</Source>
      </Beat>

      {/* 11. What the numbers rest on. */}
      <Beat id="st-basis" title="Every figure here is derived, not measured, and the classifier never holds the trip."
        films={[
          {clip: clips.trip, label: 'How the hardware trips the drive'},
          {clip: clips.measured, label: 'What is not yet measured'},
        ]}>
        <p>
          Every latency, memory figure and rate on this page is calculated: feature-extraction cycles
          plus model cycles, at 4&nbsp;cycles per int8 multiply-accumulate, against 82&nbsp;% of a
          50&nbsp;MHz core. That constant is back-solved from the design documents. No workload has been
          compiled for or measured on DG32-LITE, which has not completed place-and-route.
        </p>
        <p>
          Accuracy needs the same care. Forty of forty-one reviewed bearing-benchmark studies used
          splits open to data leakage; on a leakage-free split one classifier fell from 85.8&nbsp;% to
          69.5&nbsp;%. Expect 65 to 80&nbsp;% on bearings the model has never seen. That is why the
          classifier advises and the lockstep monitor holds the trip.
        </p>
        <Source>Playbook, page 12 · DG32-LITE architecture film, slides 6 and 16</Source>
      </Beat>

      {/* 12. The next step. */}
      <section className="st-beat st-close" id="st-next" aria-labelledby="st-next-h">
        <div className="st-beat-text">
          <h2 id="st-next-h">Bring a failure mode and a sample rate. We will tell you whether it fits.</h2>
          <p>
            If your machine is not among these thirty, the method is the same: the fault, the sensor
            that sees it, the rate it needs, and the model that fits the budget.
          </p>
        </div>
        <div className="st-close-links">
          <a className="st-primary" href={href('ask')}>Ask DeepGrid <ArrowUpRight size={16} aria-hidden="true"/></a>
          <a className="st-link" href={url(PLAYBOOK)} download>The use-case playbook, 12 pages <Download size={15} aria-hidden="true"/></a>
          <a className="st-link" href={href('control')}>The control headroom these run in <ArrowUpRight size={15} aria-hidden="true"/></a>
          <a className="st-link" href={href('evidence')}>What each kind of figure rests on <ArrowUpRight size={15} aria-hidden="true"/></a>
        </div>
      </section>
    </div>
  );
}
