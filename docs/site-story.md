# Site story pack (story-architect, 2026-09-25)

User: "/story-architect, use this skill for every section if needed". Applied to all 14 routes of
deepgrid-dr-silicon-v2 from their rendered heading outlines. Self-answered on the user's standing
instruction. /applications and /evidence already have their own packs (`docs/applications-story.md`,
`docs/evidence-story.md`); this file covers the site as a whole and the three sections that needed one.

## 1. BLUF

DG32-LITE puts a lockstep safety pair, hardware FOC and DShot in one 130 nm, 64-pin chip, on the
September 2026 shuttle; every figure on the site traces to a named source document, and the rest of the
portfolio is plans and FPGA-validated logic, labelled as such.

## 2. Audience decision

An engineer or buyer should decide whether DG32-LITE (or DG32-2DOM) belongs on their next drive board
evaluation, and know exactly which claims are simulated, which are planned and which are not made.

## 3. Tension

Motor-drive safety today needs a second MCU or a lockstep part priced for automotive. If the claim holds
on silicon, one mature-node chip does it; if a reader cannot tell measured from simulated, the site loses
them at the first unsourced number.

## 4. Argument arc (the site as a whole)

1. Overview: what DG32 is, and the one claim (lockstep safety on one chip).
2. Technology, safety, control loop: how the claim works (39-cycle fault path, ~300-cycle loop).
3. Die, package: that it is physically real (130 nm, QFN-64).
4. Products: which chip to choose.
5. Applications, evidence: where the portfolio goes and what each part rests on today.
6. Procurement, company: whether it is a sound bet to buy from or back.
7. Resources, ask: check any of it against the documents.
8. Contact: the one action.

## 5. Per-section verdicts (second pass, 2026-09-25)

The first pass judged sections from heading outlines and changed headlines. The user, on /products:
"I do not think you have applied /story-architect". Correct; this pass judged every route against the
whole contract (answer, tension, proof, visual, implication, close) on full-page renders at 1440 px,
and rebuilt where a beat was missing, not only where a heading was weak.

| Route | Verdict | Arc as rendered | What was missing, and what changed |
|---|---|---|---|
| Home | Holds | Answer, three outcomes, fault map, portfolio, evidence ladder, next step | Nothing |
| Products | **Rebuilt** | Was: two spec cards, a spec table, portfolio, choice | Added tension, fault path, interactive chip map, loop cost; specs behind a disclosure. Own pack: `docs/products-story.md` |
| Technology | **Reordered** | Was: diagram, blocks, then constraints | The four constraints (the why) now come before the diagram and blocks |
| Safety | **Rebuilt** | Was: one beat (the fault map) | Added: every failure ends at a signal (four detectors); how the path is proven on silicon (injection, cause 001, 39 cycles); where diagnostics stop (advisory only, ASIL-D a path not a certificate); a close |
| Control loop | Holds | Answer, six stages, why hardware, budget, limits, evidence | Nothing |
| Die | Holds | Split stage: the die pinned, scroll walks the six groups, resolves on the frozen core | A full-page capture flattens the sticky die into what looks like a list; scrolled, it is a complete arc |
| Package | Holds | Answer, pin map, supplies, limits, what can be locked now | The lock-status close is the board designer's decision |
| Applications | Holds | Own pack (`docs/applications-story.md`) | Nothing |
| Evidence | Holds | Own pack (`docs/evidence-story.md`) | Nothing |
| Procurement | **Close added** | Answer, comparison, why the gaps, roadmap, not claimed | Ended on links; now closes on the buying decision: evaluate now if lockstep decides the part, plan for the second spin if the 12-bit ADC or embedded flash does |
| Company | Holds | Market, strategy, milestones, team, plan and its stress test, moats, stop rules, funds, close | Nothing |
| Resources | **Reordered** | Was: films and decks, then the documents | The page promises the source behind every figure, so the six documents come first; a link that names a package (`?pkg=`) still lands on its film |
| Ask | Holds | Answer-first tool page | Heading and lead fixed in the first pass |
| Contact | Holds | One action, the form, alternatives | Nothing |

## 6. Rebuild spines

Products: see `docs/products-story.md`.

Safety:

| # | Heading | Role | Evidence |
|---|---|---|---|
| 1 | From a wrong value to a safe bridge | Answer | Guide: Safety core |
| 2 | Two paths cross the die, and only one is firmware | Proof (fault map) | Guide: A CPU fault |
| 3 | Each failure ends at a signal, never at silence | Implication: lockstep is one of four detectors | Guide: Safety core, Bus, Design Decisions ("faults are contained, never silent") |
| 4 | Firmware fires the fault on purpose, because that is the only test real silicon allows | Proof on silicon | Guide: Fault injection; datasheet Fault CSR (cause 001, inject) |
| 5 | A classifier can warn. Only hardware trips the bridge | Boundary and close | DG32 AI architecture §5 (advisory role); site rule: ASIL-D is a path |

Procurement close: two cards from the page's own leads and gaps, then the actions (discuss, pinout,
loop budget, documents).

## 7. Evidence map

- Direct: every spec in the Products cards (content.ts, from the architecture guides and datasheet).
- Fair synthesis: "a board built for one takes the other" (identical pinout in the datasheet).
- Interpretation, kept soft: "watches the motor" rests on the 2DOM guide; the accelerometer conflict
  (REVIEW-TASKS.md) is still the owner's, so no card says accelerometers are unnecessary.

## 8. Content cuts

- "Authoritative", "design authority", "Verified", "sovereign supply chain security" from headings and
  leads: they assert trust instead of showing the source, and the review showed some citations are wrong.
- "Client-ready": production language.

## 9. Rebuild instructions (implemented)

First pass: headlines on Products, Resources and Ask (see git history, e62343c).
Second pass: `app/products/page.tsx` + `app/products-story.tsx/.css`; `app/technology/safety/page.tsx`;
`app/architecture.tsx` (section order); `app/library.tsx` + `app/dr.css` (documents first, package
links land on the film); `app/procurement/page.tsx` (close).
