// Build gate for the images Ask DeepGrid attaches to answers (visualEvidence in app/data/graphrag-engine.ts).
// Every image must have a description read off the image itself (knowledge/image-descriptions.json, written by
// scripts/describe-images.py), and a caption may not claim a kind of image the file is not: a render or a simulator
// screenshot once went live captioned as a "microphotograph" and an "oscilloscope capture".
//   node scripts/check-visuals.mjs        (runs before every build)
import fs from 'node:fs';
const engine = fs.readFileSync('app/data/graphrag-engine.ts', 'utf8');
const described = JSON.parse(fs.readFileSync('knowledge/image-descriptions.json', 'utf8'));
const CLAIMS = {photograph: /\b(micro)?photo(graph)?\b|\bmicrograph\b/i, chart: /\boscilloscope|capture|spectrum|waveform|plot\b/i};
const cards = [...engine.matchAll(/title: '([^']+)',\s*type: '[^']+',\s*filePath: '([^']+)',\s*caption: '([^']+)'/g)]
  .map(m => ({file: 'public/' + m[2], caption: `${m[1]}. ${m[3]}`}));
// A caption must be about what the image shows: most of its content words appear in the image's own description.
// A forklift simulator captioned "supply chain map" shares almost none; a diagram captioned from its labels shares most.
const STOP = new Set('the and for with from into onto that this over under their its one two all per via are was were has have show shows showing'.split(' '));
const words = t => new Set((t.toLowerCase().match(/[a-z0-9]+/g) || []).filter(w => w.length > 2 && !STOP.has(w)));
const overlap = (caption, d) => { const c = words(caption), dw = words([d.shows, ...(d.visibleText || []), ...(d.subjects || [])].join(' '));
  return [...c].filter(w => dw.has(w)).length / Math.max(1, c.size); };
const fails = [];
for (const c of cards) {
  const d = described[c.file];
  if (!d) { fails.push(`${c.file}: no description on file; run scripts/describe-images.py`); continue; }
  const o = overlap(c.caption, d);
  if (o < 0.35) fails.push(`${c.file}: caption is not about what the image shows (${Math.round(o * 100)}% of its words appear in the image's description: "${d.shows.slice(0, 90)}")`);
  for (const [kind, re] of Object.entries(CLAIMS))
    if (re.test(c.caption) && d.kind !== kind) fails.push(`${c.file}: caption claims a ${kind} ("${c.caption.match(re)[0]}") but the image is a ${d.kind}`);
}
if (fails.length) { console.error('visual evidence check failed:\n  ' + fails.join('\n  ')); process.exit(1); }
console.log(`visual evidence ok: ${cards.length} captions, every image described and captioned as what it is`);
