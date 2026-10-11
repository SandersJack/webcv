import { Component, useEffect, useRef, type ErrorInfo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { ButtonLink } from './ButtonLink'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

/**
 * Reports route changes to the boundary while the fallback is showing, so
 * navigating away clears the error. Rendered inside the fallback because
 * class components cannot call useLocation themselves.
 */
function RouteChangeWatcher({ onRouteChange }: { onRouteChange: () => void }) {
  const { pathname } = useLocation()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname
      onRouteChange()
    }
  }, [pathname, onRouteChange])

  return null
}

/**
 * Catches render errors in the routed pages and shows a fallback instead of
 * a blank page. Only the routes are wrapped (App.tsx), so the header, footer,
 * and skip link stay visible. Resets when the route changes.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleRouteChange = () => {
    this.setState({ hasError: false })
  }

  override render() {
    if (this.state.hasError) {
      return (
        <>
          <RouteChangeWatcher onRouteChange={this.handleRouteChange} />
          <section className="error-boundary">
            <div className="container flow">
              <h1 className="error-boundary__heading">Something went wrong</h1>
              <p className="error-boundary__lede">
                An unexpected error occurred. Please try again.
              </p>
              <div className="button-row">
                <ButtonLink to="/">Back to home</ButtonLink>
              </div>
            </div>
          </section>
        </>
      )
    }

    return this.props.children
  }
}
