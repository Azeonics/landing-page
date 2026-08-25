import type {
  Hero,
  ImageRef,
  MetaRow,
  PipelineStage,
  SectionHead,
} from './types'

// ============ HERO ============

export const hero: Hero = {
  eyebrow: 'Azeonics · Idea 2 Orbit Innovation Hub',
  pill: 'Thane, Maharashtra · India',
  titleLines: [
    'From <em>Earth Intelligence</em>',
    'to <em>Space Excellence.</em>',
    'Under one roof.',
  ],
  sub: "India's first integrated precision manufacturing, testing, and innovation facility for drones, satellites and aerospace systems — delivered as a pay-per-use service for startups, universities, and MSMEs.",
  ctas: [
    {
      label: 'Explore capabilities',
      href: '/capabilities#capabilities',
      variant: 'primary',
    },
    {
      label: 'Manufacturing as a Service',
      href: '/capabilities#maas',
      variant: 'secondary',
    },
  ],
  stats: [
    { value: '1', suffix: 'L', label: 'sq.ft facility' },
    { value: '±5', suffix: 'µm', label: 'Machining tolerance' },
    { value: '3–4', suffix: '×', label: 'Faster idea to qualification' },
    { value: '2k', suffix: '+', label: 'Students trained per year' },
  ],
}

// ============ TICKER ============

export const tickerItems: string[] = [
  '5-Axis Precision Machining',
  'Metal Additive Manufacturing',
  'ISO-6 & ISO-8 Cleanroom Integration',
  'TVAC & EMI/EMC Qualification',
  'Ground Station as a Service',
  'Idea-to-Orbit Skilling',
]

// ============ ABOUT / THE HUB ============

export const hubHead: SectionHead = {
  num: '01 —',
  name: 'The Hub',
  title: 'A <em>national</em> infrastructure backbone for space-tech.',
}

export const hubLead =
  'India has 1,000+ drone companies, 250+ space-tech startups, and 150+ universities preparing for ISRO POEM missions. Yet no single facility offered all the capabilities to design, prototype, manufacture, qualify and integrate aerospace systems — until now.'

export const hubParagraphs: string[] = [
  'Azeonics — Idea 2 Orbit Innovation Hub — is a 1 lakh sq.ft, vertically-integrated facility that brings precision machining, metal additive, electronics & sensor fabrication, environmental qualification, and cleanroom integration together under one roof.',
  "We are a neutral infrastructure partner. We don't compete with our customers — we empower them. Every machine, every test bay, and every cleanroom slot is available on a pay-per-use, manufacturing-as-a-service model.",
]

export const hubMeta: MetaRow[] = [
  { k: 'Legal Entity', v: 'Azeonics Private Limited' },
  { k: 'Headquarters', v: 'Thane, Maharashtra, India' },
  { k: 'Manufacturing', v: 'Taloja, Maharashtra' },
  { k: 'Focus', v: 'Drones · Satellites · Aerospace' },
  { k: 'Model', v: 'Pay-per-use, MaaS' },
  { k: 'Standards', v: 'ISRO-grade · ISO 9001 · AS9100' },
]

export const hubImage: ImageRef = {
  src: '/assets/cubesat-integration-in-iso-7-room.png',
  alt: 'Technicians integrating a satellite in the Azeonics cleanroom',
  placeholder: 'Wide shot: facility floor / cleanroom / integration hall',
}

// ============ PIPELINE: Idea to Orbit ============

export const pipelineHead: SectionHead = {
  num: '02 —',
  name: 'The Journey',
  title: 'From idea 2 orbit, in <em>six</em> integrated stages.',
}

export const pipelineStages: PipelineStage[] = [
  {
    num: '01 / IDEATE',
    title: 'Concept',
    desc: 'Mission planning, payload definition, design studios and avionics labs.',
    icon: 'orbit',
  },
  {
    num: '02 / DESIGN',
    title: 'Engineer',
    desc: 'CAD/CAE/CAM, FEA, HIL/SIL test rigs, electronics bench, rapid iteration.',
    icon: 'draft',
  },
  {
    num: '03 / BUILD',
    title: 'Manufacture',
    desc: '5-axis CNC, metal additive, sheet metal, SMT/PCBA — boards and structures.',
    icon: 'machine',
  },
  {
    num: '04 / QUALIFY',
    title: 'Test',
    desc: 'TVAC, EMI/EMC semi-anechoic, electrodynamic vibration — ISRO-grade.',
    icon: 'flask',
  },
  {
    num: '05 / INTEGRATE',
    title: 'Assemble',
    desc: 'ISO-6 & ISO-8 cleanrooms for CubeSat, 6U, 12U integration and functional test.',
    icon: 'grid',
  },
  {
    num: '06 / OPERATE',
    title: 'Orbit',
    desc: 'Ground Station as a Service: pass scheduling, telemetry, mission ops.',
    icon: 'antenna',
  },
]
