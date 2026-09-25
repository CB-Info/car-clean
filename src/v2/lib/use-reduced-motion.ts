import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

// Préférence système « réduire les animations », suivie en direct.
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
