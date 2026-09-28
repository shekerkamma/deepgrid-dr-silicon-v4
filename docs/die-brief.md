# BRIEF: DG32 die page, split stage

**Interviewed 2026-09-23.** Four questions asked and answered: scope, structure, the peak, and how
`/products` gets imagery. The other four carry forward verbatim from `builds/deepgrid-dr-silicon`,
which covered vibe, energy, aesthetic range and assets for this site and is still accurate.

Target: `/technology/die` in `shekerkamma/deepgrid-dr-silicon-v2`. Chosen because it is the thinnest
page on the site, 129 words over 1.5 viewport-heights, holding its strongest asset and nothing that
competes with it.

## The eight answers

1. **Vibe.** Measured, exact, quietly confident. A datasheet set in a well-edited technical journal.
   *(carried forward)*
2. **Journey.** Scroll walks the six functional block groups with the die held on screen: safety
   core, memory and boot, motor drive, sensing and math, connectivity, then bus, system and test.
3. **Energy.** Calm throughout, one held moment. *(carried forward)*
4. **The one moment.** Five of the six groups are configurable per SKU. One is closed until silicon
   test. Seeing which part cannot be touched is the argument for the architecture.
5. **Something no site does.** Scroll selects the region on the live 3D die, and the frozen one
   refuses to behave like the others.
6. **Distance from premium-minimal.** Editorial, restrained, dark copper-on-ink. *(carried forward)*
7. **One world or scenes.** Neither: one object held for the whole page while the argument advances
   beside it.
8. **Assets.** Real only, no key, no spend: the interactive 3D die and package, two architecture
   SVGs, die renders. `/products` reuses the existing package and architecture posters.

## Grammar: split stage

Two columns in tension for the whole page, resolved by a collapse. The tension is real and is the
page's argument: **configurable against frozen**. The die column carries the region under
discussion; the copy column carries what it is and why it exists. Neither is decorative, which is
the grammar's own test. The close collapses onto the safety core, which is the side that wins.

Why the other seven lost, mechanically rather than by taste:

- **Live surface** is retired. It was applied to the home route last week, banned the hero claim a
  visitor needs, and had to be pulled. See the retired row in FINGERPRINTS.md.
- **Continuous world** requires `data-sc-mode="worldflight"` with video legs that crossfade, and
  explicitly forbids pinned acts. This page's visual is a live WebGL canvas, not footage, and the
  scroll engine was removed from the repo when live surface was retired.
- **Chaptered editorial** forbids media above the fold and requires media to sit in its own column
  with a caption. The die has to be visible and held from the first screen or the page has no
  subject. It is also the grammar `deepgrid-showcase` already owns.
- **Filmic one-shot** wants `scrub`, which needs footage of a part that does not exist yet.
- **Typographic poster** throws away the one asset this page exists to show.
- **Gallery** is right for `/resources` over 45 documents, wrong for one object in six parts.
- **Rhythmic cutlist** reads as energy; the energy answer is calm.

## Signature move: the region under the reader's thumb

Scroll drives `selected` on the live `Silicon` canvas, so the die highlights the group being read
about. The move is the exception: when the reader reaches the safety core, the region does not
offer the configure affordance the other five carry, and the divider's label changes from
CONFIGURABLE to FROZEN UNTIL SILICON TEST.

**The die stays assembled.** Explosion driven by scroll is `deepgrid-platform`'s signature and the
earlier dr-silicon brief already declined it on those grounds. Only `selected` moves here.

## Fingerprint gate

Four rows in the registry. Required: 4 of 6 against each, individually.

| Against | grammar | nav | hero | act shape | close | signature | clears |
|---|---|---|---|---|---|---|---|
| deepgrid-dr-silicon | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6/6 |
| deepgrid-platform | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6/6 |
| deepgrid-showcase | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6/6 |
| dg32-home-live-surface (retired) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6/6 |

## Feeling curve

| Act | Feeling | What causes it |
|---|---|---|
| The split establishes | Orientation | Die on one side, the six groups named on the other, both readable at once |
| Safety core | Attention | The first region, and the one the page will return to |
| Memory and boot, motor drive | Accumulation | Real parts with real figures, arriving steadily |
| Sensing, connectivity | Steadiness | The quietest stretch, deliberately even |
| Bus, system and test | Completion | The last region closes the set: all six accounted for |
| The collapse | **Recognition (peak)** | Five regions recede and the safety core takes the full width. It is the one that was never configurable |

## The peak

> Five of the six blocks are yours to configure. The one that catches the fault is not, and that is
> the point.

Lives in the collapse. It gets the largest span and the only full-width moment on the page. The act
before it is deliberately even so the collapse lands against regularity.

## Tell-someone sentence

It's the site where you scroll through a chip's six regions and find the one they will not let you
change.

## Authored silence

The sensing and connectivity stretch carries no motion beyond region selection, by design, so the
collapse reads as a change of state rather than more of the same. No stage is ever empty: the die
is on screen from the first frame with the safety core already selected.

## Standing constraints

Pre-silicon. Every figure carries the evidence kind that produced it. No invented numbers, no
counter without a real figure. No visible em dashes. All 21 block members come from
`groupMembers` in `detail-content.ts`; none is written for this page.
