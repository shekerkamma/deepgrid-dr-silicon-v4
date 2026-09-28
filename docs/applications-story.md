# Story pack: /applications

Supersedes the catalogue grammar in `applications-brief.md`. That brief answered "what are the
options" with 30 identical labels and a stats plate. The page never said what these applications
are, who needs them, or why they fit on this chip. User, 2026-09-24: "there is no storyboard at all,
what are these applications, the entire context should have been captured along with videos, not a
video spotlight."

**Spine (Rule 0, fixed order):** the playbook `public/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf`
(12 pages; section numbers below are its own). The films sit inside the beats they explain. There is
no separate player. Every film moment below was checked against its `.vtt` caption file.

## Revision, 2026-09-24: where the chip goes

User: "what exactly are these applications", pointing at the playbook and the SKU Architecture
Compendium (Technical Annex v3). The first build told what the chip can *compute* and never where it
is *used*. The Annex answers that: DG32-LITE is **SKU-4, the Safety MCU** (sheet 5). It replaces
"Microchip/Renesas functional-safety MCU sockets — 3–10M/yr India, $4–12 ASP", in "EV BMS and
motor-safety supervision, braking/steering controllers, robot joints — plus the FOC brain beside
SKU-1 and flight-critical redundancy feeding the D100 roadmap."

New beat 1b, straight after the answer: **the five sockets**, each with what the chip does there and
the playbook tasks that fit it. The socket-to-task pairing is our synthesis; neither document makes
it, and the page says so. Three limits hold: ASIL-D is a *path* (no certification is claimed);
braking and steering need CAN-FD, which is on the roadmap and not on this part; the Annex's SKU-4
specifications (200 MHz, ECC, 1 MB flash) describe the product line, not DG32-LITE, so only its
sockets are used. MCEME ₹1.01 Cr is withheld (failed verification) and never appears.

## Revision 2, 2026-09-24: the whole portfolio, not SKU-4 alone

User: "there are several SKUs, why you are choosing SKU 4 alone". Revision 1 answered where *DG32*
goes. The site covers nine SKUs plus D100 and the SDV platform, so /applications now opens on where
DeepGrid's silicon goes, organised by where it ends up (a reader thinks in machines and markets, not
SKU numbers), and the DG32 story becomes the deep dive under "Motors and drives".

Sources, in order of authority: the Technical Annex v3 PDF (primary; the only source for the
"replaces / socket" text of SKU-3, 5, 6, 8, 9), its markdown matrix, the mature-silicon architecture
section 7, and the D100 and SDV markdown. No graphify pass was needed: the text extracts cleanly and
the existing graph holds two SKU nodes.

Five application areas: motors and drives (SKU-1, SKU-4 + 2DOM); vehicles (SKU-9, SKU-4, SKU-7,
SKU-5); defence, avionics and drones (D100, SKU-3, SKU-8, SKU-7, SKU-4); grid and metering (SKU-2);
on every board (SKU-5, SKU-6, SKU-8).

Kept out, per the site's own rules: anchor customers (section 7 names one per chip; the only one
verified, MCEME, failed), market sizes and ASPs (the Annex flags them as internal estimates), and
specifications for any part without silicon. Only DG32-LITE is on first silicon; the rest are
architecture sheets, and the page says so.

## 1. BLUF

The motor controller a drive already has can watch its own motor: thirty condition-monitoring tasks
fit in the cycles DG32-LITE has left over after control, with no second processor, and the real limit
is the sensors bolted to the motor, not the chip.

## 2. Audience decision

- **OEM engineering buyer:** find their failure mode among the thirty, see what sensor it needs, and
  bring the sample rate to a conversation.
- **Investor:** believe that on-drive diagnostics is a feature of this one part rather than a
  second chip, and that the team says plainly what is derived and what is measured.

## 3. Tension

A motor drive is a safety system before it is a diagnostic one: a wrong PWM edge can short a bridge
leg. Diagnostics on the same core is only acceptable if it can never disturb control and never holds
the trip. The usual answer is a second processor on the board. The playbook's answer is that the
control loop's cost is fixed in hardware, so the remainder is a known budget, and the right
algorithms for these tasks are cheap enough to live in it.

## 4. Argument arc

| # | Arc role | Beat |
|---|---|---|
| 1 | Answer | What these applications are: thirty tasks, four families, one chip |
| 2 | Context | Why the drive's own controller is the hard place to put them |
| 3 | Proof | The budget: control costs a fixed amount, and what it leaves is known |
| 4 | Proof | The method: on a scalar core, conditioning beats model size |
| 5–8 | Proof | The four families, every task as problem, signal, what runs |
| 9 | Honest limit | Compute is not the constraint. The analog front end is |
| 10 | Implication | Where DG32-2DOM's attention engine comes in |
| 11 | Trust | What every figure rests on, and who holds the trip |
| 12 | Action | Bring your failure mode and sample rate |

## 5. Page spine

Headlines are assertions. "Film" is an inline clip with its narration line as the caption,
played from its start time and stopping at its end. "Data" is what the beat shows from the 30-task
table (`app/diagnostic-tasks.ts`, after the four corrupted rows are fixed from the PDF).

**1. "Thirty diagnostic tasks run on the motor controller the drive already has."**
Role: executive summary. Evidence: PDF cover (30 use cases, 19 model types, all ≥79 Hz, most >1 kHz,
accelerator: none); p3 (24 of 30 above 1 kHz; worst case 10.3 ms and 20 KB). Film: none; the answer
comes first, in words. Data: the four families as an index with counts (rotating 8, electrical 8,
control/motion 8, slower-rate 6), each linking to its beat. Takeaway: no second chip, and here is
the whole set.

**2. "In a motor drive, control comes first. Diagnostics has to fit around it, never in its way."**
Role: context and tension. Evidence: PDF p12, what is not claimed (the classifier is advisory; a
lockstepped deterministic monitor holds the trip limits). Film: `dg32-lite-architecture` 01:01–01:31:
"A motor drive switches power transistors thousands of times a second. If the CPU silently computes
a wrong value, it writes a wrong PWM edge, and a wrong edge can short a bridge leg." Data: none.
Takeaway: the constraint every later number respects.

**3. "Control costs a fixed amount of hardware time, so the rest is a known budget."**
Role: proof, playbook §01. Evidence: p3, the four numbers: 12.5 MMAC/s scalar throughput; 16.5 KB
model budget (29.5 KB with the runtime in mask ROM); 82% of cycles free assuming a 10 kHz FOC loop;
CORDIC already in the loop. MAC budget per inference = 12.5×10⁶ ÷ rate. Film:
`dg32-lite-architecture` 04:00–04:50 ("Here is what one loop costs… about three hundred cycles, and
it is the same at every loop rate… At ten kilohertz there are about forty-seven hundred cycles
left"). Caption the film's figure and the playbook's separately: the film counts cycles left after
the hardware part of one loop; the playbook's 82% is what remains after a full 10 kHz FOC loop. Do
not equate them. Data: none. Takeaway: the budget is known before any model is chosen.

**4. "On this core, trees and linear models beat neural networks, and conditioning the signal matters
more than the model."**
Role: proof, playbook §02–§04, compressed. Evidence: p4 (a 100-tree forest at depth 8 is about 800
comparisons, 0.06 ms; CWRU random forest 95.6% on five features; 42-paper review, SVM 95–100%
against deep methods 97–100%); p6 (demodulated features at the fault frequency outrank raw moments
4–5×, 225.9 against 51.8; kurtosis is non-monotonic, so trend it with RMS and never alarm on it
alone). Film: none. Data: the model families actually used across the thirty tasks, with the p5
cycle cost of each. Takeaway: the cheap models are the right models here, not a compromise.

**5–8. The four families.** One beat each, in playbook order: §05 rotating machinery, §06 electrical
and power, §07 control, motion and sensing, §08 slower-rate and sequence. Each beat opens with one
sourced sentence on the family, then lists its tasks as rows: **Problem** (what it detects) →
**Signal** (sensing, then features) → **What runs** (model · latency · max rate · memory).
Tasks that do not clear 1 kHz are marked where they sit, not averaged away: bearing fault 890 Hz,
gearbox 480 Hz, arc fault 840 Hz, RUL regression 970 Hz, GRU forecasting 270 Hz, raw-waveform CNN
79 Hz (six, matching p3).

- 5 Rotating, headline "Bearings are the most common motor failure, and the accelerometer catches
  them." Evidence p11: bearings are 44% of motor failures and the weakest class for current-only
  sensing. Standards line: ISO 20816 (severity zones), ISO 13373.
- 6 Electrical, headline "The phase current the drive already samples carries rotor and stator
  faults, if the converter can resolve them." Evidence p11: Goertzel at the predicted sideband
  frequencies, because the FFT that would resolve them is 8 MB. Standards line: ISO 20958. Forward
  link to beat 9.
- 7 Control and motion, headline "Most of these run on sensors the drive already has." Evidence
  p11: sensorless observation, plausibility checking, regime identification, anomaly scoring and duty
  tracking need no added parts. No standards line: the playbook names none.
- 8 Slower-rate, headline "Trend and forecasting tasks read hours of history, so they can run
  slower." Evidence p10: RUL regression takes 64 hourly feature snapshots; three of the six tasks
  below 1 kHz are in this family (970, 270 and 79 Hz). No standards line.

Film for 5–8: none. The families are shown by their data. Do not reuse beat 10's clip here.

**9. "Compute is not the limit. The sensors are."**
Role: honest limit, playbook §09. Evidence p11: 8 bits gives 42 dB of dynamic range, while rotor-bar
sidebands sit at −40 to −60 dBc, so the current-based tasks need analog suppression and gain or a
12–16-bit converter; sidebands 2·s·f₁ apart need 30–100 s records at stable load. Tier 1: one
accelerometer (≥5 kHz usable bandwidth, stud-mounted per ISO 13373-1). Tier 2: three-phase current
and voltage; the part has one differential channel today. What works today unchanged. Film:
`dg32-lite-architecture` 06:13–06:40 (the honest comparison: "The G0 leads clearly on its twelve-bit
multi-channel ADC…"). Data: tag each task as works-today, needs tier 1, or needs tier 2, only where
p11 states it; leave untagged where it does not. Takeaway: what to put on the motor before choosing
a task.

**10. "DG32-2DOM adds an attention engine on its own clock, for the models the scalar core runs
slowly."**
Role: implication and upgrade path. Evidence p3: the attention kernel at 64/32/32 is 0.26 MMAC,
about 21 ms in software, and none of the thirty needs it. Film: `dg32-2dom-architecture` 00:00–00:18
("…adds an INT8 attention engine on its own clock, so a drive can watch its own motor for faults"),
then 05:16–05:38 ("What is it for? Catching a wearing bearing… because the motor controller watches
its own motor. The STM32G0 can only run that kind of model in software…"). Takeaway: LITE covers the
thirty; 2DOM is for the next class of model.

**11. "Every figure here is derived, not measured, and the classifier never holds the trip."**
Role: trust, playbook §10. Evidence p12: every latency, memory and rate is calculated at 4 cycles per
int8 MAC against 82% of a 50 MHz core, back-solved from design documents; realistic accuracy on
unseen bearings is 65–80% (one classifier fell from 85.8% to 69.5% on a leakage-free split); LITE
has not completed place-and-route; no workload compiled or measured. Film: `dg32-lite-architecture`
02:47–02:57 ("On a mismatch, the first cause is latched and FAULT_N goes low. Route that pin to the
gate-driver enable, and the bridge turns off in hardware, without waiting for firmware."), then
07:33–07:42 ("None of this has yet been measured on silicon…"). Takeaway: the numbers are honest
estimates and the safety path does not depend on them.

**12. "Bring a failure mode and a sample rate. We will tell you whether it fits."**
Role: action. Links: Ask DeepGrid, the playbook PDF, the control-headroom page, the evidence page.

## 6. Evidence map

- **Direct evidence:** every number above, cited to a PDF page or a film timestamp; the 30 task
  rows (after the fix).
- **Fair synthesis:** "the drive's own controller watches its motor" (films plus PDF cover);
  grouping each task as problem, signal, what runs (the PDF's own columns, reordered).
- **Interpretation (keep out of headlines):** any business outcome, such as downtime avoided or
  warranty cost. The sources contain none.

## 7. Content cuts

- The four domain stock photographs (truck, robotics, logistics, defence). They illustrate markets,
  not these tasks, and every card repeated its domain's photo.
- `diagnosticDomains` fields in `app/detail-content.ts` used on this page. `standards` shows
  **AEC-Q100** on every motion task, while the lite film says no certification is claimed; "CWRU
  Audited · IEEE PHM" and "IEC 60034" appear in no source. `businessBenefit` ("weeks before motor
  seizure", "profitable predictive maintenance SLAs") is unsourced. `examples` reads 890 Hz, a
  maximum inference rate, as a bearing fault frequency.
- The standing stats plate and "External processors required: 0" as the page's peak. The fact
  survives as a sentence in beat 1.
- The "Timing is not one quantity across the four domains" paragraph. The fixed data carries one
  latency and one rate per task, so it no longer describes the page.
- The `03 / APPLICATIONS` section tag.
- Page-footer text spliced into four task rows (`app/diagnostic-tasks.ts` lines 28, 36, 44, 50).

## 8. Rebuild instructions

1. Fix the four corrupted rows from PDF pages 7–10 (`pdftotext -layout`), then extend
   `scripts/check-usecases.mjs` to fail on `DEEPGRID SEMI` or `BASE VARIANT` in any field.
2. Rebuild `app/applications/page.tsx` as twelve beats in the order above. The headline of each beat
   is its `h2`; the PDF page or film is cited under it.
3. Inline films use the existing `app/evidence-clip.tsx` pattern: poster, play from start, stop at
   end, narration line as the caption, captions track on. Re-read each cue's end time from the
   `.vtt` at build; the ranges above are cue-aligned where checked, and 02:57 must be confirmed.
4. Families 5–8: one row per task. Desktop is a four-column row (problem, signal, what runs, rate);
   phone stacks them. Tabular numbers. Six below-1 kHz rates carry a quiet marker.
5. Keep all 30 tasks visible. A family index at beat 1 jumps to beats 5–8; no filter state.
6. Verify: `npm run build`, the repo's route verifier, desktop and 390 px screenshots, and a read of
   every film caption against its `.vtt`.

## Quality gate

- Each beat has a reason to exist: yes; 4 and 9 are the two a spec sheet cannot carry.
- Readable without the sources: yes; each beat states its point before its evidence.
- Specific examples: bearings 44%, 42 dB against −40 to −60 dBc, 800 comparisons in 0.06 ms.
- Clear next action: beat 12.
- Unsupported claims: none in this pack; the cuts list the ones on the current page. Timestamps
  appear only in this pack, never as visible page text.
