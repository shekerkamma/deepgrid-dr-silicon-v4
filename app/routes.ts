// The site's URL map. One place, because nav, breadcrumbs, the pager and every
// cross-link read from it — a route that exists in only one of those is the
// defect this file exists to prevent.
/** The path the site is served under. Baked in at build time so server-rendered HTML
 *  already carries correct hrefs — resolving it at runtime meant every link pointed at
 *  the domain root until hydration, which 404s for a crawler and for a reader on a slow
 *  connection. CI sets this alongside PAGES_BASE. */
export const BASE = (process.env.NEXT_PUBLIC_PAGES_BASE || '/').replace(/\/?$/, '/');

/** Base-aware href for a root-absolute site path. */
// Idempotent on purpose. scripts/package-pages.mjs prefixes every quoted "/media/…", "/decks/…" (and
// the other content roots) inside the JS bundle, so by the time a client render calls url() on one of
// those literals it already carries the base. Prefixing again produced
// /deepgrid-dr-silicon-v2/deepgrid-dr-silicon-v2/media/…, a 404 that only a client-mounted element
// shows: the server-rendered HTML was correct and hydration keeps its attributes.
export function url(path: string): string {
  if (BASE !== '/' && path.startsWith(BASE)) return path;
  return path === '/' ? BASE : BASE.replace(/\/$/, '') + path;
}

export type RouteId =
  | 'home' | 'products' | 'technology' | 'safety' | 'control' | 'die'
  | 'package' | 'applications' | 'evidence' | 'resources' | 'procurement' | 'ask'
  | 'company' | 'contact' | 'videos' | 'docs' | 'about' | 'team' | 'recognition'
  | 'uc-motors' | 'uc-vehicles' | 'uc-defence' | 'uc-grid' | 'uc-boards';

export type Route = {id: RouteId; href: string; label: string; nav?: boolean; parent?: RouteId};

export const routes: Route[] = [
  {id: 'home',         href: '/',                        label: 'Home', nav: true},
  {id: 'products',     href: '/products',                label: 'Products',     nav: true},
  {id: 'technology',   href: '/technology',              label: 'Technology',   nav: true},
  {id: 'safety',       href: '/technology/safety',       label: 'Safety',       parent: 'technology'},
  {id: 'control',      href: '/technology/control-loop', label: 'Control loop', parent: 'technology'},
  {id: 'die',          href: '/technology/die',          label: 'The die',      parent: 'technology'},
  {id: 'package',      href: '/technology/package',      label: 'Pinout & package', parent: 'technology'},
  {id: 'applications', href: '/applications',            label: 'Applications', nav: true},
  {id: 'uc-motors', href: '/use-cases/motors', label: 'Motors and drives', parent: 'applications'},
  {id: 'uc-vehicles', href: '/use-cases/vehicles', label: 'Vehicles', parent: 'applications'},
  {id: 'uc-defence', href: '/use-cases/defence', label: 'Defence, avionics and drones', parent: 'applications'},
  {id: 'uc-grid', href: '/use-cases/grid', label: 'Grid and metering', parent: 'applications'},
  {id: 'uc-boards', href: '/use-cases/boards', label: 'On nearly every board', parent: 'applications'},
  {id: 'evidence',     href: '/evidence',                label: 'Evidence',     nav: true},
  {id: 'procurement',  href: '/procurement',             label: 'Procurement',  nav: true},
  {id: 'resources',    href: '/resources',               label: 'Resources',    nav: true},
  {id: 'docs',         href: '/resources/docs',          label: 'Documentation', parent: 'resources'},
  {id: 'videos',       href: '/resources/videos',        label: 'Videos',       parent: 'resources'},
  {id: 'ask',          href: '/ask',                     label: 'Ask DeepGrid', nav: true},
  {id: 'about',        href: '/about',                   label: 'Our story'},
  {id: 'team',         href: '/about/team',              label: 'Leadership & team', parent: 'about'},
  {id: 'recognition',  href: '/about/recognition',       label: 'Achievements', parent: 'about'},
  {id: 'company',      href: '/company',                 label: 'DG32 in the Indian market', nav: true, parent: 'about'},
  // A plain link at the end of the menu, and the header CTA on every page.
  {id: 'contact',      href: '/contact',                 label: 'Contact'},
];

export const byId = Object.fromEntries(routes.map(r => [r.id, r])) as Record<RouteId, Route>;
export const navRoutes = routes.filter(r => r.nav);
export const orderedRoutes = routes.filter(r => r.id !== 'home');

export function nextRoute(id: RouteId): Route | undefined {
  const i = orderedRoutes.findIndex(r => r.id === id);
  return i >= 0 ? orderedRoutes[i + 1] : undefined;
}

export function prevRoute(id: RouteId): Route | undefined {
  const i = orderedRoutes.findIndex(r => r.id === id);
  return i > 0 ? orderedRoutes[i - 1] : undefined;
}

/** Navigation targets, accepted under two vocabularies: the current route ids, and the
 *  hash-router's old view ids that ported page bodies still pass. Built from `routes` so a
 *  new route is addressable the moment it is declared — a hand-kept second list is how
 *  href('products') came to throw while the map only knew it as 'family'. */
export const legacyView: Record<string, string> = {
  ...Object.fromEntries(routes.map(r => [r.id, r.href])),
  overview: '/',
  family: '/products',
  architecture: '/technology',
  pinout: '/technology/package',
  roadmap: '/procurement',
  library: '/resources',
};

/** Resolve a legacy target such as "library?pkg=lite" or "architecture?block=0". */
export function resolveTarget(target: string): string {
  const [view, query] = target.replace(/^#/, '').split('?');
  const path = legacyView[view];
  if (!path) throw new Error('Unknown navigation target: ' + target);
  return url(path) + (query ? '?' + query : '');
}
