import { Component, type ReactNode } from 'react'

type WorldErrorBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
}

type WorldErrorBoundaryState = {
  hasError: boolean
}

class WorldErrorBoundary extends Component<
  WorldErrorBoundaryProps,
  WorldErrorBoundaryState
> {
  override state: WorldErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): WorldErrorBoundaryState {
    return { hasError: true }
  }

  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

export { WorldErrorBoundary }
export type { WorldErrorBoundaryProps }
