---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "DG32-LITE turns a silent CPU fault into a switched-off bridge, in hardware, without waiting for firmware"
destination: embed
aspect: 1920x1080
language: en
audience: "motor-drive engineers and technical buyers evaluating DG32"
length: 75s
angle: concept
voice: bm_george
---

## Intent

Pilot of the motion-graphics pipeline (HTML + GSAP rendered by HyperFrames) for the DG32 site's
films. The user asked to go ahead after seeing "Opus 5.5 Finally Solved Motion Graphics". Today the
DG32 films are narrated slide decks; this tests whether animated explainers read better. Subject:
the lockstep fault path, the site's central claim (Safety page, Products "Why a second core").

## Assets

- none: every visual is invented (diagrams of MAIN/CHECKER, comparator, latch, FAULT_N, bridge).

## Customizations

- Palette from the site's DESIGN.md: ink #101212 ground, surface #191d1b, paper #eeeae2 text,
  copper #d4a36e the one accent, hardware copper #bf7f3b, teal #2f9e8c ONLY for the safe state
  (bridge off). Georgia serif display, sans body.
- Narration: Kokoro bm_george (the site's narrator voice profile), 140-155 spoken wpm.

## Notes

- Evidence rules: every figure from the DG32-LITE Architecture Guide; 39 cycles is simulated and
  must be said so; pre-silicon; no certification claim; no competitor price.
- On-screen text must not recite the narration (the repo's narration echo gate).
- No music bed (music: none): a technical explainer; narration only.
