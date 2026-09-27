import { useSyncExternalStore } from 'react'

const SMALL_SCREEN_QUERY = '(max-width: 48rem)'

function subscribe(onChange: () => void): () => void {
  if (typeof window.matchMedia !== 'function') return () => undefined
  const media = window.matchMedia(SMALL_SCREEN_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia(SMALL_SCREEN_QUERY).matches
}

function getServerSnapshot(): boolean {
  return false
}

/** True below the layout's split breakpoint, where low-detail variants load. */
export function useSmallScreen(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
