> **RETIRED, unshipped (2026-09-23).** The live-surface grammar was wrong for a home page:
> it banned the hero claim and the positioning copy a first-time visitor needs, so the page
> opened on a cycle readout and never said what DG32 is. `/` is the six-section overview.
> Kept as a record of what was tried and why it failed.

# BRIEF: DG32 home route, live surface

**Interviewed 2026-09-23.** Four questions asked and answered (scope, signature move, engine
integration, assets). The other four are carried forward verbatim from
`builds/deepgrid-dr-silicon/BRIEF.md`, which covered vibe, energy, feeling and aesthetic range for
this same site and is still accurate. That brief was self-authored; these four answers are not.

Target: `/` only, in `shekerkamma/deepgrid-dr-silicon-v2`. The other 11 routes keep the two-register
split in the repo's PLAN.md.

## The eight answers

1. **Vibe.** Measured, exact, quietly confident. References: a semiconductor datasheet set in a
   well-edited technical journal; the calm of an oscilloscope trace that has just caught a glitch.
   *(carried forward)*
2. **Journey.** Changed since the prior brief, which recorded the journey as "fixed, not ours to
   change" under a no-structure-changes constraint. That constraint is void: the site is now 12
   real routes. The home route no longer has to carry the whole argument, so it carries one: what
   the silicon costs you and what it leaves you.
3. **Energy.** Calm almost everywhere. One held moment. Dense is fine, loud is not. *(carried forward)*
4. **Feeling, and the one moment.** Curiosity, then the recognition that the budget is knowable,
   then trust. The moment: seeing how few cycles are left at 100 kHz, and that the number is
   arithmetic rather than a claim. *(adapted from carried-forward answer)*
5. **Something no site does.** Let the reader spend the control loop's cycle budget by scrolling,
   and watch the headroom that is left compute itself from the published clock and the published
   fixed cost.
6. **Distance from premium-minimal.** Editorial and restrained. Dark copper-on-ink, inherited.
   *(carried forward)*
7. **One world or scenes.** Neither. The home route is one continuous operating surface.
8. **Assets.** Real only, no key, no spend: five narrated 1080p films with captions, 61 deck slides,
   the interactive 3D die and package, two draw.io diagrams, four domain photographs, die renders.

## Grammar: live surface

Chosen over the other seven because the honest pitch for DG32 is "watch what it does with the
cycles", and because its honesty rule is this project's claim discipline restated: real markup
running real logic on real or clearly-labelled data, never a painted surface.

- **Filmic one-shot** — the grammar the skill flags as the default trap, and it wants `scrub`,
  which needs footage of a thing that does not exist yet. Pre-silicon.
- **Chaptered editorial** — already the grammar of `deepgrid-showcase`, and close to
  `deepgrid-platform`. Re-using it fails the fingerprint gate on the dimension that matters most.
- **Continuous world** — one canvas for the whole scroll is the most fragile thing to build and the
  brief says distinct, not a flight.
- **Typographic poster** — the page has real telemetry to show; setting it as type throws that away.
- **Gallery / catalog** — right for `/resources` over 45 documents, wrong for the home route.
- **Split stage** — the prior showcase plan already rejected it for a whole page: right for one act,
  too narrow for six.
- **Rhythmic cutlist** — cuts read as energy, and the energy answer is "calm almost everywhere".

**What the grammar forbids here, and what that costs.** Live surface bans `scrub`, `kinetic`,
`spotlight`, marketing chrome, full-bleed photography and a hero claim over footage. That rules out
the four-plane photographic hero drawn from the reference video. It moves to `/products` and
`/applications`, which stay in the showcase register on the existing system.

## Signature move: the budget you can spend

Scroll allocates the control loop's cycle budget across its real stages, and the headroom left for
firmware computes live from the site's own published constants:

```
period  = CLOCK_HZ / (rate_khz * 1000)      CLOCK_HZ = 50_000_000
budget  = period - HW_FIXED_CYCLES          HW_FIXED_CYCLES = 300
```

10 kHz leaves 4,700 cycles (94% free); 100 kHz leaves 200 (40% free). The reader watches the
headroom collapse as the rate climbs, and every figure on screen is arithmetic they can redo.

**Two figures that measure different things.** `period - HW_FIXED_CYCLES` is what the site's
control-loop page calls the **CPU budget**: cycles available to firmware inside one period, 4,700
of 5,000 at 10 kHz. The corpus's **82% CPU headroom** is what remains after the regulators and
diagnostics have actually run, sourced to the 12.5 MMAC/s integer budget at 10 kHz FOC. They are
not in conflict, and an earlier draft of this brief wrongly said the formula contradicted the
published figure. The page shows the budget, labels it "share of period", and leaves headroom to
the control-loop page that owns it.

## Feeling curve

| Act | Feeling | What causes it |
|---|---|---|
| The surface, already running | Curiosity | A loop in flight at 10 kHz, stages lit, headroom reading 94%. No title card |
| What each stage costs | Attention | Stage costs arrive one at a time against the period, in their real cycle figures |
| Spend it | **Recognition (peak)** | Scroll drives the rate from 10 kHz to 100 kHz; 4,700 cycles of headroom collapse to 200 and the stack goes from mostly firmware to mostly hardware |
| What that buys | Calm | The quietest act. Four domains, one line each, latency envelopes |
| How the figures were obtained | Trust | Evidence kinds against the numbers just shown, and what the site does not claim |
| Ask it something | Resolve | A real query field, not a button. The page ends in an input |

## The peak

> I scrolled the loop rate up and watched the CPU's spare cycles disappear, and I could check the
> arithmetic myself.

Lives in "Spend it". It gets the only pinned stage on the page and the largest scroll span. The act
before it is deliberately quiet: stage costs arrive with no motion beyond their entrance.

## Tell-someone sentence

It's the site where you scroll to spend a motor-control chip's cycle budget and watch what is left.

## Authored silence

"What each stage costs" carries no motion beyond entrance, by design, so the peak's movement lands
against stillness. Nothing on the page is an empty stage: the surface opens already running at
10 kHz, so the first frame has live state in it.

## Standing constraints

Pre-silicon. No invented numbers, no counter without a real figure behind it, every displayed figure
labelled with the kind of evidence that produced it. No visible em dashes, which the repo's own
route gate already enforces.
