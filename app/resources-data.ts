import { url } from './routes';
// Resources: deepgridsemi.com/resources/docs and /resources/videos (captured 2026-09-26), plus the DeepGrid Semi
// YouTube channel (UCNhzSUQYxiL7lGdzxMRwNvA, listed 2026-09-26 with yt-dlp). The reference's own titles and
// descriptions are used wherever it lists a video; channel videos it does not list are kept as new information
// under their own groups, titled from the channel. Documents the reference names but that do not exist as files
// are shown "on request", never as links; the downloadable ones are the site's own PDFs.
export const CHANNEL = 'https://www.youtube.com/@DeepgridSemi/videos'; // = channel UCNhzSUQYxiL7lGdzxMRwNvA (all 28 ids match)

export type Video = { id: string; title: string; text?: string; secs?: number; short?: boolean };
export type VideoGroup = { title: string; lede?: string; videos: Video[]; from: string };
export type Doc = { title: string; note?: string; href?: string; meta?: string };
export type DocGroup = { title: string; lede: string; items: Doc[] };

const REF = 'deepgridsemi.com/resources/videos';
const YT = 'youtube.com/@DeepGridSemi channel';

export const V = {
  hitech: { id: 'qBHUWiiw4Po', title: 'Live ADAS Demo on Hyderabad City Roads', text: 'Thermal vision and real-time perception running live on Hitech City roads with the DG-A100.', secs: 1152 },
  dgridAdas: { id: 'Kn9Q4THjG6c', title: 'DGRID-ADAS: Lane Detection & Collision Warning', text: 'Live lane detection and forward-collision warning running on real road footage.', secs: 109 },
  scen2: { id: '0rEnXT__B7M', title: 'Indian Road Driving Test: Scenario 2', text: 'Perception and depth estimation on dense, unstructured Indian road scenarios.', secs: 217 },
  test3: { id: 'x7pi4APnNik', title: 'Indian Driving: ADAS Test 3', text: 'Another on-road evaluation of the perception stack across challenging Indian traffic.', secs: 222 },
  modelOut: { id: '5YDEm77Tndc', title: 'Indian Driving: Model Output', text: 'A look at the raw model output (segmentation, depth, and BEV) on Indian roads.', secs: 222 },
  nuscenes: { id: 'vjA720O8RcE', title: 'End-to-End Driving on nuScenes', text: 'From perception to control: our end-to-end driving stack on the nuScenes dataset.', secs: 9 },
  waymo: { id: 'UaNaELUh1JM', title: 'End-to-End Architecture on the Waymo Dataset', text: 'A narrative walkthrough of perception and prediction on the open Waymo autonomous-driving dataset.', secs: 20 },
  carla: { id: 'aSZdrH3EerY', title: 'End-to-End Driving Trained in CARLA', text: 'Our end-to-end autonomous driving architecture learning to navigate in the CARLA simulator.', secs: 10 },
  softmax: { id: 'FD2xhoQYwKA', title: 'Inside the DGRID Softmax ENGINE Accelerator', text: 'A walkthrough of the 3D chip layout on Sky130: the silicon behind the DG-R100 accelerator.', secs: 168 },
  mirrorThermal: { id: 'JnnzI768PZ8', title: 'AD0 AI Smart Mirror with Thermal Vision', text: 'See through glare in real time: thermal-enhanced ADAS on the AD0 smart mirror.', secs: 22 },
  mirrorDemo: { id: 'gGoUd4a-DLw', title: 'AD0 AI Smart Mirror (D-Mirror) Demo', text: 'Real-time driver alerts demonstrated on the D-Mirror ADAS display.', secs: 66 },
  mirrorAlerts: { id: 'Bx9gC9iW99k', title: 'Real-Time ADAS Alerts on D-Mirror', text: 'Live lane, object, and hazard alerts rendered on the D-Mirror display.', secs: 66 },
  followMe: { id: '-iY2KLMsZqw', title: 'D-Drive: Follow-Me Mode', text: 'D-Drive autonomously tracks and follows its target in real time.', secs: 655 },
  turn360: { id: 'fvz-Uhi8vhU', title: 'D-Drive: 360° Turn (Field Test 1)', text: 'In-place maneuverability test of the D-Drive chassis.', secs: 30 },
  bev: { id: 'knNspgTt7rM', title: 'D-Drive: BEV Perception', text: "Bird's-eye-view perception stack running on the D-Drive platform.", secs: 7 },
  steering: { id: 'pmIK4nGp5xg', title: 'D-Drive: Autonomous Steering Control', text: 'Steering-control test: the platform actuates the wheel autonomously (no manual driving).', secs: 13 },
  // channel only
  apexYoga: { id: 'i_5wXj0lHmM', title: 'Apexgrid doing a basic yoga exercise', text: 'The Apexgrid humanoid holding a sequence of yoga poses.', secs: 207 },
  apexCal: { id: 'KFQ4EHIeZnk', title: 'Apexgrid yoga: calibration of joints', short: true },
  apexSalute: { id: 'gevSbk7C50M', title: 'Salute by Apexgrid', short: true },
  apexFast: { id: 'SX-Nvnv5Dhg', title: 'Apexgrid saluting, first time fast', short: true },
  apexLawn: { id: 'fI0cZ8k1fWs', title: 'Apexgrid in the lawn, moving and saluting', short: true },
  apexLawn2: { id: 'eCAw60kV01Q', title: 'Apexgrid in the lawn', short: true },
  apexArms: { id: '75G6kkpDopw', title: 'Humanoid moving hands up and down', short: true },
  dieVoice: { id: 'Bw34e4sx144', title: 'DG32-LITE, looking at the die: 3.9 × 3.9 millimetres', text: 'A narrated tour of the DG32-LITE die.', secs: 162 },
  dieSilent: { id: '8Y6m7UTAZXY', title: 'DG32-LITE, looking at the die: 3.9 × 3.9 millimetres (without narration)', secs: 162 },
  anatomy: { id: 'b4VFlC5GDzY', title: 'Anatomy of our chip (DG32-2DOM): 13 words from a real tape-out', text: 'The vocabulary of a silicon tape-out, explained on the DG32-2DOM.', secs: 681 },
  lockstep: { id: 'bJOUUJhwa9w', title: 'DG32-LITE: dual-core lockstep RISC-V safety MCU, laid out', secs: 81 },
  gdsii: { id: '4ZVohoOoesE', title: 'DG32-LITE: GDSII view', secs: 120 },
  wrapalign: { id: 'VYNbuuYrXSg', title: "Why the DG32-2DOM's power never reached the wrapper, and how Wrapalign fixed it", secs: 164 },
  latchup: { id: 'HBLdDD5Vm9k', title: 'SAR guard ring latch-up', secs: 201 },
  pcb: { id: 'CKDsqkh1eZA', title: 'Our PCB engine, live: autoroute and auto-placement', secs: 75 },
  slam: { id: 'mRvephRowgc', title: 'D-Drive moving autonomously after slamming', secs: 139 },
  dd360s: { id: 't2EvO403h0k', title: 'D-Drive 360° movement', short: true },
  ddFwd: { id: 'hZWILGZ-mnY', title: 'D-Drive drivetrain alpha test: moving forward', short: true },
  ddBack: { id: 'Rnl7k74dVaE', title: 'D-Drive drivetrain alpha test: moving backwards', short: true },
  dbase: { id: 'io4zmbFq1MM', title: 'D-Base Alpha v1', short: true },
  retrofit: { id: 'fAoHp7WnTuY', title: 'DGrid retrofit ADAS: LDWS, FCWS, LKAS, over-speed and traffic-sign alerts', short: true },
  l1: { id: 'svS1tD3uY_g', title: 'ADAS L1 in action', short: true },
  western: { id: 'qG8XNHRXZWk', title: 'ADAS on Western and Indian roads: the difference (first model)', short: true },
  thub: { id: 'AOaSVtRbvRk', title: 'Aravind Prasad, Director, DeepGrid Semi, with T-Hub', text: 'The founder on DeepGrid Semi, recorded with T-Hub.', secs: 211 },
  site: { id: '-0YJvIQHIA8', title: 'deepgridsemi.com', text: 'A tour of the company website.', secs: 114 },
} satisfies Record<string, Video>;

// On the DG32 site the silicon group, which holds the DG32 videos, comes first.
export const videoGroups: VideoGroup[] = [
  { title: 'Silicon & Architecture', lede: 'Go inside our AI accelerators: chip floorplanning, compute engines, and the silicon design behind ultra-low-power inference at the edge.', from: REF + ' + ' + YT,
    videos: [V.dieVoice, V.anatomy, V.lockstep, V.gdsii, V.wrapalign, V.latchup, V.dieSilent, V.softmax] },
  { title: 'Autonomous Driving: ADAS', lede: 'From Indian city streets to benchmark datasets: real-world road tests plus the end-to-end perception, prediction, and planning stack that powers them on CARLA, Waymo, and nuScenes.', from: REF,
    videos: [V.hitech, V.dgridAdas, V.scen2, V.test3, V.modelOut, V.nuscenes, V.waymo, V.carla] },
  { title: 'Smart Mirror: D-Mirror', lede: 'The AD0 Smart Mirror (D-Mirror) turns the rear-view mirror into a live ADAS display: thermal vision that sees through glare, with real-time driver and hazard alerts.', from: REF,
    videos: [V.mirrorThermal, V.mirrorDemo, V.mirrorAlerts] },
  { title: 'Autonomous Mobility: D-Drive', lede: "Field tests of the D-Drive autonomous mobility platform: follow-me navigation, bird's-eye-view perception, and autonomous steering control.", from: REF + ' + ' + YT,
    videos: [V.followMe, V.turn360, V.bev, V.steering, V.slam] },
  { title: 'Humanoid: Apexgrid', lede: 'The Apexgrid humanoid: joint calibration, balance and first movements.', from: YT,
    videos: [V.apexYoga] },
  { title: 'Company', lede: 'The founder with T-Hub, and the company website.', from: YT, videos: [V.thub, V.site] },
  { title: 'Engineering tools', lede: 'The in-house tools behind the boards.', from: YT, videos: [V.pcb] },
];
export const shortGroups: VideoGroup[] = [
  { title: 'Apexgrid humanoid', from: YT, videos: [V.apexCal, V.apexSalute, V.apexFast, V.apexLawn, V.apexLawn2, V.apexArms] },
  { title: 'D-Drive and D-Base', from: YT, videos: [V.dd360s, V.ddFwd, V.ddBack, V.dbase] },
  { title: 'ADAS on the road', from: YT, videos: [V.retrofit, V.l1, V.western] },
];

const D = url('/downloads/docs/');
const ASK = (what: string) => 'mailto:group@deepgrid.in?subject=' + encodeURIComponent('Document request: ' + what);
export const docGroups: DocGroup[] = [
  { title: 'Product Datasheets', lede: 'Detailed specifications and technical documentation for all our AI accelerators',
    items: [
      { title: 'DG32-LITE preliminary datasheet', note: 'Lockstep RISC-V motor-control SoC on SkyWater sky130A, 64-pin QFN.', href: D + 'deepgrid-dg32-lite-preliminary-datasheet.pdf', meta: 'PDF · 12 pages' },
      { title: 'DG32-2DOM preliminary datasheet', note: 'DG32-LITE plus an INT8 attention accelerator on a second clock.', href: D + 'deepgrid-dg32-2dom-preliminary-datasheet.pdf', meta: 'PDF · 12 pages' },
      { title: 'DG32 QFN-64 datasheets, both parts', note: 'DG32-LITE and DG32-2DOM in one document.', href: D + 'deepgrid-datasheets-qfn64.pdf', meta: 'PDF · 24 pages' },
      { title: 'SKU architecture compendium, technical annex v3', note: 'Nine SKU architecture sheets plus the D100 drone SoC and the SDV platform.', href: D + 'deepgrid-sku-compendium-technical-annex-v3.pdf', meta: 'PDF · 14 pages · 4.8 MB' },
      { title: 'DG-A100 ADAS SoC' }, { title: 'DG-R100 Radar SoC' }, { title: 'DG-S100 SDV Controller' }, { title: 'DG-T100 Transformer NPU' },
    ] },
  { title: 'SDK Documentation', lede: 'Complete developer guides and API references for DGrid SDK',
    items: [{ title: 'Getting Started' }, { title: 'API Reference' }, { title: 'Code Examples' }, { title: 'Best Practices' }] },
  { title: 'Technical Whitepapers', lede: 'In-depth research papers and technical analyses',
    items: [
      { title: 'Mature-node silicon for India’s defence and industrial base', note: 'Plain-language edition, v3.', href: D + 'deepgrid-mature-node-silicon-master-whitepaper-v3.pdf', meta: 'PDF · 71 pages · 5.4 MB' },
      { title: 'DG32-2DOM system architecture: block definition', note: 'Per-block architecture of the attention variant.', href: D + 'deepgrid-dg32-2dom-system-architecture.pdf', meta: 'PDF · 24 pages' },
      { title: 'DG32-LITE base variant: thirty use cases and models', note: 'The AI tasks the part runs with no attention engine in the path.', href: D + 'deepgrid-dg32-ai-30-use-cases.pdf', meta: 'PDF · 12 pages' },
      { title: 'AI Acceleration Architecture' }, { title: 'Edge Computing Performance' }, { title: 'Power Efficiency Studies' },
    ] },
  { title: 'Integration Guides', lede: 'Step-by-step guides for integrating our solutions',
    items: [{ title: 'Hardware Integration' }, { title: 'Software Setup' }, { title: 'System Configuration' }, { title: 'Troubleshooting' }] },
  { title: 'Performance Benchmarks', lede: 'Real-world performance metrics and comparison studies',
    items: [{ title: 'ADAS Benchmarks', note: 'How each DG32 figure was obtained, and which are not yet measured, is on Evidence.', href: '/evidence' }, { title: 'Transformer Performance' }, { title: 'Power Consumption Analysis' }] },
  { title: 'Software Downloads', lede: 'Latest drivers, tools, and development kits',
    items: [{ title: 'DGrid SDK' }, { title: 'Drivers & Firmware' }, { title: 'Development Tools' }, { title: 'Sample Projects' }] },
].map((g) => ({ ...g, items: g.items.map((d) => (d.href ? d : { ...d, href: ASK(d.title), meta: 'On request' })) }));
