export interface Stat {
  value: string
  label: string
  /** Styled suffix rendered after the value (e.g. 'L', 'µm', '×', '+'). */
  suffix?: string
}
export interface PipelineStage {
  num: string
  title: string
  desc: string
  icon?: string
}
export interface Capability {
  num: string
  title: string
  desc: string
  specs: string[]
  icon?: string
}
export interface Plan {
  num: string
  title: string
  /** Billing cadence label (e.g. 'Hourly', 'Per day') — never an amount. */
  cadence: string
  desc: string
}
export interface Program {
  num: string
  title: string
  duration: string
  desc: string
  points: string[]
  featured?: boolean
}
export interface Product {
  name: string
  desc: string
  category: string
  group: string
  image?: string
}
export interface CatalogGroup {
  id: string
  title: string
  count: string
}
export interface AudienceCard {
  num: string
  name: string
  meta: string
  image?: string
  imagePlaceholder?: string
}
export interface Partner {
  name: string
  sub?: string
  style?: 'sans' | 'mono' | 'italic'
}
export interface Location {
  label: string
  name: string
  address: string
  tag: string
}

/**
 * Section heading block shared by every section.
 * `title` may contain `<em>…</em>` markers around emphasised words —
 * consumers parse these into styled spans.
 */
export interface SectionHead {
  num: string
  name: string
  title: string
}

/** Hero block on the home page. */
export interface Hero {
  /** Monospace eyebrow text next to the status dot. */
  eyebrow: string
  /** Pill badge text in the eyebrow row. */
  pill: string
  /** Title lines; each line may contain `<em>…</em>` markers. */
  titleLines: string[]
  sub: string
  ctas: Cta[]
  stats: Stat[]
}

export interface Cta {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

export interface MetaRow {
  k: string
  v: string
}

export interface ImageRef {
  src: string
  alt?: string
  placeholder?: string
}

/** GSaaS frequency band cell (e.g. VHF / Telemetry). */
export interface GsaasBand {
  band: string
  label: string
}

/** GSaaS service row (e.g. G/01 Pay-per-pass …). */
export interface GsaasService {
  num: string
  text: string
}

/** Manha spotlight key/value feature. */
export interface ManhaFeature {
  k: string
  v: string
}

/** International footprint cell (region · city · address). */
export interface InternationalLocation {
  region: string
  name: string
  address: string
}

/** Catalog filter chip; `filter` is the data-filter value. */
export interface FilterChip {
  label: string
  filter: string
}

/** Component / product partner logo shown in the catalog. */
export interface ComponentPartner {
  name: string
  logo: string
}

/** Contact info row (label / value). */
export interface InfoRow {
  label: string
  value: string
}

/**
 * Contact form field definition. `name` is the JSON key posted to
 * /api/contact — these must not change without updating the API.
 */
export interface FormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'select' | 'textarea'
  placeholder?: string
  required: boolean
  options?: string[]
}
