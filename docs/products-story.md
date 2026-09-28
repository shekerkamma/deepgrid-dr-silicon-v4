# Products story pack (story-architect, 2026-09-25)

The user, on the live page: "I do not think you have applied /story-architect ... looks like you
have not applied". Correct. The first pass rewrote four headings and moved one section; the page
stayed a datasheet: two tall spec cards with diagrams too small to read, a twelve-row table that
repeats them, a portfolio table and a choice. No tension, no proof beat, no visual of the one idea
the page exists to land. This pack replaces the Products rows of `docs/site-story.md`.

Source for every line below: `public/downloads/dg32-lite-architecture-guide.md` (What is DG32-LITE,
Architecture Overview, Key Data Flows, DG32-2DOM, Design Decisions) and `app/content.ts`, which
carries the same figures.

## 1. BLUF

DG32-LITE puts a hardware lockstep safety monitor, the motor-drive peripherals and the FOC math in
one 64-pin chip; DG32-2DOM is the same chip with an attention engine added on its own clock, so a
board built for one takes the other.

## 2. Audience decision

A drive engineer or buyer decides which part to evaluate, and whether it fits their loop rate.

## 3. Tension

A silent CPU fault can destroy a power bridge. Software self-test runs periodically and cannot see a
fault between runs. Hardware lockstep has lived in automotive MCUs (AURIX, S32K, Hercules), not in
the entry-level motor-control tier. (Guide: What is DG32-LITE; Design Decisions.) No price claim.

## 4. Argument arc

1. Answer: one footprint, two chips.
2. Tension: self-test is blind between runs; lockstep checks every committed store.
3. Proof: the fault path, five steps, ending with the bridge off in hardware.
4. Proof: what is in the chip. Six block groups on one clock; 2DOM adds a seventh on its own.
5. Implication: the loop runs in hardware, so its cost is fixed (~300 cycles) and the CPU budget
   at each loop rate is known.
6. Context: DG32 is SKU-4 of a ten-chip mature-node portfolio.
7. Action: which chip to start on, and where to go next.

## 5. Section spine

| # | Heading (assertion) | Role | Evidence | Visual treatment | Takeaway |
|---|---|---|---|---|---|
| 1 | One footprint, two chips | Answer | Guide: What is DG32-LITE; datasheet pinout | Head + three figures: 2 cores, ~300 cycles, 44 shared pins | Same board, two capabilities |
| 2 | Software self-test cannot see a fault between runs. Lockstep checks every store. | Tension | Design Decisions: "Two cores and a comparator" | Two-column contrast, self-test vs lockstep, four rows | Why a second core |
| 3 | (same section) A fault turns the bridge off without waiting for firmware | Proof | Key Data Flows: A CPU fault, 5 steps | Numbered five-step chain; the last step in Signal Teal (safe state, the one use DESIGN.md allows) | The claim is a hardware path, not a promise |
| 4 | Six block groups on one clock; DG32-2DOM adds a seventh on its own | Proof | Architecture Overview; DG32-2DOM | **Interactive chip map** (architecture-to-everything, Stage 3 pattern): LITE/2DOM toggle, click a block for what it does and why; in 2DOM view the six groups read "identical" and the engine domain lights up | Everything outside the engine is the same design |
| 4b | Full specifications, side by side | Reference | content.ts specs, familyCompare | Disclosure holding the comparison table; full diagrams one click away | For the reader who needs the datasheet |
| 5 | The loop runs in hardware, so its cost is fixed | Implication | Key Data Flows: FOC loop table | Four rows, one per loop rate, hardware share vs CPU budget (Hardware Copper for the hardware share, as DESIGN.md prescribes); links to /control for the interactive budget | Will it run my loop |
| 6 | Mature-node silicon, around the sub-10 nm core | Context | Annex v3, whitepaper | Existing ten-row table, each part linking to its card on /applications | DG32 is one of ten |
| 7 | Start on DG32-LITE; move to DG32-2DOM when the drive should watch its own motor | Action | Status lines | Two choice cards, then the actions: datasheet, architecture deck, discuss your application | The decision |

## 6. Evidence map

- Direct: every figure (two cycles behind, 39-cycle inject-to-latch, ~300 cycles, 50/114 MHz,
  44 signal pins, 64 KB/32 KB), each already on the site with its source.
- Fair synthesis: "a board built for one takes the other" (identical pinout, datasheet).
- Interpretation, kept soft: "watches the motor". The accelerometer conflict between the 2DOM
  guide and the playbook is still the owner's call, so no line says accelerometers are unneeded.

## 7. Content cuts

- The two spec cards as the page's centre: moved into the disclosure (4b). They were reference
  presented as story.
- Architecture diagram thumbnails at card width: unreadable at that size; now a full-size link
  from the map.
- The fixed ~300-cycle table duplicated from /control: replaced by a four-row summary that links
  there.

## 8. architecture-to-everything: what fits a website section

Its four outputs already exist for DG32, made from the same diagrams:
`public/downloads/dg32-{lite,2dom}-architecture.drawio` (Stage 1), the architecture guides and
`.pptx` decks (Stage 2), shown in /resources with their films. Stage 4 (NotebookLM Q&A) is what Ask
DeepGrid already does on the site. The one missing output is Stage 3, the interactive diagram with
clickable nodes, and that is what Products lacked. It is built natively in React from the guide's
six block groups (`blocks` in content.ts), not as a self-contained HTML embed, so it uses the site's
tokens, passes the class and route gates, and works with the keyboard and reduced motion. The
/technology page keeps its 3D die; the Products map is 2D and is about the difference between the
two chips.

## 9. Quality gate

- Each section has a reason: yes, one beat each.
- Story readable without the sources: yes, tension and fault path are stated in plain words.
- Examples specific: the five-step fault path and the loop table are the guide's own.
- Clear decision: the close.
- Unsupported claims, internal terms: none added; no price claim; no competitor comparison beyond
  the guide's naming of automotive lockstep MCUs.
