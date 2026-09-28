# Grill: visual assets, aesthetics and cross-references, whole site (2026-09-24)

User: use scroll-craft, web-design-guidelines and impeccable on visual assets and aesthetics, grill to
review and analyse, then deploy; take the latest from GitHub; focus on cross-references across all
sections. Self-answered, on the user's standing instruction ("self answer all the questions") and the
recorded preference to apply design skills with judgment on an existing site rather than run their
full interviews. Baseline: `d712098` (owner's PR #1), built and captured full-page at 1440 and 390 px
on all 14 routes.

## Kept as the owner's decisions (PR #1)

Card images removed from /applications cards; section eyebrow tags removed; count-up animation
removed; `visual-refinement.css` layer; simpler Ask placeholder. Its 16 off-ramp font sizes are the
owner's recent choices and are left as they are.

## Findings and decisions

**V1. /procurement "Executive procurement scorecard" prices DG32 against competitors and guarantees
outcomes.** "$2.60-$3.10 target" against "$0.80-$11.40 (STM32G0 / TI Hercules)", "80% cost reduction",
"100% compliant with Make-II", "Guaranteed domestic supply", "Guaranteed fail-safe with zero software
overhead". None of these appears in any shipped source or the whitepaper; they exist only in
`app/detail-content.ts`. The not-claimed list rendered on the same page says "No price or cost claims
against any competitor". Decision: remove the scorecard section. The sourced STM32G0 comparison, the
leads/gaps lists and the roadmap stay.

**V2. Ask DeepGrid opens on "Sovereign Supply Chain Immunity: The Three-Factory & 100% Domestic
Architecture", claiming "complete immunity".** Two of the three factories it names are SkyWater (USA)
and IHP (Germany). Decision: correct the wording at the source data (title, lead, graph edge label)
to what the three-factory documents say: sequencing across three foundries in three countries, with
SCL Mohali as the Indian one. No "100% domestic", no "complete immunity".

**V2b. Ask's "DG32 vs. STM32G0" answer priced DG32 against the G0 and misquoted the fault path.** "$3.10",
"$6.50-$9.00" drive BOMs, "$3.50+ per inverter", "<40 ns" shutoff (the checked figure is 39 cycles,
simulated), "guaranteed sovereign supply", cited to an Annex "Section 4: Competitive Benchmarks" that
does not exist. Decision: rewrite from the DG32-LITE Architecture Guide ("Position against the
incumbent", "Safety core"), cite the guide, and point its related links at /procurement and the
control loop. The citation card now labels a non-PDF source "Download guide", not "Download PDF". The
suggestion chip becomes "Guide · DG32 vs STM32G0".

**V1b. Six links and three dead data blocks still pointed at the removed scorecard.** Link labels in
the Ask data now read "Where DG32 leads, and where it does not" -> /procurement. `executivePillars`,
`platformSections` and `productEssence` were rendered by no page and carried cost claims ("Saves
$3.70-$8.30 per drive inverter board") cited to whitepaper sections that do not exist under those
titles (§5.2 is "Who actually makes the production batch"): deleted.

**V2c. Ask's "100% SPEC-VERIFIED" badge.** This pass found Ask citations naming sections the documents
do not contain, so the badge claims something untrue today. Decision: "SOURCES CITED", which is.

**Open, not fixed in this pass: Ask citation audit.** At least one more Ask citation names a section
the document does not have under that title (multi-agent-engine: whitepaper "Section 5.3: Sovereign
Silicon Moats & Unit Economics"; §5.3 is "The boundary we would rather state than be caught on").
Twenty citations need checking against each document's real table of contents, ideally with a build
gate that fails on a section title the source does not carry.

**V3. The sideways roadmap rail (/procurement, /company) pins with its heading off-screen, cards half
empty and the lower half of the viewport blank.** It reserves 260vh to move four short cards, forces
each card to 320-440 px, and its comment promises a "held heading" the markup cannot hold (the
heading is outside the sticky stage). Decision: cards take their content height, the scroll room drops
to 200vh, and the pinned stage sits in the middle of the viewport rather than under the nav, so the
pin reads as a deliberate stage. The comment is corrected to say what the device does.

**V4. /contact "NO SIGN-IN" badge floats to the page's top-left corner, over the logo.** It is styled
to sit on a card image, and this card has none and no positioning context. Decision: in a card header
the badge sits in flow, beside the tag.

**V5. Two images without width and height** (`app-card.tsx`, `council-view.tsx`), which lets the
layout jump as they load (web-design-guidelines, CLS). Decision on inspection: false positive. Both images already carry `width` and `height`, on lines after
the `<img` tag; the guidelines script only reads the tag's own line. No change.

**V6. /technology/safety band that reads as empty in a full-page capture.** Measured by scrolling: the
fault trace pins at 600 px and advances through all five steps by 2,600 px, then holds the last step
for about one viewport. That hold is an authored resolve, not dead scroll. Decision: keep.

**V7. /applications is about 22 viewport-heights**, against scroll-craft's 8-14 for a landing page.
Decision: keep. It is a reference page whose storyboard requires all thirty tasks visible, and the
family index at the top jumps to each block. Length is the cost of completeness here, stated.

**V8. About 600 design-system drift findings** (colours and font sizes off DESIGN.md's scale, almost
all in the older `dr.css` and `ux.css`). Decision: out of scope for this pass; DESIGN.md already names
the drift as the system's one real defect. The two "border-accent-on-rounded" findings are the
documented 3 px top border on the tab bars: false positives.

**V9. Cross-references.** Decision: after the fixes, re-run the declared-link gate, re-check that every
`#chip-` link resolves, and check that no section still contradicts another: the scorecard (V1) and
the Ask answer (V2) were the two cross-section contradictions this pass found.
