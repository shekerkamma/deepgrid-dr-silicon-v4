'use client';

import {ArrowUpRight, FileText} from 'lucide-react';
import {byId, url, type RouteId} from './routes';
import {related} from './cross-references';
import {groundedDocuments} from './documents-data';
import './related.css';

/** The cross-reference block every route ends on. Sections first, because a reader who wants more
 *  usually wants the neighbouring argument rather than a 71-page PDF; documents second, with the
 *  page count stated so nobody opens a 71-page file expecting a summary. */
export default function Related({route}: {route: RouteId}) {
  const r = related[route];
  const docs = r.docs
    .map(id => groundedDocuments.find(d => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <aside className="dr-related" aria-labelledby={'related-' + route}>
      <h2 className="dr-kicker" id={'related-' + route}>Where to go next</h2>

      <ul className="dr-related-sections">
        {r.sections.map(s => {
          const t = byId[s.id];
          return (
            <li key={s.id}>
              <a href={url(t.href) + (s.query ? '?' + s.query : '')}>
                <span className="dr-related-name">{t.label}<ArrowUpRight size={15} aria-hidden="true"/></span>
                <span className="dr-related-why">{s.why}</span>
              </a>
            </li>
          );
        })}
      </ul>

      {docs.length > 0 && (
        <div className="dr-related-docs">
          <p className="dr-kicker">The documents behind this page</p>
          <ul>
            {docs.map(d => (
              <li key={d.id}>
                <a href={url(d.pdfFile)}>
                  <FileText size={15} aria-hidden="true"/>
                  <span className="dr-related-doc-title">{d.title}</span>
                  <span className="dr-related-doc-meta">PDF · {d.pdfPageCount}</span>
                </a>
                <a className="dr-related-doc-spec" href={url(d.specFile)}>Specification (Markdown)</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
