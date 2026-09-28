# Site review, adapted from "Getting the most out of Opus 5.5" (claude.dev, 2026-09-22)

Scope: deepgrid-dr-silicon-v2, all 14 routes, at commit a771742.

Techniques taken from the post, and how each is applied here:

- **"Check this deck for anything that contradicts itself: numbers, dates and names. Quote each problem
  and say where it is."** -> every figure, date and chip name on every page, compared across pages and
  against the source documents.
- **"Name the styles you don't want."** The post's own list: cream/off-white background, italic accent
  words in headings, numbered "01 / 02 / 03" section labels, monospace labels, pill-shaped buttons.
  -> counted on the rendered site; reported, not changed (a site-wide style call is the owner's).
- **"List only problems you'd block the merge for": file and line, why it's wrong, how to show it
  fails.** -> the blocking list below.
- **"Mark anything you couldn't confirm, and say where you looked."**
- Report under "Blocked on me / Changed / Found".

Done means: every contradiction quoted with its location; blocking ones fixed and verified in a build
and on the rendered page; design defaults counted; unconfirmed items marked.

## Checklist

- [x] Extract every route's rendered text (after reveal-on-scroll) from the local build
- [x] Pull every figure with a unit, every date and every chip name; group by what it measures
- [x] Flag concepts stated with more than one value; judge each against the sources
- [x] Count the five design defaults on the rendered pages
- [x] Fix the blocking contradictions; rebuild; re-run gates; re-check the rendered text
- [x] Report: Blocked on me / Changed / Found, with unconfirmed items marked

## Results (2026-09-25)

Method: rendered text of all 14 routes (after reveal-on-scroll), every figure with a unit, every date and
chip name grouped by what it measures; each multi-valued or unfamiliar figure read in context and
searched for in the shipped markdown and the whitepaper PDF text.

Consistent everywhere: 50 MHz clock; ~55-62 MHz lockstep ceiling; 39-cycle fault path; 64 KB ROM,
32 KB SRAM; ~0.43 W; September 2026 shuttle; ~300-cycle loop; 82 % (10 kHz, diagnostics) and 88 %
(20 kHz, firmware) are different quantities, each labelled.

Blocking, fixed (unsourced or contradicted by another section):
- Ask supply-chain answer, explanation paragraphs: "130 nm / 250 nm SiGe", "owns 100% of ... mask
  tooling, ensuring foreign sanctions ..." (the title and lead had been fixed in a771742; the body had not).
- Ask seed-round answer and knowledge base: "₹2.88 Cr committed pre-ASIC revenue" and "proves real
  market demand". /company drops this figure because it contains MCEME ₹1.01 Cr, withdrawn on /evidence;
  the whitepaper's own ch03 calls presenting it as chip demand an anti-pattern.
- Ask knowledge graph: four anchor-customer nodes (MCEME, Airgap, Ripple, BEL) and five edges, including
  "₹1.01 Cr Order". /contact says the site publishes no customer list; "Ripple: national rollout partner"
  overstated an unsigned letter.
- Resources document cards: "84% ... mature nodes (≥65nm)", "NRE from ₹12 Cr to ₹0.8 Cr" (Company, from the
  source: ₹0.6-1.2 Cr per chip vs $2-5M), "38 kg" harness saving and "<50 µs" CAN-XL (SDV doc: 4 × CAN-XL
  up to 20 Mbps, 16 e-fuses, ASIL-D as a target), "Guarantees 100% drop-in", and "Uses DG32 silicon" for
  the zonal gateway (the SDV doc credits SKU-9).

Found, needs the owner:
- Source conflict: the DG32-2DOM architecture doc says current-signature analysis "eliminates external
  accelerometers and vibration probes entirely"; the use-case playbook (p. 11) says an 8-bit converter
  cannot resolve current sidebands and bearings need an accelerometer. Resources quotes the first,
  Applications the second.
- Design defaults from the post's list: italic accent words in 52 headings, 59 numbered "01 / ..."
  labels, 132 monospace uppercase labels. No cream background, no pill buttons.

Could not confirm (and where I looked): whether any Ask citation section title other than those already
found is wrong (checked only the whitepaper's table of contents, not the other five documents'); the
three Ask retrieval passages quoting MCEME are the source PDFs' own text and were left as they are.
