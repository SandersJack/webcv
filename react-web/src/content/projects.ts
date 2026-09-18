/**
 * Project case-study model (plan §4 — projects and case studies).
 * Every entry is backed by the live portfolio; `publicityLevel` guards
 * against publishing details that have not been approved.
 */

export type ProjectCategory = 'physics' | 'software' | 'web'

export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  summary: string
  status: 'complete' | 'in-progress' | 'maintained'
  year: string
  role: string
  team: string
  problem: string
  approach: string[]
  result: string
  limitations: string
  technologies: string[]
  links: ProjectLink[]
  relatedPath: 'physics' | 'mobile' | 'water' | null
  publicityLevel: 'public' | 'review-required'
}

export const projects: Project[] = [
  {
    id: 'flexible-na62-framework',
    title: 'Flexible NA62 Framework',
    category: 'physics',
    summary:
      'Generalised the NA62 Monte Carlo framework so new detectors can be designed and placed freely from a configuration file.',
    status: 'complete',
    year: '2021–2023',
    role: 'Lead developer',
    team: 'NA62 collaboration software team',
    problem:
      'The NA62 simulation framework was hard-coded to the existing detector setup; only that exact geometry could be simulated, which blocked studies of new detectors.',
    approach: [
      'Generalised the framework classes so a .dat configuration file defines the detector setup, allowing detectors to be placed in any position and orientation.',
      'Validated the refactored simulation and reconstruction extensively, including Geantino scans to check impacts with detector volumes and comparisons against the original simulation output.',
    ],
    result:
      'The flexible framework is used extensively within NA62 for developing new detectors and was integral to the HIKE proposal.',
    limitations:
      'Internal collaboration software; the codebase is not public.',
    technologies: ['C++', 'Geant4', 'Monte Carlo simulation'],
    links: [
      {
        label: 'HIKE proposal on INSPIRE-HEP',
        href: 'https://inspirehep.net/literature/2722407',
      },
    ],
    relatedPath: 'physics',
    publicityLevel: 'public',
  },
  {
    id: 'slim-mc',
    title: 'Slim MC',
    category: 'physics',
    summary:
      'Compressed NA62 Monte Carlo output to a third of its original size using smaller data types and custom compression.',
    status: 'complete',
    year: '2023–2024',
    role: 'Developer',
    team: 'NA62 collaboration software team',
    problem:
      'NA62 analysis requires large volumes of simulation — around a petabyte of Monte Carlo output — but as a small experiment, storage is limited and most of it is reserved for collected data.',
    approach: [
      'Reduced data types where physics precision allowed: doubles to floats, ints to shorts.',
      'Implemented custom compression algorithms tuned to the simulation output.',
    ],
    result:
      'As of June 2024, the compression achieved a three-times reduction in Monte Carlo file size.',
    limitations:
      'Internal collaboration software; the codebase is not public.',
    technologies: ['C++', 'Data compression'],
    links: [],
    relatedPath: 'physics',
    publicityLevel: 'public',
  },
  {
    id: 'dark-photon-analysis',
    title: 'Dark Photon Search at NA62',
    category: 'physics',
    summary:
      'PhD analysis work searching for dark photons in NA62 data.',
    status: 'in-progress',
    year: '2021–present',
    role: 'Researcher',
    team: 'NA62 collaboration',
    problem:
      'The search for dark photons is a key part of the NA62 physics programme beyond its flagship kaon measurements.',
    approach: ['Analysis in progress — details will be published when approved.'],
    result: 'Work in progress; results are not yet public.',
    limitations:
      'Analysis details are restricted until approved for release by the collaboration.',
    technologies: ['C++', 'Python'],
    links: [],
    relatedPath: 'physics',
    publicityLevel: 'public',
  },
  {
    id: 'placeguesser',
    title: 'PlaceGuesser',
    category: 'web',
    summary:
      'A free, self-hosted web game inspired by GeoGuessr, with single-player and real-time multiplayer modes.',
    status: 'complete',
    year: '2022',
    role: 'Sole developer',
    team: 'Personal project',
    problem:
      'GeoGuessr moved behind a subscription, so I built a fully working alternative for myself and my friends.',
    approach: [
      'Python and Flask provide the routes and login system, with an SQLite database for user data and scores.',
      'The Google Maps API provides both the Street View locations and the 2D guessing map.',
      'Multiplayer uses Socket.IO for real-time data sharing between clients; a live leaderboard updates on the home page.',
      'The whole project is self-hosted in Docker behind a reverse proxy.',
    ],
    result: 'A playable single- and multiplayer game, self-hosted and used by friends.',
    limitations: 'Depends on Google Maps API availability and usage quotas.',
    technologies: ['Python', 'Flask', 'SQLite', 'HTML', 'CSS', 'JavaScript', 'Socket.IO', 'Docker'],
    links: [
      { label: 'Play PlaceGuesser', href: 'https://placeguesser.jack-sanders.uk' },
      { label: 'Source on GitHub', href: 'https://github.com/SandersJack/PlaceGuesser' },
    ],
    relatedPath: null,
    publicityLevel: 'public',
  },
  {
    id: 'pico-environment-monitor',
    title: 'Pico Environment Monitor',
    category: 'software',
    summary:
      'Room temperature monitoring with a Raspberry Pi Pico, feeding a dashboard and Home Assistant-controlled heating.',
    status: 'maintained',
    year: '2023',
    role: 'Sole developer',
    team: 'Personal project',
    problem:
      'I wanted to monitor how the temperature of my room changed over time and keep it at a chosen temperature automatically.',
    approach: [
      'A Raspberry Pi Pico reads a DHT22 temperature and humidity sensor soldered to its GPIO pins, with firmware written in C using the pico-sdk.',
      'Readings are sent over UDP to a Python server that stores them in an SQLite database.',
      'A dashboard displays the history, and readings also feed a local Home Assistant server that holds the room at a selected temperature.',
    ],
    result: 'Continuous room monitoring with automated temperature control.',
    limitations: 'Single-room, single-sensor setup on a home network.',
    technologies: ['C', 'pico-sdk', 'Python', 'SQLite', 'UDP', 'Docker', 'Home Assistant'],
    links: [],
    relatedPath: null,
    publicityLevel: 'public',
  },
  {
    id: 'energy-grid-dashboard',
    title: 'UK Energy Grid Dashboard',
    category: 'web',
    summary:
      'A dashboard showing the current energy production of the UK, plus the last 24 hours and 7 days.',
    status: 'maintained',
    year: '2023',
    role: 'Sole developer',
    team: 'Personal project',
    problem:
      'UK energy production data is not easily accessible in one place or in a convenient format.',
    approach: [
      'Collects data from the National Grid API and the Elexon API into an SQLite database.',
      'A Python server exposes the data to an HTML/CSS/JavaScript client.',
    ],
    result: 'A live dashboard of instantaneous and historical UK energy production, self-hosted in Docker.',
    limitations: 'Dependent on the upstream public APIs staying available.',
    technologies: ['Python', 'SQLite', 'REST APIs', 'HTML', 'CSS', 'JavaScript', 'Docker'],
    links: [{ label: 'View the dashboard', href: 'https://ukenergy.jack-sanders.uk' }],
    relatedPath: null,
    publicityLevel: 'public',
  },
  {
    id: 'orbit-simulation',
    title: 'Orbit Simulation',
    category: 'software',
    summary:
      'A C++ simulation of satellite orbits in the Solar System, visualised in the browser with Three.js.',
    status: 'complete',
    year: '2022',
    role: 'Sole developer',
    team: 'Personal project',
    problem:
      'A project to demonstrate C++ programming and apply orbital mechanics to an interactive simulation.',
    approach: [
      'Simulates the Solar System with the ability to add and remove planets and place satellites in orbit.',
      'A static site visualises the simulation output in the browser using Three.js.',
    ],
    result: 'A working orbit simulation with an interactive 3D visualisation.',
    limitations: 'Simplified physics; not a precision ephemeris.',
    technologies: ['C++', 'Three.js', 'HTML', 'CSS', 'JavaScript'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/SandersJack/OrbitSim' }],
    relatedPath: 'physics',
    publicityLevel: 'public',
  },
  {
    id: 'world-climate-dashboard',
    title: 'World Climate Dashboard',
    category: 'web',
    summary:
      'Explore ERA5 temperature data from 1940 to the present by picking a location on the map.',
    status: 'maintained',
    year: '2024',
    role: 'Sole developer',
    team: 'Personal project',
    problem:
      'ERA5 reanalysis data is rich but awkward to explore interactively.',
    approach: [
      'ERA5 temperature data from the Copernicus Climate Change Service is stored in parquet files for performance.',
      'A Python server serves a Dash dashboard where selecting a location shows its temperature record over time.',
    ],
    result: 'An interactive climate dashboard, self-hosted in Docker.',
    limitations: 'Resolution and update cadence follow the ERA5 dataset.',
    technologies: ['Python', 'Dash', 'Parquet', 'Docker'],
    links: [{ label: 'View the dashboard', href: 'https://climate.jack-sanders.uk' }],
    relatedPath: null,
    publicityLevel: 'public',
  },
  {
    id: 'crypto-trading-bot',
    title: 'Crypto Trading Bot',
    category: 'software',
    summary:
      'An early-stage Python bot that monitors BNB prices and trades on simple moving averages.',
    status: 'in-progress',
    year: '2023',
    role: 'Sole developer',
    team: 'Personal project',
    problem:
      'An experiment in monitoring cryptocurrency prices and acting on them programmatically.',
    approach: [
      'Uses the Binance API to track the price of BNB and place trades.',
      'Trades on simple moving averages and accounts for fees when deciding to sell.',
    ],
    result: 'Work in progress; an honest experiment, not a money-maker.',
    limitations: 'Early stages; strategy is deliberately simple.',
    technologies: ['Python', 'Binance API'],
    links: [],
    relatedPath: null,
    publicityLevel: 'public',
  },
  {
    id: 'this-site',
    title: 'This Site',
    category: 'web',
    summary:
      'The portfolio you are reading — rebuilt as an accessible React app with an interactive 3D world.',
    status: 'in-progress',
    year: '2026',
    role: 'Sole developer',
    team: 'Personal project',
    problem:
      'Replace a static HTML/CSS/JS CV with a portfolio that demonstrates ability through the experience itself, without sacrificing accessibility or performance.',
    approach: [
      'React, TypeScript, and Vite for the accessible content layer; React Three Fiber for the world.',
      'Static assets served through NGINX in Docker behind a reverse proxy.',
    ],
    result: 'In development; the original static site remains live until cutover.',
    limitations: 'The 3D world ships progressively — HTML content first.',
    technologies: ['React', 'TypeScript', 'Vite', 'Three.js', 'Docker', 'NGINX'],
    links: [{ label: 'Original site source', href: 'https://github.com/SandersJack/webcv' }],
    relatedPath: null,
    publicityLevel: 'public',
  },
]

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}
