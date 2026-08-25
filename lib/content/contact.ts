import type {
  AudienceCard,
  FormField,
  InfoRow,
  InternationalLocation,
  Location,
  Partner,
  SectionHead,
} from './types'

// ============ GLOBAL FOOTPRINT ============

export const footprintHead: SectionHead = {
  num: '09 —',
  name: 'Global Footprint',
  title: 'Built in <em>India.</em> Going global.',
}

export const footprintIndiaLabel = 'India · Operating Locations'
export const footprintIndiaCount = '02'

export const indiaLocations: Location[] = [
  {
    label: 'Headquarters',
    name: 'Thane, Maharashtra',
    address:
      '204, 2nd Floor, Opal Square IT Park, Wagle Estate, Padwal Nagar, Thane West, Thane, Maharashtra 400604',
    tag: 'HQ',
  },
  {
    label: 'Manufacturing',
    name: 'Navi Mumbai, Maharashtra',
    address: 'Navi Mumbai',
    tag: 'Mfg Unit',
  },
]

export const footprintInternationalLabel = 'International'
export const footprintInternationalCount = '01'

export const internationalLocations: InternationalLocation[] = [
  {
    region: 'Region · North America',
    name: 'Beverly Hills, California',
    address:
      '8549 Wilshire Boulevard, Beverly Hills, California 90211, United States',
  },
]

// ============ WHO WE SERVE ============

export const audienceHead: SectionHead = {
  num: '10 —',
  name: 'Who We Serve',
  title: 'Built for the makers of <em>Indian</em> space-tech.',
}

export const audienceCards: AudienceCard[] = [
  {
    num: 'A/01',
    name: 'Space-tech Startups',
    meta: 'Manufacturing · Qualification',
    image: '/DATE-22-05-2026/WhatsApp Image 2026-05-22 at 11.04.56.jpeg',
    imagePlaceholder: 'Space-tech startup team',
  },
  {
    num: 'A/02',
    name: 'Universities & Research Labs',
    meta: 'POEM · SMiLE · CubeSats',
    image: '/DATE-22-05-2026/WhatsApp Image 2026-05-22 at 11.14.24.jpeg',
    imagePlaceholder: 'University research team',
  },
  {
    num: 'A/03',
    name: 'Drone & UAV Companies',
    meta: 'Sensors · Flight controllers',
    image: '/DATE-22-05-2026/WhatsApp Image 2026-05-22 at 11.15.10.jpeg',
    imagePlaceholder: 'Drone company / UAV',
  },
  {
    num: 'A/04',
    name: 'Aerospace MSMEs',
    meta: 'Tier-2 supply · Qualification',
    image: '/DATE-22-05-2026/WhatsApp Image 2026-05-22 at 11.04.39.jpeg',
    imagePlaceholder: 'MSME / aerospace SME',
  },
]

// ============ PARTNERS ============

export const partnersHead: SectionHead = {
  num: '11 —',
  name: 'Partners & Clients',
  title: 'In good <em>company</em>.',
}

export const partnersIntro =
  'Working alongside government, consulting majors, industry leaders, and a network of innovative startups — across space-tech, advisory, manufacturing and emerging tech.'

export const partners: Partner[] = [
  { name: 'WSC', style: 'sans' },
  { name: 'Govt. of Odisha', style: 'italic' },
  { name: 'SV University' },
  { name: 'PwC', style: 'sans' },
  { name: 'EY', style: 'sans' },
  { name: 'Accenture', style: 'sans' },
  { name: 'KPMG', style: 'sans' },
  { name: 'MYCHO', style: 'mono' },
  { name: 'JSW Group', style: 'sans' },
  { name: 'Tata Steel', style: 'italic' },
  { name: 'Universal Sompo' },
  { name: 'Future Generali', style: 'italic' },
  { name: 'Cholamandalam' },
  { name: 'Ksheema Insurance' },
  { name: 'AGROWATCH', style: 'mono' },
  { name: 'Agribook', style: 'italic' },
  { name: 'AGRICAPITA', style: 'mono' },
  { name: 'EncureIT', style: 'sans' },
  { name: 'ARKWIZ', style: 'mono' },
  { name: 'Replete Business', style: 'italic' },
  { name: 'R FLY', style: 'mono' },
  { name: 'Imperative', style: 'italic' },
  { name: 'TakeMe2Space', style: 'sans' },
  { name: 'Earth Now', style: 'sans' },
]

// ============ CONTACT ============

export const contactHead: SectionHead = {
  num: '12 —',
  name: 'Contact',
  title: "Let's <em>launch</em> something.",
}

export const contactSub =
  "Tell us about your mission, your prototype or your training cohort. We'll come back within one working day with a feasibility note and a slot."

export const contactInfo: InfoRow[] = [
  { label: 'Legal Entity', value: 'Azeonics Private Limited' },
  {
    label: 'Headquarters',
    value:
      '204, 2nd Floor, Opal Square IT Park, Wagle Estate, Padwal Nagar, Thane West, Thane, Maharashtra 400604',
  },
  {
    label: 'Manufacturing',
    value: 'Navi Mumbai',
  },
  { label: 'Mail', value: 'info@azeonics.com' },
  { label: 'Phone', value: '+91-9668913303' },
]

/**
 * Contact form fields. The `name` values are the JSON keys POSTed to
 * /api/contact — keep them in sync with the API route.
 */
export const contactFormFields: FormField[] = [
  {
    id: 'f-name',
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
  },
  {
    id: 'f-email',
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@company.com',
    required: true,
  },
  {
    id: 'f-interest',
    name: 'interest',
    label: "I'm interested in",
    type: 'select',
    placeholder: 'Select an option',
    required: true,
    options: [
      'Manufacturing as a Service',
      'Test & Qualification campaign',
      'Cleanroom & integration slot',
      'Ground Station as a Service',
      'Skilling program (1-week bootcamp)',
      'Skilling program (12-week advanced)',
      'ISRO POEM / SMiLE capstone',
      'Idea-to-Orbit student bundle',
      'Partnership / Other',
    ],
  },
  {
    id: 'f-msg',
    name: 'message',
    label: 'Tell us more',
    type: 'textarea',
    placeholder: 'Briefly describe your mission, prototype or cohort…',
    required: true,
  },
]

export const contactSubmitLabel = 'Send enquiry'
export const contactSuccessMessage =
  '✓ Thanks — we will be in touch within one working day.'
