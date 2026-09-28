/** Content for /company and /contact, ported from the hand-written site that used to serve
 *  deepgrid-dr-silicon_new (company.html, contact.html at 8dc6e8c).
 *
 *  Three claims from that site are deliberately NOT carried over, because this site's
 *  verification already rejected them. They are listed with their reasons on /evidence, and
 *  re-stating them here would quietly undo that:
 *    - "MCEME / Indian Army — Defence Anchor, ₹1.01 Cr (Chip 4)"  (see claims.ts `withheld`)
 *    - "FY27: ₹4 Cr (₹2.88 Cr live contracted)" — the contracted half contains the ₹1.01 Cr above,
 *      so the FY27 figure is carried as a plan target only, without the contracted sub-claim.
 *    - Two films, "The 198-Day Silicon Loop" (12 min) and "Deterministic Control in 6 µs" (10 min).
 *      Neither exists. The five films this site actually ships are on /resources.
 *  One figure is corrected rather than dropped: the use-case playbook is 12 pages, not 14.
 */

export const companyStats: [string, string][] = [
  ['Hyderabad', 'DESIGN CENTRE'],
  ['198 days', 'SHUTTLE-TO-SHUTTLE LOOP'],
  ['130 nm', 'FIRST-SILICON NODE'],
  ['Sep 2026', 'TAPEOUT, SHUTTLE CI2609'],
  ['3', 'FOUNDRIES, IN SEQUENCE'],
  ['RV32IM', 'INSTRUCTION SET'],
];

export const pillars = [
  {
    name: 'Sovereign silicon',
    what: 'Three foundries in sequence, not in parallel: SkyWater in the USA for first silicon, IHP in Germany for SiGe radar front-ends, then SCL Mohali in India for sovereign defence production.',
    why: 'The RTL moves between them without a rewrite, so each migration is a library swap rather than a redesign. SCL Mohali is what earns DAP-2020 Buy (Indian-IDDM); SkyWater and IHP are what make it possible to get there without waiting on domestic capacity first.',
  },
  {
    name: 'Deterministic control',
    what: 'One current-control loop costs about 300 hardware cycles, and costs the same at every loop rate. CORDIC runs a Clarke/Park transform in 53–58 cycles.',
    why: 'Firmware that has to meet a deadline is firmware you have to re-time on every change. Moving sampling, the transforms and PWM edges into hardware makes the loop cost a constant, so the CPU keeps only the PI regulators and the remaining headroom is available for diagnostics.',
  },
  {
    name: 'Hardware lockstep safety',
    what: 'Two RV32IM cores run identical inputs two cycles apart. Every committed store is compared, the first mismatch latches its cause, and FAULT_N drives the gate-driver enable directly.',
    why: 'Motor control drives power electronics, where a silent CPU fault destroys a bridge. Putting the comparator and the trip in hardware takes firmware out of the path entirely. In simulation, an injected fault reaches the bridge in 39 cycles.',
  },
];

export const milestones: [string, string, string, string][] = [
  ['NOW', 'DG32-LITE first silicon', 'On SkyWater’s CI2609 shuttle: tapeout 16 September 2026, packaged parts 3 March 2027.', 'Bring-up measures what simulation and static timing predicted: loop cost, fault latency, fmax and power.'],
  ['NEXT', 'Second spin', 'A 12-bit multi-channel ADC and embedded flash.', 'Closes the two largest gaps against the incumbent entry-level motor-control MCU.'],
  ['THEN', 'Connectivity and debug', 'CAN-FD, and interactive CPU debug over JTAG.', 'The vehicle bus a traction or steering drive expects, and the debug path a production team needs.'],
  ['PARALLEL', 'DG32-2DOM', 'The two-clock-domain variant with the INT8 attention engine: design complete, in physical trials.', 'Bring-up will measure the engine’s cycles per query row against the analytic 3,242.'],
];

export const team = [
  {
    name: 'A flow that has already taped out',
    what: 'A test die on TinyTapeout-6, on SkyWater sky130, before DG32-LITE taped in.',
    why: 'First silicon is not also the first time the tools have produced a die. On a shuttle with no respin, that removes one whole category of surprise.',
  },
  {
    name: 'An open-source physical design flow',
    what: 'RTL through to GDSII on Yosys, OpenLane and OpenROAD, with analog and mixed-signal blocks alongside.',
    why: 'No per-seat EDA licence sits in the cost of a spin. That is what lets a 198-day loop pay for itself at defence volumes, and what lets the RTL move to SCL Mohali by swapping libraries rather than rewriting it.',
  },
  {
    name: 'A team sized to the plan',
    what: 'Five to seven engineers over the 24 months the seed round covers, at a Hyderabad cost base.',
    why: 'The payroll line is sized to the roadmap on this page, not to a headcount target. It is 24% of the raise.',
  },
];

/** Company plan figures. These are targets and internal economics, not measurements and not
 *  audited results — the page says so where it shows them. */
export const unitEconomics: [string, string][] = [
  ['NRE per chip', '₹0.6–1.2 Cr, against $2–5M for a conventional flow'],
  ['Gross margin at 10k units', '60–75% on defence volumes'],
  ['EDA licensing', '₹0: Yosys, OpenROAD and TritonCTS'],
  ['CPU royalties', '₹0: DGridRiscV is RISC-V, so there is no ARM licence'],
  ['Shuttle cost', '₹14.3L for 100 parts, against $500K–$1M for dedicated masks'],
];

export const revenueBuild: [string, string][] = [
  ['Market', 'India imports ~$23.4B of ICs a year; ~$9B of that is mature node (≥130 nm)'],
  ['FY27', '₹4 Cr'],
  ['FY28', '₹28 Cr'],
  ['FY29', '₹140 Cr'],
  ['FY30', '₹410 Cr'],
  ['FY31', '₹1,000 Cr'],
];

/** The FY31 plan by row, with the whitepaper's own crash re-pricing (§12.2, "What if Chinese prices
 *  crash"). Both columns are the source's numbers; the page only adds and subtracts them. Pulling the
 *  meter row gives 520, which is the whitepaper's own figure for exactly that failure. */
export type PlanRow = {id: string; name: string; plan: number; crash: number; why: string};
/** `chip` links a row to the chip it names on /applications (#chip-<id>). "Defence (screened)" pools
 *  several screened chips that the whitepaper does not split, so it names none. */
export const fy31Chip: Record<string, {id: string; name: string} | null> = {
  meters: {id: 'sku2', name: 'SKU-2 smart-meter SoC'},
  motors: {id: 'sku1', name: 'SKU-1 BLDC motor controller'},
  defence: null,
  drones: {id: 'd100', name: 'D100 drone SoC'},
  vehicle: {id: 'sku9', name: 'SKU-9 zonal gateway'},
};

export const fy31Rows: PlanRow[] = [
  {id: 'meters',  name: 'Smart meters',       plan: 480, crash: 340, why: 'Tender pricing squeezes 30%.'},
  {id: 'motors',  name: 'Motor controllers',  plan: 220, crash: 130, why: 'The most exposed chip: 40% off.'},
  {id: 'defence', name: 'Defence (screened)', plan: 200, crash: 200, why: 'Import-banned. A price crash cannot reach it.'},
  {id: 'drones',  name: 'Drone brain',        plan: 65,  crash: 55,  why: 'Army origin checks blunt it.'},
  {id: 'vehicle', name: 'Vehicle gateway',    plan: 35,  crash: 25,  why: 'Open market: 30% off.'},
];

/** The whitepaper's verdict on its own FY31 split (§13, p. 63). Quoted, not paraphrased, because the point
 *  is that the company said it. */
export const splitVerdict = {
  // Verbatim, including its em dash: this is the one place the no-em-dash rule yields, because a
  // quotation that has been re-punctuated is no longer the source's words.
  quote: 'So the total holds and the split does not: 70 % of FY31 sits on two chips, while chips 9, 7 and 4 are planned at under a tenth of theirs. We would rebalance before an institutional round.',
  cite: 'Master whitepaper v3, §13, p.\u00a063',
  // The whitepaper numbers chips 1-10 (its p. 67 table: 9 = vehicle gateway, 10 = drone brain); the rest of
  // the site names them by SKU. The key keeps the quote verbatim and still readable against /applications.
  key: 'The whitepaper numbers the chips: the two carrying 70 % are chip 2, the smart-meter SoC, and chip 1, the BLDC motor controller; chip 9 is the zonal gateway, chip 7 the 77 GHz radar and chip 4 DG32-LITE.',
};

export const moats = [
  {name: 'DAP-2020 Buy (Indian-IDDM)', what: 'Defence tenders that require an Indian designer and manufacturer.', why: 'An importer cannot bid at all, so the competition is domestic or absent.'},
  {name: 'PIL 1–5 import bans', what: '346+ line items carrying hard import-ban deadlines.', why: 'Demand with a date on it, rather than demand that has to be created.'},
  {name: 'SRIJAN', what: '37,696 items listed on the SRIJAN indigenisation portal.', why: 'A published list of parts the defence services have already said they want made in India.'},
  {name: 'Three-factory sovereignty', what: 'SkyWater, then IHP, then SCL Mohali.', why: 'Each qualification makes the next SKU cheaper, and no single government can stop the roadmap.'},
  {name: 'Compounding IP', what: 'Silicon-validated blocks reused across the SKU roadmap.', why: 'The second chip on a node costs a fraction of the first, which is the whole economic argument for mature nodes.'},
];

export const stopRules: [string, string][] = [
  ['S1: signature gate', 'If the anchor customer for Chip 2, the smart-meter SoC, has not signed a binding letter by the factory-order cutoff, Chip 2 pauses for one cycle and its capital moves to Chips 1 and 3, the BLDC motor controller and the high-reliability power IC.'],
  ['S2: screening failure', 'If Chip 6, the voltage supervisor, fails military screening twice, every forward defence revenue projection is deferred by 12 months, across all materials, within 30 days.'],
  ['S3: commercial exit', 'In FY29, if delivered Chinese component pricing falls below DeepGrid’s bare manufacturing cost, exit ceiling-fan drivers and concentrate on two-wheelers and proprietary modules.'],
  ['S4: SCL Mohali lateness', 'If SCL Mohali slips by more than two manufacturing cycles, declare the delay publicly and run production only at SkyWater and IHP.'],
];

export const fundsAllocation: [string, string, string][] = [
  ['Factory runs and mask sets', '₹3.60 Cr (36%)', 'Six sky130 MPW runs and one IHP SiGe run (₹1.34 Cr), then two production mask sets and first wafers for Chips 1 and 2, the BLDC motor controller and the smart-meter SoC (₹2.26 Cr)'],
  ['Engineering payroll', '₹2.40 Cr (24%)', 'Five to seven engineers over 24 months at a Hyderabad cost base'],
  ['Qualification and approval', '₹1.80 Cr (18%)', 'Four product qualifications: MIL-STD-883, JSS, CEMILAC, and the Chip 6 (voltage supervisor) pathfinder'],
  ['ATE testing line', '₹1.20 Cr (12%)', 'Automated test equipment, custom load boards, and wafer sort'],
  ['Sales and working capital', '₹1.00 Cr (10%)', 'Evaluation kits, datasheets, distributor onboarding, and customer engineering'],
];

export const companyNotClaimed = [
  'No revenue figure on this page is audited, and none of it is contracted revenue. FY27 onward are plan targets.',
  'Market sizes are third-party import statistics applied to our own segment definition, not a commissioned study.',
  'Customer names are not listed on this site. One contract figure that previously appeared here was withdrawn after verification; the reason is on the Evidence page.',
  'Team composition is described by function. Individual names and histories are shared under NDA, not published.',
];

export const enquiryRoles = ['Engineer / technical lead', 'Procurement / supply chain', 'Engineering management', 'Investor / analyst', 'Other'];
export const motorTypes = ['BLDC / PMSM', 'Induction / ACIM', 'Stepper', 'Switched reluctance', 'Other'];
export const voltages = ['12–48 V', '48–300 V', '300–800 V', '800 V and above'];
export const powers = ['1–10 kW', '10–100 kW', 'Over 100 kW'];
export const volumes = ['Prototyping (1–10)', '10–100 units', '100–1,000 units', '1,000–10,000 units', 'Over 10,000 units'];
export const timelines = ['Immediate (0–3 months)', 'Near term (3–6 months)', 'Medium term (6–12 months)', 'Long term (12+ months)', 'Just exploring'];

export const CONTACT_EMAIL = 'contact@deepgrid.in';

/** Where each figure on /company comes from. scripts/check-claims.mjs re-runs every probe against its
 *  source on each build, the same mechanism that guards app/claims.ts. The first draft of this page
 *  carried about fifteen figures that failed this search; this list is what stops them coming back.
 *
 *  Not covered here, because the gate reads text and these live only in the master whitepaper PDF
 *  (deepgrid-mature-node-silicon-master-whitepaper-v3.pdf): FY27 ₹4 Cr, FY28 ₹28 Cr, FY29 ₹140 Cr and
 *  FY30 ₹410 Cr (§13, p. 61), the ₹520 Cr meter-row failure (§12.2, p. 61), and the split verdict
 *  quoted in splitVerdict (§13, p. 63). Checked by hand against the PDF on 2026-09-23. */
export const companySources = {
  'co-imports': {source: 'deepgrid-mature-silicon-architecture.md', probe: '$23.4 B'},
  'co-mature': {source: 'deepgrid-mature-silicon-architecture.md', probe: '$9 Billion Import Funnel'},
  'co-nre': {source: 'deepgrid-mature-silicon-architecture.md', probe: '₹0.60 – 1.20 Crore'},
  'co-nre-conventional': {source: 'deepgrid-mature-silicon-architecture.md', probe: '$2,000,000 – $5,000,000'},
  'co-margin-defence': {source: 'deepgrid-mature-silicon-architecture.md', probe: '60–75%'},
  'co-mpw-cost': {source: 'deepgrid-mature-silicon-architecture.md', probe: '₹14.3 Lakhs'},
  'co-mask-cost': {source: 'deepgrid-mature-silicon-architecture.md', probe: '$500,000 – $1,000,000'},
  'co-fy31-meters': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Meters } ₹480'},
  'co-fy31-motors': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Motors } ₹220'},
  'co-fy31-defence': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Defence } ₹200'},
  'co-crash-meters': {source: 'deepgrid-mature-silicon-architecture.md', probe: '**₹340 Cr**'},
  'co-crash-motors': {source: 'deepgrid-mature-silicon-architecture.md', probe: '**₹130 Cr**'},
  'co-crash-defence': {source: 'deepgrid-mature-silicon-architecture.md', probe: '₹200 Cr remains **₹200 Cr**'},
  'co-crash-drones': {source: 'deepgrid-mature-silicon-architecture.md', probe: '**₹55 Cr**'},
  'co-crash-vehicle': {source: 'deepgrid-mature-silicon-architecture.md', probe: '**₹25 Cr**'},
  'co-crash-total': {source: 'deepgrid-mature-silicon-architecture.md', probe: '**₹750 Crore**'},
  'co-srijan': {source: 'deepgrid-mature-silicon-architecture.md', probe: '37,696 items'},
  'co-pil': {source: 'deepgrid-mature-silicon-architecture.md', probe: '346 items'},
  'co-funds-factory': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Factory Runs & Mask Sets (₹3.60 Cr / 36%)'},
  'co-funds-mpw': {source: 'deepgrid-mature-silicon-architecture.md', probe: '₹0.86 Cr for 6 sky130 MPW runs'},
  'co-funds-payroll': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Engineering Payroll (₹2.40 Cr / 24%)'},
  'co-funds-headcount': {source: 'deepgrid-mature-silicon-architecture.md', probe: '5–7 engineers over 24 months'},
  'co-funds-qual': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Qualification & Approval (₹1.80 Cr / 18%)'},
  'co-funds-qual-detail': {source: 'deepgrid-mature-silicon-architecture.md', probe: '4 product qualifications'},
  'co-funds-ate': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'ATE Testing Line (₹1.20 Cr / 12%)'},
  'co-funds-sales': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Sales & Working Capital (₹1.00 Cr / 10%)'},
  'co-stop-s1': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'S1 (Meter Signature Gate)'},
  'co-stop-s2': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'fails military screening twice'},
  'co-stop-s3': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'S3 (Commercial Exit Gate)'},
  'co-stop-s4': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'slips by more than two manufacturing cycles'},
  'co-tapeout': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'Tapeout 16 September 2026'},
  'co-parts': {source: 'deepgrid-mature-silicon-architecture.md', probe: '3 March 2027'},
  'co-tinytapeout': {source: 'deepgrid-mature-silicon-architecture.md', probe: 'TinyTapeout-6'},
  'co-foundry-sequence': {source: 'deepgrid-three-factory-architecture.md', probe: 'Sequential Three-Foundry'},
  'co-rtl-portable': {source: 'deepgrid-three-factory-architecture.md', probe: 'requires zero RTL rewrites'},
};
