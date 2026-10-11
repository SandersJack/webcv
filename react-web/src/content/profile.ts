/**
 * Verified profile facts, sourced from the live portfolio (portfolio.jack-sanders.uk).
 * Add nothing here that is not backed by the existing public site or an
 * approved source, see docs/PRODUCTION_IMPLEMENTATION_PLAN.md §10.
 */

export type Publication = {
  title: string
  venue: string
  year: number
  role: 'Main author' | 'Corresponding author' | 'Author'
  link: string
  linkLabel: string
  summary: string
}

export type Experience = {
  organisation: string
  role: string
  period: string
  description: string
}

export const profile = {
  name: 'Jack Sanders',
  fullName: 'Jack Dylan Sanders',
  tagline: 'Physicist. Engineer. Developer.',
  positioning:
    'Software engineer at BT building mobile apps for the BT and EE consumer brands, and PhD researcher in experimental particle physics at the University of Birmingham.',
  email: 'sandersjack141@gmail.com',
  links: {
    github: 'https://github.com/SandersJack',
    linkedin: 'https://www.linkedin.com/in/jackdsanders/',
  },
  affiliations: [
    'University of Birmingham',
    'CERN',
    'NA62',
    'HIKE',
  ],
  skills: [
    'Python',
    'C++',
    'C',
    'HTML',
    'CSS',
    'JavaScript',
    'Flutter',
    'React Native',
    'Swift',
    'Kotlin',
    'Docker',
    'SQL',
    'REST APIs',
  ],
} as const

export const education: Experience[] = [
  {
    organisation: 'University of Birmingham',
    role: 'Experimental Particle Physics PhD',
    period: 'Graduation year: 2025',
    description:
      'Software developer and researcher in the NA62 collaboration. Led the refactoring of the NA62 framework, the C++ codebase for Monte Carlo simulation of the NA62 detector and reconstruction of NA62 data, making it flexible enough for users to design and implement new detectors, work that was used extensively for the HIKE proposal. Spent six months at CERN on a long-term attachment, helping install the new CEDAR-H detector, acting as detector expert for the CEDAR/KTAG, and as an expert for the PC farm.',
  },
  {
    organisation: 'University of Birmingham',
    role: 'Physics MSci',
    period: 'Graduation year: 2021',
    description:
      'A strong foundation in physics and computer science, specialising in particle physics and quantum mechanics. Final-year project with the NEWS-G group developing a new spherical proportional counter for neutron spectroscopy, including a new simulation and analysis of the data produced by the detector.',
  },
]

export const workExperience: Experience[] = [
  {
    organisation: 'EE & BT',
    role: 'Software Engineer',
    period: 'Sept 2025–present',
    description:
      'Building mobile apps for the BT and EE consumer brands, focusing on broadband and home wifi. Working with Flutter and React Native apps, and building developer tools in Python.',
  },
  {
    organisation: 'University of Birmingham',
    role: 'Postgraduate Teaching Assistant',
    period: 'Part-time, 2021–2025',
    description:
      'Year 2 lab demonstrator for electronics and coding projects, marker for physics problem sheets, and exam invigilator.',
  },
  {
    organisation: 'NEWS-G',
    role: 'Summer Studentship',
    period: 'Summer 2021',
    description:
      'Analysed a detailed simulation of neutron interactions with a spherical proportional counter, comparing it against experimental data from the detector installed at the University of Birmingham.',
  },
  {
    organisation: 'ARUP',
    role: 'Vacation Placement',
    period: 'Summers 2017, 2018, 2019',
    description:
      'Worked in the Highways and Bridges team in Cardiff on large-scale infrastructure projects, including the A40 dual carriageway upgrade in Pembrokeshire (public consultation) and the M4/A470 study in Cardiff, where a comprehensive traffic-data study informed the design of new junctions.',
  },
]

export const publications: Publication[] = [
  {
    title:
      'A new hydrogen-filled Cherenkov detector for kaon tagging at the NA62 experiment at CERN',
    venue: 'JINST',
    year: 2024,
    role: 'Main author',
    link: 'https://iopscience.iop.org/article/10.1088/1748-0221/19/05/C05026',
    linkLabel: '2024 JINST 19 C05026',
    summary:
      'The precision measurement of K⁺→π⁺νν̄ at NA62 requires kaon identification with time resolution better than 100 ps, at least 95% efficiency, and pion misidentification below 10⁻⁴. A new CEDAR using hydrogen (CEDAR-H) as its radiator gas was developed to reduce material in the beamline, validated in a 2022 test beam, and approved for NA62 data taking from 2023.',
  },
  {
    title:
      'Development of a new CEDAR for kaon identification at the NA62 experiment at CERN',
    venue: 'JINST',
    year: 2024,
    role: 'Corresponding author',
    link: 'https://iopscience.iop.org/article/10.1088/1748-0221/19/05/P05005',
    linkLabel: '2024 JINST 19 P05005',
    summary:
      'The CEDAR-H detector minimises material in the beam path by using hydrogen gas as the radiator medium. It was shown to satisfy the kaon tagging requirements in a test beam before installation and commissioning, with performance measured using NA62 data collected in 2023.',
  },
  {
    title:
      'Neutron spectroscopy with a high-pressure nitrogen-filled spherical proportional counter',
    venue: 'NIM',
    year: 2023,
    role: 'Author',
    link: 'https://www.sciencedirect.com/science/article/pii/S0168900223001146',
    linkLabel: 'j.nima.2023.168124',
    summary:
      'First neutron measurements with a nitrogen-filled spherical proportional counter at operating pressures up to 1.8 bar, enhancing its prospects as a neutron spectrometer for challenging environments including underground laboratories and industrial and medical settings.',
  },
]
