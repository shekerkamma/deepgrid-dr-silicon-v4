---
format: 1920x1080
duration: 89s
message: "DG32-LITE turns a silent CPU fault into a switched-off bridge, in hardware, without waiting for firmware"
arc: Hook → Problem → Mechanism → Proof (fault path) → Proof on silicon → Close
audience: motor-drive engineers and technical buyers evaluating DG32
mode: autonomous
music: none
---

## Frame 1 — One wrong value

- scene: A three-phase bridge drawn in hairlines; a PWM trace runs; one edge lands wrong and the bridge flares hardware-copper
- duration: 13.205s
- transition_in: cut
- status: animated
- voiceover: "A motor drive switches power electronics. If its processor computes one wrong value, the next PWM edge is wrong too, and a wrong edge can destroy the bridge."
- src: compositions/frames/01-wrong-value.html
- on_screen: "One wrong value" · labels PWM, BRIDGE

Hook. The stakes before the mechanism: a CPU datapath fault is not a crash, it is a wrong edge on power electronics.

## Frame 2 — The gap

- scene: A timeline; self-test ticks appear at intervals; the space between ticks shades as blind; a fault spark lands inside a gap
- duration: 10.091s
- transition_in: crossfade
- status: animated
- voiceover: "The usual defence is software self-test. It runs periodically, and between runs it sees nothing, so a fault can act inside that gap."
- src: compositions/frames/02-the-gap.html
- on_screen: "Blind between runs" · labels SELF-TEST, FAULT

Problem. The weakness is structural (time between checks), not a bug.

## Frame 3 — Two cores, one answer

- scene: MAIN block draws in; an identical CHECKER block draws beside it offset by two ticks; matching value chips stream from both into a comparator
- duration: 15.573s
- transition_in: crossfade
- status: animated
- voiceover: "DG32-LITE carries a second, identical core. CHECKER runs the same instructions two cycles behind MAIN, on mirrored inputs and bus responses. Every value MAIN commits, CHECKER must commit too, bit for bit."
- src: compositions/frames/03-two-cores.html
- on_screen: "Two cores, one answer" · labels MAIN, CHECKER · +2 CYCLES, COMPARATOR

Mechanism. The idea that makes the fault visible.

## Frame 4 — Mismatch to safe state

- scene: One MAIN chip turns hardware-copper (wrong); CHECKER's stays paper; comparator flags; latch closes; FAULT_N line drops; gate driver disables; bridge dims to teal "off"; a cycle counter stops at 39 with "simulated"
- duration: 26.859s
- transition_in: cut
- status: animated
- voiceover: "Now a datapath fault changes one store. CHECKER commits the right value, and the comparator flags the mismatch on that store, not at the next self-test. A latch holds the first cause. FAULT N goes low, and the gate driver switches the bridge off. In simulation, injection to latch takes thirty-nine cycles. No firmware is in that path."
- src: compositions/frames/04-fault-path.html
- on_screen: "Mismatch → safe state" · labels COMPARATOR, FAULT LATCH, FAULT_N, GATE DRIVER, BRIDGE OFF, "39 cycles · simulated"

Proof. The peak: the whole path animates left to right; teal appears for the first time, on the bridge.

## Frame 5 — Proven by firing it

- scene: A locked register icon unlocks; a pulse travels the same path from Frame 4 in miniature; latch reads "cause 001"
- duration: 12.416s
- transition_in: crossfade
- status: animated
- voiceover: "Firmware can still prove the path works. A locked injection register fires it on purpose, which is the only way to test it on real silicon."
- src: compositions/frames/05-inject.html
- on_screen: "Proven by firing it" · labels FAULT CSR, INJECT, CAUSE 001

Proof on silicon: how the claim becomes a bench measurement.

## Frame 6 — Safety in the core

- scene: Everything clears to the site's tagline; a small line of status beneath
- duration: 10.688s
- transition_in: crossfade
- status: animated
- voiceover: "Safety in the core. DG32-LITE goes to first silicon on the September 2026 shuttle; until then, every figure here comes from simulation."
- src: compositions/frames/06-close.html
- on_screen: "Safety in the core." "Control in silicon." · micro "PRE-SILICON · DG32-LITE ARCHITECTURE GUIDE"

Close: the site's own sign-off, and the evidence caveat.
