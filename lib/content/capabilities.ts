import type {
  Capability,
  GsaasBand,
  GsaasService,
  Plan,
  SectionHead,
} from './types'

// ============ CAPABILITIES ============

export const capabilitiesHead: SectionHead = {
  num: '03 —',
  name: 'Capabilities',
  title: 'Six capabilities, one <em>integrated</em> floor.',
}

export const capabilities: Capability[] = [
  {
    num: 'CP/01',
    title: 'Precision Manufacturing',
    desc: 'High-end 5-axis CNC machining of satellite structural components, reaction wheel housings, rocket turbopump parts, and lightweight aerospace assemblies.',
    specs: ['±5 µm', '5-axis', 'Aerospace-grade alloys'],
    icon: 'cnc',
  },
  {
    num: 'CP/02',
    title: 'Metal Additive Manufacturing',
    desc: 'Print thruster nozzles, thermal manifolds, propellant tanks and lightweight space structures — cutting lead time 50–70% and cost 30–40% vs. imported parts.',
    specs: ['DMLS · LPBF', 'Ti · Inconel · Al', 'Topology-optimised'],
    icon: 'additive',
  },
  {
    num: 'CP/03',
    title: 'Electronics, Avionics & SMT',
    desc: 'SMT and PCBA line for drone flight controllers, GNSS/INS, satellite avionics and payload PCBs — 300–400 high-reliability boards/month.',
    specs: ['SMT line', 'PCBA', 'Conformal coating'],
    icon: 'pcb',
  },
  {
    num: 'CP/04',
    title: 'Advanced Sensor Lab',
    desc: 'Radar modules, EO/IR camera payloads, LiDAR calibration and RF testing — comprehensive signal analysis, optical characterisation, and RF shielding validation for airborne and space payloads.',
    specs: ['EO/IR', 'LiDAR', 'RF · S-band · X-band'],
    icon: 'sensor',
  },
  {
    num: 'CP/05',
    title: 'Environmental Qualification',
    desc: 'Thermal Vacuum (TVAC), EMI/EMC semi-anechoic chamber, and electrodynamic vibration — full launch-readiness testing to ISRO standards.',
    specs: ['TVAC', 'EMI/EMC', 'Vibration'],
    icon: 'tvac',
  },
  {
    num: 'CP/06',
    title: 'Cleanroom Integration',
    desc: 'ISO Class 7 cleanroom for CubeSat, 6U and 12U satellite assembly, payload integration, microelectronics and satellite-level functional testing.',
    specs: ['ISO 6 · ISO 8', 'CubeSat · 6U · 12U', '2–3 sats/month'],
    icon: 'cleanroom',
  },
]

// ============ MaaS ============

export const maasHead: SectionHead = {
  num: '04 —',
  name: 'Manufacturing as a Service',
  title: 'Pay only for what you <em>use</em>.',
}

export const maasLead =
  'A world-class aerospace facility, available <em>by the hour</em>. We democratise access so startups, universities, and MSMEs can move from idea to qualification in <em>3–4 months, not 12</em>.'

export const maasBody: string[] = [
  'Bring your CAD, your boards, your prototype. Book a machine, a test campaign, or a full integration slot. We handle scheduling, operators, certifications and documentation — you keep the IP and walk out with qualified hardware.',
  'For deep partners and educational programs, we also offer a bundled "Idea 2 Orbit" student-satellite package: design lab access, board & structure manufacturing, cleanroom assembly, TVAC/EMI-EMC/vibration testing, launch-readiness certification and ISRO-aligned documentation — all bundled into one accessible package per student.',
]

export const maasPlans: Plan[] = [
  {
    num: 'M/01',
    title: 'Hourly Machine Time',
    cadence: 'Hourly',
    desc: 'Precision machining, 3D printing, electronics assembly, and advanced testing — all booked by the hour with certified operators.',
  },
  {
    num: 'M/02',
    title: 'Day-Based Test Campaigns',
    cadence: 'Per day',
    desc: 'TVAC, EMI/EMC, vibration — booked as full-day campaigns with engineer support.',
  },
  {
    num: 'M/03',
    title: 'On-Demand Manufacturing',
    cadence: 'Per part',
    desc: 'Send drawings, get parts and boards back. From one-offs to qualified small batches.',
  },
  {
    num: 'M/04',
    title: 'Idea-to-Orbit Bundle',
    cadence: 'Per mission',
    desc: 'End-to-end student or startup package — design through launch readiness certification.',
  },
  {
    num: 'M/05',
    title: 'Annual Studio Membership',
    cadence: 'Annual',
    desc: 'Reserved desk + design-lab access + priority on shared infrastructure for resident teams.',
  },
]

// ============ GSaaS ============

export const gsaasHead: SectionHead = {
  num: '05 —',
  name: 'Ground Station as a Service',
  title: 'A <em>ground segment,</em> as a service.',
}

export const gsaasLead =
  'Plug your nano-satellite into a professional-grade ground network from <em>day one of orbit</em> — without the capex or licensing burden.'

export const gsaasBody =
  'Multi-band antennas, automated pass scheduling, telemetry decoding, uplink command and control, secure data pipelines, and a 24×7 Mission Operations Centre — all run by Azeonics on your behalf. We also handle IN-SPACe authorization, WPC coordination and ITU filings.'

export const gsaasBands: GsaasBand[] = [
  { band: 'VHF', label: 'Telemetry' },
  { band: 'UHF', label: 'Telecommand' },
  { band: 'S', label: 'Band' },
  { band: 'X', label: 'Band' },
]

export const gsaasServices: GsaasService[] = [
  {
    num: 'G/01',
    text: 'Pay-per-pass — billed per ground contact, ideal for student missions',
  },
  {
    num: 'G/02',
    text: 'Subscription plans — fixed monthly access for active constellations',
  },
  {
    num: 'G/03',
    text: 'Dedicated mission support — full lifecycle from LEOP to end-of-life',
  },
  {
    num: 'G/04',
    text: 'Training-linked access — bundled pass time for skilling cohorts',
  },
]
