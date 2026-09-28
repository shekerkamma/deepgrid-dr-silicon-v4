# DeepGrid DG32 — multi-page site rebuild

Status: **foundation landed, design phases pending.** 12 routes build, prerender and pass a
browser gate. The visual rebuild has not started; every page currently wears the old site's
clothes on a new skeleton.

## The decision

Rebuild as a real multi-page site on the existing stack, in two visual registers. Not a
scroll-driven single page, and not a from-scratch rewrite.

The governing rule comes from the reference video itself, at 07:37–08:04: *"the other element
of AI slop is when it feels like you're looking at something that is meant for someone else."*
DeepGrid's reader is an engineering evaluator or a procurement officer. A 3D world is right for
the brand surfaces and wrong for a pinout table, so the site carries both and says which is which.

| Register | Routes | Treatment |
|---|---|---|
| Showcase | `/`, `/products`, `/applications`, `/technology/die` | Four-plane layering, one peak per page, scroll-driven motion |
| Reference | `/technology/package`, `/evidence`, `/procurement`, `/resources` | Dense, static, fast, deep-linkable, printable. No pinning |

## What the references contribute

- **The video, 02:12–02:37.** Depth comes from occlusion between named planes, not parallax.
  The OFFGRID frame has four: blurred canyon, oversized type, the bike *in front of the type*,
  foreground rocks in front of the bike. DG32's equivalent: fab field, oversized wordmark,
  package render, bond wires.
- **The video, 01:37–01:47.** Four generated sites share a skeleton — kicker, oversized
  headline, small subhead, bottom meta rail — and no two share a layout.
- **21st.dev.** "Organized by what it is, so you can go straight to the shelf you need instead
  of scrolling a landing page." Category indexes carry counts (Heroes 1.2K, Forms 1.8K).
- **Godly.** Inspiration indexed by component — Hero, CTA, Footer — not only by whole site.
- **Awwwards.** Faceted filters above a uniform card grid, per-card award badge.

## Architecture

`vinext` is a Next.js App Router drop-in on Vite, and it does real multi-page static export —
but not with `trailingSlash: true`, which makes every nested route fail prerender with
`RSC handler returned 308`. Removing that one line took the export from 1 HTML file to 13.

Three things follow from static export under a project path:

1. **Content assets are root-absolute** (`/media/x.jpg`), not relative. A relative `./media/`
   resolves to `/technology/media/` from a nested route and 404s. `scripts/package-pages.mjs`
   prefixes them with the base exactly as it already did for `/_next/`.
2. **The base is baked in at build time** via `NEXT_PUBLIC_PAGES_BASE`. Resolving it at runtime
   left every nav link pointing at the domain root until hydration — broken for a crawler and
   for a reader on a slow connection.
3. **Navigation targets resolve through one map** built from `routes.ts`, so a route is
   addressable the moment it is declared.

## Gates

`npm run build:pages` fails if a route declared in `app/routes.ts` did not export. This is not
belt-and-braces: vinext reports an unprerendered route as "skipped" and still exits 0, and a
green build shipped without `/applications` and `/evidence` before the gate existed.

`scripts/verify-routes.mjs` opens every route at 1440 and 390 px and checks status, the declared
base, links that escape the base, broken images, horizontal overflow, entrance animations that
never complete, and console errors. It polls for the settled state rather than sampling once —
the same unchanged page reported 7 blocks hidden at 250 ms, 0 at 800 ms, and intermittently 2 at
1000 ms, because a live WebGL canvas can park a transition for seconds. A gate that samples an
animation measures the animation, not the outcome.

## Motion

Five narrated films already exist at 1920x1080 with captions (259–463 s), plus 61 deck slides
and two architecture SVGs. Those are reused as they are. Three new short pieces carry technical
argument and are built in the node-chain idiom the video shows at 03:22:

| Piece | Length | Home |
|---|---|---|
| Die assembly — six block groups converging | ~10 s | `/` hero |
| Signal chain — ADC, CORDIC, Park, PI, PWM | ~8 s | `/technology/control-loop` |
| Fault path — commit, compare, mismatch, latch, bridge off | ~6 s | `/technology/safety` |

All silent, looping, poster-first, `prefers-reduced-motion` honoured. Clips must be re-encoded to
H.264 with a silent AAC track; Playwright records VP8 in WebM and captures no audio stream at all.

## Claim hygiene

A visual rebuild is exactly where "Simulated" quietly becomes "measured". Every figure keeps the
evidence kind that produced it, `/evidence` carries all five kinds plus the explicit
"what this site does not claim" list, and `PRE_SILICON` is a shared constant rather than a
sentence re-typed per page.

## Phases

1. **Foundation** — routes, shell, asset paths, gates, deploy. *Done.*
2. **Design system** — the four-plane hero, the two registers, type scale, the die-as-index
   signature move.
3. **Page design** — showcase routes first, then reference routes.
4. **Motion** — the three new pieces.
5. **Content** — `/applications` domain pages, `/resources` faceted index over 45 documents
   and 43 downloads.
