export type RouteMetadata = {
  /** Pattern matched with react-router's matchPath, e.g. '/projects/:projectId' */
  pattern: string
  title: string
  description: string
}

/**
 * Unique title and description per route (plan §11 — SEO, metadata, sharing).
 * Order matters: the first matching pattern wins.
 */
export const routeMetadata: RouteMetadata[] = [
  {
    pattern: '/',
    title: 'Jack Sanders — Physicist, Engineer, Developer',
    description:
      'The interactive portfolio of Jack Sanders: particle physics PhD researcher, software developer, and water polo player.',
  },
  {
    pattern: '/physics',
    title: 'Physics — NA62 and the search for dark photons',
    description:
      "Jack Sanders' particle physics research: the NA62 experiment at CERN, the CEDAR-H kaon tagger, detector software, and analysis work.",
  },
  {
    pattern: '/mobile-development',
    title: 'Mobile development',
    description:
      'How Jack Sanders turns real user and system needs into reliable mobile and connected software experiences.',
  },
  {
    pattern: '/water-polo',
    title: 'Water polo',
    description:
      "Water polo as a serious part of Jack Sanders' identity: discipline, communication, anticipation, and team performance.",
  },
  {
    pattern: '/projects',
    title: 'Projects',
    description:
      'Case studies from physics software, embedded sensors, dashboards, and web projects by Jack Sanders.',
  },
  {
    pattern: '/projects/:projectId',
    title: 'Project case study',
    description: 'A project case study by Jack Sanders.',
  },
  {
    pattern: '/about',
    title: 'About',
    description:
      'A cross-disciplinary biography of Jack Sanders: physics, software, and water polo.',
  },
  {
    pattern: '/contact',
    title: 'Contact',
    description:
      'Get in touch with Jack Sanders: email, GitHub, LinkedIn, and a validated contact form.',
  },
]

export const notFoundMetadata = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
}

export const siteTitleSuffix = ' | Jack Sanders'
