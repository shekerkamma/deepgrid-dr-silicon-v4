# Grill: cross-references across sections (started 2026-09-24)

User ask: "review each and every section, focus on cross references across sections, specifically".
Format: one question at a time (grill-me). Each answer is checkpointed here before the next question.

## Facts gathered (not decisions)

- **Declared graph** (`app/cross-references.ts`, 14 routes, 4 section links each, enforced by
  `scripts/check-crossrefs.mjs`). Inbound counts: evidence 8, products 7, technology 7, procurement 5,
  safety 4, control 4, die 4, package 4, applications 4, resources 3, ask 3, company 2, contact 1,
  home 0 (home is reached through the nav only).
- **In-body links** beyond the end-of-page block: overview 15, products 10, package 4, procurement 4,
  contact 5, safety 3, applications 3, evidence 3, company 1; technology, control-loop, die,
  resources and ask make none.
- **Documents**: doc1 = the 30-use-case playbook, doc2 = Technical Annex v3 (10 SKUs, D100, SDV),
  doc3 = DShot RTL spec, doc4 = DG32-2DOM architecture, doc5 = mature-node whitepaper v3,
  doc6 = datasheets and pinout. /applications cites doc1 and doc2.
- **The portfolio is described in three places**: /products (a 10-SKU table, node, foundry, what it
  does), /applications (by area: role, replaces, node, made at, evidence status, Annex link) and
  /company (FY27-FY31 plan revenue, FY31 split by chip line, stop rules naming Chips 1, 2, 3, 6).
- **Contradiction introduced in commit a3a2b39**: notClaimed item "No market size, price or revenue
  for the wider portfolio" (shown on /evidence and /procurement) vs /company's per-chip-line FY31
  plan revenue (whitepaper §13, labelled plan targets, not audited).

- **The source documents live as distilled chapters on GitHub**: `shekerkamma/deepgrid-sku-portfolio`
  (14 chapters of the mature-node whitepaper) and `shekerkamma/deepgrid-sku-compendium` (one chapter
  per Annex sheet), each with a cheatsheet, glossary and patterns file.
- **The documents' own label scheme** (whitepaper ch03): every figure is tagged where it appears as
  DONE (a chip exists or an order is signed), DESIGNED (circuit code works on test hardware), PLANNED
  (a tracked date, not a claim) or ESTIMATED (DeepGrid's own number, no outside source; volumes, prices
  and performance curves default to it). The site uses a different, DG32-only five-kind ladder.
- **Compendium ch01**: each sheet mixes five evidence tiers (block annotations = targets, timing
  diagram = intent, characteristic panels = illustrative, market tiles = rough internal estimates,
  prototype strip = template text identical on every sheet). Quoting the strip per SKU is an
  anti-pattern.
- **Errors this surfaces in commit a3a2b39**: (1) /evidence quotes the template strip as SKU-1's
  evidence; (2) the whitepaper's DESIGNED list has FPGA-validated logic for SKU-4, SKU-1 (motor
  datapath), SKU-2 (meter chain), SKU-6 (supervisor sensing chain) and D100 (drone position engine),
  while /evidence grades SKU-6 as a sheet and says "three have logic on an FPGA"; (3) the whitepaper
  lists a DONE 130 nm test chip (SkyWater, own flow, working silicon), which "no silicon result for any
  chip but DG32-LITE" glosses over.

## Decisions

**Q1. Which section owns the portfolio's numbers?** User: "all the documents, refer to GH docs".
Read as: no section owns a number; the source document does. Each section states a figure where it
needs it, cites the document (and chapter) it comes from, and carries that document's own label.
Sections cross-reference each other for context, not for figures. (Interpretation, to be confirmed by
Q2's answer, which depends on it.)

**Q2. Adopt the documents' four labels (DONE/DESIGNED/PLANNED/ESTIMATED) site-wide?** User: "ignore".
The site keeps its current evidence vocabulary. The three factual errors above are corrections, not a
labelling decision, and stay on the fix list.

**Facts for Q3**: both GitHub doc repos are PUBLIC. Citations today: the end-of-page block links the
shipped PDF and markdown (public/downloads); /evidence names a source as plain text; /applications
cards link the Annex PDF at `#page=N`. The GitHub chapters are distillations with critique (e.g.
compendium ch01's "the addressable tile always includes something beyond this SKU's units"), not the
documents themselves.

**Q3. Where does a citation link go?** User: "look into existing convention". The convention, found:
(1) documents are registered once in `app/documents-data.ts` (doc1-doc6: shipped PDF + markdown spec)
and every document link (end-of-page block, /resources, Ask DeepGrid "title · section" + PDF) reads
that registry; (2) figures live in `app/claims.ts` with a source document and a probe string that
`scripts/check-claims.mjs` finds in the document on every build, and pages print the source *title*;
(3) page-anchored `#page=N` PDF links are NOT convention: they were introduced on /applications and
/evidence in fa55f0d/a3a2b39 as ad-hoc paths; (4) no page links the GitHub chapter repos.
Decision: follow it. Citations name the registered document (and section/sheet) and link through the
registry, not hard-coded paths; figures that bear weight go through the claim map so the build
verifies them; the GitHub chapter repos are the maintainers' checking reference, not a reader link.

**Q4. Which sections keep the portfolio table?** User: "applications". /applications is the home of
per-chip facts. /products keeps its "Where DG32 sits" argument with a compact table (SKU, part, node)
whose rows link to each chip's card on /applications; /evidence keeps only its evidence columns (evidence
today, next step, source) with each chip name linking to its card. Nothing else repeats per-chip facts.

**Facts for Q5 (naming)**: three schemes name the same chips. "SKU-N" / product name on /applications,
/products, claims (91 uses; the Annex's own label); "Chip N" on /company (22 uses; the whitepaper's
label, used throughout its chapters, e.g. ch12's scoreboard "chip 2 Ripple's letter, chip 9 a vehicle
maker's pilot"); and /company's FY31 rows by market line (Smart meters, Motor controllers, Defence
(screened), Drone brain, Vehicle gateway), which match neither SKUs nor the five application areas.
Chip N = SKU N in both sources (detail-content.ts). Whitepaper ch12 does not state which chips make
up each FY31 row.

## Revisit, self-answered (user, 2026-09-24: "revisit all questions, self answer")

Facts added before answering: the shipped whitepaper PDF (doc5,
`deepgrid-mature-node-silicon-master-whitepaper-v3.pdf`) carries, on p. 12, the DONE 130 nm test chip
("made at SkyWater using our own automated flow ... real working silicon came back") and the DESIGNED
list ("the lockstep microcontroller with fault testing, the motor control datapath, the meter
measurement chain, the supervisor sensing chain, and the drone position engine ... on an Artix-7 FPGA
at 81.25 MHz"), plus "81.25 MHz is a limit of the FPGA, not of our design". Its p. 67 table numbers the
chips 1-10 with 9 = vehicle gateway and 10 = drone brain (D100). The shipped markdown carries none of
the DESIGNED list, so no build gate can probe it without a PDF parser, which CI does not have.

- **Q1 (revisited). Who owns the numbers?** Keep the user's answer: the source documents. Confirmed by
  the facts: every figure in question is in doc2 (Annex) or doc5 (whitepaper).
- **Q2 (revisited). Four labels site-wide?** Keep the user's "ignore": no relabelling of the site. The
  DONE/DESIGNED facts are still used as *content* where they correct an error (Q8), not as a scheme.
- **Q3 (revisited). Where do citations link?** Keep "existing convention": registered documents via
  `app/documents-data.ts`, section or page named in text, no ad-hoc paths and no `#page=` anchors.
  The two hard-coded Annex paths (applications-portfolio.tsx, evidence/page.tsx) move to the registry.
- **Q4 (revisited). Portfolio home?** Keep "applications". /products shrinks to SKU, part, node and a
  link per row to the chip's card; /evidence drops its "where it goes" column and links each chip name
  to its card. Cards get stable ids (`#chip-<id>`) so links can land on them.
- **Q5. One name per chip?** SKU-N plus the product name is the site's label (the Annex's own, and the
  majority use). Where /company restates the whitepaper it keeps "Chip N" and adds the product name in
  the same breath ("Chip 2, the smart-meter SoC"); the quoted split verdict stays verbatim with a key
  beneath it. FY31 rows link to the card of the chip they name: meters -> SKU-2, motors -> SKU-1,
  drone brain -> D100, vehicle gateway -> SKU-9; "Defence (screened)" pools several chips the
  documents do not split, and says so.
- **Q6. Missing links between sections?** Add /company <-> /applications to the declared
  cross-references (where each planned chip goes, and what each is planned to earn). The overview
  already links /applications twice in its body, so home needs no new entry.
- **Q7. The contradictory not-claimed line?** Rewrite both portfolio items. Revenue: the annex's market
  tiles are rough internal estimates and are not shown; the only revenue figures are /company's plan
  targets, which are not results. Silicon: no product chip besides DG32-LITE is on a shuttle; the
  others rest on architecture sheets and FPGA-validated logic; the one chip returned so far is a 130 nm
  test chip on DeepGrid's own flow (doc5 p. 12).
- **Q8. The three evidence errors?** Correct from doc5 p. 12: SKU-1, SKU-2, SKU-6 and D100 each have
  named logic validated on the FPGA (four, not three, and SKU-6 was wrong); drop the template-strip
  wording; add "81.25 MHz is a limit of the FPGA, not of our design" as the caveat. Status label
  "FPGA prototype" becomes "FPGA-validated". The source column cites the whitepaper for those rows.
- **Q9. Can the build verify the portfolio facts?** Not fully: the shipped markdown lacks the per-sheet
  panels and the DESIGNED list, and CI has no PDF parser. State this as a known limit rather than add a
  gate that checks names only (a gate that measures nothing new is worse than none).

## Implemented (2026-09-24), and what verified it

- Q3: `citeDoc()` reads the registry; the hard-coded Annex paths and `#page=` anchors are gone.
- Q4: /products table is SKU, part, node, each part linking to `/applications#chip-<id>`; /evidence's
  portfolio table dropped "where it goes" and links each chip name; cards carry `id="chip-<id>"`.
- Q5: /company glosses "Chip N" with the product name; the split verdict stays verbatim with a key;
  FY31 rows link to their chip's card, and "Defence (screened)" says it pools chips.
- Q6: /company <-> /applications added to the declared cross-references (58 section links).
- Q7/Q8: not-claimed items rewritten; FPGA-validated logic corrected from doc5 p. 12 (SKU-1, SKU-2,
  SKU-6, D100), citing "Whitepaper v3, §3"; status label "FPGA-validated".
- One more disagreement found while verifying: D100's node read "TSMC 28 nm" on /products and
  "130 nm + 28 nm" on /applications. Fixed at the shared record (detail-content.ts), override removed.
- Build fix: story.css now loads once in app/layout.tsx; imported from five pages it produced a
  CSS-only shared chunk whose JS preload stub was never emitted ("Missing asset" in package-pages).
- Verified: all build gates; route gate 14 routes x 3 profiles; 24 new `#chip-` links (evidence 9,
  products 11, company 4) all resolve to the 10 cards; a real click from /company's smart-meter row lands
  on the SKU-2 card 80 px from the top, below the sticky nav; design detector clean.
- Not verified by any gate: the portfolio facts themselves (Q9): the shipped markdown lacks them and
  CI has no PDF parser.
