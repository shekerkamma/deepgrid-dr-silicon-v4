import type {Clip} from './evidence-clip';
import {groundedDocuments} from './documents-data';

/** A citation, through the document registry (the site's convention: app/documents-data.ts is the one
 *  place a document's title and file live, and every link reads it rather than a hard-coded path). */
export const citeDoc = (id: 'doc2' | 'doc5') => {
  const d = groundedDocuments.find(x => x.id === id)!;
  return {title: d.title, pdf: d.pdfFile};
};

/** Source data for /applications, told as a story (docs/applications-story.md).
 *
 *  The spine is the playbook public/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf; page numbers
 *  below are its own. Each film moment is one whole slide segment from app/data/*-film.json, so a
 *  clip starts and stops where the narrated film changes slide, and its poster is the slide on screen.
 *  scripts/check-clips.mjs checks every `saying` against the caption file over that range.
 */

// The clips must stay in this exact shape (two-space keys, one field per line) for
// scripts/check-clips.mjs to parse them.
export const clips: Record<string, Clip> = {
  'why': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-03.webp', start: 61.36, duration: 30.52, slide: 3,
    shows: 'A silent CPU fault can destroy a power bridge.',
    saying: 'Why build it this way? A motor drive switches power transistors thousands of times a second. If the CPU silently computes a wrong value, it writes a wrong PWM edge, and a wrong edge can short a bridge leg. Entry-level motor MCUs catch faults with watchdogs and periodic software self-test. Hardware lockstep has lived in automotive parts such as AURIX, S32K and Hercules.',
  },
  'budget': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-09.webp', start: 239.68, duration: 51.14, slide: 9,
    shows: 'One current loop costs about 300 hardware cycles, at every loop rate.',
    saying: 'Here is what one loop costs. The current sample takes one hundred seventy-seven cycles. Each CORDIC operation takes fifty-three to fifty-eight. The regulators cost about eight cycles per instruction. Together the hardware part is about three hundred cycles, and it is the same at every loop rate. At twenty kilohertz, that is twelve percent of the period. So the question becomes how much firmware fits. At ten kilohertz there are about forty-seven hundred cycles left: enough for a full current and speed loop with an observer. At twenty kilohertz, twenty-two hundred, enough for field-weakening. At fifty kilohertz, seven hundred, an inner current loop only. The simulated ceiling is about one hundred kilohertz.',
  },
  'analog': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-14.webp', start: 373.17, duration: 28.24, slide: 14,
    shows: 'DG32 leads on safety and trails on analog.',
    saying: 'Against the STM32G0, the entry-level incumbent, the comparison is honest. DG32 leads on hardware lockstep, native DShot, hardware CORDIC and the on-chip AI variant, with an open RISC-V core. The G0 leads clearly on its twelve-bit multi-channel ADC, embedded flash, USB and CAN-FD, and on production maturity.',
  },
  'engine': {
    deck: 'DG32-2DOM architecture',
    film: '/media/dg32-2dom-architecture.mp4',
    captions: '/media/dg32-2dom-architecture.vtt',
    poster: '/decks/dg32-2dom/slide-01.webp', start: 0, duration: 29.73, slide: 1,
    shows: 'Condition monitoring on the motor-control chip.',
    saying: 'DG32-2DOM is the attention variant of Deepgrid Semi\'s DG32-LITE motor-control chip. It keeps the dual-core lockstep controller and adds an INT8 attention engine on its own clock, so a drive can watch its own motor for faults. The design is complete and in physical trials. Every figure here is a post-route, simulated or analytic value, and each one is labelled.',
  },
  'bearing': {
    deck: 'DG32-2DOM architecture',
    film: '/media/dg32-2dom-architecture.mp4',
    captions: '/media/dg32-2dom-architecture.vtt',
    poster: '/decks/dg32-2dom/slide-12.webp', start: 316.54, duration: 32.37, slide: 12,
    shows: 'The engine targets bearing faults in the drive.',
    saying: 'What is it for? Catching a wearing bearing, or a drive that starts behaving oddly, without an extra processor on the board, because the motor controller watches its own motor. The STM32G0 can only run that kind of model in software, so a hardware engine sets DG32-2DOM apart. On the roadmap it runs alongside DG32-LITE\'s first silicon, with its design finished and undergoing physical trials.',
  },
  'trip': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-06.webp', start: 153.43, duration: 25.40, slide: 6,
    shows: 'Two cores must agree on every committed store.',
    saying: 'This is the safety core. MAIN runs the application. CHECKER runs the same instructions two cycles later, on the same inputs, and the comparator checks every committed store. On a mismatch, the first cause is latched and FAULT_N goes low. Route that pin to the gate-driver enable, and the bridge turns off in hardware, without waiting for firmware.',
  },
  'measured': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-16.webp', start: 433.54, duration: 29.59, slide: 16,
    shows: 'Safety in the core. Control in silicon.',
    saying: 'Three ideas to hold on to. The protection is built into the processor itself, not bolted on in software. The costly parts of motor control are dedicated hardware, so the price of one loop is fixed and known in advance. And the weaknesses are named, with fixes scheduled. None of this has yet been measured on silicon, and no functional-safety certification is claimed; bring-up is where the numbers become real.',
  },
};

/** The nineteen models that fit, from playbook page 5: inference cost only, feature extraction is
 *  costed separately. Names match app/diagnostic-tasks.ts exactly, so the page can count use. */
export const models: {name: string; role: string; cycles: string; inference: string}[] = [
  {name: 'Random forest, 100×d8', role: 'Primary classifier', cycles: '3,200', inference: '0.06 ms'},
  {name: 'Gradient boosting, 200×d4', role: 'Primary classifier', cycles: '3,200', inference: '0.06 ms'},
  {name: 'Isolation forest', role: 'Unlabelled anomaly detection', cycles: '3,200', inference: '0.06 ms'},
  {name: 'LDA', role: 'Primary classifier', cycles: '128', inference: '0.00 ms'},
  {name: 'Logistic regression', role: 'Primary classifier', cycles: '128', inference: '0.00 ms'},
  {name: 'Naive Bayes', role: 'Regime identification', cycles: '512', inference: '0.01 ms'},
  {name: 'PCA + Hotelling T²', role: 'Anomaly detection, the condition-monitoring standard', cycles: '1,024', inference: '0.02 ms'},
  {name: 'Mahalanobis score', role: 'Anomaly score, single scalar', cycles: '4,096', inference: '0.08 ms'},
  {name: 'One-class SVM', role: 'Anomaly detection with a decision boundary', cycles: '12,800', inference: '0.26 ms'},
  {name: 'k-NN, 200 prototypes', role: 'Field-adaptable classifier', cycles: '25,600', inference: '0.51 ms'},
  {name: 'Nearest centroid', role: 'On-device baselining, no backward pass', cycles: '1,024', inference: '0.02 ms'},
  {name: 'Gaussian mixture', role: 'Regime identification', cycles: '2,048', inference: '0.04 ms'},
  {name: 'HMM, 8 state', role: 'Sequence and state tracking', cycles: '3,072', inference: '0.06 ms'},
  {name: 'Extended Kalman filter', role: 'Observer: sensorless FOC, thermal', cycles: '2,400', inference: '0.05 ms'},
  {name: 'MLP 32-16-8-4', role: 'Nonlinear classifier or regressor', cycles: '2,688', inference: '0.05 ms'},
  {name: 'MLP autoencoder', role: 'Unsupervised drift detection', cycles: '22,016', inference: '0.44 ms'},
  {name: 'MLP 128-64-32-8', role: 'Regression at the dense-network ceiling', cycles: '41,984', inference: '0.84 ms'},
  {name: 'GRU, 16 units', role: 'Short sequence modelling', cycles: '147,456', inference: '2.95 ms'},
  {name: '1D-CNN 8/16/32', role: 'Raw-waveform classification', cycles: '512,000', inference: '10.24 ms'},
];

/** The four families, in playbook order (pages 7 to 10). Each headline is a finding; `lede` is one
 *  sourced sentence; `standards` appears only where the playbook names one. */
export const families: {
  id: 'rotating' | 'electrical' | 'motion' | 'degradation';
  name: string; page: number; headline: string; lede: string; standards?: string;
}[] = [
  {
    id: 'rotating', name: 'Rotating machinery', page: 7,
    headline: 'Bearings are the most common motor failure, and an accelerometer catches them.',
    lede: 'Bearings account for 44 % of motor failures and are the weakest fault class for current-only sensing, so this family reads vibration. Features taken at the bearing’s own fault frequencies outrank raw statistics four to five times, so the classifier behind them stays small.',
    standards: 'ISO 20816 severity zones · ISO 13373 vibration monitoring',
  },
  {
    id: 'electrical', name: 'Electrical and power', page: 8,
    headline: 'The phase current the drive already samples carries rotor and stator faults.',
    lede: 'Motor current signature analysis looks for sidebands around the supply frequency. The FFT that would resolve them is 8 MB, so the playbook evaluates Goertzel filters at only the predicted sideband frequencies instead.',
    standards: 'ISO 20958 motor current signature analysis',
  },
  {
    id: 'motion', name: 'Control, motion and sensing', page: 9,
    headline: 'Most of these run on the sensors the drive already has.',
    lede: 'Sensorless observation, plausibility checking, regime identification, anomaly scoring and duty tracking depend on relative change rather than small-signal resolution, so they need no added parts.',
  },
  {
    id: 'degradation', name: 'Slower-rate and sequence', page: 10,
    headline: 'Trend and forecasting tasks read hours of history, so they can run slower.',
    lede: 'Remaining-useful-life regression works from 64 hourly feature snapshots. Three of the six tasks that run below 1 kHz are in this family.',
  },
];

/** Tasks the playbook (page 11) names as needing more than the part's 8-bit converter. */
export const needsResolution = new Set(['Broken rotor bar detection', 'Air-gap eccentricity', 'Stator inter-turn short']);

/** Where DG32-LITE goes: SKU-4, the Safety MCU, in the SKU Architecture Compendium (Technical
 *  Annex v3, sheet 5, public/downloads/docs/deepgrid-sku-compendium-technical-annex-v3.pdf). The
 *  sockets are the Annex's own words. The `tasks` on each are OUR pairing of the playbook's tasks
 *  with those sockets; neither document makes it, and the page says so. Every name must match a row
 *  in app/diagnostic-tasks.ts exactly (scripts/check-usecases.mjs checks).
 *
 *  Deliberately not used from the Annex: its SKU-4 specification (200 MHz, ECC, 1 MB flash) describes
 *  the product line, not the DG32-LITE open-PDK part; "ASIL-D" is stated only as a path, since the
 *  site claims no certification; and "MCEME ₹1.01 Cr" is a withheld claim that failed verification. */
export const SOCKET_SOURCE = 'SKU Architecture Compendium, Technical Annex v3, sheet 5';
export const sockets: {id: string; name: string; short: string; what: string; limit?: string; tasks: string[]}[] = [
  {
    id: 'bms', short: 'Battery and motor supervision', name: 'EV battery management and motor-safety supervision',
    what: 'The independent processor that watches a battery pack or a drive and can shut it down. Lockstep cores and the FAULT_N pin are the supervision; the diagnostics add warning before a trip.',
    tasks: ['Battery state-of-health', 'Winding thermal estimation', 'Phase loss and current unbalance', 'Stator inter-turn short', 'Multivariate anomaly scoring'],
  },
  {
    id: 'brake-steer', short: 'Braking and steering', name: 'Braking and steering controllers',
    what: 'Drives where a wrong output is a safety event, so a silent CPU fault has to trip in hardware.',
    limit: 'These need the CAN-FD vehicle bus, which is on the roadmap and not on DG32-LITE.',
    tasks: ['Learned sensor plausibility', 'Sensorless rotor position', 'Kickback and stall detection', 'Load estimation and torque ripple'],
  },
  {
    id: 'joints', short: 'Robot joints', name: 'Robot joints',
    what: 'One controller per joint, running the motor loop and watching the gearbox and load behind it.',
    tasks: ['Adaptive friction compensation', 'Gearbox and gear-mesh faults', 'Kickback and stall detection', 'Operating-mode classification', 'Duty-cycle and state tracking'],
  },
  {
    id: 'bldc', short: 'BLDC motor control', name: 'The motor-control processor beside a BLDC driver',
    what: 'The field-oriented-control processor next to SKU-1, DeepGrid’s BLDC motor controller for fans, appliances, EV two- and three-wheelers, robotics and actuator joints.',
    tasks: ['Bearing fault classification', 'Fan and blower imbalance', 'Pump cavitation and dry-run', 'Compressor valve faults', 'Broken rotor bar detection', 'Belt slip and misalignment'],
  },
  {
    id: 'flight', short: 'Drone flight redundancy', name: 'Flight-critical redundancy for the D100 drone programme',
    what: 'A second, independent safety processor beside the flight computer. DG32-LITE drives drone speed controllers directly through its four hardware DShot channels.',
    tasks: ['Learned sensor plausibility', 'Multivariate anomaly scoring', 'Kickback and stall detection'],
  },
];

/** The portfolio, by where it ends up. Source: the SKU Architecture Compendium (Technical Annex v3,
 *  public/downloads/docs/deepgrid-sku-compendium-technical-annex-v3.pdf), one sheet per product;
 *  its markdown matrix (deepgrid-sku-compendium-architecture.md) and the mature-silicon architecture
 *  section 7 agree on every product. `replaces`, `goes` and `status` restate each sheet's own
 *  "Replaces", "Socket" and "Status & node path" panels in plain words.
 *
 *  Left out on purpose, per the site's own rules: anchor customers (the only one verified, MCEME,
 *  failed), market sizes and prices (the Annex flags them as internal estimates), and specifications
 *  for any part without silicon. D100's node is the Annex matrix's own "130nm + 28nm SiP": sheet 11
 *  names the 130 nm die and app/detail-content.ts the TSMC 28 nm one, and both are in the package. */
export type ProductId = 'sku1' | 'sku2' | 'sku3' | 'sku4' | 'sku5' | 'sku6' | 'sku7' | 'sku8' | 'sku9' | 'd100';
/** `evidence` is the strongest evidence each chip has today and `evidenceDoc` the registered document
 *  that states it (app/documents-data.ts). /evidence grades the portfolio from these fields, so
 *  /applications and /evidence cannot disagree about any chip.
 *
 *  The FPGA-validated logic is from the whitepaper (doc5), p. 12, which names exactly five blocks: the
 *  lockstep microcontroller (SKU-4), the motor control datapath (SKU-1), the meter measurement chain
 *  (SKU-2), the supervisor sensing chain (SKU-6) and the drone position engine (D100), on an Artix-7 at
 *  81.25 MHz. The Annex's "Artix-7 · 81.25 MHz · validation only" strip is NOT used: it is template text
 *  stamped identically on every sheet, including the analog parts and the radar, whose own panels
 *  contradict it. An earlier revision quoted it for SKU-1 and graded SKU-6 as a sheet only; both wrong. */
export const products: Record<ProductId, {name: string; tag: string; sheet: number; replaces?: string; status?: string; evidence: string; evidenceDoc: 'doc2' | 'doc5'}> = {
  sku1: {name: 'BLDC motor controller', tag: 'SKU-1', sheet: 2,
    replaces: 'A motor-driver chip plus a separate microcontroller, collapsed into one die.',
    status: 'First multi-project wafer run, cycle 1.',
    evidence: 'FPGA-validated: the motor control datapath runs as circuit code on an Artix-7 at 81.25 MHz.', evidenceDoc: 'doc5'},
  sku2: {name: 'Smart-meter SoC', tag: 'SKU-2', sheet: 3,
    replaces: 'A metrology front end plus a separate meter microcontroller.',
    status: 'Cycle-1 wafer run, alongside SKU-1.',
    evidence: 'FPGA-validated: the meter measurement chain runs as circuit code on the same Artix-7.', evidenceDoc: 'doc5'},
  sku3: {name: 'High-reliability power IC', tag: 'SKU-3', sheet: 4,
    replaces: 'Imported qualified power parts in avionics and military-vehicle electronics.',
    status: 'Prototype on 130 nm, then production at SCL 180 nm in India.',
    evidence: 'Architecture sheet; prototyping planned on sky130 20 V devices, production at SCL 180 nm.', evidenceDoc: 'doc2'},
  sku4: {name: 'DG32-LITE safety microcontroller', tag: 'SKU-4', sheet: 5,
    replaces: 'Imported functional-safety microcontrollers of the Microchip and Renesas class.',
    status: 'On first silicon: the September 2026 multi-project shuttle.',
    evidence: 'First silicon on the September 2026 shuttle; bring-up has not started.', evidenceDoc: 'doc2'},
  sku5: {name: 'RS-485 and CAN-FD transceiver', tag: 'SKU-5', sheet: 6,
    replaces: 'TI, ADI and Renesas interface parts facing obsolescence.',
    status: 'Cycle-2 wafer run.',
    evidence: 'Architecture sheet.', evidenceDoc: 'doc2'},
  sku6: {name: 'Voltage supervisor', tag: 'SKU-6', sheet: 7,
    replaces: 'TI and Maxim supervisor chips.',
    status: 'Cycle-1 or cycle-2 wafer run; the first chip planned through MIL-883 qualification.',
    evidence: 'FPGA-validated: the supervisor sensing chain runs as circuit code on the same Artix-7.', evidenceDoc: 'doc5'},
  sku7: {name: '77 GHz 4D radar', tag: 'SKU-7', sheet: 8,
    replaces: 'Radar front ends under US export control: this one is fabricated at IHP in Germany.',
    status: 'IHP wafer run, FY28.',
    evidence: 'Architecture sheet. The SiGe front end has no FPGA equivalent, so it is proven on silicon or not at all.', evidenceDoc: 'doc2'},
  sku8: {name: 'Rugged display driver', tag: 'SKU-8', sheet: 9,
    replaces: 'Imported display timing controllers and source drivers.',
    status: 'Cycle-3 wafer run.',
    evidence: 'Architecture sheet.', evidenceDoc: 'doc2'},
  sku9: {name: 'Zonal gateway', tag: 'SKU-9', sheet: 10,
    replaces: 'Relay boxes and point-to-point wiring harnesses.',
    evidence: 'Architecture sheet.', evidenceDoc: 'doc2'},
  d100: {name: 'D100 drone SoC', tag: 'D100', sheet: 11,
    replaces: 'Nothing made in India: no indigenous flight-control and navigation SoC exists, and the sheet states that gap with references.',
    status: 'Track B: scoped and funded separately from the nine SKUs.',
    evidence: 'FPGA-validated: the drone position engine runs as circuit code on the same Artix-7.', evidenceDoc: 'doc5'},
};

export const areas: {
  id: string; name: string; headline: string; lede: string;
  items: {product: ProductId; role: string; primary?: boolean}[];
}[] = [
  {
    id: 'motors', name: 'Motors and drives',
    headline: 'In a motor drive, one chip runs the motor and another can stop it safely.',
    lede: 'SKU-1 replaces the driver-plus-microcontroller pair in fans, appliances, EV two- and three-wheelers, robots and actuators. SKU-4, DG32-LITE, is the safety processor that supervises a motor and can shut it down.',
    items: [
      {product: 'sku1', primary: true, role: 'Runs the motor: fans, appliances, EV two- and three-wheelers, robotics and actuator joints.'},
      {product: 'sku4', primary: true, role: 'Supervises the motor: motor-safety supervision, robot joints, and the field-oriented-control processor beside SKU-1.'},
    ],
  },
  {
    id: 'vehicles', name: 'Vehicles',
    headline: 'In a vehicle, the chips sit at the edges: the battery, the brakes, the radar, the bus and the wiring zones.',
    lede: 'The central computer of a software-defined vehicle is a sub-10 nm problem and is explicitly not claimed. What mature nodes own is everything around it.',
    items: [
      {product: 'sku9', primary: true, role: 'The zonal layer of a software-defined vehicle: gateway, smart inputs and outputs, and the safety and security edge.'},
      {product: 'sku4', role: 'EV battery management, and braking and steering controllers. Braking and steering need CAN-FD, which is on the DG32 roadmap and not on DG32-LITE.'},
      {product: 'sku7', primary: true, role: 'DeepGrid’s own truck mirror-tower radar, and automotive emergency braking.'},
      {product: 'sku5', primary: true, role: 'The CAN-FD and RS-485 link at every node on the vehicle bus.'},
    ],
  },
  {
    id: 'defence', name: 'Defence, avionics and drones',
    headline: 'Defence, avionics and drones need screened parts, and a failsafe that does not depend on software.',
    lede: 'The drone SoC keeps a hardware failsafe island wired straight to the motor controllers, so a crashed or jammed mission stack can still land the airframe.',
    items: [
      {product: 'd100', primary: true, role: 'Flight control and visual-inertial navigation for drones, with a hardware failsafe to the speed controllers. Navigation is geometric, so it survives GPS jamming.'},
      {product: 'sku3', primary: true, role: 'The sequenced 28 V power rails of avionics and military-vehicle electronics.'},
      {product: 'sku8', primary: true, role: 'Rugged cockpit displays.'},
      {product: 'sku7', role: 'Defence perimeter and counter-drone radar.'},
      {product: 'sku4', role: 'Flight-critical redundancy feeding the D100 roadmap.'},
    ],
  },
  {
    id: 'grid', name: 'Grid and metering',
    headline: 'For the national smart-meter rollout, one chip measures the power and records tampering.',
    lede: 'Tamper detection is a tender requirement, so the chip keeps an always-on clock domain that logs a magnet or an opened case while mains power is cut.',
    items: [
      {product: 'sku2', primary: true, role: 'Class 0.5S metrology for electricity meters, with tamper logging on backup power.'},
    ],
  },
  {
    id: 'boards', name: 'On nearly every board',
    headline: 'Some parts go on nearly every circuit board, which is where the volume is.',
    lede: 'A supervisor watches a board’s power rails and a transceiver connects it to its bus. Neither is glamorous, and both ship with almost everything.',
    items: [
      {product: 'sku6', primary: true, role: 'Watches up to four power rails and latches a fault, on nearly every circuit board.'},
      {product: 'sku5', role: 'Ships with every node on every industrial bus, including harsh wiring harnesses.'},
      {product: 'sku8', role: 'Industrial control panels, rail passenger displays and automotive instrument clusters.'},
    ],
  },
];
