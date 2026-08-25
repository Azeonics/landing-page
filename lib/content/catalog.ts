import { catalogImages } from '@/lib/site-data'
import type {
  CatalogGroup,
  ComponentPartner,
  FilterChip,
  Product,
  SectionHead,
} from './types'

// ============ CATALOG ============

export const catalogHead: SectionHead = {
  num: '08 —',
  name: 'Catalog',
  title: 'Space-ready <em>hardware</em>, available now.',
}

export const catalogIntro =
  'A growing catalog of flight-grade subsystems and ground infrastructure — from CubeSat platforms and OBCs to test rigs and launch adapters. Available standalone or as part of a turnkey mission package.'

// ============ COMPONENT / PRODUCT PARTNERS ============

export const componentPartnersLabel = 'Component & Product Partners'

export const componentPartners: ComponentPartner[] = [
  {
    name: 'TakeMe2Space',
    logo: '/assets/tm2-space-logo.avif',
  },
]

// ============ FILTERS ============

export const filterChips: FilterChip[] = [
  { label: 'All', filter: 'all' },
  { label: 'Platforms', filter: 'platforms' },
  { label: 'On-Board Compute', filter: 'obc' },
  { label: 'Attitude & Control', filter: 'adcs' },
  { label: 'Power', filter: 'power' },
  { label: 'Comms', filter: 'comms' },
  { label: 'Structures', filter: 'struct' },
  { label: 'Test Infrastructure', filter: 'test' },
]

// ============ GROUPS ============

export const catalogGroups: CatalogGroup[] = [
  { id: 'platforms', title: 'Satellite Platforms', count: 'PLATFORMS · 8 PRODUCTS' },
  { id: 'obc', title: 'On-Board Compute', count: 'OBC · 3 PRODUCTS' },
  { id: 'adcs', title: 'Attitude & Control', count: 'ADCS · 5 PRODUCTS' },
  { id: 'power', title: 'Power', count: 'EPS · 3 PRODUCTS' },
  { id: 'comms', title: 'Communications', count: 'COMMS · 1 PRODUCT' },
  { id: 'struct', title: 'Structures & Materials', count: 'STRUCT · 4 PRODUCTS' },
  { id: 'test', title: 'Test Infrastructure', count: 'TEST · 5 PRODUCTS' },
]

// ============ PRODUCTS ============
// Product names are the join key into `catalogImages` in lib/site-data.ts —
// they must match those keys exactly.

export const products: Product[] = [
  // —— Satellite Platforms ——
  {
    name: 'Darwin',
    desc: '30–50 kg microsat bus — flagship platform for sub-100 kg missions.',
    category: 'MICROSAT',
    group: 'platforms',
    image: catalogImages['Darwin'],
  },
  {
    name: 'Arya-16',
    desc: '16U CubeSat bus for high-capability payload missions.',
    category: 'CUBESAT BUS',
    group: 'platforms',
    image: catalogImages['Arya-16'],
  },
  {
    name: 'Arya-12',
    desc: '12U CubeSat bus — medium-class payload platform.',
    category: 'CUBESAT BUS',
    group: 'platforms',
    image: catalogImages['Arya-12'],
  },
  {
    name: 'Arya-8',
    desc: '8U CubeSat bus — versatile for EO, IoT and tech-demo missions.',
    category: 'CUBESAT BUS',
    group: 'platforms',
    image: catalogImages['Arya-8'],
  },
  {
    name: 'Arya-6',
    desc: '6U CubeSat bus — the workhorse class for first missions.',
    category: 'CUBESAT BUS',
    group: 'platforms',
    image: catalogImages['Arya-6'],
  },
  {
    name: 'Arya-3',
    desc: '3U CubeSat bus — compact platform for student / academic missions.',
    category: 'CUBESAT BUS',
    group: 'platforms',
    image: catalogImages['Arya-3'],
  },
  {
    name: 'Arya-2',
    desc: '2U CubeSat bus — the smallest standalone in the Arya series.',
    category: 'CUBESAT BUS',
    group: 'platforms',
    image: catalogImages['Arya-2'],
  },
  {
    name: 'Arya-1',
    desc: '1U CubeSat bus — the entry-level flight-grade platform.',
    category: 'CUBESAT BUS',
    group: 'platforms',
    image: catalogImages['Arya-1'],
  },
  // —— On-Board Compute ——
  {
    name: 'CMCube',
    desc: 'High-performance on-board computer for CubeSats with mission-critical workloads.',
    category: 'OBC',
    group: 'obc',
    image: catalogImages['CMCube'],
  },
  {
    name: 'AICube',
    desc: 'Space-optimised GPU module — onboard AI inference for EO and payload data.',
    category: 'AI / GPU',
    group: 'obc',
    image: catalogImages['AICube'],
  },
  {
    name: 'ZeroCube',
    desc: 'Compact OBC for CubeSats, powered by Raspberry Pi Zero — ideal for academia.',
    category: 'OBC',
    group: 'obc',
    image: catalogImages['ZeroCube'],
  },
  // —— Attitude & Control ——
  {
    name: 'AeroMagControl',
    desc: 'Integrated ADCS module for CubeSats — magnetorquer-based attitude control.',
    category: 'ADCS',
    group: 'adcs',
    image: catalogImages['AeroMagControl'],
  },
  {
    name: 'SpaceWheel 30',
    desc: '30 mNms reaction wheel for precise three-axis attitude control.',
    category: 'REACTION WHEEL',
    group: 'adcs',
    image: catalogImages['SpaceWheel 30'],
  },
  {
    name: 'SunSense',
    desc: 'Coarse sun sensor — reliable solar vector input for ADCS.',
    category: 'SUN SENSOR',
    group: 'adcs',
    image: catalogImages['SunSense'],
  },
  {
    name: 'AirCoil',
    desc: 'Air-core magnetorquer — lightweight attitude actuator for nano-sats.',
    category: 'TORQUER',
    group: 'adcs',
    image: catalogImages['AirCoil'],
  },
  {
    name: 'HyperMagCoil',
    desc: 'High-density magnetorquer for missions requiring extra control authority.',
    category: 'TORQUER',
    group: 'adcs',
    image: catalogImages['HyperMagCoil'],
  },
  // —— Power ——
  {
    name: 'PowerBank',
    desc: '50 Wh battery pack — qualified energy storage for CubeSat missions.',
    category: 'BATTERY',
    group: 'power',
    image: catalogImages['PowerBank'],
  },
  {
    name: 'PowerDrive',
    desc: 'Electrical Power System for CubeSats — regulation, distribution, telemetry.',
    category: 'EPS',
    group: 'power',
    image: catalogImages['PowerDrive'],
  },
  {
    name: 'PowerPlane',
    desc: 'Body-mounted solar panels — surface-form solar arrays for CubeSats.',
    category: 'SOLAR',
    group: 'power',
    image: catalogImages['PowerPlane'],
  },
  // —— Communications ——
  {
    name: 'xHF Comms',
    desc: 'UHF / VHF communications module — telemetry & command for CubeSats.',
    category: 'RADIO',
    group: 'comms',
    image: catalogImages['xHF Comms'],
  },
  // —— Structures & Materials ——
  {
    name: 'CubeFrame',
    desc: 'Machined CubeSat chassis — modular, flight-grade structural frame.',
    category: 'CHASSIS',
    group: 'struct',
    image: catalogImages['CubeFrame'],
  },
  {
    name: 'Structure Rods Kit',
    desc: 'Precision rods for assembling CubeSat structural frames.',
    category: 'STRUCTURE',
    group: 'struct',
    image: catalogImages['Structure Rods Kit'],
  },
  {
    name: 'Subsystem Spacers Kit',
    desc: 'Stack spacers for CubeSat subsystem boards — precision-machined.',
    category: 'STRUCTURE',
    group: 'struct',
    image: catalogImages['Subsystem Spacers Kit'],
  },
  {
    name: 'RadShield Coating',
    desc: 'Radiation-shielding tape for sensitive electronics in orbit.',
    category: 'SHIELDING',
    group: 'struct',
    image: catalogImages['RadShield Coating'],
  },
  // —— Test Infrastructure ——
  {
    name: 'hCage',
    desc: 'Helmholtz cage — generates controlled magnetic fields for ADCS testing.',
    category: 'ADCS TEST',
    group: 'test',
    image: catalogImages['hCage'],
  },
  {
    name: 'FloatMaster',
    desc: 'Air-bearing platform for frictionless ADCS algorithm validation.',
    category: 'ADCS TEST',
    group: 'test',
    image: catalogImages['FloatMaster'],
  },
  {
    name: 'CubeHDRM',
    desc: 'Hold-Down and Release Mechanism (HDRM) for CubeSat deployments.',
    category: 'DEPLOY',
    group: 'test',
    image: catalogImages['CubeHDRM'],
  },
  {
    name: 'POEM / SMiLE Emulator',
    desc: 'Bench-side emulator that mimics POEM / SMiLE platform interfaces for payload validation.',
    category: 'EMULATOR',
    group: 'test',
    image: catalogImages['POEM / SMiLE Emulator'],
  },
  {
    name: 'POEM / SMiLE Adapter',
    desc: 'Adapter board for plugging student payloads into POEM and SMiLE missions.',
    category: 'ADAPTER',
    group: 'test',
    image: catalogImages['POEM / SMiLE Adapter'],
  },
]
