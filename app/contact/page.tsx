'use client';

import {useRef, useState} from 'react';
import {Shell, useNav} from '../shell';
import {ArrowUpRight, Download, Mail} from 'lucide-react';
import {Sec, SectionHead} from '../detail';
import {url} from '../routes';
import {
  CONTACT_EMAIL, enquiryRoles, motorTypes, powers, timelines, volumes, voltages,
} from '../company-content';
import '../contact.css';
import Related from '../related';

type Field = {
  id: string; label: string; type: 'text' | 'email' | 'textarea' | 'select';
  options?: string[]; wide?: boolean; required?: boolean; autoComplete?: string; placeholder?: string;
};

const FIELDS: Field[] = [
  {id: 'name', label: 'Full name', type: 'text', required: true, autoComplete: 'name', placeholder: 'Priya Raman…'},
  {id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', placeholder: 'name@company.com…'},
  {id: 'company', label: 'Company or organization', type: 'text', required: true, autoComplete: 'organization', placeholder: 'Example Drives Ltd…'},
  {id: 'role', label: 'Your role', type: 'select', options: enquiryRoles, autoComplete: 'organization-title'},
  {id: 'application', label: 'Application description', type: 'textarea', wide: true, required: true, placeholder: 'A 48\u00a0V BLDC traction drive, field-oriented control at 20\u00a0kHz…'},
  {id: 'motor', label: 'Motor type', type: 'select', options: motorTypes},
  {id: 'voltage', label: 'Voltage range', type: 'select', options: voltages},
  {id: 'power', label: 'Power rating', type: 'select', options: powers},
  {id: 'volume', label: 'Annual volume target', type: 'select', options: volumes},
  {id: 'timeline', label: 'Project timeline', type: 'select', options: timelines},
  {id: 'constraints', label: 'Key requirements and constraints', type: 'textarea', wide: true, placeholder: 'Temperature range, safety standard, sensors already on the board…'},
];

export default function Page() {
  const {go} = useNav();
  const [v, setV] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const set = (id: string, value: string) => {
    setV(p => ({...p, [id]: value}));
    if (errors[id]) setErrors(e => { const n = {...e}; delete n[id]; return n; });
  };

  const body = FIELDS
    .filter(f => (v[f.id] || '').trim())
    .map(f => `${f.label}:\n${v[f.id].trim()}`)
    .join('\n\n');
  const mailto =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent('DG32 evaluation enquiry' + (v.company ? ': ' + v.company : ''))}` +
    `&body=${encodeURIComponent(body || 'Describe your motor type, control requirements and sensing constraints.')}`;

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of FIELDS) if (f.required && !(v[f.id] || '').trim()) e[f.id] = `${f.label} is required.`;
    const em = (v.email || '').trim();
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = 'Enter an address in the form name@company.com.';
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    const first = FIELDS.find(f => e[f.id]);
    if (first) {
      setStatus(`${Object.keys(e).length} field${Object.keys(e).length > 1 ? 's need' : ' needs'} attention.`);
      formRef.current?.querySelector<HTMLElement>('#enq-' + first.id)?.focus();
      return;
    }
    setStatus('Opening your mail app with the enquiry written out.');
    window.location.href = mailto;
  };

  return (
    <Shell route="contact">
      <section className="page-wrap">
        <SectionHead
          title="Tell us the motor, the control requirement and the sensing constraint"
          copy="Those three decide which DG32 variant fits, which reference design applies, and which support tier you need. Everything else can follow."
        />

        <Sec
          kicker="ENQUIRY"
          title="This form composes an email in your own client,"
          em="so nothing is submitted to a server and nothing is stored here."
          copy="Fill in what is relevant and leave the rest blank. The button opens your mail app with the answers already written out; you send it, so you keep the record."
        >
          <form className="dr-enq" ref={formRef} onSubmit={ev => { ev.preventDefault(); submit(); }} noValidate aria-describedby="enq-status">
            {FIELDS.map(f => {
              const id = 'enq-' + f.id, err = errors[f.id];
              const common = {
                id, name: f.id, value: v[f.id] || '',
                required: f.required, 'aria-required': f.required || undefined,
                'aria-invalid': err ? true : undefined, 'aria-describedby': err ? id + '-err' : undefined,
                autoComplete: f.autoComplete ?? 'off',
              };
              return (
                <div className={'dr-enq-field' + (f.wide ? ' dr-enq-wide' : '')} key={f.id}>
                  <label htmlFor={id}>{f.label}{f.required ? <span aria-hidden="true"> *</span> : null}</label>
                  {f.type === 'textarea' ? (
                    <textarea {...common} placeholder={f.placeholder} onChange={e => set(f.id, e.target.value)}/>
                  ) : f.type === 'select' ? (
                    <select {...common} onChange={e => set(f.id, e.target.value)}>
                      <option value="">Select {f.label.toLowerCase()}</option>
                      {f.options!.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      {...common} type={f.type} placeholder={f.placeholder}
                      inputMode={f.type === 'email' ? 'email' : undefined}
                      spellCheck={f.type === 'email' ? false : undefined}
                      onChange={e => set(f.id, e.target.value)}
                    />
                  )}
                  {err && <p className="dr-enq-error" id={id + '-err'}>{err}</p>}
                </div>
              );
            })}
            <div className="dr-enq-actions">
              <button className="primary" type="submit"><Mail size={17} aria-hidden="true"/> Compose enquiry email</button>
              <a className="text-link" href={'mailto:' + CONTACT_EMAIL}>Or just write to {CONTACT_EMAIL} <ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
            <p className="dr-enq-note" id="enq-status" aria-live="polite">
              {status || 'Fields marked * are required. No analytics, no form processor and no cookies are involved. If your browser has no mail client configured, copy the address above instead.'}
            </p>
          </form>
        </Sec>

        <Sec
          kicker="ALTERNATIVE PATHS"
          title="Three of these answer most questions without waiting for a reply,"
          em="and all of them are on this site already."
          copy="The whitepaper is the full argument, the playbook is the edge-AI envelope, and the films walk the architecture slide by slide."
        >
          <div className="dr-hub-grid">
            <article className="dr-hub-card">
              <div className="dr-hub-card-top"><span className="dr-hub-tag">WHITEPAPER</span><span className="dr-hub-badge">71 PAGES</span></div>
              <h3>Mature-node silicon master whitepaper</h3>
              <p className="dr-hub-sub">The sovereign-silicon roadmap in full: import substitution, the NRE argument, and the DAP-2020 position.</p>
              <div className="dr-hub-footer">
                <a className="text-link" href={url('/downloads/docs/deepgrid-mature-node-silicon-master-whitepaper-v3.pdf')}>
                  <Download size={16} aria-hidden="true"/> Download PDF
                </a>
              </div>
            </article>
            <article className="dr-hub-card">
              <div className="dr-hub-card-top"><span className="dr-hub-tag">PLAYBOOK</span><span className="dr-hub-badge">12 PAGES</span></div>
              <h3>30-use-case edge AI playbook</h3>
              <p className="dr-hub-sub">What fits in a 50 MHz scalar compute envelope: lightweight algorithms, CWRU benchmarks and the ISO standards each task answers to.</p>
              <div className="dr-hub-footer">
                <a className="text-link" href={url('/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf')}>
                  <Download size={16} aria-hidden="true"/> Download PDF
                </a>
              </div>
            </article>
            <article className="dr-hub-card">
              <div className="dr-hub-card-top"><span className="dr-hub-tag">FILMS</span><span className="dr-hub-badge">5 FILMS</span></div>
              <h3>Narrated architecture and datasheet films</h3>
              <p className="dr-hub-sub">DG32-LITE and DG32-2DOM architecture, both preliminary datasheets, and the tape-in block diagram: 29 minutes in total, with captions.</p>
              <div className="dr-hub-footer">
                <button className="text-link" onClick={() => go('resources')}>Watch on Resources <ArrowUpRight size={16} aria-hidden="true"/></button>
              </div>
            </article>
            <article className="dr-hub-card">
              <div className="dr-hub-card-top"><span className="dr-hub-tag">CONSOLE</span><span className="dr-hub-badge">NO SIGN-IN</span></div>
              <h3>Ask DeepGrid</h3>
              <p className="dr-hub-sub">Put a question to the knowledge graph and get a cited answer. It runs entirely in your browser, so nothing you type leaves the page.</p>
              <div className="dr-hub-footer">
                <button className="text-link" onClick={() => go('ask')}>Open the console <ArrowUpRight size={16} aria-hidden="true"/></button>
              </div>
            </article>
          </div>
        </Sec>

        <Sec
          kicker="OFFICE"
          title="Design, verification and bring-up are in one building in Hyderabad"
          em="and that is where an enquiry lands."
        >
          <div className="dr-group">
            <div className="dr-group-head">
              <div>
                <p className="dr-kicker">REGISTERED OFFICE</p>
                <h3 className="dr-group-name">DeepGrid Semi Pvt Ltd</h3>
              </div>
              <p className="dr-group-why">T-Hub, Floor-7, Hyderabad, Telangana, India</p>
            </div>
            <div className="dr-links">
              <a className="text-link" href={'mailto:' + CONTACT_EMAIL}><Mail size={16} aria-hidden="true"/> {CONTACT_EMAIL}</a>
              <a className="text-link" href={'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('DG32 demonstration request')}>Book a demonstration <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="text-link" href="https://www.openstreetmap.org/search?query=T-Hub%2C%20Knowledge%20City%2C%20Hyderabad" target="_blank" rel="noopener noreferrer">Find us on the map <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="text-link" href="https://github.com/shekerkamma/deepgrid-dr-silicon-v3" rel="noreferrer noopener" target="_blank">Source repository <ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
          </div>
          <div className="dr-notclaimed">
            <p className="dr-kicker">ON CUSTOMER NAMES</p>
            <ul>
              <li>This site does not publish a customer list. Engagements are covered by NDA, and one contract figure that previously appeared on a customer list here was withdrawn after verification. The reason is recorded on the Evidence page.</li>
              <li>Reference designs, evaluation boards and co-qualification are discussed under NDA rather than advertised.</li>
            </ul>
          </div>
        </Sec>

        <div className="dr-links dr-sec-gap">
          <button className="text-link" onClick={() => go('company')}>About DeepGrid Semi <ArrowUpRight size={16} aria-hidden="true"/></button>
          <button className="text-link" onClick={() => go('evidence')}>How every figure is evidenced <ArrowUpRight size={16} aria-hidden="true"/></button>
          <button className="text-link" onClick={() => go('procurement')}>Procurement information <ArrowUpRight size={16} aria-hidden="true"/></button>
        </div>
      <Related route="contact"/>
      </section>
    </Shell>
  );
}
