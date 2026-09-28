'use client';

import {useMemo, useState} from 'react';
import {ArrowRight, ArrowUpRight, Search} from 'lucide-react';
import {url} from './routes';
import {sovereignSkuHorizon} from './detail-content';
import {areas, citeDoc, products, type ProductId} from './applications-story-data';
import './applications-portfolio.css';

/** The portfolio by where it goes, structured like the showcase's Product lines page
 *  (deepgrid-platform-showcase, app/views/portfolio.tsx), which the owner named as the reference:
 *  filter chips with counts, a search, a Cards/Compare toggle and a results line; then per line a
 *  concept banner, the line's name with one figure, a lead paragraph and a grid of product cards
 *  (meta, name, one line, "Used for", three figures, "Open product").
 *
 *  What differs, and why: the reference's figures are price, FY2032 revenue and margin. These
 *  chips have no price or revenue the site can carry (the Annex flags its market figures as internal
 *  estimates), so each card's three figures are node, where it is made, and status. A product sits
 *  under one line, as in the reference; the other places it goes are part of its "Used for".
 *  The SoC2 die render is not used anywhere here: it is printed "39.3 TOPS", a withdrawn claim. */

const ANNEX = citeDoc('doc2');
const scene: Record<string, {src: string; alt: string}> = {
  motors: {src: '/media/deepgrid_robotics.jpg', alt: 'Concept render of an autonomous forklift in a warehouse aisle, its sensor beams sweeping the racks'},
  vehicles: {src: '/media/deepgrid_truck.jpg', alt: 'Concept render of a DeepGrid-liveried truck on a wet highway at dusk, a camera-mirror display beside the cab'},
  defence: {src: '/media/deepgrid_defence.jpg', alt: 'Concept render of a border surveillance tower seen from an operator cabin, with tracked targets on the glass'},
  grid: {src: '/images/scenes/grid-meters-1536.webp', alt: 'Concept render of a row of electricity smart meters on a utility wall at dusk, one open to show its metrology board, a transformer beyond the doorway'},
  boards: {src: '/images/scenes/boards-supervisor-1536.webp', alt: 'Concept render of an industrial controller board with a row of voltage regulators and a small supervisor chip beside them'},
};
const skuOf: Record<ProductId, string> = {
  sku1: 'SKU-1', sku2: 'SKU-2', sku3: 'SKU-3', sku4: 'SKU-4', sku5: 'SKU-5',
  sku6: 'SKU-6', sku7: 'SKU-7', sku8: 'SKU-8', sku9: 'SKU-9', d100: 'Track B',
};
const ALL = 'All';

type Row = {
  id: ProductId; area: string; areaName: string; name: string; tag: string; sheet: number;
  what: string; usedFor: string[]; inAreas: string[]; replaces?: string; status?: string;
  node: string; made: string; onSilicon: boolean; evidence: string; stage: string;
};

// One row per product. Its line is the first area where it is marked primary; every area it
// appears in contributes a "Used for" entry, so nothing the Annex says about it is lost.
const rows: Row[] = (Object.keys(products) as ProductId[]).map(id => {
  const p = products[id];
  const home = areas.find(a => a.items.some(i => i.product === id && i.primary))!;
  const sku = sovereignSkuHorizon.find(s => s.sku === skuOf[id])!;
  const inAreas = areas.filter(a => a.items.some(i => i.product === id));
  return {
    id, area: home.id, areaName: home.name, name: p.name, tag: p.tag, sheet: p.sheet,
    what: sku.targetApp,
    usedFor: inAreas.map(a => a.items.find(i => i.product === id)!.role),
    inAreas: inAreas.map(a => a.id),
    replaces: p.replaces, status: p.status,
    node: sku.node, made: sku.phase.replace(/^Phase \d · /, ''),
    onSilicon: id === 'sku4',
    evidence: p.evidence,
    // the card's short status, from the same evidence field /evidence grades the portfolio with
    stage: p.evidence.startsWith('First silicon') ? 'First silicon' : p.evidence.startsWith('FPGA') ? 'FPGA-validated' : 'Design only',
  };
});

export default function ApplicationsPortfolio() {
  const [area, setArea] = useState(ALL);
  const [query, setQuery] = useState('');
  const [layout, setLayout] = useState<'cards' | 'table'>('cards');
  const visible = useMemo(() => rows.filter(r =>
    (area === ALL || r.inAreas.includes(area)) &&
    `${r.name} ${r.tag} ${r.what} ${r.usedFor.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
  ), [area, query]);
  const count = (id: string) => (id === ALL ? rows.length : rows.filter(r => r.inAreas.includes(id)).length);
  const clear = () => { setArea(ALL); setQuery(''); };

  return (
    <div className="pf">
      <div className="pf-controls">
        <div className="pf-filters" role="group" aria-label="Where the chips go">
          {[{id: ALL, name: 'All products'}, ...areas].map(a => (
            <button key={a.id} type="button" aria-pressed={area === a.id} onClick={() => setArea(a.id)}>
              {a.name} <span className="num">{count(a.id)}</span>
            </button>
          ))}
        </div>
        <div className="pf-row">
          <label className="pf-search">
            <Search size={16} aria-hidden="true"/>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Find a chip…" aria-label="Find a chip" name="chip-search"
              autoComplete="off" spellCheck={false}
            />
          </label>
          <div className="pf-layout" role="group" aria-label="Layout">
            {([['cards', 'Cards'], ['table', 'Compare']] as const).map(([id, label]) => (
              <button key={id} type="button" aria-pressed={layout === id} onClick={() => setLayout(id)}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="pf-results" aria-live="polite">
        <span>{visible.length} of {rows.length} chips{area !== ALL ? ` · ${areas.find(a => a.id === area)?.name}` : ''}</span>
        {(query || area !== ALL) && <button type="button" onClick={clear}>Clear filters</button>}
      </div>

      {layout === 'table' ? (
        <div className="st-table-scroll" tabIndex={0} aria-label="Chip comparison">
          <table className="st-models pf-compare">
            <thead>
              <tr>
                <th scope="col">Chip</th><th scope="col">Where it goes</th><th scope="col">Replaces</th>
                <th scope="col">Node</th><th scope="col">Made at</th><th scope="col">Evidence today</th><th scope="col">Next step</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(r => (
                <tr key={r.id}>
                  <th scope="row">{r.name}<span className="pf-tag num">{r.tag}</span></th>
                  <td>{r.inAreas.map(id => areas.find(a => a.id === id)!.name).join(' · ')}</td>
                  <td>{r.replaces}</td>
                  <td>{r.node}</td>
                  <td>{r.made}</td>
                  <td>{r.evidence}</td>
                  <td>{r.onSilicon ? 'Bring-up' : r.status ?? 'Not stated on the sheet.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pf-lines">
          {/* With no filter each chip sits under its own line, as in the reference. With a filter, only the
              chosen line is drawn, holding every chip that goes there, so none appears twice. */}
          {areas.filter(a => (area === ALL ? visible.some(r => r.area === a.id) : a.id === area && visible.length > 0)).map(a => {
            const members = visible.filter(r => (area === ALL ? r.area === a.id : true));
            const s = scene[a.id];
            return (
              <section key={a.id} className="pf-line" id={'area-' + a.id} aria-labelledby={'area-' + a.id + '-h'}>
                {s && (
                  <figure className="pf-scene">
                    <img src={url(s.src)} alt={s.alt} width={1376} height={768} loading="lazy" decoding="async"/>
                    <figcaption>{a.name} · Application concept</figcaption>
                  </figure>
                )}
                <header className="pf-line-head">
                  <h2 id={'area-' + a.id + '-h'}>{a.name}</h2>
                  <p className="pf-line-figure num">
                    {members.length} {members.length === 1 ? 'chip' : 'chips'}
                    {members.some(m => m.onSilicon) ? ' · 1 on first silicon' : ''}
                  </p>
                  <p className="pf-line-lead">{a.headline} {a.lede}</p>
                </header>
                <div className="pf-grid">
                  {members.map(r => {
                    const deep = r.onSilicon;
                    const href = deep ? '#st-answer' : url(ANNEX.pdf);
                    return (
                      <a key={r.id} id={'chip-' + r.id} className="pf-card" href={href} {...(deep ? {} : {target: '_blank', rel: 'noreferrer'})}>
                        <div className="pf-card-body">
                          <span className="pf-meta">{a.name}<span className="num">{r.tag}</span></span>
                          <h3>{r.name}</h3>
                          <p>{r.what}.</p>
                          <div className="pf-used">
                            <span>Used for</span>
                            <ul>{r.usedFor.map(u => <li key={u}>{u}</li>)}</ul>
                          </div>
                          <dl>
                            <div><dt>Node</dt><dd>{r.node}</dd></div>
                            <div><dt>Made at</dt><dd>{r.made}</dd></div>
                            <div><dt>Status</dt><dd>{r.stage}</dd></div>
                          </dl>
                          <span className="pf-open">
                            <span>
                              {deep ? 'Open product' : `Annex sheet ${r.sheet}`}{' '}
                              {deep ? <ArrowRight size={16} aria-hidden="true"/> : <ArrowUpRight size={16} aria-hidden="true"/>}
                            </span>
                            <span className="pf-media num">{deep ? '5 films · 30 diagnostic tasks' : r.status ?? ''}</span>
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
      {!visible.length && (
        <div className="pf-empty">
          <p>No chip matches that search.</p>
          <button type="button" onClick={clear}>Clear filters</button>
        </div>
      )}
      <p className="disclaimer">
        Where each chip goes is from the SKU Architecture Compendium (Technical Annex v3). Only DG32-LITE
        is on first silicon; the rest are architecture sheets with their wafer runs planned. Concept
        renders show where a product is used, not the product.
      </p>
    </div>
  );
}
