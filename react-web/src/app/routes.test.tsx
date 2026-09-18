import { render, screen } from '@testing-library/react'
import { matchPath, MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { notFoundMetadata, routeMetadata } from './routeMetadata'

function expectedTitleFor(pathname: string): string {
  const matched = routeMetadata.find(({ pattern }) =>
    matchPath({ path: pattern, end: true }, pathname),
  )
  return (matched ?? notFoundMetadata).title
}

const cases = [
  { route: '/', heading: 'Physicist. Engineer. Developer.' },
  { route: '/physics', heading: 'Tagging kaons and hunting dark photons' },
  {
    route: '/mobile-development',
    heading: 'Software that survives contact with real users',
  },
  {
    route: '/water-polo',
    heading: 'The other place I think in three dimensions',
  },
  { route: '/projects', heading: 'Case studies, not trophies' },
  {
    route: '/projects/flexible-na62-framework',
    heading: 'Flexible NA62 Framework',
  },
  {
    route: '/about',
    heading: 'One thread through physics, software, and water',
  },
  { route: '/contact', heading: 'Jack Sanders' },
  { route: '/no-such-page', heading: 'Page not found' },
]

beforeAll(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
})

describe('App routes', () => {
  it.each(cases)(
    '$route renders its page heading and document title',
    ({ route, heading }) => {
      render(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>,
      )

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        heading,
      )
      expect(document.title).toContain(expectedTitleFor(route))
    },
  )
})
