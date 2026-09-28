// Every route must point somewhere, and say why.
//
// Before app/cross-references.ts each page ended in a hand-written list of links and the set drifted:
// measured on the live site, the home page linked to no other route at all, /products reached two,
// and no page outside /resources and /ask linked to a single source document although the site ships
// nine. A reader who wanted the document behind a figure had to go looking for it.
//
// This fails the build when:
//   - a declared route has no cross-reference entry, or fewer than two sibling sections
//   - a `why` is missing, too short to be a reason, or one of the empty phrases that look like one
//   - a section points at itself, is named twice, or names a route that does not exist
//   - a document id is not in the grounded document registry
//   - a page component does not actually render <Related>, which is how a declared entry would
//     otherwise sit in the map while the reader never sees it
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const routesSrc = read('app/routes.ts');
const declared = [...routesSrc.matchAll(/\{id: '([\w]+)',\s*href: '([^']+)'/g)].map(m => ({id: m[1], href: m[2]}));
if (declared.length < 8) {
  console.error(`Only ${declared.length} routes parsed from app/routes.ts; the map or this parser is wrong.`);
  process.exit(1);
}

const xref = read('app/cross-references.ts');
const docIds = new Set([...read('app/documents-data.ts').matchAll(/id: '(doc\d)'/g)].map(m => m[1]));
if (docIds.size < 3) { console.error('Fewer than 3 documents parsed from app/documents-data.ts.'); process.exit(1); }

// Each entry runs from `<id>: {` to the closing `},` of its docs array.
const entries = new Map();
for (const m of xref.matchAll(/^ {2}(\w+): \{\n([\s\S]*?)\n {2}\},$/gm)) {
  const body = m[2];
  const sections = [...body.matchAll(/\{id: '(\w+)', why: '((?:[^'\\]|\\.)*)'/g)].map(s => ({id: s[1], why: s[2]}));
  const docs = [...(body.match(/docs: \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'(\w+)'/g)].map(d => d[1]);
  entries.set(m[1], {sections, docs});
}

const EMPTY = /^(learn|read|find out|see) more\b|^more\b|^(read|view|see) the (docs?|documentation|page|section)\b|^click here\b|^details\b/i;
const problems = [];

for (const {id} of declared) {
  const e = entries.get(id);
  if (!e) { problems.push(`${id}: no cross-reference entry in app/cross-references.ts`); continue; }
  if (e.sections.length < 2) problems.push(`${id}: ${e.sections.length} sibling section(s); a route must point at two or more`);

  const seen = new Set();
  for (const s of e.sections) {
    if (!declared.some(d => d.id === s.id)) problems.push(`${id}: points at "${s.id}", which is not a declared route`);
    if (s.id === id) problems.push(`${id}: points at itself`);
    if (seen.has(s.id)) problems.push(`${id}: points at "${s.id}" twice`);
    seen.add(s.id);
    const why = s.why.trim();
    if (why.length < 25) problems.push(`${id} -> ${s.id}: reason is ${why.length} chars, too short to tell a reader anything: "${why}"`);
    else if (EMPTY.test(why)) problems.push(`${id} -> ${s.id}: "${why}" says what to do, not what the reader gets`);
  }
  for (const d of e.docs) if (!docIds.has(d)) problems.push(`${id}: document "${d}" is not in the grounded document registry`);
}

// A declared entry the page never renders is invisible to the reader, which is the failure this
// whole file exists to prevent, one level up.
const pages = [];
(function scan(dir) {
  for (const entry of fs.readdirSync(path.join(root, dir), {withFileTypes: true})) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(rel);
    else if (entry.name === 'page.tsx') pages.push(rel);
  }
})('app');

for (const f of pages) {
  const src = read(f);
  const route = src.match(/<Shell route="(\w+)"/)?.[1];
  if (!route) continue;
  if (!/<Related\s+route="(\w+)"/.test(src)) {
    problems.push(`${f}: renders <Shell route="${route}"> but never renders <Related>`);
    continue;
  }
  const rendered = src.match(/<Related\s+route="(\w+)"/)[1];
  if (rendered !== route) problems.push(`${f}: <Shell route="${route}"> but <Related route="${rendered}">`);
  // Inside a Suspense fallback it renders only while a lazy chunk is loading, so the reader never
  // sees it. /ask shipped that way on the first pass and measured as unchanged.
  const fallback = src.match(/fallback=\{([\s\S]*?)\}>/)?.[1] ?? '';
  if (/<Related\b/.test(fallback)) problems.push(`${f}: <Related> is inside a Suspense fallback, so it renders only while loading`);
}

if (problems.length) {
  console.error(`${problems.length} cross-reference problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nEvery route points at two or more siblings and says what the reader gets there.');
  process.exit(1);
}

const totalSections = [...entries.values()].reduce((t, e) => t + e.sections.length, 0);
const totalDocs = [...entries.values()].reduce((t, e) => t + e.docs.length, 0);
console.log(`Cross-reference check: ${declared.length} routes, ${totalSections} section links, ${totalDocs} document links, all reasoned.`);
