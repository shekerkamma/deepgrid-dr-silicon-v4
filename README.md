# DG32 silicon site

**Live: https://shekerkamma.github.io/deepgrid-dr-silicon-v3/**

The public site for DeepGrid Semi's DG32 motor-control silicon: DG32-LITE, a dual-core lockstep
RISC-V SoC, and DG32-2DOM, the same chip plus an INT8 attention engine. Pre-silicon: every figure
is a design value carrying the kind of evidence that produced it, not a measurement on fabricated
parts.

This is the multi-page rebuild. The earlier site (`deepgrid-dr-silicon`) was one hash-routed
document serving eight views from a single `index.html`; nothing could be linked, crawled or
cached per page. This repo is 12 routes that each export their own HTML, on the same React 19
stack and the same design system.

## Routes

| Route | Register | What it carries |
|---|---|---|
| `/` | live surface | The control loop running, and its cycle budget spent by scrolling |
| `/products` | showcase | DG32-LITE against DG32-2DOM, and the ten-chip portfolio DG32 is SKU-4 of |
| `/technology` | reference | Block-by-block architecture, per chip |
| `/technology/safety` | reference | Lockstep, and the 39-cycle path from a wrong value to a safe bridge |
| `/technology/control-loop` | reference | Loop timing and the cycle budget at four rates |
| `/technology/die` | showcase | Split stage: scroll walks the six block groups on the live die, and collapses onto the one that is frozen |
| `/technology/package` | reference | QFN-64 pinout, supplies, electrical limits |
| `/applications` | showcase | A filterable catalogue of diagnostic tasks, each under one label schema |
| `/evidence` | reference | Five kinds of evidence, and what the site does not claim |
| `/procurement` | reference | Position against the STM32G0, scorecard, roadmap |
| `/resources` | reference | 45 documents, 43 downloads, five narrated films |
| `/ask` | reference | Ask DeepGrid, grounded in the whitepaper, running in the browser |

Two registers on purpose. Showcase routes carry motion and depth; reference routes stay dense,
static, printable and deep-linkable. An engineer hunting a supply limit should not have to scroll
through a 3D world to reach a table. `PLAN.md` carries the reasoning.

## Commands

```bash
npm ci
npm run dev                  # vinext dev

npm run typecheck
npm run build:pages          # static export + packaging, fails if a declared route did not export

npm run verify                   # serve dist/pages at the real base path, then gate it
npm run verify:url -- https://shekerkamma.github.io/deepgrid-dr-silicon-v3/   # gate the live site
```

`PAGES_BASE` and `NEXT_PUBLIC_PAGES_BASE` must agree. The first tells the packager where to
rewrite asset paths; the second is baked into the bundle so server-rendered HTML already carries
correct hrefs. For a custom domain set both to `/` and set `PAGES_DOMAIN`.

**Run `build:pages` before `verify`, never `build`.** `npm run build` refreshes `dist/client`;
`npm run verify` reads `dist/pages`, which only `build:pages` rewrites. Run them in the wrong order
and the gate measures whatever base the last `build:pages` used — which reports all 36 route checks
failed, on a tree that is fine. Every line of that failure says
`site-base "/x/" != "/y/"`; that string means the package is stale, not that the routes are broken.
`package-pages.mjs` replaces `dist/pages` before it validates, so a *failed* `build:pages` also
leaves a stale package on disk for the next `verify` to read.

## Deploying

**v3 is independent.** Built from v2 (`deepgrid-dr-silicon-v2` @ 6500f79) on 2026-09-27 and not synced with
it or any other repository in either direction. This repository deploys only itself, to
`/deepgrid-dr-silicon-v3/`; there are no mirror remotes, no mirror keys and no sync script.

## Gates, and why each exists

Every check here was added after something shipped wrong, not in anticipation.

- **Route export.** `scripts/package-pages.mjs` fails when a route declared in `app/routes.ts`
  produced no HTML. `vinext` reports an unprerendered route as "skipped" and still exits 0, so a
  build went green having silently dropped `/applications` and `/evidence`.
- **Base declaration.** Every exported page must carry `<meta name="site-base">` matching the
  build's base. A page that lost it renders every nav link pointing at the domain root, which
  looks like a working build and 404s on click.
- **Route gate.** `scripts/verify-routes.mjs` opens all 12 routes at desktop, phone, and phone
  with reduced motion forced, checking status, base, links escaping the base, broken images,
  horizontal overflow, entrance animations that never finish, WCAG 2.5.8 tap targets, and console
  errors. 36 checks.
- **Class names.** `scripts/check-classes.mjs` fails the build when a static `className` in
  `app/` has no CSS rule behind it, scanning every stylesheet it discovers under `app/` rather
  than a hardcoded list, because a hardcoded list made it report 20 false failures the first time
  a new stylesheet appeared. This shipped twice: 31 invented names on a rebuilt overview
  that rendered unstyled, then `view-pager`, `mobile-sheet` and `mobile-sheet-close` in the shell,
  which left the prev/next control and the entire phone navigation unstyled on all 12 routes. An
  unstyled element typechecks, builds, and passes a browser gate measuring status, links, images
  and overflow, because it is present and correct by every one of those measures. The 13
  pre-existing cases live in `scripts/unstyled-classes-baseline.json` as a ratchet, not a waiver:
  the debt stays listed and cannot grow.
- **Claims.** `scripts/check-claims.mjs` fails the build when a source document stops carrying a
  figure that `app/claims.ts` says it carries. The claim map records 16 load-bearing figures with
  what each measures, its evidence kind, and the document behind it. It checks the *link*, not the
  truth: a matching probe means the document still says the number, not that the number is right.
- **Threaded server.** `scripts/serve-dist.py` exists because `python3 -m http.server` is
  single-threaded: once the home route began importing the scroll engine, one chunk request sat
  pending forever and `networkidle` never fired, failing a page curl served in 2 ms.

The route gate captures the viewport, never `fullPage`. A full-page shot of a reveal-on-scroll
page renders unreached blocks blank and its counters at zero, so it shows a broken page that is not
broken, and it times out on `/ask`. To read a page as a visitor sees it, scroll it first.

Two rules for reading a red gate, both learned the hard way. An animation sampled at a fixed
moment measures the animation, not the outcome: the same unchanged page reported 7 blocks hidden
at 250 ms and 0 at 800 ms. And a gate that goes green because the thing it measured moved is
worse than no gate. When a check flips, find out what moved.

## Claim hygiene

The site's argument is that its numbers are checkable, so the numbers have to be.

- No figure without the kind of evidence behind it. `/evidence` carries all five kinds and the
  explicit list of what the site does not claim.
- `PRE_SILICON` is one shared constant, not a sentence retyped per page.
- Counters show real numbers only. The home route's budget readout derives every figure live from
  `CLOCK_HZ` and `HW_FIXED_CYCLES` so a reader can redo the arithmetic on screen.
- `CPU budget` (cycles available to firmware in a period) and `CPU headroom` (what is left after
  the regulators run) are different quantities. Do not relabel one as the other.
- No visible em dashes in site copy.
- **Headings state a finding, not a question.** A page of questions reads as an FAQ while the rest
  of the site states verdicts. Measured once across all routes: 12 question headings against 34
  declarative, with 9 of the 12 on `/technology/control-loop` and `/technology`. The control page
  is now 0 of 5. `/technology` still carries five, in `architecture.tsx`, and that is known debt
  rather than an oversight.
- **A page cites figures from `app/claims.ts`, never by retyping them.** Retyped provenance drifts
  from `/evidence` the first time either changes. `/technology/control-loop` renders its plate from
  seven claim ids.
- Watch for non-breaking spaces when string-matching site copy. `~300 cycles` and `50 MHz` both
  carry one; it is invisible in a grep and fatal to an exact match. It defeated two heading
  rewrites before being spotted.
- **Derive from the documents, never from this repo's own derived data.** `sovereignSkuHorizon`
  was itself derived from the source markdown and had silently drifted: DG32-LITE numbered SKU-1
  when two independent sources call it SKU-4, D100 given a SKU number when it is Track B, wrong
  nodes on two entries, and "Phase" meaning calendar years when the sources use it for foundries.
  A derived layer cannot be used to check itself, so `app/claims.ts` reads `public/downloads`.
- Claims the sources carry that this site does not repeat are listed in `claims.ts` with their
  reasons, so the reason travels with the decision rather than living in a commit message.

## Layout

```
app/routes.ts          the URL map; nav, breadcrumbs, the pager and cross-links all read from it
app/shell.tsx          shared chrome, base-aware links, query state
app/home-surface.tsx   the live-surface home route
app/scrollcraft/       vendored scroll engine, do not edit; see its README
app/motion.tsx         the reveal/scroll system for the other 11 routes
scripts/               build packaging, route gate, threaded dev server
PLAN.md                the rebuild's reasoning and remaining phases
docs/home-brief.md     a retired build, kept as a record of a grammar that did not fit
docs/die-brief.md      the die page's brief: split stage, signature move, fingerprint gate
docs/applications-brief.md  the catalogue's brief: gallery grammar, the plate that never moves
app/claims.ts          the claim map: figure, what it measures, evidence kind, source document
app/fmax-chart.tsx     post-route frequency per block, on /technology because it is an
                       implementation result, not a control-loop one
```

Two scroll systems coexist because they never run on the same document.
