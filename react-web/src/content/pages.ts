/**
 * Page-level copy. Every factual claim traces to the live portfolio or the
 * approved plan; slots marked TODO(content) await Jack's verified input
 * (plan §10 — content workflow).
 */

export const homePage = {
  eyebrow: 'Jack Sanders',
  heading: 'Physicist. Engineer. Developer.',
  lede: 'I study rare particle decays at CERN, build software that makes detectors and data usable, and play water polo — this site tells that story as one journey.',
  paths: [
    {
      to: '/physics',
      label: 'Explore physics',
      description: 'NA62, kaon tagging, and the search for dark photons.',
    },
    {
      to: '/mobile-development',
      label: 'Explore mobile development',
      description: 'Turning real user needs into reliable connected software.',
    },
    {
      to: '/water-polo',
      label: 'Explore water polo',
      description: 'Discipline, anticipation, and team performance in the pool.',
    },
  ],
  primaryActions: [
    { to: '/projects', label: 'View projects' },
    { to: '/contact', label: 'Get in touch' },
  ],
  instruction:
    'Scroll or swipe to explore. Use the section links to jump directly.',
}

export const physicsPage = {
  eyebrow: 'Physics PhD — NA62, CERN',
  heading: 'Tagging kaons and hunting dark photons',
  lede: 'In plain terms: I help build the detectors and software that let physicists pick out one rare decay from billions of particle collisions — and I use that data to search for new physics.',
  sections: {
    research: {
      title: 'The research, in plain language',
      body: [
        'The NA62 experiment at CERN measures some of the rarest decays in physics, including K⁺→π⁺νν̄ — a decay so sensitive to new particles that measuring it precisely tests the Standard Model itself.',
        'My doctoral work has two threads: the detector work that makes clean kaon identification possible, and the software and analysis that turn detector signals into physics — including the search for dark photons.',
      ],
    },
    contribution: {
      title: 'My contribution to NA62',
      body: [
        'I led the refactoring of the NA62 simulation and reconstruction framework, replacing a hard-coded detector description with a flexible, configuration-driven design now used across the collaboration and integral to the HIKE proposal.',
        'I developed the compression of the experiment’s Monte Carlo output, cutting file sizes three-fold to relieve the experiment’s storage pressure.',
        'During a six-month long-term attachment at CERN I helped install the new CEDAR-H kaon tagger, then served as detector expert for the CEDAR/KTAG and as an expert for the PC farm.',
      ],
    },
    methods: {
      title: 'How the work gets done',
      body: [
        'Detector physics: Cherenkov tagging with the CEDAR-H, from test-beam validation to installation and commissioning in the NA62 beamline.',
        'Simulation: large-scale Geant4-based Monte Carlo in C++, with validation techniques such as Geantino scans of detector volumes.',
        'Data: compression, reconstruction, and analysis pipelines in C++ and Python.',
      ],
    },
    accuracyNote:
      'Simplifications on this site are artistic and educational. Detector renderings are illustrative, not engineering drawings, and collaboration work is credited to the collaboration.',
  },
}

export const mobilePage = {
  eyebrow: 'Mobile & software development',
  heading: 'Software that survives contact with real users',
  lede: 'The same instincts that make good analysis code — clear state, honest error handling, measured performance — make good products.',
  sections: {
    intro: {
      title: 'How I build',
      body: [
        'I care about the whole path from a user’s need to a reliable release: platform choices made deliberately, state kept minimal and explicit, networking that fails gracefully, and testing that checks behaviour rather than implementation.',
        'Accessibility and release quality are part of the definition of done, not polish added later.',
      ],
    },
    experience: {
      title: 'Professional experience',
      body: [
        'I am a mobile developer at BT/EE, where for the past year I have built and shipped features for a large consumer app.',
        'The work spans Flutter and React Native, alongside native iOS and Android development in Swift and Kotlin.',
      ],
    },
    projects: {
      title: 'Selected projects',
      body: [
        'My public work spans connected devices, dashboards, and web apps — see the projects page for full case studies.',
      ],
    },
    demo: {
      title: 'A live demonstration',
      // TODO(content): the shared physics trajectory demo arrives with Phase 3/4 (plan §4).
      body: [
        'A physics trajectory simulation, presented as a mobile app interface, is in development. One implementation will serve both this page and the physics page — a small demonstration of building once and reusing well.',
      ],
    },
  },
}

export const waterPoloPage = {
  eyebrow: 'Water polo',
  heading: 'The other place I think in three dimensions',
  lede: 'Water polo is a serious part of who I am — a sport that demands decision-making under pressure, spatial awareness, fitness, communication, and trust.',
  sections: {
    intro: {
      title: 'Why it matters',
      body: [
        'Water polo rewards the same skills as good research and good engineering: reading a system quickly, committing to a decision with incomplete information, and trusting the people around you to do their job.',
      ],
    },
    history: {
      title: 'Playing history',
      // TODO(content): Jack to supply confirmed role/position, teams, and competitions (plan §4).
      body: [
        'Confirmed details of my playing history — position, teams, and competitions — are being finalised and will appear here soon.',
      ],
    },
    demands: {
      title: 'What the sport demands',
      body: [
        'Decision-making under pressure: you have seconds on the ball before a defender arrives.',
        'Spatial awareness: the game happens above and below the waterline, in three dimensions.',
        'Fitness and composure: perform while treading water, often while being held.',
        'Communication and trust: six other players need to know your intention before you act.',
      ],
    },
    tactical: {
      title: 'Tactical view',
      // TODO(content): interactive tactical formation arrives with the water polo world (Phase 6).
      body: [
        'A labelled top-down formation with an accessible text description is planned alongside the interactive water polo scene.',
      ],
    },
  },
}

export const projectsPage = {
  eyebrow: 'Projects',
  heading: 'Case studies, not trophies',
  lede: 'Real projects with a stated problem, approach, outcome, and honest limitations — from CERN simulation frameworks to self-hosted web apps.',
}

export const aboutPage = {
  eyebrow: 'About',
  heading: 'One thread through physics, software, and water',
  lede: 'I observe systems, model them, build tools around them, and work with people to make the results useful.',
  sections: {
    bio: {
      title: 'Biography',
      body: [
        'I am an experimental particle physics PhD researcher at the University of Birmingham, working in the NA62 collaboration at CERN on software development and the search for dark photons.',
        'Alongside research I build things: simulation frameworks used across an international collaboration, self-hosted web apps, embedded sensors, and dashboards. I enjoy learning new languages and solving problems with them.',
        'Away from a keyboard, I play water polo.',
      ],
    },
    timeline: {
      title: 'Timeline',
    },
    focus: {
      title: 'Current focus',
      body: [
        'Completing my doctoral analysis, and building this site — an accessible React application with an interactive 3D world layered on top.',
      ],
    },
  },
}

export const contactPage = {
  eyebrow: 'Contact',
  heading: 'Get in touch',
  lede: 'The quiet end of the site: email, links, and a form that respects your time.',
}

export const notFoundPage = {
  heading: 'Page not found',
  body: 'The page you are looking for does not exist. It may have moved, or the link may be wrong.',
}
