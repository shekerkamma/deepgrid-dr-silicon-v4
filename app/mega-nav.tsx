'use client';
// v3 primary menu: dropdowns per subject, on the pattern of deepgrid-platform-v2's menu (and its lessons).
// - Menu aim: while a panel is open, another button takes over only after the pointer rests on it (180 ms), and
//   leaving closes after 280 ms, so a pointer crossing a neighbour on its way to a link keeps the panel.
// - One-column panels hang under their own button and are nudged back inside the viewport.
// - Escape closes and returns focus; Enter/Space open; the phone sheet scrolls and expands groups inline.
// Notes under each link are the target page's own heading, so the menu never says what the page does not.
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { url, type RouteId } from './routes';

type Item = { label: string; href: string; note?: string };
type Menu = { id: string; label: string; match: RouteId[]; items: Item[] };

const a = (path: string, hash = '') => url(path) + (hash ? '#' + hash : '');

export const menus: Menu[] = [
  {
    id: 'products', label: 'Products', match: ['products'],
    items: [
      { label: 'DG32-LITE and DG32-2DOM', href: a('/products'), note: 'One footprint, two chips' },
      { label: 'Pinout & package', href: a('/technology/package'), note: '44 signals in a 9 × 9 mm package' },
      { label: 'Where DG32 leads', href: a('/procurement'), note: 'And where it does not yet' },
    ],
  },
  {
    id: 'technology', label: 'Technology', match: ['technology', 'safety', 'control', 'die', 'package'],
    items: [
      { label: 'Overview', href: a('/technology'), note: 'Two chips, one frozen safety core' },
      { label: 'Safety', href: a('/technology/safety'), note: 'From a wrong value to a safe bridge' },
      { label: 'Control loop', href: a('/technology/control-loop'), note: 'The CPU runs two regulators, not the loop' },
      { label: 'The die', href: a('/technology/die'), note: 'Six functional groups. One of them is frozen.' },
      { label: 'Pinout & package', href: a('/technology/package'), note: '44 signals in a 9 × 9 mm package' },
    ],
  },
  {
    id: 'usecases', label: 'Use Cases', match: ['applications', 'uc-motors', 'uc-vehicles', 'uc-defence', 'uc-grid', 'uc-boards'],
    items: [
      { label: 'Motors and drives', href: a('/use-cases/motors'), note: 'One chip runs the motor, another can stop it safely' },
      { label: 'Vehicles', href: a('/use-cases/vehicles'), note: 'The battery, the brakes, the radar, the bus and the wiring zones' },
      { label: 'Defence, avionics and drones', href: a('/use-cases/defence'), note: 'Screened parts, and a failsafe that does not depend on software' },
      { label: 'Grid and metering', href: a('/use-cases/grid'), note: 'Measure the power and record tampering' },
      { label: 'On nearly every board', href: a('/use-cases/boards'), note: 'Supervisors and transceivers, where the volume is' },
      { label: 'All chips by application', href: a('/applications'), note: 'Ten chips, five kinds of system' },
    ],
  },
  {
    id: 'evidence', label: 'Evidence', match: ['evidence'],
    items: [
      { label: 'How every figure was obtained', href: a('/evidence'), note: 'Nothing here is measured on silicon yet' },
      { label: 'Claims withheld', href: a('/evidence', 'ev-withheld') },
      { label: 'Simulated', href: a('/evidence', 'ev-simulated') },
      { label: 'Post-route timing', href: a('/evidence', 'ev-post-route') },
      { label: 'What this site does not claim', href: a('/evidence', 'ev-next') },
    ],
  },
  {
    id: 'resources', label: 'Resources', match: ['resources', 'docs', 'videos', 'ask'],
    items: [
      { label: 'Documentation', href: a('/resources/docs'), note: 'Datasheets, whitepapers and development resources' },
      { label: 'Videos', href: a('/resources/videos'), note: 'Demos, field tests and deep dives' },
      { label: 'Documents & decks', href: a('/resources'), note: 'The documents, decks and films behind every figure' },
      { label: 'Ask DeepGrid', href: a('/ask'), note: 'Every answer names its source' },
    ],
  },
  {
    id: 'about', label: 'About', match: ['about', 'team', 'recognition', 'company'],
    items: [
      { label: 'Our story', href: a('/about'), note: 'A semiconductor company for edge AI, in Hyderabad' },
      { label: 'Leadership & team', href: a('/about/team'), note: 'Founders, board, engineers, advisors and partners' },
      { label: 'Achievements', href: a('/about/recognition'), note: 'Milestones and recognition' },
      { label: 'DG32 in the Indian market', href: a('/company'), note: 'A market already obliged to buy domestic' },
    ],
  },
];

const canHover = () => typeof matchMedia !== 'undefined' && matchMedia('(hover: hover)').matches;

export function MegaNav({ route, onNavigate, label = 'Primary navigation' }: { route: RouteId; onNavigate?: () => void; label?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const menuId = 'menu-' + useId().replace(/[^a-zA-Z0-9_-]/g, '') + '-';
  const root = useRef<HTMLElement>(null);
  const closing = useRef<number | undefined>(undefined);
  const switching = useRef<number | undefined>(undefined);

  const enter = (id: string) => {
    if (!canHover()) return;
    window.clearTimeout(closing.current);
    window.clearTimeout(switching.current);
    setOpen((cur) => {
      if (!cur || cur === id) return id;
      switching.current = window.setTimeout(() => setOpen(id), 180);
      return cur;
    });
  };
  const leave = () => {
    if (!canHover()) return;
    window.clearTimeout(switching.current);
    window.clearTimeout(closing.current);
    closing.current = window.setTimeout(() => setOpen(null), 280);
  };

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const was = open; setOpen(null);
      (root.current?.querySelector(`[aria-controls="${menuId}${was}"]`) as HTMLElement | null)?.focus();
    };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open, menuId]);

  // Keep an open panel inside the viewport.
  useLayoutEffect(() => {
    const el = open ? (root.current?.querySelector('#' + menuId + open) as HTMLElement | null) : null;
    if (!el || getComputedStyle(el).position === 'static') return;
    el.style.translate = '';
    const r = el.getBoundingClientRect(), pad = 12;
    const dx = r.right > innerWidth - pad ? innerWidth - pad - r.right : r.left < pad ? pad - r.left : 0;
    if (dx) el.style.translate = dx + 'px 0';
  }, [open]);

  return (
    <nav className="mega-nav" aria-label={label} ref={root}>
      <a href={url('/')} className={'mega-home' + (route === 'home' ? ' active' : '')} aria-current={route === 'home' ? 'page' : undefined} onClick={onNavigate}>
        <img src={url('/brand/deepgrid-d-64.png')} alt="" aria-hidden="true" width={20} height={20} />
        Deepgrid Semi
      </a>
      {menus.map((m) => {
        const isOpen = open === m.id;
        const active = m.match.includes(route);
        return (
          <div key={m.id} className="mega-item" onMouseEnter={() => enter(m.id)} onMouseLeave={leave}>
            <button type="button" className={'mega-trigger' + (active ? ' active' : '')} aria-expanded={isOpen} aria-controls={menuId + m.id} onClick={() => setOpen(isOpen ? null : m.id)}>
              {m.label}
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div id={menuId + m.id} className="mega-panel" hidden={!isOpen}>
              <ul>
                {m.items.map((it) => (
                  <li key={it.href + it.label}>
                    <a href={it.href} onClick={() => { setOpen(null); onNavigate?.(); }}>
                      <span>{it.label}</span>
                      {it.note && <small>{it.note}</small>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
      <a href={url('/contact')} className={'mega-link' + (route === 'contact' ? ' active' : '')} aria-current={route === 'contact' ? 'page' : undefined} onClick={onNavigate}>
        Contact
      </a>
    </nav>
  );
}
