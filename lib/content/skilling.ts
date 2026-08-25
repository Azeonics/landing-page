import type {
  Cta,
  ImageRef,
  ManhaFeature,
  Program,
  SectionHead,
} from './types'

// ============ SKILLING ============

export const skillingHead: SectionHead = {
  num: '06 —',
  name: 'Skilling',
  title:
    'From <em>classroom</em> to CubeSat — the most accessible space-tech training in India.',
}

export const skillingLead =
  "Every program ends with a <em>working satellite</em>, hardware in hand, and a credentialed pathway into India's space sector."

export const skillingSummary =
  'Azeonics Skilling — delivered in partnership with TakeMe2Space, Smartcircuits Innovation and Earth Now — is a tiered, hands-on program built around our proprietary Manha Nano-Satellite Kit. From a one-week bootcamp to a real ISRO POEM capstone payload, learners design, integrate, deploy and operate a CubeSat-class system on real ground-station hardware.'

export const skillingImages: ImageRef[] = [
  { src: '/assets/manha-product.png', alt: 'Manha satellite kit' },
  { src: '/assets/manha-blueprint-crop.png', alt: 'Manha blueprint' },
  {
    src: '/DATE-22-05-2026/WhatsApp Image 2026-05-22 at 11.04.21.jpeg',
    placeholder: 'Cohort photo',
  },
]

export const programs: Program[] = [
  {
    num: 'PROGRAM 01 · BOOTCAMP',
    title: 'Nano Satellite Development Bootcamp',
    duration: '1 Week · Manha Kit',
    desc: 'A short-format intensive that takes school and college learners from satellite fundamentals to a fully built nano-satellite — using our proprietary Manha Sat Kit as the live teaching platform.',
    points: [
      'Satellite concepts, orbits, ground stations',
      'Hands-on kit training — electronics, sensors, MCUs',
      'NOAA signal reception & decoding',
      'Mechanical assembly & programming',
      'Parachute design + drone launch + data analysis',
    ],
  },
  {
    num: 'PROGRAM 02 · ADVANCED',
    title: 'From Classroom to CubeSat Prototype',
    duration: '12 Weeks · Hybrid',
    desc: 'An advanced, semester-style program that takes engineering students into deep satellite-systems territory — culminating in a working Flatsat and a custom mission proposal.',
    points: [
      'OBC, EPS, ADCS, payload, communications',
      'Mission design & simulation in STK, MATLAB, Gpredict',
      'Embedded systems — C/C++, Python, micros',
      'Subsystem validation and signal integrity testing',
      'Mini ground station setup, capstone review',
    ],
    featured: true,
  },
  {
    num: 'PROGRAM 03 · CAPSTONE',
    title: 'ISRO POEM & SMiLE Real-Payload Capstone',
    duration: 'Project · ISRO-Linked',
    desc: "For students and faculty teams ready to fly real hardware. We mentor your payload from concept through ISRO-grade testing and integration support — culminating in a launch on ISRO's POEM or SMiLE platforms.",
    points: [
      'Real payload design for POEM / SMiLE',
      'Full mission lifecycle & documentation',
      'IN-SPACe / ISRO engagement support',
      'Vibration, TVAC, EMI/EMC, shock testing',
      'VSSC / SHAR integration & launch support',
    ],
  },
]

export const skillingCta: Cta = {
  label: 'Apply to a program',
  href: '/contact#contact',
  variant: 'primary',
}

// ============ MANHA SPOTLIGHT ============

export const manhaHeroImage: ImageRef = {
  src: '/assets/manha-hero.png',
  alt: 'Manha nano-satellite kit',
}

/** Corner annotations on the Manha hero image (top-left, bottom-right). */
export const manhaCorners = {
  tl: 'MANHA · NANO-SAT KIT',
  br: 'CUBESAT · 1U · LIVE TEACHING PLATFORM',
}

export const manhaEyebrow = 'FEATURED PRODUCT'

export const manhaTitle = 'Built to <em>fly,</em> made to <em>teach.</em>'

export const manhaParagraphs: string[] = [
  'The Manha Sat Kit is a fully-assembled, working nano-satellite kit — designed by Azeonics as the live teaching platform for our skilling programs. It mirrors the architecture of a real CubeSat: OBC, EPS, ADCS, communications, payload modules and ground-station interface, all in a flight-ready 1U structure.',
  'Cohorts use the same kit to learn satellite fundamentals, complete a real mission cycle, and walk away with their own hardware to keep building on.',
]

export const manhaFeatures: ManhaFeature[] = [
  { k: 'Form', v: 'CubeSat · 1U' },
  { k: 'Subsystems', v: 'OBC · EPS · ADCS · Comms' },
  { k: 'Comms', v: 'VHF / UHF telemetry' },
  { k: 'Used in', v: 'Skilling · Capstone · R&D' },
]

export const manhaExtras: ImageRef[] = [
  { src: '/assets/manha-blueprint-crop.png', alt: 'Manha technical drawing' },
  { src: '/assets/manha-product.png', alt: 'Manha satellite product shot' },
]
