/**
 * Page-level copy. Every factual claim traces to the live portfolio or the
 * approved plan; slots marked TODO(content) await Jack's verified input
 * (plan §10, content workflow).
 */

export const homePage = {
  eyebrow: 'Jack Sanders',
  heading: 'PhD particle physicist turned software engineer.',
  lede: 'I build the WiFi control apps used by BT and EE customers. Outside of work, I study rare particle decays at CERN and play water polo. This site showcases some of my academic, personal and professional projects.',
  paths: [
    {
      to: '/software-development',
      label: 'Explore software development',
      description: 'Flutter and React Native apps for BT and EE broadband customers.',
    },
    {
      to: '/physics',
      label: 'Explore physics',
      description: 'NA62, kaon tagging, and the search for dark photons.',
    },
    {
      to: '/water-polo',
      label: 'Explore water polo',
      description: 'Discipline, anticipation, and team performance in the pool.',
    },
  ],
  primaryActions: [
    { to: '/projects', label: 'View projects' },
    { to: '/contact', label: 'Contact me' },
  ],
  proofPoints: [
    { value: 'PhD', label: 'Particle physics, CERN' },
    { value: 'BT', label: 'Flutter + React Native' },
    { value: 'Wales', label: 'Water polo' },
  ],
}

export const physicsPage = {
  eyebrow: 'Physics PhD, NA62, CERN',
  heading: 'Tagging kaons and hunting dark photons',
  lede: 'In plain terms: I help build the detectors and software that let physicists pick out one rare decay from billions of particle collisions, and I use that data to search for new physics.',
  sections: {
    research: {
      title: 'The research, in plain language',
      body: [
        'The NA62 experiment at CERN measures some of the rarest decays in physics, including K⁺→π⁺νν̄, a decay so sensitive to new particles that measuring it precisely tests the Standard Model itself.',
        'My doctoral work has two threads: the detector work that makes clean kaon identification possible, and the software and analysis that turn detector signals into physics, including the search for dark photons.',
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

export const softwarePage = {
  eyebrow: 'Software development',
  heading: 'Building products used by millions',
  lede: 'I build and ship Flutter and React Native apps for the BT and EE consumer brands, focusing on broadband and home wifi. The same instincts that make good analysis code, clear state, honest error handling, measured performance, make good products.',
  sections: {
    approach: {
      title: 'How I work',
      body: [
        'I care about the whole path from a problem to a reliable release: platform choices made deliberately, state kept minimal and explicit, networking that fails gracefully, and testing that checks behaviour rather than implementation.',
        'Accessibility and release quality are part of the definition of done, not polish added later.',
      ],
    },
  },
}

export const waterPoloPage = {
  eyebrow: 'Water polo',
  heading: 'The other place I think in three dimensions',
  lede: 'Water polo is a serious part of who I am, a sport that demands decision-making under pressure, spatial awareness, fitness, communication, and trust.',
  sections: {
    intro: {
      title: 'What it taught me',
      body: [
        'Water polo rewards the same skills as good research and good engineering: reading a system quickly, committing to a decision with incomplete information, and trusting the people around you to do their job.',
      ],
    },
    history: {
      title: 'Where I\'ve played',
      body: [
        'I have played for Welsh Wanderers, the University of Birmingham, Sandwell, and represented Wales at the national level.',
      ],
      clubs: [
        { team: 'Welsh national team', period: 'International' },
        { team: 'Welsh Wanderers', period: 'Club' },
        { team: 'University of Birmingham', period: 'University' },
        { team: 'Sandwell', period: 'Club' },
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
    game: {
      title: 'The game',
      body: [
        'A water polo pitch is 25 by 20 metres with goals at each end. Six outfield players and a goalkeeper work in a arc formation, passing and driving to create shooting lanes. The game is as much about movement without the ball as it is about possession, every pass is a commitment, every drive a gamble.',
      ],
    },
  },
}

export const projectsPage = {
  eyebrow: 'Projects',
  heading: 'Case studies, not trophies',
  lede: 'Real projects with a stated problem, approach, outcome, and honest limitations, from CERN simulation frameworks to self-hosted web apps.',
}

export const aboutPage = {
  eyebrow: 'About',
  heading: 'One thread through software, physics, and water',
  lede: 'I build mobile apps that millions of broadband customers use, observe particle systems at CERN, and play water polo.',
  sections: {
    bio: {
      title: 'Biography',
      body: [
        'I am a software engineer at BT, building mobile apps for the BT and EE consumer brands, focusing on broadband and home wifi. I work with Flutter and React Native, and build developer tools in Python.',
        'Previously I was an experimental particle physics PhD researcher at the University of Birmingham, working in the NA62 collaboration at CERN on software development and the search for dark photons.',
        'Away from a keyboard, I play water polo.',
      ],
    },
    timeline: {
      title: 'Timeline',
    },
    focus: {
      title: 'Current focus',
      body: [
        'Working hard to gain connections in the industry while making projects that I enjoy!',
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
