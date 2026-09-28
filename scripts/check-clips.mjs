// The evidence clips must still point at the moment they quote.
//
// /evidence used to carry stills from an AMR forklift simulator captioned "Evidence visualization:
// Simulated". Each card now shows the deck slide that states the figure, plays the film segment
// that explains it, and prints that segment's narration as text. Three things can rot: the film or
// slide can be renamed, the segment can move when a film is re-cut, and the quoted narration can
// drift from what is actually said.
//
// This fails the build when:
//   - a referenced film, caption file or poster slide is missing from public/
//   - a quoted segment falls outside the film's own duration
//   - the quoted narration is not what the caption file carries over that time range
//
// It reads the .vtt, so it checks the artifact rather than a copy of it.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Two pages quote film moments: /evidence (one per kind of evidence) and /applications (the
// story's beats, in app/applications-story-data.ts). Both keep them in a `const clips` map of the same
// shape, and each file has a floor so a parser that silently matches nothing fails instead of passing.
const SOURCES = [
  {file: 'app/evidence/page.tsx', min: 5},
  {file: 'app/applications-story-data.ts', min: 7},
];
const field = (body, name) => body.match(new RegExp(`${name}: '((?:[^'\\\\]|\\\\.)*)'`))?.[1];
const num = (body, name) => Number(body.match(new RegExp(`${name}: ([\\d.]+)`))?.[1]);

const clips = [];
for (const {file, min} of SOURCES) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  const block = src.slice(src.indexOf('const clips'), src.indexOf('\n};', src.indexOf('const clips')));
  const found = [...block.matchAll(/^  '?([\w\s-]+?)'?: \{\n([\s\S]*?)\n  \},$/gm)].map(m => ({
    kind: `${file.split('/').slice(-2).join('/')} ${m[1]}`,
    film: field(m[2], 'film'), captions: field(m[2], 'captions'), poster: field(m[2], 'poster'),
    start: num(m[2], 'start'), duration: num(m[2], 'duration'),
    saying: field(m[2], 'saying')?.replace(/\\'/g, "'"),
  }));
  if (found.length < min) {
    console.error(`Only ${found.length} clips parsed from ${file}, expected at least ${min}; the map or this parser is wrong.`);
    process.exit(1);
  }
  clips.push(...found);
}

const secs = t => {
  const [h, m, s] = t.split(':');
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
};
const words = t => (t.toLowerCase().match(/[a-z0-9']+/g) || []);

const problems = [];
for (const c of clips) {
  for (const [label, rel] of [['film', c.film], ['captions', c.captions], ['poster', c.poster]]) {
    if (!rel) { problems.push(`${c.kind}: no ${label}`); continue; }
    if (!fs.existsSync(path.join(root, 'public', rel))) problems.push(`${c.kind}: ${label} missing from public: ${rel}`);
  }
  if (!c.captions || !fs.existsSync(path.join(root, 'public', c.captions))) continue;

  const vtt = fs.readFileSync(path.join(root, 'public', c.captions), 'utf8');
  const cues = [];
  for (const blk of vtt.split(/\r?\n\r?\n/)) {
    const m = blk.match(/(\d\d:\d\d:\d\d\.\d+)\s*-->/);
    if (!m) continue;
    const text = blk.split(/\r?\n/).filter(l => !l.includes('-->') && l.trim() && !/^\d+$/.test(l.trim())).join(' ');
    cues.push({at: secs(m[1]), text});
  }
  if (!cues.length) { problems.push(`${c.kind}: ${c.captions} carries no cues`); continue; }

  const end = c.start + c.duration;
  const last = cues[cues.length - 1].at;
  if (c.start > last) problems.push(`${c.kind}: starts at ${c.start}s but the film's last cue is at ${last.toFixed(1)}s`);

  // The quoted narration must be what is said over that range. Compare on words, because the page
  // may punctuate differently from the caption file; 92% catches a re-cut without failing on a comma.
  const said = words(cues.filter(q => q.at >= c.start - 0.5 && q.at < end).map(q => q.text).join(' '));
  const quoted = words(c.saying || '');
  if (!quoted.length) { problems.push(`${c.kind}: no narration quoted`); continue; }
  const pool = [...said];
  const kept = quoted.filter(w => { const i = pool.indexOf(w); if (i < 0) return false; pool.splice(i, 1); return true; });
  const share = kept.length / quoted.length;
  if (share < 0.92) problems.push(`${c.kind}: only ${Math.round(share * 100)}% of the quoted narration appears in ${c.captions} between ${c.start}s and ${end.toFixed(1)}s`);
}

if (problems.length) {
  console.error(`${problems.length} evidence-clip problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nRe-read the segment off the caption file; do not edit the quote to make this pass.');
  process.exit(1);
}
console.log(`Evidence clip check: ${clips.length} clips, every film, caption and slide present, narration matches the caption file.`);
