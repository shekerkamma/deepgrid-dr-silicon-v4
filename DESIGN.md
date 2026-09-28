---
name: DG32 Silicon Site
description: Pre-silicon technical reference for a lockstep RISC-V motor-control chip, set as a dark editorial datasheet. v3 (2026-09-27) sets it in self-hosted Newsreader, Inter and JetBrains Mono.
colors:
  ink: "#101212"
  surface: "#191d1b"
  muted: "#292d29"
  accent-surface: "#343d31"
  border: "#3d453b"
  rule: "#48544066"
  paper: "#eeeae2"
  paper-bright: "#f4f0e7"
  ink-2: "#a7b09f"
  muted-foreground: "#a0a59b"
  copper: "#d4a36e"
  copper-ring: "#d9ac78"
  hardware: "#bf7f3b"
  cpu: "#2f9e8c"
  overlay-shadow: "rgb(0 0 0 / .45)"
typography:
  display:
    fontFamily: "'Newsreader Variable', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.4rem, 3.8vw, 3.5rem)"
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Newsreader Variable', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.9rem, 2.6vw, 2.45rem)"
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Newsreader Variable', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.5rem, 2.1vw, 1.95rem)"
    lineHeight: 1.22
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Inter Variable', system-ui, sans-serif"
    fontSize: "0.9375rem"
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    letterSpacing: "0.08em"
elevation:
  overlay: "0 24px 48px rgb(0 0 0 / .45)"
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  lg: "6px"
  xl: "8px"
  pill: "9999px"
  circle: "50%"
spacing:
  measure: "64ch"
components:
  button-primary:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  text-link:
    textColor: "{colors.copper}"
    typography: "{typography.body}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "16px 20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "11px 13px"
    height: "44px"
---

# Design System: DG32 Silicon Site

<!-- Extracted from the implementation on 2026-09-24 by /impeccable document (scan mode).
     Token values are read from app/globals.css and app/dr.css; the drift figures in Colors are
     measured, not estimated. Descriptive language is self-authored rather than interviewed, on the
     owner's standing instruction to adapt design skills rather than run their interviews. -->

## Overview

**Creative North Star: "The Datasheet That Argues"**

This is a semiconductor reference document that happens to be a website. It reads like a well set
technical journal: serif headings that state a finding, sans-serif body text at a comfortable
measure, and monospace for anything a machine produced. The page is dark because a datasheet full
of oscilloscope traces, die renders and signal diagrams is easier to read on ink than on paper, and
because the imagery it carries is photographic and dark.

The restraint is the argument. Every figure on the site carries the kind of evidence behind it, and
claims that failed verification are printed with the reason they were withdrawn. A visual system
that shouted would undercut that. So: one accent colour, used sparingly; rules and type rather than
cards and shadows; no gradients on text, no glows, no stripes down the side of a panel. Where the
site wants emphasis it uses size, weight and space.

Motion is functional. Content reveals once on entry and then hands transitions back to the element,
so hover and press stay immediate. One page holds a scroll-driven fault trace and another a
scroll-selected die; both resolve to a complete resting state, because anything that only exists
mid-animation is invisible to a PDF export, a screenshot and a reader with reduced motion on.

**Key Characteristics:**
- Dark ink ground, warm copper accent, one cool teal reserved for the safe state
- Serif display over sans body over monospace labels: three voices, never four
- Rules and type carry structure; shadows appear only on overlays and on hover
- Evidence grade printed next to figures, not implied
- Reduced motion is a first-class path, not a fallback

## Colors

A warm copper accent on a cool near-black ground, with a single teal admitted only where the
hardware is in a safe state.

### Primary
- **Copper** (`#d4a36e`): the one accent. Section kickers, active tabs, links, the left edge of a
  data bar, the value a reader is meant to land on. A slightly lighter **Copper Ring**
  (`#d9ac78`) is the focus ring and the primary fill.
- **Hardware Copper** (`#bf7f3b`): deeper, used only for the hardware share of a cycle-budget bar,
  so hardware and CPU are distinguishable without a legend.

### Secondary
- **Signal Teal** (`#2f9e8c`): reserved. It marks the safe state, a held value and a passing gate.
  It is the only hue on the site that is not copper or neutral, and it earns that by never being
  decorative.

### Neutral
- **Ink** (`#101212`): the page ground. Cool, very slightly green.
- **Surface** (`#191d1b`): panels, inputs and any raised block.
- **Muted** (`#292d29`) and **Accent Surface** (`#343d31`): selection and hover grounds.
- **Border** (`#3d453b`): the visible edge on inputs and cards.
- **Rule** (`#48544066`): the hairline. Deliberately translucent, so it recedes on any ground.
- **Paper** (`#eeeae2`): body text. **Paper Bright** (`#f4f0e7`) for emphasis on a dark panel.
- **Ink 2** (`#a7b09f`) and **Muted Foreground** (`#a0a59b`): secondary text, captions and labels.

### Named Rules

**The One Accent Rule.** Copper is the only accent. A new state gets a new *shape*, weight or
position, not a new hue. Teal is the single exception and it means "safe", nothing else.

**The Named Colour Rule.** A colour used more than once is a token. As of this scan the codebase
holds **1,065 literal colour values against 1,209 token references, across 524 distinct literals**:
140 distinct near-blacks for only 293 uses, most appearing exactly once. That is drift, not a ramp.
Before adding a colour, check whether one of the fourteen above already means what you mean.

**The Alpha Is Not A Colour Rule.** `#d4a36e1f` is copper at 12%, not a separate colour. Express it
from the token (`color-mix`, or a documented alpha token), never as a new hex, so a change to copper
reaches every place copper is implied.

## Typography

**Display Font:** Newsreader Variable (`--font-display`), with Georgia and Times New Roman behind it
**Body Font:** Inter Variable (`--font-text`), with system-ui behind it
**Label / Mono Font:** JetBrains Mono Variable (`--font-mono`), with the platform monospace stack
behind it

**Character:** a journal pairing rather than a product one. The serif gives headings the authority
of a printed specification; the sans keeps long technical body text quiet and legible; the monospace
marks everything a machine emitted, which on this site is most of the numbers. All three faces are
self-hosted through `@fontsource-variable` (imported in `app/layout.tsx`, tokens in `app/v3.css`), so
no request leaves the site; the Georgia, system-ui and platform-mono fallbacks cover the swap.

### Hierarchy
- **Display** (serif, `clamp(2.4rem, 3.8vw, 3.5rem)`, line-height 1.05, tracking -0.035em): the
  page headline, once per route.
- **Headline** (serif, `clamp(1.9rem, 2.6vw, 2.45rem)`, 1.16, -0.025em): a section verdict.
- **Title** (serif, `clamp(1.5rem, 2.1vw, 1.95rem)`, 1.22, -0.02em): a block heading.
- **Card** (serif, 1.35rem, 1.28, -0.015em): the heading inside a panel.
- **Body** (sans, 0.9375rem, 1.65): running text, held to a 64ch measure.
- **Control** (sans, 0.875rem): buttons, tabs and form controls.
- **Label** (mono, 0.75rem, tracking 0.08em, uppercase): kickers, units, table headers, evidence
  grades and anything a tool produced.

### Named Rules

**The Verdict Heading Rule.** A heading states the finding, not the topic. "Both domains close
post-route with positive slack" rather than "Timing closure". A heading that ends in a question mark
has not been written yet.

**The Machine Voice Rule.** Monospace means a machine produced it: a measured value, a part number,
an evidence grade, a file name. Prose never sets itself in monospace for texture.

**The Joined Quantity Rule.** A number and its unit are joined by a non-breaking space
(`50&nbsp;MHz`, `300&nbsp;cycles`), so a wrap can never separate them. Tabular figures
(`font-variant-numeric: tabular-nums`) are on every table, metric and counter.

## Layout

A single centred column, `page-wrap`, capped at 1600px (`--wrap`) with one side gutter,
`--gutter: clamp(20px, 6vw, 96px)`, and body text capped at a 64ch measure regardless of viewport.
The header, menu bar, breadcrumbs, section tabs, page body, homepage and footer all start at the same
left edge: full-bleed bars pad to the 1600px column's edge plus the gutter, capped blocks pad by the
gutter inside it (`app/v3.css`, "gutter"). A new block takes the token, never its own percentage. Sections are separated by generous vertical space
and hairline rules rather than boxes.

The type scale is fluid between 1.5rem and 3.5rem via `clamp()`, so there is no heading breakpoint
to maintain. Component layout uses CSS grid with `minmax(0, 1fr)` tracks, collapsing to a single
column at 720–800px depending on the component. Tap targets are at least 24px in every state, and
controls that take a press are 44px.

The site is 14 routes with a sticky top tab bar carrying a page-progress hairline, and every route
ends with the same cross-reference block: sibling sections with a reason each, then the source
documents behind that page.

## Elevation & Depth

**Flat at rest, lifted only when something genuinely floats.** Most depth comes from tonal
layering, ink to surface to muted, and from hairline rules. Nothing on the page carries a shadow in
its resting state except true overlays.

There are 26 shadow declarations across 16 distinct values, all with a real offset and blur. They
fall into three roles, and the spread of values is loose rather than a designed scale: an elevation
pass could reduce 16 values to about four without changing how anything reads.

Zero-offset coloured halos were removed: on all four rules that had one, the state was already
carried by a copper border and a tinted background, so the glow decorated a signal that was already
there.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 12px 32px rgba(0,0,0,0.45)`, 8 uses): modals, drawers and the deck
  viewer. The most reused value on the site and the closest thing it has to a standard.
- **Deep overlay** (`0 16px 48px rgba(0,0,0,0.4)`, 3 uses; `0 24px 64px rgba(0,0,0,0.8)`): the
  largest floating surfaces, where the page behind needs to recede.
- **Hover lift** (`0 4px 20px #00000033`, and one copper-tinted `0 6px 18px rgba(212,163,110,.22)`):
  the only shadows that appear in response to a pointer, on interactive cards.

### Named Rules

**The No Halo Rule.** `box-shadow: 0 0 Npx <colour>` is banned and gated in the build
(`scripts/check-css-bans.mjs`). A shadow has an offset, or it is not a shadow. An inset hairline
(`inset 0 0 0 1px`) is a ring and is allowed.

**The Resting Flatness Rule.** A surface that is part of the page carries no shadow. A shadow means
the element is above the page (a modal, a drawer) or is responding to a pointer. There is no
ambient elevation.

**The No Side Tab Rule.** A thick coloured border on one edge of a panel is banned. State is carried
by the whole frame, the background tint and the label, never by a stripe.

## Shapes

Small radii. The scale as built is 2px, 3px and 4px doing most of the work (39, 37 and 18 uses),
with 6px and 8px on the largest panels, 50% on dots and status pips, and a 9999px pill used twice.
Three neighbouring steps under 5px is one more than this system needs: 3px and 4px are not
distinguishable at a glance, and collapsing them is the one shape change worth making.

Several structural elements are deliberately square, including the architecture and library tab
bars, whose active state is a 3px top border on a 0px-radius button.

Borders are 1px and translucent by default. The form language is rectangular and quiet: this is a
document, and a document does not have pill-shaped edges.

## Components

### Buttons
- **Shape:** slightly softened corners (4px), or square where the control is structural.
- **Primary:** copper fill, ink text, 10px 16px padding, minimum 44px tall.
- **Text link:** copper text with an underline offset 3px, no background, arrow glyph for an
  outbound or cross-section link.
- **Hover / Focus:** enumerated transitions on colour, background, border, opacity, shadow and
  transform at 0.15s. `transition: all` is banned and gated in the build. Focus is a 2px copper ring
  at 2–4px offset, never removed. It is written two ways across the codebase, `var(--ring)` (4 uses)
  and `var(--copper)` (5, one of them `!important`); they differ by a hair (`#d9ac78` against
  `#d4a36e`). Prefer `var(--ring)`, which exists for exactly this.

### Chips
- **Style:** 4px radius, surface background, translucent border, mono label at 0.75rem.
- **State:** the selected chip takes a copper border and copper text; the ground shifts one tonal
  step. No stripe, no glow.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** surface (`#191d1b`) on the ink ground.
- **Shadow Strategy:** none. See Elevation & Depth.
- **Border:** 1px translucent rule, or a solid border where the card is interactive.
- **Internal Padding:** 16–20px.

### Inputs / Fields
- **Style:** surface ground, 1px border, 6px radius, 11px 13px padding, 44px minimum height.
- **Focus:** a 2px copper ring at 2px offset.
- **Error:** a warm red-sand border (`#e8a08a`) with the message rendered directly beneath the
  field, wired through `aria-invalid` and `aria-describedby`. Focus moves to the first invalid field
  on submit.

### Navigation
- Sticky top tab bar across all routes, mono labels, a page-progress hairline along its top edge, and
  the active route marked by a copper top border on a square button. Below 800px the bar collapses
  into a sheet behind a labelled menu button.

### The Cross-Reference Block (signature)
Every route ends with the same structure: a hairline-separated list of sibling sections, each with a
one-line reason a reader would actually act on, then the source documents behind that page with
their page counts. It is typeset as part of the document, with no cards and no accent bar, so it
reads as the end of the argument rather than as a widget.

### Established-brand homepage refinement (2026-09-28)
The engineering-facing homepage retains the ink/copper palette, Newsreader display, Inter body,
and JetBrains Mono technical labels, original wordmark, and interactive model. Copy leads on
phones; the model sits to the right on desktop. The reading order is product, mechanism, graded
evidence, then evaluation. Keep pre-silicon status explicit: 39-cycle fault response and approximately
100 kHz closed current-loop rate are simulated; 82% diagnostic headroom at 10 kHz is analytic.
Enquiry actions lead to Contact. The existing fault trace remains skippable.

Implemented in `app/home-refined.tsx` and `app/home-refined.css`, selected by `app/page.tsx`.
The completed refinement received PASS across all five contract sections in review.
## Do's and Don'ts

### Do:
- **Do** state a finding in a heading, and print the evidence grade next to a figure.
- **Do** use one of the fourteen named colours. A colour used twice is a token.
- **Do** join a number to its unit with a non-breaking space, and set numerals as tabular figures.
- **Do** enumerate the properties a transition animates.
- **Do** give every scroll-driven surface a complete resting state, and a reduced-motion path.
- **Do** keep body text inside the 64ch measure.

### Don't:
- **Don't** add a second accent hue. Teal means safe and nothing else.
- **Don't** use `transition: all`, a zero-offset coloured halo, or a coloured stripe down one edge
  of a panel. All three are gated in the build.
- **Don't** write a new near-black. There are already 140 of them and that is the system's one real
  defect.
- **Don't** set prose in monospace, or a machine-produced value in the serif.
- **Don't** put a number on the page that no source document carries.
