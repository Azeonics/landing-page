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
    bio: 'CEO & Managing Director of Azeonics, and CEO & Director of Earth Now — driving the company’s Idea-to-Orbit vision across precision manufacturing, space-tech skilling and Earth intelligence. A Jawaharlal Nehru Technological University alumnus.',
    photo: '/assets/team-photos/BN-Rao.JPG',
    linkedin: 'https://www.linkedin.com/in/b-n-raao-87898085/',
  },
  {
    name: 'Ravi Nirgudkar',
    role: 'Chief Strategic Officer',
    bio: 'CEO of RFLY Innovations and a seasoned aerospace, defence and manufacturing leader; National Executive Board member and Defense Committee Co-Chair at AMCHAM, with prior leadership at BAE Systems and Raytheon.',
    photo: '/assets/team-photos/Ravi-Nirgudkar.jpg',
    linkedin: 'https://www.linkedin.com/in/nirgudkar',
  },
  { name: 'Bhavik Kamlesh Mehta', role: 'Director', photo: '/assets/team-photos/Bhavik-Sir.JPG' },
  {
    name: 'Manish Asawa',
    role: 'Director',
    bio: 'Director at Azeonics and Managing Director of Asawa Insulation — an award-winning HVAC manufacturing entrepreneur (ACREX Excellence Award, India SME 100). A Welingkar Institute of Management alumnus.',
    photo: '/assets/team-photos/Manish-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/manish-asawa-b7876937/',
  },
  {
    name: 'Kammal K Jaiswal',
    role: 'Director',
    bio: 'Director at Azeonics and owner of Duracool Airconditioning, bringing entrepreneurial and business-operations experience to the leadership team.',
    photo: '/assets/team-photos/Kammal-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/kammal-k-jaiswal-475b8969/',
  },
  {
    name: 'Madhusudan Manjunath Shetty',
    role: 'Director',
    bio: 'Director at Azeonics with 30+ years of industry experience — a senior global procurement leader championing strategic cost-savings and sustainable practices. An XLRI Jamshedpur alumnus.',
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
    bio: 'Drives public-sector and strategic partnerships across SpaceTech, satellite manufacturing and geospatial intelligence — previously a leader at Genesys International.',
    photo: '/assets/team-photos/Nagesh-Sir.JPG',
    linkedin: 'https://www.linkedin.com/in/nagesh-suryavanshi-b1babb17/',
  },
  {
    name: 'Prachi Kulkarni',
    role: 'EVP Aerospace',
    bio: 'EVP for Aerospace at Azeonics and an experienced business leader, and an alumna of Savitribai Phule Pune University.',
    photo: '/assets/team-photos/Prachi-Kulkarni.jpg',
    linkedin: 'https://www.linkedin.com/in/prachi-kulkarni/',
  },
  {
    name: 'Ujjwal Kumar Sittu',
    role: 'AVP Product & Engineering',
    bio: 'AVP of Product & Engineering, an IIT Madras alumnus building aerospace and space-tech products, with a background spanning FinTech, AI and product engineering.',
    photo: '/assets/team-photos/Ujjwal.JPG',
    linkedin: 'https://www.linkedin.com/in/ujjusittu/',
  },
  {
    name: 'Santosh Satyam',
    role: 'EVP Sales',
    bio: 'Chief Growth Officer at EarthNow and a serial founder (CoachIT, CipherLane), driving growth and go-to-market across space-tech and deep-tech. An Osmania University alumnus.',
    photo: '/assets/team-photos/Santosh-Satyam.JPG',
    linkedin: 'https://www.linkedin.com/in/santosh-satyam-68541a8/',
  },
  {
    name: 'Hari Prasad Rai',
    role: 'AVP Sales',
    bio: 'Global Account Director focused on geospatial analytics, strategic partnerships and customer-centric growth at EarthNow. A University of London alumnus.',
    photo: '/assets/team-photos/Hari-Prasad.JPG',
    linkedin: 'https://www.linkedin.com/in/hari-prasad-rai-973280a6/',
  },
  {
    name: 'Harsh Jain',
    role: 'VP Corporate Strategy & International Business',
    bio: 'VP of Corporate Strategy & International Business, an XLRI Jamshedpur alumnus focused on market expansion, strategic partnerships and international go-to-market.',
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
    bio: 'Dean of the KIIT School of Aerospace Engineering, with around 25 years in the aeronautical domain and deep expertise in gas-turbine propulsion and aerospace education.',
    photo: '/assets/team-photos/Mrutyunjay-Jena.jpg',
    linkedin: 'https://www.linkedin.com/in/mrutyunjay-jena-b46b66218',
  },
  {
    name: 'Dr. Dipak Kumar Giri',
    role: 'Honorary Advisor',
    bio: 'Associate Professor of Aerospace Engineering at IIT Kanpur, specialising in satellite attitude dynamics & control and nonlinear control for flight vehicles, with work published in leading AIAA journals.',
    photo: '/assets/team-photos/Dipak-Giri.jpg',
    linkedin: 'https://www.linkedin.com/in/dipak-kumar-giri-03893739',
  },
]
