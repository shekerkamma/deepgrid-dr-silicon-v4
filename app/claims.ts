/** The claim map: every load-bearing figure on this site, the kind of evidence behind it, and the
 *  source document in public/downloads that carries it.
 *
 *  Derived from the markdown sources, not from this repo's other data files. That order matters:
 *  `sovereignSkuHorizon` was itself derived from those documents and had silently drifted from
 *  them (wrong SKU numbers, wrong nodes, three different meanings of "Phase"), so the derived
 *  layer is not the source of truth and cannot be used to check itself.
 *
 *  Every entry below was located by searching all 13 markdown sources for the figure; none is
 *  asserted from memory. `scripts/check-claims.mjs` re-runs that search and fails when a claim's
 *  source no longer carries it.
 */

/** The five kinds from `evidenceLadder`. Structural facts carry no kind: a pin count is a design
 *  decision, not a measurement, and labelling it "Simulated" would cheapen the word. */
export type EvidenceKind = 'Simulated' | 'Post-route' | 'Analytic' | 'Tool estimate' | 'Process nominal';

export interface Claim {
  /** What the reader sees. */
  figure: string;
  /** What the number actually measures. The budget/headroom confusion came from skipping this. */
  measures: string;
  kind?: EvidenceKind;
  /** File in public/downloads. */
  source: string;
  sourceTitle: string;
  /** A string that must still appear in the source, so the gate can verify the link. */
  probe: string;
  /** Routes where this figure appears or is explained further. */
  seeAlso?: string[];
}

export const claims: Record<string, Claim> = {
  'fault-39': {
    figure: '39 cycles',
    measures: 'Injected fault to FAULT_N asserted and the PWM bridge disabled, with no firmware in the path',
    kind: 'Simulated',
    source: 'dg32-lite-architecture-guide.md',
    sourceTitle: 'DG32-LITE Architecture Guide',
    probe: '39',
    seeAlso: ['safety', 'technology'],
  },
  'loop-100k': {
    figure: '~100 kHz',
    measures: 'Closed current-loop rate, the simulated ceiling: about 5 µs acquisition plus 5 µs compute',
    kind: 'Simulated',
    source: 'dg32-lite-architecture-guide.md',
    sourceTitle: 'DG32-LITE Architecture Guide',
    probe: '100',
    seeAlso: ['control'],
  },
  'hw-300': {
    figure: '~300 cycles',
    measures: 'Fixed hardware cost per loop: one ADC sample, two CORDIC operations and a PWM write, at any loop rate',
    kind: 'Simulated',
    source: 'dg32-lite-architecture-guide.md',
    sourceTitle: 'DG32-LITE Architecture Guide',
    probe: '300',
    seeAlso: ['control'],
  },
  'adc-177': {
    figure: '177 cycles',
    measures: 'On-die SAR ADC conversion, fired by the PWM at the current-ripple null',
    kind: 'Simulated',
    source: 'dg32-lite-architecture-guide.md',
    sourceTitle: 'DG32-LITE Architecture Guide',
    probe: '177',
    seeAlso: ['control'],
  },
  'cordic-53': {
    figure: '53 to 58 cycles',
    measures: 'One CORDIC sin/cos or rotation operation',
    kind: 'Simulated',
    source: 'dg32-lite-architecture-guide.md',
    sourceTitle: 'DG32-LITE Architecture Guide',
    probe: '53',
    seeAlso: ['control'],
  },
  'cpi-8': {
    figure: '~8 cycles per instruction',
    measures: 'Cost of a CPU instruction on this fetch-bound core, used to convert the cycle budget into instructions',
    kind: 'Simulated',
    source: 'dg32-lite-architecture-guide.md',
    sourceTitle: 'DG32-LITE Architecture Guide',
    probe: 'cycles per instruction',
    seeAlso: ['control'],
  },
  'fmax-lockstep': {
    figure: '55 to 62 MHz',
    measures: 'Maximum frequency of the lockstep core on the placed-and-routed design, which is what sets the 50 MHz clock',
    kind: 'Post-route',
    source: 'deepgrid-datasheets-engineering-spec.md',
    sourceTitle: 'DeepGrid Datasheets Engineering Specification',
    probe: '55',
    seeAlso: ['control', 'technology'],
  },
  'power-043': {
    figure: '~0.43 W',
    measures: 'Vectorless power estimate at 50 MHz, 25 °C and 1.8 V, from the implementation tools',
    kind: 'Tool estimate',
    source: 'deepgrid-datasheets-engineering-spec.md',
    sourceTitle: 'DeepGrid Datasheets Engineering Specification',
    probe: '0.43',
    seeAlso: ['package'],
  },
  'headroom-82': {
    figure: '82%',
    measures: 'Available DIAGNOSTIC headroom at a 10 kHz FOC rate: core clock cycles left after the hardware datapath AND the control firmware. Not the same quantity as the cycle budget, which is the period minus the fixed hardware cost alone and is 94% at the same rate.',
    kind: 'Analytic',
    source: 'deepgrid-dg32-ai-architecture.md',
    sourceTitle: 'DG32 AI Architecture',
    probe: '82',
    seeAlso: ['control', 'applications'],
  },
  'node-130': {
    figure: '130 nm',
    measures: 'Process node. Chosen so the die can take 28 to 120 V transient rails and survive −55 to +125 °C, which sub-10 nm cannot',
    kind: 'Process nominal',
    source: 'deepgrid-mature-silicon-architecture.md',
    sourceTitle: 'Mature-Node Silicon System Architecture',
    probe: '130 nm',
    seeAlso: ['products', 'package'],
  },
  'loop-198': {
    figure: '198 days',
    measures: 'RTL to GDSII shuttle loop on the verified SkyWater factory calendar',
    kind: 'Analytic',
    source: 'deepgrid-mature-silicon-architecture.md',
    sourceTitle: 'Mature-Node Silicon System Architecture',
    probe: '198',
    seeAlso: ['procurement'],
  },
  'asil-d': {
    figure: 'ISO 26262 ASIL-D',
    measures: 'The target the lockstep safety MCU is designed against. A mechanism, not a held certificate',
    source: 'deepgrid-mature-silicon-architecture.md',
    sourceTitle: 'Mature-Node Silicon System Architecture',
    probe: 'ASIL-D',
    seeAlso: ['safety', 'evidence'],
  },
  'rom-64k': {
    figure: '64 KB boot ROM',
    measures: 'Mask-programmed boot path. Built as logic rather than a memory macro',
    source: 'deepgrid-datasheets-engineering-spec.md',
    sourceTitle: 'DeepGrid Datasheets Engineering Specification',
    probe: '64',
    seeAlso: ['technology'],
  },
  'sram-32k': {
    figure: '32 KB SRAM',
    measures: 'Dual-port, on 16 macros: one port for CPU and DMA data, the other for instruction fetch',
    source: 'deepgrid-datasheets-engineering-spec.md',
    sourceTitle: 'DeepGrid Datasheets Engineering Specification',
    probe: '32',
    seeAlso: ['technology'],
  },
  'qfn-64': {
    figure: 'QFN-64, 9 × 9 mm',
    measures: 'Package: 44 signal pins and 20 supply and ground pins, identical on both parts',
    source: 'deepgrid-datasheets-engineering-spec.md',
    sourceTitle: 'DeepGrid Datasheets Engineering Specification',
    probe: 'QFN',
    seeAlso: ['package'],
  },
  'sku-4': {
    figure: 'SKU-4',
    measures: 'DG32-LITE’s place in the ten-chip portfolio: the lockstep safety MCU. Two sources agree chip for chip',
    source: 'deepgrid-sku-compendium-architecture.md',
    sourceTitle: 'SKU Architecture Compendium (Technical Annex v3)',
    probe: 'Safety MCU',
    seeAlso: ['products'],
  },
};

/** Claims the sources carry that this site deliberately does not repeat, and why. Kept in code so
 *  the reason travels with the decision instead of living in a commit message. */
export const withheld: {claim: string; why: string}[] = [
  {
    claim: '₹1.01 Cr contracted, Indian Army MCEME, attached to Chip 4',
    why: 'Verification found it materially misdescribed: ₹23.01L delivered, ₹78.39L is L1 (lowest bidder, not an award), and it sits in Deepgrid Datacentre Pvt Ltd rather than Deepgrid Semi, with MCEME-owned IP.',
  },
  {
    claim: '39.3 TOPS measured on FPGA',
    why: 'A derivation, not a measurement. The Artix-7 board ceilings near 1.8 TOPS.',
  },
  {
    claim: '12.9× cheaper than Mobileye',
    why: 'Category error: their ASP against our die cost. Loaded with NRE at plan volumes the advantage is about 2.3×.',
  },
];
