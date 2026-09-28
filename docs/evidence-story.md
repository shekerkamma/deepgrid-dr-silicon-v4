# Story pack: /evidence

User, 2026-09-24: "this page also has similar issues: there is no storyboard at all, the video
spotlight does not make sense with screenshot images."

What was there: five cards, each a full-width white deck slide with a play button over it, a
coloured badge covering the slide's own title, a one-line definition and an examples line; then a
16-row table of figures, a "not claimed" box and a "withheld" box, none of it connected. The table
is the substance and sat at the bottom, detached from the definitions it applies.

**Spine:** the site's own claim map (`app/claims.ts`, 16 figures, each located in a source document
and re-checked by `scripts/check-claims.mjs`), the evidence ladder and not-claimed list
(`app/detail-content.ts`), and the withheld claims. Films are the five existing slide segments,
already checked against their captions by `scripts/check-clips.mjs`.

## Revision, 2026-09-24: the portfolio

/applications now places ten chips. Nine of them carry claims (where they go, what they replace,
node, foundry, planned wafer run) that no beat here graded. New beat after the design constants:
**"The other nine chips rest on design documents and FPGA prototypes, not silicon"**, one row per
chip with its strongest evidence today and next step, both restated from the chip's Annex "Status
& node path" panel and read from the same record /applications uses, so the two pages cannot
disagree. The answer beat and the index say so; the not-claimed list gains "no silicon result for
any chip but DG32-LITE" and "no market size, price or revenue for the wider portfolio".

## BLUF

Nothing on this site has been measured on silicon yet, so every figure states what it rests on
instead, and three claims our own sources made were dropped because they failed that test.

## Audience decision

An investor or engineer should know, for any number on the site, how much weight it can bear
before first silicon, and trust that the team removes claims that fail verification.

## Arc and page spine

| # | Headline (assertion) | Evidence | Film |
|---|---|---|---|
| 1 | Nothing here is measured on silicon yet. Every figure says what it rests on instead. | not-claimed #1 (first silicon on the September 2026 shuttle, bring-up not started); counts per kind from the claim map | none |
| 2 | Three claims in our own sources failed verification. This site does not make them. | `withheld` (3) | none |
| 3 | Simulation shows the design behaves as intended before any silicon exists. | ladder: Simulated; the 6 Simulated figures | DG32-LITE architecture, slide 6 (lockstep, FAULT_N) |
| 4 | Post-route timing is checked on the laid-out design, which is still not silicon. | ladder: Post-route; its figure | DG32-2DOM architecture, slide 11 ("Those are layout results, not silicon") |
| 5 | Analytic figures are arithmetic on the architecture, and a bench measurement replaces them. | ladder: Analytic; its 2 figures | DG32-2DOM architecture, slide 10 |
| 6 | The power figure is a tool estimate, not a measurement. | ladder: Tool estimate; its figure | DG32-LITE datasheet, slide 7 |
| 7 | Electrical limits are process nominals until first-silicon characterisation replaces them. | ladder: Process nominal; its figure | DG32-LITE datasheet, slide 6 |
| 8 | Some figures are design decisions, not measurements of anything. | the 5 figures with no kind | none |
| 9 | What this site does not claim, and where to check what it does. | not-claimed list; links to the specification suite and Ask DeepGrid | none |

Each kind beat (3 to 7) states what that kind is, then lists the figures that rest on it (figure,
what it measures, source document), then the film moment with its narration.

## Film presentation (applies to /applications too)

A film moment is part of the argument, not a spotlight. It renders as a compact row inside the beat:
a small slide frame with a play control, the narration quoted beside it, and deck, slide and time.
Pressing play opens the full player in place, with sound and captions. No full-width slide
screenshots at rest, and no badge over the slide.

## Content cuts

- Per-kind badge colours and the badge overlay (covered the slide title; a second accent system
  that DESIGN.md's One Accent Rule does not allow).
- The one-line "Examples" field per kind: replaced by the actual figures from the claim map.
- The detached 16-row table: its rows move into the beats they belong to.
