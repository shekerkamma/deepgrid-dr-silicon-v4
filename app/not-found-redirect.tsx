'use client';
import {useEffect} from 'react';
import {BASE} from './routes';

// GitHub Pages is case- and slash-sensitive: /About, /about/, /about.html and /use-cases all 404.
// Map them onto the real page before showing "not found".
const SECTION_HOME: Record<string, string> = {'use-cases': 'use-cases/motors'};

export function NotFoundRedirect() {
  useEffect(() => {
    const path = decodeURIComponent(location.pathname);
    if (!path.toLowerCase().startsWith(BASE.toLowerCase())) return;
    let rest = path.slice(BASE.length).toLowerCase().replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '');
    rest = SECTION_HOME[rest] ?? rest;
    const target = BASE + rest + location.search + location.hash;
    if (target !== path + location.search + location.hash) location.replace(target);
  }, []);
  return null;
}
