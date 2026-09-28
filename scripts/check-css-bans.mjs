// Two CSS patterns this site bans, because both crept in unnoticed and both read as machine-made.
//
//   transition: all   Animates whatever changes, including layout, so a hover that alters padding or
//                     width triggers layout on every frame. It also hides intent: nobody can tell
//                     from the rule what was meant to move. Eight button rules carried it.
//   0 0 Npx <colour>  A zero-offset coloured halo. On all four rules that had one, the state it
//                     decorated was already signalled by a copper border and a tinted background,
//                     so the glow added nothing but the look scroll-craft and impeccable both flag.
//
// Found by a static scan during the site-wide design pass on 2026-09-23; the impeccable detector did
// not report either. An inset hairline (`inset 0 0 0 1px`) is allowed: it has no blur, so it is a
// ring, not a halo.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
(function scan(dir) {
  for (const e of fs.readdirSync(path.join(root, dir), {withFileTypes: true})) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) scan(rel);
    else if (e.name.endsWith('.css')) files.push(rel);
  }
})('app');
if (files.length < 3) { console.error(`Only ${files.length} stylesheets found under app/; the scan is wrong.`); process.exit(1); }

const problems = [];
for (const f of files) {
  const raw = fs.readFileSync(path.join(root, f), 'utf8');
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  const lineOf = i => src.slice(0, i).split('\n').length;
  for (const m of src.matchAll(/transition\s*:\s*all\b[^;}]*/g))
    problems.push(`${f}:${lineOf(m.index)}  ${m[0].trim()}  -> name the properties that should animate`);
  for (const m of src.matchAll(/(?:box|text)-shadow\s*:([^;}]*)/g)) {
    for (const layer of m[1].split(/,(?![^(]*\))/)) {
      const l = layer.trim();
      if (/^inset\b/.test(l)) continue;
      const g = l.match(/^0(?:px)?\s+0(?:px)?\s+(\d*\.?\d+)px\b/);
      if (g && Number(g[1]) > 0 && /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|var\(--/i.test(l))
        problems.push(`${f}:${lineOf(m.index)}  ${m[0].trim().slice(0, 80)}  -> zero-offset coloured halo`);
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} banned CSS pattern(s):\n`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`CSS ban check: ${files.length} stylesheets, no transition: all, no zero-offset coloured halos.`);
