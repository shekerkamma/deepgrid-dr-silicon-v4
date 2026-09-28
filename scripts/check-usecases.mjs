// The task catalogue must hold every task the playbook counts.
//
// /applications showed four sample tasks per domain and cited a total of thirty, so fourteen of
// them existed on the page only as a number. The rows now come from the playbook's own tables
// (public/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf, pages 7-10) via app/diagnostic-tasks.ts.
//
// This fails the build when the table stops matching its own headline, when a row loses a field the
// document states, or when a domain drifts from the count the site's domain data declares. It is
// deliberately not a PDF parser: CI has no pdftotext, and a gate that silently skips when its tool
// is missing is worse than no gate.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'app/diagnostic-tasks.ts'), 'utf8');

const total = Number(src.match(/USE_CASE_TOTAL = (\d+)/)?.[1]);
if (!Number.isFinite(total)) { console.error('USE_CASE_TOTAL not found in app/diagnostic-tasks.ts'); process.exit(1); }

const FIELDS = ['domain', 'name', 'detects', 'sensing', 'features', 'model', 'memory', 'latency', 'rate'];
const rows = [...src.matchAll(/\{domain: '(\w+)',([^\n]*?)\},$/gm)].map(m => {
  const row = {domain: m[1]};
  for (const f of FIELDS.slice(1)) row[f] = m[2].match(new RegExp(`${f}: '((?:[^'\\\\]|\\\\.)*)'`))?.[1] ?? '';
  return row;
});

const problems = [];
if (rows.length !== total) problems.push(`the table holds ${rows.length} tasks; the playbook counts ${total}`);

// The last row of each playbook page once came through with the page footer spliced into its cells
// ("Shaft misalignment and looseness EEPGRID SEMI · DG32-LITE BASE V", rate ">1 kHz 07"). Every
// field was present and the latency parsed, so nothing above caught it. Footer text, and a page
// number trailing a rate, fail here.
const FOOTER = /DEEPGRID SEMI|EEPGRID|BASE VARI|back-solved|not measured on|\bsilicon\.$|kHz \d\d$|Hz \d\d$/;

for (const [i, r] of rows.entries()) {
  for (const f of FIELDS) if (!String(r[f]).trim()) problems.push(`task ${i + 1} (${r.name || 'unnamed'}): "${f}" is empty`);
  for (const f of FIELDS) if (FOOTER.test(String(r[f]))) problems.push(`task ${i + 1} (${r.name}): "${f}" carries the PDF page footer: "${r[f]}"`);
  if (r.latency && !/^<?\d+(\.\d+)? ?ms$/.test(r.latency)) problems.push(`task ${i + 1} (${r.name}): latency "${r.latency}" is not a time`);
}

const names = rows.map(r => r.name);
for (const n of new Set(names)) if (names.filter(x => x === n).length > 1) problems.push(`"${n}" appears more than once`);

// Per-domain counts must match what the site's own domain data declares, which is the number the
// page prints beside each filter.
const dc = fs.readFileSync(path.join(root, 'app/detail-content.ts'), 'utf8');
const block = dc.slice(dc.indexOf('export const diagnosticDomains'));
for (const m of block.matchAll(/id: '([\w-]+)',[\s\S]{0,400}?tasksCount: '(\d+)/g)) {
  const [, id, declared] = m;
  const have = rows.filter(r => r.domain === id).length;
  if (have !== Number(declared)) problems.push(`domain "${id}": ${have} task(s) in the table, ${declared} declared in diagnosticDomains`);
}

// /applications pairs tasks with the sockets DG32-LITE goes into (app/applications-story-data.ts).
// Each name there must match a task row exactly, or the page would link to a task that is not listed.
const story = fs.readFileSync(path.join(root, 'app/applications-story-data.ts'), 'utf8');
const socketBlock = story.slice(story.indexOf('export const sockets'));
const paired = [...socketBlock.matchAll(/tasks: \[([^\]]*)\]/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]));
if (!paired.length) problems.push('no socket task pairings parsed from app/applications-story-data.ts');
for (const n of paired) if (!names.includes(n)) problems.push(`socket pairing names "${n}", which is not a task in app/diagnostic-tasks.ts`);

if (problems.length) {
  console.error(`${problems.length} task-catalogue problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nRe-read the rows off the playbook tables; do not pad the list to reach the count.');
  process.exit(1);
}
console.log(`Task catalogue check: ${rows.length} of ${total} tasks, every field present, domain counts agree.`);
