// Every class the app writes must have at least one rule behind it.
//
// This exists because the same defect shipped twice. A rebuilt overview invented 31 class names
// with no CSS and rendered unstyled; then the multi-page shell invented `view-pager`,
// `mobile-sheet` and `mobile-sheet-close`, so the prev/next control and the ENTIRE phone
// navigation were unstyled on all 12 routes. Nothing caught either: they typecheck, they build,
// they pass a browser gate that checks status, links, images and overflow. An unstyled element is
// present and correct by every one of those measures.
//
// Only static className string literals are read. A class assembled at runtime cannot be checked
// this way and is not guessed at.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, 'app');

// Classes that legitimately carry no rules of their own.
const ALLOW = new Set([
  'mono',        // typography helper applied alongside a styled parent
  'dark',        // theme flag on <html>
  'primary',     // defined in globals.css on button, checked separately
]);

const files = [];
(function scan(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) scan(f);
    else if (/\.tsx?$/.test(e.name)) files.push(f);
  }
})(appDir);

const used = new Map();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/className=(?:"([^"{]*)"|\{'([^']*)'\})/g)) {
    for (const c of (m[1] || m[2] || '').split(/\s+/).filter(Boolean)) {
      if (!used.has(c)) used.set(c, path.relative(root, f));
    }
  }
}

// Every stylesheet under app/, discovered rather than listed. A hardcoded list meant that adding
// applications-catalog.css reported 20 false failures on classes that were styled all along, and
// the obvious fix for that is to edit the gate, which is exactly the habit a gate should not teach.
const cssFiles = [];
(function scanCss(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) scanCss(f);
    else if (e.name.endsWith('.css')) cssFiles.push(f);
  }
})(appDir);
if (cssFiles.length < 3) { console.error(`Only ${cssFiles.length} stylesheets found under app/; the scan is wrong.`); process.exit(1); }
const css = cssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

const defined = new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(m => m[1]));

// A ratchet, not a waiver: the baseline lists what the original app already shipped unstyled, so
// that debt stays visible while no new instance can be added.
const baselinePath = path.join(root, 'scripts/unstyled-classes-baseline.json');
const baseline = new Set(
  fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')).classes : [],
);
const missing = [...used].filter(([c]) => !defined.has(c) && !ALLOW.has(c) && !baseline.has(c));
const stale = [...baseline].filter(c => defined.has(c) || !used.has(c));
if (missing.length) {
  console.error(`${missing.length} class name(s) with no CSS rule:\n`);
  for (const [c, f] of missing) console.error(`  .${c}  (${f})`);
  console.error('\nEither style them, reuse an existing class, or add to ALLOW with a reason.');
  process.exit(1);
}
if (stale.length) console.log(`Class check: ${stale.length} baseline entr(ies) now styled or gone, safe to delete: ${stale.join(', ')}`);
console.log(`Class check: ${used.size} static class names across ${cssFiles.length} stylesheets, ${baseline.size} baselined, no new unstyled.`);
