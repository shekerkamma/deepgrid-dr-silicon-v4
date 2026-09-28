'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, ArrowRight, ArrowLeft, Menu, X} from 'lucide-react';
import {byId, nextRoute, prevRoute, resolveTarget, url, type RouteId} from './routes';
import {MegaNav} from './mega-nav';
import {useReveal, useScrollVars} from './motion';
import {useDraw, useRail} from './devices';

function Brand() {
  return (
    <>
      {/* The company's own wordmark, as on deepgridsemi.com. */}
      <img className="brand-wordmark" src={url('/brand/deepgrid-semi-wordmark.png')} alt="Deepgrid Semi" width={480} height={96}/>
    </>
  );
}

export function Shell({
  route,
  children,
  reduced,
}: {
  route: RouteId;
  children: React.ReactNode;
  reduced?: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = menuDialog.current;
    if (!menu || !dialog) return;
    dialog.showModal();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')].filter(el => el.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('keydown', trapFocus);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenu(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      dialog.removeEventListener('keydown', trapFocus);
      dialog.close();
      menuButton.current?.focus();
    };
  }, [menu]);
  const here = byId[route];
  const parent = here.parent ? byId[here.parent] : undefined;
  const next = nextRoute(route);
  const prev = prevRoute(route);
  const href = url;

  useScrollVars();
  useReveal(route);
  useScrollRegions();
  useDraw(route);
  useRail(route);


  return (
    <div className={'site-shell view-' + route}>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="topbar">
        <a className="brand" href={href('/')} aria-label="DeepGrid Semi home"><Brand/></a>
        <div className="topline">
          <span>DG32 · LOCKSTEP RISC-V MOTOR-CONTROL SILICON</span>
          <span className="status-dot">FIRST SILICON · SEP 2026</span>
        </div>
        <a className="contact-link" href={href('/contact')}>Discuss your application <ArrowUpRight size={17}/></a>
        <button ref={menuButton} className="mobile-menu" aria-label="Open navigation" aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(true)}>
          <span>{here.id === 'home' ? 'Deepgrid Semi' : here.label}</span><Menu/>
        </button>
      </header>

      <div className="main-nav"><MegaNav route={route}/></div>

      {menu && (
        <dialog ref={menuDialog} id="mobile-navigation" className="navigation-sheet mobile-sheet" aria-label="Navigation" onCancel={() => setMenu(false)} onClose={() => setMenu(false)}>
          <button className="mobile-sheet-close" aria-label="Close navigation" onClick={() => setMenu(false)}><X aria-hidden="true"/></button>
          <MegaNav route={route} label="Primary" onNavigate={() => setMenu(false)}/>
        </dialog>
      )}

      <main id="main" tabIndex={-1}>
        {route !== 'home' && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href={href('/')}>Home</a>
            <span>/</span>
            {parent && <><a href={href(parent.href)}>{parent.label}</a><span>/</span></>}
            <span aria-current="page">{here.label}</span>
          </nav>
        )}

        {(route === 'technology' || here.parent === 'technology') && (
          <nav className="technology-nav" aria-label="Technology sections">
            {(['technology', 'safety', 'control', 'die', 'package'] as const).map(id => (
              <a key={id} href={href(byId[id].href)} aria-current={route === id ? 'page' : undefined}>{byId[id].label}</a>
            ))}
          </nav>
        )}
        {children}

        {(prev || next) && (
          <nav className="section-pagination" aria-label="Section navigation">
            {prev ? (
              <a href={href(prev.href)}>
                <ArrowLeft size={19} aria-hidden="true"/>
                <span><small>Previous section</small>{prev.label}</span>
              </a>
            ) : <span/>}
            {next && (
              <a href={href(next.href)}>
                <span><small>Next section</small>{next.label}</span>
                <ArrowRight size={19} aria-hidden="true"/>
              </a>
            )}
          </nav>
        )}
      </main>

      <footer className="footer">
        <div className="footer-top">
          <a className="brand" href={href('/')} aria-label="DeepGrid Semi home"><Brand/></a>
          <h2>Safety in the core.<br/><em>Control in silicon.</em></h2>
          <a className="text-link" href="https://deepgridsemi.com" target="_blank" rel="noreferrer">
            deepgridsemi.com <ArrowUpRight size={20}/>
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DEEPGRID SEMI PVT LTD</span>
          <span>HYDERABAD · INDIA</span>
          <span>PRE-SILICON · DESIGN VALUES, NOT MEASUREMENTS</span>
          <a href={href('/resources')}>Documents &amp; media ↗</a>
        </div>
      </footer>
    </div>
  );
}

/** A table or figure that scrolls sideways must be reachable by keyboard (WCAG 2.1.1; axe
 *  scrollable-region-focusable). Only wrappers that actually overflow get a tab stop, named from the table's
 *  caption or the image's alt text, and the check reruns when the layout width changes. */
function useScrollRegions() {
  useEffect(() => {
    const mark = () => document.querySelectorAll<HTMLElement>('.table-scroll, .st-table-scroll, .figure-scroll').forEach((el) => {
      const scrolls = el.scrollWidth > el.clientWidth + 1;
      if (scrolls && !el.hasAttribute('tabindex')) {
        el.tabIndex = 0;
        el.setAttribute('role', 'region');
        const name = el.querySelector('caption')?.textContent?.trim() || el.querySelector('img')?.getAttribute('alt') || 'Scrollable content';
        el.setAttribute('aria-label', name + ' (scrolls sideways)');
        el.dataset.scrollRegion = '';
      } else if (!scrolls && el.dataset.scrollRegion !== undefined) {
        el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label'); delete el.dataset.scrollRegion;
      }
    });
    const t = window.setTimeout(mark, 300);
    addEventListener('resize', mark);
    return () => { window.clearTimeout(t); removeEventListener('resize', mark); };
  }, []);
}

/** prefers-reduced-motion, read once per page. */
export function useReduced() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Query-string state, replacing the old hash router's params. Static-export safe. */
export function useQuery(): [URLSearchParams, (changes: Record<string, string | undefined>) => void] {
  const [params, setParams] = useState(() => new URLSearchParams());
  useEffect(() => {
    setParams(new URLSearchParams(location.search));
    const sync = () => setParams(new URLSearchParams(location.search));
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, []);
  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(location.search);
    for (const [k, v] of Object.entries(changes)) { if (v) next.set(k, v); else next.delete(k); }
    history.replaceState(history.state, '', location.pathname + (next.size ? '?' + next : '') + location.hash);
    setParams(next);
  };
  return [params, update];
}

/** Navigation for ported page bodies. `navigate('pinout')` and `go('library?pkg=lite')`
 *  keep working against the real URL map, and `href()` gives an anchor the same answer. */
export function useNav() {
  const href = (target: string) => resolveTarget(target);
  const navigate = (target: string) => { location.assign(href(target)); };
  return {href, navigate, go: navigate};
}
