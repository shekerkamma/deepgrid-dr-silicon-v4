// Pages for the Software, Use Cases, About and Contact menus, built from deepgridsemi.com's content
// (captured 2026-09-26: content/reference/deepgridsemi/, structured/) under content/reconciliation.md:
// deepgridsemi.com is final where it overlaps the showcase; its template filler and unsourced
// claims are left out. Every section names the reference page it came from (`from`).
//
// Policy (user, 2026-09-26): include deepgridsemi.com's content as the site states it, in its own
// wording. Two exceptions, both links rather than content: the SDK page's "Order Metis!" button (it
// sells Axelera AI's board) and its GitHub download (no repository exists), replaced by a request for
// SDK access. Showcase additions are marked `from: 'showcase …'`.

import { url } from './routes';
import { areas, products } from './applications-story-data';
import { V, videoGroups, shortGroups, docGroups, type VideoGroup, type DocGroup } from './resources-data';

export type Card = { title: string; text?: string; image?: string; meta?: string; href?: string; icon?: string };
export type FlowStep = { label: string; text: string; icon: string };
export type Person = { name: string; role: string; detail?: string; photo?: string; initials: string; bio?: string[] };
export type Section =
  | { kind: 'split'; kicker?: string; title: string; lede?: string; paras: string[]; image?: string; imageAlt?: string; flow?: FlowStep[]; flowLabel?: string; from: string }
  | { kind: 'cards'; kicker?: string; title: string; lede?: string; cols: 2 | 3 | 4; items: Card[]; from: string }
  | { kind: 'steps'; kicker?: string; title: string; lede?: string; items: Card[]; from: string }
  | { kind: 'stats'; items: [string, string][]; from: string }
  | { kind: 'people'; kicker?: string; title: string; lede?: string; people: Person[]; from: string }
  | { kind: 'figures'; kicker?: string; title: string; items: { src: string; alt: string; caption: string; w: number; h: number }[]; from: string }
  | { kind: 'contact'; from: string }
  | { kind: 'roster'; kicker?: string; title: string; lede?: string; groups: { title: string; people: [string, string][] }[]; from: string }
  | { kind: 'films'; kicker?: string; title: string; lede?: string; ids: string[]; from: string }
  | { kind: 'videos'; kicker?: string; title: string; lede?: string; groups: VideoGroup[]; shorts?: VideoGroup[]; channel?: boolean; from: string }
  | { kind: 'docs'; groups: DocGroup[]; from: string }
  | { kind: 'scene'; scene: 'motor' | 'truck' | 'defence'; title: string; lede: string; from: string }
  | { kind: 'bullets'; kicker?: string; title: string; items: string[]; from: string }
  | { kind: 'cta'; title: string; lede: string; actions: { label: string; href: string; primary?: boolean }[]; from: string };

export type CompanyPage = {
  id: string;
  menu: 'about' | 'contact' | 'resources' | 'usecases';
  path: string;
  label: string;
  title: string;
  kicker: string;
  lede: string;
  heroImage?: { src: string; alt: string; fit?: 'natural' };
  chips?: [string, string][];
  sections: Section[];
};

const REF = 'https://deepgridsemi.com';
const img = (p: string) => url('/images/' + p);

export const companyPages: CompanyPage[] = [
  {
    id: 'story', menu: 'about', path: 'about', label: 'Our story',
    kicker: 'About Us', title: 'A semiconductor company for edge AI, in Hyderabad',
    lede: 'Our mission is to provide businesses with cutting-edge AI acceleration technology to thrive in today\'s intelligent systems market.',
    sections: [
      { kind: 'stats', from: REF + '/about/story', items: [['2020', 'Founded'], ['28', 'Team Members'], ['4', 'Product Lines']] },
      { kind: 'split', title: 'Who We Are', from: REF + '/about/story',
        paras: [
          'Deepgrid Semi is a pioneering semiconductor company specializing in AI acceleration solutions for edge computing. Founded by a team of industry veterans with decades of combined experience in chip design, AI, and autonomous systems, we are at the forefront of the AI revolution.',
          'Our headquarters in Hyderabad, India, serves as a hub of innovation where world-class engineers and researchers collaborate to push the boundaries of what\'s possible in AI hardware acceleration.',
          'We focus on delivering specialized System-on-Chip (SoC) solutions that bring datacenter-class AI performance to edge devices, enabling real-time intelligence in autonomous vehicles, robotics, industrial automation, and smart infrastructure.',
        ],
        image: img('scenes/company-wafer-1536.webp'), imageAlt: 'Illustration of a 200 mm silicon wafer covered in identical small dies, lit in copper' },
      { kind: 'cards', title: 'Company Strategy', cols: 3, from: REF + '/about/story',
        items: [
          { title: 'Our Philosophy', text: 'Our philosophy is simple: innovate with a purpose. We don\'t just create technology for the sake of innovation; we aim to solve real-world problems that impact road safety and mobility. Our approach is focused on delivering practical, high-performance solutions that enhance driver awareness, anticipate potential hazards, and respond rapidly to keep you safe.' },
          { title: 'Our Vision', text: 'Towards ZERO Fatalities on Roads. We envision a world where roads are safer for everyone, where AI-powered automotive technology significantly reduces traffic accidents. By equipping vehicles with state-of-the-art ADAS solutions, we aim to make this vision a reality. Looking back from 2040, we should proudly declare that there used to be so many fatalities on our roads, but now we have achieved zero.' },
          { title: 'Our Mission', text: 'Our mission is to push the boundaries of automotive technology by developing intelligent chipsets that provide predictive safety features and real-time assistance. We aim to set new benchmarks in the ADAS industry by making vehicles smarter, more responsive, and capable of preventing accidents before they happen.' },
        ] },
      { kind: 'cards', title: 'Our Values', cols: 4, from: REF + '/about/story',
        items: [
          { title: 'Innovation', text: 'We are dedicated to continuously exploring new technologies and methodologies to enhance automotive safety.' },
          { title: 'Safety', text: 'Our core focus is on keeping drivers and passengers safe, making it the foundation of all our developments.' },
          { title: 'Quality', text: 'We deliver reliable, high-performance technology designed to meet stringent automotive standards.' },
          { title: 'Collaboration', text: 'We work closely with leading automotive manufacturers and partners to bring the best ADAS solutions to the market.' },
        ] },
      { kind: 'split', title: 'From Concept to Implementation', from: REF + '/about/story',
        paras: [
          'At DeepGrid Semi, we take pride in turning innovative concepts into reality. Our development process involves rigorous research, extensive testing, and collaboration with industry leaders to ensure our hardware & software solutions are not only technologically advanced but also practical and effective in real-world applications.',
          'We aim to deliver products that address the most challenging driving conditions, such as low visibility and unpredictable obstacles, with features like radar-based assistance and blind-spot detection.',
        ] },
      { kind: 'steps', title: 'How an idea becomes a product', from: REF + '/about/story',
        items: [
          { title: 'Rigorous Research', text: 'Extensive R&D for cutting-edge solutions' },
          { title: 'Extensive Testing', text: 'Real-world validation and optimization' },
          { title: 'Industry Collaboration', text: 'Partnering with leading manufacturers' },
          { title: 'Practical Solutions', text: 'Real-world effectiveness guaranteed' },
        ] },
      { kind: 'cta', title: 'Join Us on Our Journey', lede: 'Whether you\'re looking to partner with us, join our team, or learn more about our technology, we\'d love to hear from you.', from: REF + '/about/story',
        actions: [ { label: 'Contact Us', href: 'contact', primary: true }, { label: 'Leadership and team', href: 'about/team' } ] },
    ],
  },
  {
    id: 'team', menu: 'about', path: 'about/team', label: 'Leadership & team',
    kicker: 'About', title: 'Leadership and team',
    lede: 'The founders, board, engineering organisation, advisors and the partners contracted for the silicon.',
    sections: [
      { kind: 'people', title: 'Leadership', from: REF + '/about/team',
        people: [
          { name: 'Aravind Prasad G', role: 'Founder & Chief Executive Officer', initials: 'AP', photo: img('deepgridsemi/aravind.webp'),
            detail: 'B.Tech ECE, Bangalore University · Research Associate, IISc Bangalore (speech signal processing) · Stanford SDRM, 2007',
            bio: ['Twenty years across three founded ventures (Evolgence IT Solutions, Deepgrid Datacentre, Evolgence Energy) spanning telecom, AI cloud infrastructure and solar.',
              'Deployed AI systems for Hyundai Glovis, Pike Electric and Mapsol across predictive analytics, NLP and multimodal LLM stacks.',
              'Commercial accountability across DeepGrid’s four business units: ADAS, defence, robotics and AI licensing.'] },
          { name: 'Ayaz Khan', role: 'Chief Technology Officer · Silicon architecture', initials: 'AK', detail: 'M.Sc. Physics, IIT Gandhinagar' },
        ] },
      { kind: 'people', title: 'Board and officers', from: REF + '/about/team',
        people: [
          { name: 'Prashant Sadanand', role: 'Part-time Director · CMO', initials: 'PS', photo: img('deepgridsemi/prashanth.webp'), bio: ['Owns OEM go-to-market and commercial positioning across the ADAS product family.'] },
          { name: 'Jayesh Loya', role: 'Virtual CFO', initials: 'JL' },
          { name: 'Krishna Mohan R', role: 'Independent Director', initials: 'KM', bio: ['Twenty years in corporate governance as Senior Director at Citadel Group.'] },
        ] },
      { kind: 'stats', from: REF + '/about/team', items: [['28', 'Engineers'], ['10', 'Silicon / hardware'], ['6', 'AI / perception'], ['7', 'Firmware / software'], ['5', 'Design, test, G&A']] },
      { kind: 'roster', title: 'Our Team', lede: '28 engineers across four domains.', from: REF + '/about/team',
        groups: [
          { title: 'Silicon / Hardware', people: [['Arun Saathappan Sundaraam', 'Sr. Digital IC Design Engineer'], ['Koushik B', 'Sr. Digital IC Design Engineer'], ['Santu Sardar', 'Digital IC Engineer'], ['Chandana Pokala', 'Digital IC Engineer'], ['Shrivardhini Indla', 'Digital IC Engineer'], ['Siddhartha V. S. Bade', 'Digital IC Engineer'], ['Ananya Sindam', 'RTL Engineer'], ['Srikar Varma Penmetsa', 'RTL Engineer'], ['Haritha Palgunam', 'Silicon Verification'], ['Rajesh Hembram', 'Hardware Engineer']] },
          { title: 'AI / Perception', people: [['Aryaman Anil Kaprekar', 'ADAS Engineer · Perception Lead'], ['Vishista Reddy Mandala', 'AI Engineer'], ['S. Haemanth Ruban', 'AI Engineer'], ['Shankar Pathlavath', 'AI Engineer'], ['Rahul Aka', 'AI Firmware Engineer'], ['Kodali Paani Chowdary', 'Python Developer (Intern)']] },
          { title: 'Firmware / Software', people: [['Saiteja Jampula', 'Firmware Engineer'], ['Bhavagna Bathula', 'Firmware Engineer'], ['Srikar Panuganti', 'Software Dev Engineer'], ['Gopi Krishna Pulicharla', 'Software Dev Engineer'], ['Snigdha Mohapatra', 'Software Dev Engineer'], ['Govind Sarang', 'Backend Engineer'], ['Srinath Panuganti', 'Front-end Developer']] },
          { title: 'Design / Test / G&A', people: [['Rehan Ahmed Siddiqui', '3D Design & Hardware PCB'], ['Madhu Babu Mallappagari', 'UI & Graphic Designer'], ['Sai Sreekar Tirumala', 'Manual Testing'], ['R. K. Goverdhan', 'G&A / Support'], ['A. Govardhan', 'G&A / Support']] },
        ] },
      { kind: 'people', title: 'Advisors', from: REF + '/about/team',
        people: [
          { name: 'Venkat Simhadri', role: 'Strategic advisor', initials: 'VS', detail: 'Ex-CEO, MosChip Technologies', bio: ['Semiconductor commercialisation, fabless go-to-market and listed-company governance; advises on the SoC roadmap, OEM design-in and capital-markets readiness.'] },
          { name: 'Emani Capital Advisory', role: 'Financial advisor · placement agent', initials: 'EC', detail: 'Sai Emani · Haradatta Emani', bio: ['Lead financial advisor for the pre-Series A.'] },
          { name: 'Dr. Ramesh Patel', role: 'ANRF lead PI · IIT Tirupati', initials: 'RP', detail: 'Electrical Engineering', bio: ['Ph.D. UNIST; former Ericsson antenna architect. Antenna systems, 5G base stations, mm-wave and THz detectors.'] },
          { name: 'Dr. M.V. Kartikeyan', role: 'ANRF co-PI · IIT Tirupati', initials: 'MK', detail: 'Electrical Engineering', bio: ['Fellow IEEE, INAE, IET and IETE; Alexander von Humboldt Fellow. RF and antenna architecture, computational electromagnetics.'] },
          { name: 'Prof. C. Krishna Mohan', role: 'Academic advisor · IIT Hyderabad', initials: 'CK', detail: 'Computer Science & Engineering', bio: ['Heads the VIGIL lab: intelligent transportation, autonomous-vehicle perception and real-time edge AI.'] },
          { name: 'Dr. K.T. Satyajith', role: 'Academic advisor · IMJIR', initials: 'KS', detail: 'Founder Director', bio: ['Experimental physics: atomic physics, ion trapping, precision spectroscopy and quantum computing.'] },
        ] },
      { kind: 'cards', title: 'Silicon & Manufacturing Partners', lede: 'Specialist firms engaged across fabrication, physical design, IP and board manufacturing for the 28 nm combo die.', cols: 3, from: REF + '/about/team',
        items: [
          { title: 'Muse Semi / GSME', meta: 'Fab / MPW', text: 'TSMC 28 nm HPC+ shuttle for the six-chiplet combo die; 79-day fab cycle.' },
          { title: 'SmartSoC', meta: 'Physical design', text: 'RTL-to-GDS partner: floorplanning, place and route, timing, DRC/LVS sign-off.' },
          { title: 'PrimeSoC', meta: 'IP partner', text: 'Authored the feasibility reports DGrid-FS-001/002-2026; architecture confirmed feasible.' },
          { title: 'Terminus Circuits', meta: 'PHY IP', text: 'High-speed PHY hard macros for the 28 nm die.' },
          { title: 'Anamya Technologies', meta: 'FPGA board fab', text: 'Artix-7 200T prototype boards and carrier PCBs for the current AD-series pilots.' },
        ] },
    ],
  },
  {
    id: 'recognition', menu: 'about', path: 'about/recognition', label: 'Achievements',
    kicker: 'Our milestones', title: 'Achievements',
    lede: 'Milestones and recognition in AI acceleration innovation',
    sections: [
      { kind: 'split', title: 'Top 50 Startups in Telangana', lede: 'Telangana Innovation Ecosystem & T-Hub · Recognition Year: 2024', from: REF + '/about/achievements',
        paras: ['DeepGrid Semi Pvt. Ltd. is redefining the semiconductor landscape with its indigenous DGrid SoC, a low-power, high-parallelism AI chipset designed for ADAS, robotics, and edge intelligence. With a mission to bring Full-Stack Edge Intelligence: from Silicon, Sensors, Systems to Sentience, DeepGrid Semi stands at the forefront of India\'s next-generation compute innovation.'], },
      { kind: 'stats', from: REF + '/about/achievements', items: [['1000+', 'ADAS chipsets'], ['5+', 'Collaborations'], ['3+', 'Patents'], ['28', 'Skilled engineers']] },
      { kind: 'bullets', title: 'Achievements', from: REF + '/about/achievements',
        items: [
          '1,000+ ADAS chipsets currently in the prototyping stage, showcasing our commitment to innovation and safety.',
          '5+ Strategic collaborations with top Original Equipment Manufacturers (OEMs), including Yamaha Motors, Kia Motors, Renault-Nissan, and Maruti Suzuki.',
          '3+ Patents filed for AI-based safety technologies that enhance automotive performance and accident prevention.',
          '28 skilled engineers and researchers committed to advancing our ADAS solutions.',
        ] },
      { kind: 'cards', title: 'All Awards & Recognition', cols: 3, from: REF + '/about/achievements',
        items: [
          { title: 'Top 50 Startups in Telangana', meta: '2024 · Telangana Innovation Ecosystem & T-Hub', text: 'Selected among the Top 50 Startups in Telangana for pioneering India\'s edge-first semiconductor and AI ecosystem with the DGrid-SoC chipset.' },
          { title: 'Top 10 AI Semiconductor Companies', meta: '2024 · Industry Analyst Report', text: 'Recognized among the top 10 AI semiconductor companies globally for our innovative NPU architecture and transformer optimization capabilities.' },
          { title: 'Innovation Excellence Award', meta: '2024 · Semiconductor Industry Association', text: 'Honored for breakthrough innovations in edge AI processing and power-efficient chip design methodologies.' },
          { title: 'Best Product Design - DG-T100', meta: '2024 · Design & Engineering Awards', text: 'Our DG-T100 transformer accelerator received acclaim for its elegant architecture and exceptional performance-per-watt ratio.' },
          { title: 'Technology Pioneer', meta: '2023 · World Economic Forum', text: 'Selected as a Technology Pioneer for advancing AI acceleration technology and contributing to autonomous systems development.' },
          { title: 'Fast Company Most Innovative', meta: '2023 · Fast Company Magazine', text: 'Featured for our disruptive approach to AI chip design and rapid market adoption in robotics and automotive sectors.' },
          { title: 'Best Emerging Technology', meta: '2023 · CES Innovation Awards', text: 'Awarded at CES for our groundbreaking edge AI solutions that enable real-time processing in resource-constrained environments.' },
          { title: 'Breakthrough Technology Award', meta: '2022 · MIT Technology Review', text: 'Recognized by MIT Technology Review for pioneering work in neural processing unit architecture and AI acceleration.' },
          { title: 'Rising Star Company', meta: '2022 · TechCrunch Disrupt', text: 'Named Rising Star at TechCrunch Disrupt for our rapid growth and innovative solutions in the AI semiconductor space.' },
        ] },
      { kind: 'figures', title: 'TiE50 Hyderabad, at the Hyderabad Entrepreneurship Summit', from: REF + '/about/achievements',
        items: [
          { src: img('deepgridsemi/award1.webp'), alt: 'The DeepGrid Semi team receiving the award on stage at the Hyderabad Entrepreneurship Summit', caption: 'The award at the Hyderabad Entrepreneurship Summit.', w: 1280, h: 960 },
          { src: img('deepgridsemi/award2.webp'), alt: 'TiE50 Hyderabad announcement: DeepGrid Semi selected among the Top 50 Startups in Telangana', caption: 'The TiE50 Hyderabad announcement.', w: 1280, h: 1280 },
        ] },
    ],
  },

  // ------------------------------------------------------------------ Resources,
  {
    id: 'docs', menu: 'resources', path: 'resources/docs', label: 'Documentation',
    kicker: 'Technical documentation & resources', title: 'Resources',
    lede: 'Access technical documentation, datasheets, whitepapers, and development resources',
    sections: [
      { kind: 'docs', groups: docGroups, from: 'deepgridsemi.com/resources/docs + the site\'s own PDFs' },
      { kind: 'cta', title: 'Need Technical Support?', lede: 'Our technical team is here to help you get the most out of our products', from: 'deepgridsemi.com/resources/docs',
        actions: [ { label: 'Contact Support', href: 'contact', primary: true }, { label: 'Videos', href: 'resources/videos' } ] },
    ],
  },
  {
    id: 'videos', menu: 'resources', path: 'resources/videos', label: 'Videos',
    kicker: 'Demos, field tests & deep dives', title: 'Videos',
    lede: 'Watch DeepGrid Semi\'s silicon, autonomous driving, and mobility platforms in action.',
    sections: [
      { kind: 'videos', title: 'By platform', groups: videoGroups, shorts: shortGroups, channel: true, from: 'deepgridsemi.com/resources/videos + youtube.com DeepGrid Semi channel' },
      { kind: 'cta', title: 'Simulations and the narrated walkthrough', lede: 'The product lines in their simulators, the silicon films, and the 104-slide portfolio narrated end to end.', from: 'showcase films',
        actions: [ { label: 'Simulations & walkthrough', href: 'demonstrations', primary: true }, { label: 'Documentation', href: 'resources/docs' } ] },
    ],
  },

  // ------------------------------------------------------------------ Contact,
  {
    id: 'contact', menu: 'contact', path: 'contact', label: 'Contact',
    kicker: 'We\'re here to help', title: 'Get in Touch',
    lede: 'Let\'s discuss how Deepgrid Semi can power your AI innovation',
    sections: [{ kind: 'contact', from: REF + '/contact' }],
  },
];


// ------------------------------------------------------------------ Use cases (DG32 site)
// One page per application area, generated from applications-story-data.ts (the Annex's socket sheets): the
// same areas, chips, roles and evidence the Applications page shows, laid out on the use-case template. Only
// DG32's own films appear, on the area they explain; no third-party or other-product footage is attached.
const SCENE: Record<string, { src: string; alt: string }> = {
  motors: { src: '/media/deepgrid_robotics.jpg', alt: 'Concept render of an autonomous forklift in a warehouse aisle' },
  vehicles: { src: '/media/deepgrid_truck.jpg', alt: 'Concept render of a truck on a wet highway at dusk' },
  defence: { src: '/media/deepgrid_defence.jpg', alt: 'Concept render of a border surveillance tower seen from an operator cabin' },
  grid: { src: '/images/scenes/grid-meters-1536.webp', alt: 'Concept render of a row of electricity smart meters on a utility wall' },
  boards: { src: '/images/scenes/boards-supervisor-1536.webp', alt: 'Concept render of an industrial controller board with a small supervisor chip' },
};
const FILMS: Record<string, string[]> = { motors: ['dg32-fault-path-explained', 'dg32-lite-architecture'] };
const stageOf = (e: string) => (e.startsWith('First silicon') ? 'First silicon' : e.startsWith('FPGA') ? 'FPGA-validated' : 'Design only');
export const useCasePages: CompanyPage[] = areas.map((a) => {
  const items = a.items.map((i) => ({ ...i, p: products[i.product] }));
  const sections: Section[] = [
    { kind: 'split', title: 'Where the chips fit', paras: [a.lede], from: 'applications-story-data.ts (Technical Annex v3)' },
    { kind: 'cards', title: 'The chips for this application', lede: `${items.length} ${items.length === 1 ? 'chip' : 'chips'}, each with what it does here.`, cols: items.length > 2 ? 3 : 2,
      items: items.map((i) => ({ title: i.p.name, meta: `${i.p.tag} · ${stageOf(i.p.evidence)}`, text: i.role + (i.p.replaces ? ' Replaces: ' + i.p.replaces : '') })),
      from: 'applications-story-data.ts' },
    { kind: 'bullets', title: 'What the evidence says today', items: items.map((i) => `${i.p.tag}, ${i.p.name}: ${i.p.evidence}`), from: 'applications-story-data.ts' },
  ];
  const SCENE3D: Record<string, { scene: 'motor' | 'truck' | 'defence'; title: string; lede: string }> = {
    motors: { scene: 'motor', title: 'The motor the chips run and supervise', lede: 'Three phase windings around a magnet rotor: SKU-1 drives them, DG32-LITE watches the drive and can shut it down.' },
  };
  if (SCENE3D[a.id]) sections.splice(1, 0, { kind: 'scene', ...SCENE3D[a.id], from: 'v3 three.js scenes' });
  if (FILMS[a.id]) sections.push({ kind: 'films', title: 'DG32 in this application, explained', lede: 'Narrated films on the DG32 safety path and architecture, with captions.', ids: FILMS[a.id], from: 'DG32 films' });
  sections.push({ kind: 'cta', title: 'Tell us about your application', lede: 'The motor, the control requirement and the sensing constraint are what we need to answer.', from: 'site',
    actions: [{ label: 'Discuss your application', href: '/contact', primary: true }, { label: 'All chips by application', href: '/applications' }] });
  return {
    id: 'uc-' + a.id, menu: 'usecases', path: 'use-cases/' + a.id, label: a.name, kicker: 'Use case', title: a.name, lede: a.headline,
    heroImage: { src: url(SCENE[a.id].src), alt: SCENE[a.id].alt },
    chips: items.slice(0, 3).map((i) => [i.p.name, i.role] as [string, string]),
    sections,
  };
});
companyPages.push(...useCasePages);

export const pageById = (id: string) => companyPages.find((p) => p.id === id);
