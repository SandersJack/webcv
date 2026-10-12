import { useEffect, useRef, type RefObject } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { ErrorBoundary } from '../components/ErrorBoundary'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { trackPageView } from '../lib/firebase'
import { SkipLink } from '../components/SkipLink'

import { AppRoutes } from './routes'
import {
  notFoundMetadata,
  routeMetadata,
  siteTitleSuffix,
} from './routeMetadata'

function useRouteMetadata(mainRef: RefObject<HTMLElement | null>) {
  const location = useLocation()

  useEffect(() => {
    const matched = routeMetadata.find(({ pattern }) =>
      matchPath({ path: pattern, end: true }, location.pathname),
    )
    const metadata = matched ?? notFoundMetadata

    const title = `${metadata.title}${siteTitleSuffix}`
    document.title = title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', metadata.description)

    trackPageView(location.pathname, title)

    // Move focus and scroll to the top on navigation so keyboard and screen
    // reader users land at the start of the new page (design skills §5).
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname, mainRef])
}

export function App() {
  const mainRef = useRef<HTMLElement>(null)
  useRouteMetadata(mainRef)

  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        ref={mainRef}
        className="site-main"
      >
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
