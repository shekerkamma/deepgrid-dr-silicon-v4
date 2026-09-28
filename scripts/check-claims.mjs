// The claim map must stay true to the documents it was derived from.
//
// app/claims.ts records, for each load-bearing figure, the source in public/downloads that carries
// it. This re-runs that search: if a source no longer contains a claim's probe string, the link is
// stale and the build fails. It is the mechanism that stops the same drift that put DG32-LITE at
// SKU-1 when both source documents call it SKU-4.
//
// It checks the link, not the truth of the figure. A probe that still matches means the document
// still carries the number, not that the number is right.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'app/claims.ts'), 'utf8');

const ENTRY = /'([\w-]+)':\s*\{[\s\S]*?source:\s*'([^']+)'[\s\S]*?probe:\s*'([^']+)'/g;
const parse = text => [...text.matchAll(ENTRY)].map(m => ({id: m[1], source: m[2], probe: m[3]}));
const entries = parse(src);

// /company's figures, registered in app/company-content.ts. Parsed from its companySources block only,
// so no other object literal in that file can be mistaken for a claim.
const company = fs.readFileSync(path.join(root, 'app/company-content.ts'), 'utf8');
const start = company.indexOf('export const companySources');
const companyEntries = start < 0 ? [] : parse(company.slice(start, company.indexOf('\n};', start)));
if (companyEntries.length < 30) {
  console.error(`Only ${companyEntries.length} /company sources parsed from app/company-content.ts; the map or this parser is wrong.`);
  process.exit(1);
}
entries.push(...companyEntries);

if (entries.length < 10) {
  console.error(`Only ${entries.length} claims parsed from app/claims.ts; the map or this parser is wrong.`);
  process.exit(1);
}

const problems = [];
for (const e of entries) {
  const file = path.join(root, 'public/downloads', e.source);
  if (!fs.existsSync(file)) { problems.push(`${e.id}: source missing from public/downloads: ${e.source}`); continue; }
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(e.probe)) problems.push(`${e.id}: "${e.probe}" no longer appears in ${e.source}`);
}

if (problems.length) {
  console.error(`${problems.length} claim(s) no longer match their source:\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nRe-derive the claim from the document, or remove it. Do not edit the probe to make this pass.');
  process.exit(1);
}
console.log(`Claim check: ${entries.length - companyEntries.length} claims and ${companyEntries.length} /company figures, all still carried by their source documents.`);
