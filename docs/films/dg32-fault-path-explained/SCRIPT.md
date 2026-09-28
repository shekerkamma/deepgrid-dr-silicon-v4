# SCRIPT — dg32-fault-path-explained

**Voice:** bm_george (Kokoro, local)
**Voice settings:** speed 0.84 (target 140-155 spoken wpm)
**Voice direction:** Measured, informative, low register; an engineer explaining to engineers.

---

## Line 1 — One wrong value (Frame 1)

**Delivery:** steady; land the last clause.

    A motor drive switches power electronics. If its processor computes one wrong value, the next PWM edge is wrong too, and a wrong edge can destroy the bridge.

## Line 2 — The gap (Frame 2)

**Delivery:** steady; land the last clause.

    The usual defence is software self-test. It runs periodically, and between runs it sees nothing, so a fault can act inside that gap.

## Line 3 — Two cores, one answer (Frame 3)

**Delivery:** steady; land the last clause.

    DG32-LITE carries a second, identical core. CHECKER runs the same instructions two cycles behind MAIN, on mirrored inputs and bus responses. Every value MAIN commits, CHECKER must commit too, bit for bit.

## Line 4 — Mismatch to safe state (Frame 4)

**Delivery:** steady; land the last clause.

    Now a datapath fault changes one store. CHECKER commits the right value, and the comparator flags the mismatch on that store, not at the next self-test. A latch holds the first cause. FAULT N goes low, and the gate driver switches the bridge off. In simulation, injection to latch takes thirty-nine cycles. No firmware is in that path.

## Line 5 — Proven by firing it (Frame 5)

**Delivery:** steady; land the last clause.

    Firmware can still prove the path works. A locked injection register fires it on purpose, which is the only way to test it on real silicon.

## Line 6 — Safety in the core (Frame 6)

**Delivery:** steady; land the last clause.

    Safety in the core. DG32-LITE goes to first silicon on the September 2026 shuttle; until then, every figure here comes from simulation.
