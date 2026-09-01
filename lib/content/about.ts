import type { ImageRef, MetaRow, Person, SectionHead } from './types'

// ============ STORY ============

export const aboutHead: SectionHead = {
  num: '01 —',
  name: 'About Azeonics',
  title: 'One roof for India’s <em>idea-to-orbit</em> ambition.',
}

export const aboutLead =
  'Azeonics was founded on a simple conviction: India’s makers of drones, satellites and aerospace systems should not have to stitch their supply chain across a dozen vendors and three states to get from a sketch to a qualified flight article.'

export const aboutParagraphs: string[] = [
  'India has 1,000+ drone companies, 250+ space-tech startups and 150+ universities building toward ISRO POEM missions — but the infrastructure to design, machine, qualify and integrate their hardware was scattered, expensive and out of reach for most. Azeonics — the Idea 2 Orbit Innovation Hub — was built to close that gap.',
  'Our 1 lakh sq.ft, vertically-integrated facility brings precision machining, metal additive manufacturing, electronics & sensor fabrication, environmental qualification and ISO-class cleanroom integration together under a single roof. Everything is available on a pay-per-use, manufacturing-as-a-service model.',
  'We are a neutral infrastructure partner — we don’t compete with our customers, we empower them. From student capstones to flight-qualified payloads, our mission is to make world-class aerospace capability accessible, affordable and Made in India.',
]

export const aboutMeta: MetaRow[] = [
  { k: 'Founded', v: 'Azeonics Private Limited' },
  { k: 'Headquarters', v: 'Thane, Maharashtra, India' },
  { k: 'Manufacturing', v: 'Navi Mumbai' },
  { k: 'Focus', v: 'Drones · Satellites · Aerospace' },
  { k: 'Model', v: 'Pay-per-use, MaaS' },
  { k: 'Standards', v: 'ISRO-grade · ISO 9001 · AS9100' },
]

// ============ TEAM PHOTO ============

export const teamPhoto: ImageRef = {
  src: '/assets/team-photos/Team-Without-Prachi-Madam.JPG',
  alt: 'The Azeonics team',
  placeholder: 'Wide team photograph — full leadership & crew',
}

// ============ KEY PEOPLE ============

export const keyPeopleHead: SectionHead = {
  num: '02 —',
  name: 'Key People',
  title: 'The people steering <em>the mission</em>.',
}

export const keyPeopleIntro =
  'The leadership team setting Azeonics’ direction — across strategy, operations and growth — as we build India’s idea-to-orbit ecosystem.'

// Order is intentional — do not re-sort.
// TODO: add `bio` and `linkedin` for each as they are supplied.
// Ravi Nirgudkar (Chief Strategic Officer) has no photo yet — renders the "RN" monogram.
export const keyPeople: Person[] = [
  {
    name: 'B N Raao',
    role: 'CEO & MD',
    bio: 'CEO of Azeonics and CEO & Director of Earth Now, with over 25 years of leadership across geospatial technologies, space applications, remote sensing, AI-driven analytics, digital twins and aerospace innovation. He is building Azeonics and Earth Now as institutions for the next generation of satellite missions, intelligent infrastructure, climate solutions and advanced manufacturing — turning ideas into innovation, innovation into capability, and capability into national and global impact.',
    photo: '/assets/team-photos/BN-Rao.JPG',
    linkedin: 'https://www.linkedin.com/in/b-n-raao-87898085/',
  },
  {
    name: 'Ravi Nirgudkar',
    role: 'Chief Strategic Officer',
    bio: 'A global aerospace, defence and space executive with over 20 years of leadership across national-security and advanced-technology programs. He served as Managing Director for India, Bangladesh & Sri Lanka at BAE Systems, and earlier, at Raytheon Technologies, delivered mission-critical programs for the US Navy and NASA.',
    photo: '/assets/team-photos/Ravi-Nirgudkar.jpg',
    linkedin: 'https://www.linkedin.com/in/nirgudkar',
  },
  {
    name: 'Bhavik Kamlesh Mehta',
    role: 'Director',
    bio: 'Director at Azeonics and founder of FinREQ, a Chartered Accountant bringing deep financial, governance and business-building expertise to the board. He anchors Azeonics’ financial strategy and corporate governance as the company scales.',
    photo: '/assets/team-photos/Bhavik-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/bhavikmehta',
  },
  {
    name: 'Manish Asawa',
    role: 'Director',
    bio: 'Director at Azeonics and Managing Director of Asawa Insulation, a pioneer in pre-insulated sandwich panels and HVAC systems with 6,000+ projects delivered across pharma, healthcare, industrial and commercial sectors. An award-winning manufacturing entrepreneur — recognised with the ACREX Excellence Award for green products and named among the India SME 100 — he brings deep advanced-manufacturing and operations leadership to the board.',
    photo: '/assets/team-photos/Manish-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/manish-asawa-b7876937/',
  },
  {
    name: 'Kammal K Jaiswal',
    role: 'Director',
    bio: 'Director at Azeonics and owner of Duracool Airconditioning. A hands-on entrepreneur with a background in HVAC and cooling systems, he brings business-building and day-to-day operations experience to the leadership team.',
    photo: '/assets/team-photos/Kammal-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/kammal-k-jaiswal-475b8969/',
  },
  {
    name: 'Madhusudan Manjunath Shetty',
    role: 'Director',
    bio: 'Director at Azeonics with over 30 years of industry experience as a senior global procurement leader. A specialist in strategic sourcing and supply-chain optimisation, he champions cost-savings and sustainable practices, bringing enterprise-scale procurement discipline to Azeonics’ manufacturing and operations.',
    photo: '/assets/team-photos/Madhusudan-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/madhusudan-shetty-7b03911ba/',
  },
]

// ============ HEADS OF DEPARTMENT ============

export const hodsHead: SectionHead = {
  num: '03 —',
  name: 'Heads of Department',
  title: 'The leaders <em>running the floor</em>.',
}

export const hodsIntro =
  'The department heads who turn the mission into delivered hardware and services — day in, day out, across sales, aerospace and engineering.'

// Order is intentional — do not re-sort.
// TODO: add `bio` and `linkedin` for each as they are supplied.
// Prachi Kulkarni has no individual photo yet — renders the initials monogram.
export const hods: Person[] = [
  {
    name: 'Nagesh Suryavanshi',
    role: 'EVP – Government & Strategic Business',
    bio: 'Leads Azeonics’ government and strategic business, driving public-sector partnerships across space technology, satellite manufacturing, geospatial intelligence, AI and digital twins. Previously a leader at Genesys International, he brings deep experience delivering large-scale geospatial and digital-twin programs for governments and enterprises, and focuses on strengthening India’s indigenous capabilities across space, defence and geospatial domains.',
    photo: '/assets/team-photos/Nagesh-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/nagesh-suryavanshi-b1babb17/',
  },
  {
    name: 'Prachi Kulkarni',
    role: 'EVP Aerospace',
    bio: 'EVP for Aerospace at Azeonics, leading the company’s aerospace vertical. An experienced business leader, she drives execution, delivery and growth across Azeonics’ aerospace programs.',
    photo: '/assets/team-photos/Prachi-Kulkarni.jpg',
    linkedin: 'https://www.linkedin.com/in/prachi-kulkarni/',
  },
  {
    name: 'Ujjwal Kumar Sittu',
    role: 'AVP Product & Engineering',
    bio: 'AVP of Product & Engineering, leading product and engineering for Azeonics’ aerospace and space-tech platforms. With a background spanning FinTech, AI and software engineering, he brings a product-first approach to building the digital and engineering systems behind the Idea-to-Orbit ecosystem.',
    photo: '/assets/team-photos/Ujjwal.JPG',
    linkedin: 'https://www.linkedin.com/in/ujjusittu/',
  },
  {
    name: 'Santosh Satyam',
    role: 'EVP Sales',
    bio: 'EVP Sales at Azeonics, leading the company’s market and sales function and its SpaceTech skilling programs. He is also Chief Growth Officer at EarthNow — Azeonics’ sister company — driving growth and go-to-market across space-tech and deep-tech, and is a frequent keynote speaker on space-tech education and skilling.',
    photo: '/assets/team-photos/Santosh-Satyam.JPG',
    linkedin: 'https://www.linkedin.com/in/santosh-satyam-68541a8/',
  },
  {
    name: 'Hari Prasad Rai',
    role: 'AVP Sales',
    bio: 'AVP Sales at Azeonics, leading corporate and Urban Local Body (ULB) accounts with a focus on sustainability, green and impact and other verticals. He works at the intersection of Earth observation and climate action — carbon markets, geospatial analytics and digital-twin solutions — helping organisations turn satellite and geospatial data into measurable impact.',
    photo: '/assets/team-photos/Hari-Prasad.JPG',
    linkedin: 'https://www.linkedin.com/in/hari-prasad-rai-973280a6/',
  },
  {
    name: 'Harsh Jain',
    role: 'VP Corporate Strategy & International Business',
    bio: 'VP of Corporate Strategy & International Business, building global growth platforms for Azeonics. He focuses on market expansion, strategic partnerships and go-to-market, helping the company scale into new international markets and accelerate revenue growth.',
    photo: '/assets/team-photos/Harsh-Jain.JPG',
    linkedin: 'https://www.linkedin.com/in/harsh-jain-010230b5/',
  },
]

// ============ HONORARY ADVISORS ============

export const advisorsHead: SectionHead = {
  num: '04 —',
  name: 'Honorary Advisors',
  title: 'Guided by <em>the best</em> in the field.',
}

export const advisorsIntro =
  'Distinguished academic and industry experts who guide our technical and strategic direction across aerospace and space systems.'

// Order is intentional — do not re-sort.
export const advisors: Person[] = [
  {
    name: 'Mrutyunjay Jena',
    role: 'Honorary Advisor',
    bio: 'Dean of the KIIT School of Aerospace Engineering, with around 25 years in the aeronautical domain. A specialist in gas-turbine propulsion and aerospace education, he guides Azeonics on aerospace engineering, academic collaboration and building the next generation of aerospace talent.',
    photo: '/assets/team-photos/Mrutyunjay-Jena.jpg',
    linkedin: 'https://www.linkedin.com/in/mrutyunjay-jena-b46b66218',
  },
  {
    name: 'Dr. Dipak Kumar Giri',
    role: 'Honorary Advisor',
    bio: 'Associate Professor of Aerospace Engineering at IIT Kanpur, specialising in satellite attitude dynamics & control and nonlinear control for flight vehicles. His research spans magnetic attitude control, fault-tolerant satellite systems and multirotor UAV control, with work published in leading journals including the AIAA Journal of Guidance, Control, and Dynamics. He advises Azeonics on satellite guidance, navigation & control and space systems.',
    photo: '/assets/team-photos/Dipak-Giri.jpg',
    linkedin: 'https://www.linkedin.com/in/dipak-kumar-giri-03893739',
  },
]
