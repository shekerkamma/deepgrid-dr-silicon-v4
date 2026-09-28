'use client';

import {useState} from 'react';
import {fy31Chip, fy31Rows, splitVerdict, type PlanRow} from './company-content';
import {useNav} from './shell';
import './company.css';

/** Break the plan yourself. Two tests from the master whitepaper, applied by the reader: pull any one
 *  row out of FY31 (the concentration test) and re-price every row at the whitepaper's crash values
 *  (the price test). Every figure shown is the source's own row, or a sum of them. */
export default function CompanyStress() {
  const [pulled, setPulled] = useState<string | null>(null);
  const {href} = useNav();
  const [crash, setCrash] = useState(false);

  const value = (r: PlanRow) => (crash ? r.crash : r.plan);
  const total = fy31Rows.reduce((t, r) => t + (r.id === pulled ? 0 : value(r)), 0);
  const max = Math.max(...fy31Rows.map(r => r.plan));
  const gone = fy31Rows.find(r => r.id === pulled);

  let verdict: string;
  if (!gone && !crash) verdict = 'The plan as written. Pull a row, or flood the market.';
  else if (!gone) verdict = 'Every open-market row is re-priced down. Defence does not move: the market it sells into is import-banned, so a price crash cannot reach it.';
  else if (gone.id === 'meters' && !crash) verdict = 'The meter row fails loudest, and the plan still closes near ₹520 Cr on the other rows.';
  else if (!crash) verdict = `Without ${gone.name.toLowerCase()}, the plan closes at ₹${total.toLocaleString('en-IN')} Cr.`;
  else verdict = `Without ${gone.name.toLowerCase()}, and with prices crashed, ₹${total.toLocaleString('en-IN')} Cr.`;

  const state = (r: PlanRow) =>
    r.id === pulled ? 'pulled' : crash && r.crash === r.plan ? 'held' : crash ? 'cut' : 'plan';

  return (
    <div className="dr-stress">
      <fieldset className="dr-stress-controls">
        <legend className="dr-stress-legend">Two tests the whitepaper runs on its own plan</legend>
        <div className="dr-stress-buttons">
        <button className="dr-stress-toggle" aria-pressed={crash} onClick={() => setCrash(c => !c)}>
          {crash ? 'Prices crashed' : 'Flood the market with subsidised chips'}
        </button>
        <button className="dr-stress-reset" onClick={() => { setPulled(null); setCrash(false); }} disabled={!pulled && !crash}>
          Restore the plan
        </button>
        </div>
      </fieldset>

      <ul className="dr-stress-rows">
        {fy31Rows.map(r => {
          const v = r.id === pulled ? 0 : value(r);
          return (
            <li key={r.id} className="dr-stress-row" data-state={state(r)}>
              <button
                className="dr-stress-pull"
                aria-pressed={r.id === pulled}
                aria-label={r.id === pulled ? `Put ${r.name} back into the plan` : `Pull ${r.name} out of the plan`}
                onClick={() => setPulled(p => (p === r.id ? null : r.id))}
              >
                <span className="dr-stress-name">{r.name}</span>
                <span className="dr-stress-bar" aria-hidden="true"><i style={{transform: `scaleX(${v / max})`}}/></span>
                <span className="dr-stress-val">{r.id === pulled ? 'pulled' : `₹${v} Cr`}</span>
              </button>
              <p className="dr-stress-why">{crash && r.id !== pulled ? r.why : ' '}</p>
              <p className="dr-stress-chip">
                {fy31Chip[r.id]
                  ? <a className="st-link" href={href('applications') + '#chip-' + fy31Chip[r.id]!.id}>{fy31Chip[r.id]!.name}</a>
                  : 'Several screened chips; the whitepaper does not split this row'}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="dr-stress-total">
        <span className="dr-kicker">FY31</span>
        <strong>₹{total.toLocaleString('en-IN')}&nbsp;Cr</strong>
        <p aria-live="polite">{verdict}</p>
      </div>

      <blockquote className="dr-stress-quote">
        <p>{splitVerdict.quote}</p>
        <cite>{splitVerdict.cite}</cite>
      </blockquote>
      <p className="dr-stress-key">{splitVerdict.key}</p>
      <p className="disclaimer">
        Rows and crash values are the whitepaper’s own (§12.2, p. 60). Totals are those rows added up; pulling a row and
        crashing prices together is arithmetic on them, not a forecast.
      </p>
    </div>
  );
}
